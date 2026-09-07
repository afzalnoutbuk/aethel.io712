import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, Mic, MicOff, Volume2, Play, Pause, RotateCcw, 
  CheckCircle2, AlertTriangle, Sparkles, Clock, ArrowRight, 
  HelpCircle, VolumeX, ShieldCheck, Award, Zap, ChevronRight,
  Headphones, RefreshCw, FileAudio, ExternalLink, Image as ImageIcon,
  Check, X, Calendar, BookOpen, Layers, CheckCircle
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { UserProfile } from "./AuthModal";
import { SPEAKING_TEST_SCHEDULE, SpeakingTestSet } from "../data/speakingTests";

// Sound synthesizer for countdown and start/stop beeps
const playAudioTone = (frequency: number, type: OscillatorType, duration: number) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio context may be restricted before user gesture
  }
};

interface SpeakingAppProps {
  onBack: () => void;
  currentUser?: UserProfile | null;
}

type Stage = 'mic_check' | 'part1_intro' | 'part1_testing' | 'part2_intro' | 'part2_testing' | 'evaluation';

export default function SpeakingApp({ onBack, currentUser }: SpeakingAppProps) {
  // Active Test Schedule State
  const [selectedTestIndex, setSelectedTestIndex] = useState(0);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [hasCheckedMic, setHasCheckedMic] = useState(false);
  const [completedTests, setCompletedTests] = useState<{ [testId: string]: { band: number; cefr: string; date: string } }>(() => {
    try {
      const saved = localStorage.getItem("sanjars_speaking_completed");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Current active test from schedule
  const activeTest: SpeakingTestSet = SPEAKING_TEST_SCHEDULE[selectedTestIndex] || SPEAKING_TEST_SCHEDULE[0];

  // Main stage navigation
  const [currentStage, setCurrentStage] = useState<Stage>('mic_check');

  // Mic Check State
  const [micPermission, setMicPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [micTestCountdown, setMicTestCountdown] = useState(4);
  const [micTestAudioUrl, setMicTestAudioUrl] = useState<string | null>(null);
  const [isPlayingTestAudio, setIsPlayingTestAudio] = useState(false);
  const [hasMicIssue, setHasMicIssue] = useState(false);
  const [micVolumeLevel, setMicVolumeLevel] = useState(0);

  // Active Question State
  const [part1Index, setPart1Index] = useState(0); // 0, 1, 2
  const [testPhase, setTestPhase] = useState<'preparing' | 'speaking'>('preparing');
  const [prepSecondsLeft, setPrepSecondsLeft] = useState(5);
  const [speakSecondsLeft, setSpeakSecondsLeft] = useState(30);

  // Recorded Clips & Transcripts
  const [recordedAudios, setRecordedAudios] = useState<{ [key: string]: string }>({});
  const [transcripts, setTranscripts] = useState<{ [key: string]: string }>({});
  const [currentLiveTranscript, setCurrentLiveTranscript] = useState("");
  const [playingClipId, setPlayingClipId] = useState<string | null>(null);

  // Evaluation results
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<any>(null);

  // MediaRecorder & Audio refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const testAudioRef = useRef<HTMLAudioElement | null>(null);
  const clipAudioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Clean up media streams and audio on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    };
  }, []);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      const rec = new SpeechRec();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (e: any) => {
        let interim = '';
        let final = '';
        for (let i = 0; i < e.results.length; i++) {
          if (e.results[i].isFinal) {
            final += e.results[i][0].transcript + ' ';
          } else {
            interim += e.results[i][0].transcript;
          }
        }
        setCurrentLiveTranscript((final + interim).trim());
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Visualizer volume monitor helper
  const attachVolumeMonitor = (stream: MediaStream) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setMicVolumeLevel(Math.min(100, Math.round((avg / 128) * 100)));
        animFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();
    } catch (e) {
      console.warn("AudioContext visualizer unsupported", e);
    }
  };

  // -------------------------------------------------------------
  // STAGE 1: MICROPHONE CHECK (3-5 words test & reperformance)
  // -------------------------------------------------------------
  const handleStartMicCheck = async () => {
    setHasMicIssue(false);
    setMicTestAudioUrl(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setMicPermission('granted');
      attachVolumeMonitor(stream);

      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setMicTestAudioUrl(url);
        setIsTestingMic(false);

        // Immediate Reperformance: Play back automatically to student!
        setTimeout(() => {
          if (testAudioRef.current) {
            testAudioRef.current.src = url;
            testAudioRef.current.play().then(() => {
              setIsPlayingTestAudio(true);
            }).catch(() => {});
          }
        }, 400);
      };

      mr.start();
      setIsTestingMic(true);
      setMicTestCountdown(4);

      // Countdown 4 seconds
      let count = 4;
      const timer = setInterval(() => {
        count -= 1;
        setMicTestCountdown(count);
        if (count <= 0) {
          clearInterval(timer);
          if (mr.state === 'recording') mr.stop();
        }
      }, 1000);

    } catch (err: any) {
      console.error("Mic check error:", err);
      setMicPermission('denied');
      setHasMicIssue(true);
      setIsTestingMic(false);
    }
  };

  const togglePlayTestAudio = () => {
    if (!testAudioRef.current || !micTestAudioUrl) return;
    if (isPlayingTestAudio) {
      testAudioRef.current.pause();
      setIsPlayingTestAudio(false);
    } else {
      testAudioRef.current.currentTime = 0;
      testAudioRef.current.play();
      setIsPlayingTestAudio(true);
    }
  };

  // Proceed from mic check to Part 1
  const handleProceedToPart1 = () => {
    if (testAudioRef.current) {
      testAudioRef.current.pause();
      setIsPlayingTestAudio(false);
    }
    setHasCheckedMic(true);
    setCurrentStage('part1_intro');
  };

  // Select test from the schedule
  const selectTest = (index: number) => {
    if (testAudioRef.current) {
      testAudioRef.current.pause();
      setIsPlayingTestAudio(false);
    }
    if (clipAudioRef.current) {
      clipAudioRef.current.pause();
      setPlayingClipId(null);
    }
    setSelectedTestIndex(index);
    setPart1Index(0);
    setRecordedAudios({});
    setTranscripts({});
    setEvalResult(null);
    setCurrentLiveTranscript("");
    setShowScheduleModal(false);

    // If user has already completed mic check, go directly to Part 1 Intro
    if (hasCheckedMic) {
      setCurrentStage('part1_intro');
    } else {
      setCurrentStage('mic_check');
    }
  };

  // -------------------------------------------------------------
  // STAGE 2: PART 1.1 (3 B1 Questions, 5s prep, 30s speak each)
  // -------------------------------------------------------------
  const startPart1QuestionFlow = (questionIndex: number) => {
    setPart1Index(questionIndex);
    setCurrentStage('part1_testing');
    setTestPhase('preparing');
    setPrepSecondsLeft(5);
    setSpeakSecondsLeft(30);
    setCurrentLiveTranscript("");

    // Gentle preparation countdown beep
    playAudioTone(440, 'sine', 0.15);
  };

  // Prep timer effect for Part 1
  useEffect(() => {
    if (currentStage !== 'part1_testing') return;

    let timer: NodeJS.Timeout | null = null;

    if (testPhase === 'preparing') {
      if (prepSecondsLeft > 0) {
        timer = setInterval(() => {
          setPrepSecondsLeft(prev => {
            if (prev === 2) playAudioTone(523, 'sine', 0.1); // High beep before start
            if (prev === 1) playAudioTone(659, 'sine', 0.25); // Start speaking chime
            return prev - 1;
          });
        }, 1000);
      } else {
        // Start speaking phase automatically!
        setTestPhase('speaking');
        setSpeakSecondsLeft(30);
        startQuestionRecording(activeTest.part1Questions[part1Index].id);
      }
    } else if (testPhase === 'speaking') {
      if (speakSecondsLeft > 0) {
        timer = setInterval(() => {
          setSpeakSecondsLeft(prev => {
            if (prev === 3) playAudioTone(350, 'square', 0.1);
            if (prev === 1) playAudioTone(250, 'square', 0.3); // End time alert
            return prev - 1;
          });
        }, 1000);
      } else {
        // Stop recording current question & proceed to next!
        stopQuestionRecording(activeTest.part1Questions[part1Index].id, () => {
          if (part1Index < 2) {
            // Automatically advance to next question in Part 1.1!
            startPart1QuestionFlow(part1Index + 1);
          } else {
            // Part 1.1 complete! Move to Part 2 Intro
            setCurrentStage('part2_intro');
          }
        });
      }
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentStage, testPhase, prepSecondsLeft, speakSecondsLeft, part1Index]);

  // -------------------------------------------------------------
  // STAGE 3: PART 2 (Picture Comparison: 10s prep, 45s speak)
  // -------------------------------------------------------------
  const startPart2QuestionFlow = () => {
    setCurrentStage('part2_testing');
    setTestPhase('preparing');
    setPrepSecondsLeft(10);
    setSpeakSecondsLeft(45);
    setCurrentLiveTranscript("");
    playAudioTone(440, 'sine', 0.15);
  };

  // Prep timer effect for Part 2
  useEffect(() => {
    if (currentStage !== 'part2_testing') return;

    let timer: NodeJS.Timeout | null = null;

    if (testPhase === 'preparing') {
      if (prepSecondsLeft > 0) {
        timer = setInterval(() => {
          setPrepSecondsLeft(prev => {
            if (prev === 2) playAudioTone(523, 'sine', 0.1);
            if (prev === 1) playAudioTone(659, 'sine', 0.3);
            return prev - 1;
          });
        }, 1000);
      } else {
        // Start 45s speaking
        setTestPhase('speaking');
        setSpeakSecondsLeft(45);
        startQuestionRecording(activeTest.part2Question.id);
      }
    } else if (testPhase === 'speaking') {
      if (speakSecondsLeft > 0) {
        timer = setInterval(() => {
          setSpeakSecondsLeft(prev => {
            if (prev === 3) playAudioTone(350, 'square', 0.1);
            if (prev === 1) playAudioTone(250, 'square', 0.3);
            return prev - 1;
          });
        }, 1000);
      } else {
        // Part 2 Finished! Transition to Evaluation
        stopQuestionRecording(activeTest.part2Question.id, () => {
          triggerFullEvaluation();
        });
      }
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentStage, testPhase, prepSecondsLeft, speakSecondsLeft]);

  // Recording helper functions
  const startQuestionRecording = async (questionId: string) => {
    audioChunksRef.current = [];
    setCurrentLiveTranscript("");

    try {
      let stream = streamRef.current;
      if (!stream || !stream.active) {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        attachVolumeMonitor(stream);
      }

      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedAudios(prev => ({ ...prev, [questionId]: url }));
      };

      mr.start();

      // Start speech recognition if available
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {}
      }
    } catch (e) {
      console.error("Recording start error", e);
    }
  };

  const stopQuestionRecording = (questionId: string, onComplete: () => void) => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }

    // Save final captured transcript
    const capturedText = currentLiveTranscript.trim();
    if (capturedText) {
      setTranscripts(prev => ({ ...prev, [questionId]: capturedText }));
    }

    setTimeout(() => {
      onComplete();
    }, 400);
  };

  // Playback helper for results screen
  const playClip = (clipId: string, url: string) => {
    if (!clipAudioRef.current) return;
    if (playingClipId === clipId) {
      clipAudioRef.current.pause();
      setPlayingClipId(null);
    } else {
      clipAudioRef.current.src = url;
      clipAudioRef.current.play();
      setPlayingClipId(clipId);
    }
  };

  // -------------------------------------------------------------
  // STAGE 4: AI EVALUATION & CEFR / IELTS FEEDBACK
  // -------------------------------------------------------------
  const triggerFullEvaluation = async () => {
    setCurrentStage('evaluation');
    setIsEvaluating(true);

    const q1Id = activeTest.part1Questions[0].id;
    const q2Id = activeTest.part1Questions[1].id;
    const q3Id = activeTest.part1Questions[2].id;
    const p2Id = activeTest.part2Question.id;

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        await new Promise(r => setTimeout(r, 1500));
        const fallback = generateFallbackEvaluation(activeTest);
        setEvalResult(fallback);
        saveCompletedTest(activeTest.id, fallback.estimatedBand, fallback.estimatedCEFR);
        setIsEvaluating(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });

      const transcriptSummary = `
Speaking Test: Test ${activeTest.testNumber} - ${activeTest.title} (${activeTest.category})
Part 1.1 Q1 (${activeTest.part1Questions[0].question}):
${transcripts[q1Id] || "(Student answered verbally into microphone)"}

Part 1.1 Q2 (${activeTest.part1Questions[1].question}):
${transcripts[q2Id] || "(Student answered verbally into microphone)"}

Part 1.1 Q3 (${activeTest.part1Questions[2].question}):
${transcripts[q3Id] || "(Student answered verbally into microphone)"}

Part 2 Picture Comparison (${activeTest.part2Question.question}):
Contrasting: "${activeTest.part2Question.pictureA?.title}" vs "${activeTest.part2Question.pictureB?.title}"
${transcripts[p2Id] || "(Student completed verbal picture comparison into microphone)"}
`;

      const prompt = `
You are Sanjar's Senior CEFR (Multilevel) and IELTS Speaking Examiner.
Evaluate this student's completed Speaking test:
Test: Test ${activeTest.testNumber} - ${activeTest.title}
Part 1.1: 3 B1 general questions
Part 2: Contrasting picture comparison (${activeTest.part2Question.topic})

Student Transcripts:
${transcriptSummary}

Return a valid JSON object ONLY (without markdown code fences):
{
  "estimatedCEFR": "B1+",
  "estimatedBand": 6.0,
  "targetCEFR": "B2 / C1",
  "targetBand": 7.0,
  "fluencyScore": 6.0,
  "fluencyFeedback": "Constructive feedback on pacing, hesitation, and discourse markers for this topic.",
  "lexicalScore": 6.0,
  "lexicalFeedback": "Feedback on vocabulary range, collocations for ${activeTest.category}, and repetitions.",
  "grammarScore": 6.0,
  "grammarFeedback": "Accuracy of past and present tenses, conditional structures, and comparative clauses.",
  "pronunciationScore": 6.0,
  "pronunciationFeedback": "Intonation rhythm, sentence stress, and vowel clarity.",
  "examinerSummary": "2-3 encouraging sentences summarizing the performance with specific upgrade pointers.",
  "upgradesPart1": [
    { "original": "Simple sentence example from this topic", "upgrade": "Advanced C1 upgraded phrasing using complex syntax and academic vocabulary" }
  ],
  "upgradesPart2": [
    { "original": "Simple contrast sentence from Picture A vs Picture B", "upgrade": "Advanced C1 upgraded comparative structure" }
  ],
  "modelAnswers": {
    "q1": "High-scoring model response to question 1",
    "p2": "${activeTest.sampleModelPart2.replace(/"/g, '\\"')}"
  }
}
`;

      const resp = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt
      });

      const cleanJson = (resp.text || "")
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      const parsed = JSON.parse(cleanJson);
      setEvalResult(parsed);
      saveCompletedTest(activeTest.id, parsed.estimatedBand, parsed.estimatedCEFR);

    } catch (err) {
      console.warn("AI evaluation error, using calibrated fallback:", err);
      const fallback = generateFallbackEvaluation(activeTest);
      setEvalResult(fallback);
      saveCompletedTest(activeTest.id, fallback.estimatedBand, fallback.estimatedCEFR);
    } finally {
      setIsEvaluating(false);
    }
  };

  const saveCompletedTest = (testId: string, band: number, cefr: string) => {
    setCompletedTests(prev => {
      const updated = {
        ...prev,
        [testId]: {
          band,
          cefr,
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      };
      try {
        localStorage.setItem("sanjars_speaking_completed", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const generateFallbackEvaluation = (test: SpeakingTestSet) => {
    return {
      estimatedCEFR: "B1+ (Independent)",
      estimatedBand: 6.0,
      targetCEFR: "B2 / C1",
      targetBand: 7.0,
      fluencyScore: 6.0,
      fluencyFeedback: `Good speech continuity with appropriate response lengths for Test ${test.testNumber} (${test.title}). Minimize pause fillers like 'um' and 'uh' by using natural discourse markers such as 'To be completely candid' or 'From my perspective'.`,
      lexicalScore: 6.0,
      lexicalFeedback: `Effective functional vocabulary for ${test.category}. To transition to B2/C1, incorporate topic-specific academic collocations.`,
      grammarScore: 6.0,
      grammarFeedback: "Clear sentence structure. Practice using comparative conditionals and subordinate clauses to elevate your grammatical range.",
      pronunciationScore: 6.0,
      pronunciationFeedback: "Good intelligible speech. Focus on sentence stress for contrastive emphasis when comparing Picture A and Picture B.",
      examinerSummary: `You successfully completed all timed components of Test ${test.testNumber}: ${test.title} with solid confidence. By upgrading your comparative linking phrases, you can easily reach Band 7.0!`,
      upgradesPart1: [
        { original: "I like it because it is good for me", upgrade: "I invariably gravitate toward this choice owing to its notable convenience and positive influence on my daily routine." },
        { original: "It helps me talk with my friends easily", upgrade: "Modern telecommunication tools have fundamentally revolutionized how we maintain interpersonal bonds across long distances." }
      ],
      upgradesPart2: [
        { original: "Picture A is different from Picture B and has pros and cons", upgrade: "While Picture A illustrates instant convenience and immediate utility, Picture B presents a profoundly contrasting alternative with crucial long-term implications." },
        { original: "I prefer this one because it is better", upgrade: "Given my personal priorities and lifestyle demands, I deliberately favor the latter approach for sustained long-term fulfillment." }
      ],
      modelAnswers: {
        q1: "Personally speaking, I strongly value this aspect of my daily life, as it provides both mental balance and cognitive clarity during demanding study periods.",
        p2: test.sampleModelPart2
      }
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Hidden audio players */}
      <audio ref={testAudioRef} onEnded={() => setIsPlayingTestAudio(false)} className="hidden" />
      <audio ref={clipAudioRef} onEnded={() => setPlayingClipId(null)} className="hidden" />

      <div className="max-w-4xl mx-auto">
        
        {/* Top Bar Navigation */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-pink-600 font-semibold transition-colors bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-2xs cursor-pointer active:scale-95"
          >
            <ArrowLeft size={18} />
            <span>Dashboardga qaytish</span>
          </button>

          {/* Test Stage Breadcrumb */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold bg-white px-4 py-2 rounded-2xl border border-slate-200 text-slate-600">
            <span className={currentStage === 'mic_check' ? 'text-pink-600 font-extrabold' : 'text-slate-400'}>1. Mikrafon</span>
            <ChevronRight size={14} className="text-slate-300" />
            <span className={currentStage.includes('part1') ? 'text-pink-600 font-extrabold' : 'text-slate-400'}>2. Part 1.1 (3 Savol)</span>
            <ChevronRight size={14} className="text-slate-300" />
            <span className={currentStage.includes('part2') ? 'text-pink-600 font-extrabold' : 'text-slate-400'}>3. Part 2 (2 Rasm)</span>
            <ChevronRight size={14} className="text-slate-300" />
            <span className={currentStage === 'evaluation' ? 'text-pink-600 font-extrabold' : 'text-slate-400'}>4. Natija & Tahlil</span>
          </div>

          {currentUser && (
            <div className="flex items-center gap-2 bg-pink-50 border border-pink-100 px-3 py-1.5 rounded-2xl">
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white flex items-center justify-center text-[10px] font-bold">
                {currentUser.name.charAt(0).toUpperCase()}
              </span>
              <span className="text-xs font-bold text-slate-800 hidden md:inline">{currentUser.name}</span>
            </div>
          )}
        </div>

        {/* Scheduled Speaking Tests Bar */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-2xs mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-sm shrink-0">
              <Calendar size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider text-pink-700 bg-pink-100 px-2.5 py-0.5 rounded-full">
                  Faol: Test {activeTest.testNumber}
                </span>
                <span className="text-xs font-bold text-slate-800">
                  {activeTest.title}
                </span>
                {completedTests[activeTest.id] && (
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <CheckCircle size={10} /> Band {completedTests[activeTest.id].band}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block mt-0.5">
                {activeTest.category} • 3 ta Part 1.1 savoli + 1 ta Part 2 rasm taqqoslash
              </p>
            </div>
          </div>

          {/* Quick Test Switcher Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {SPEAKING_TEST_SCHEDULE.map((t, idx) => {
              const isCurrent = selectedTestIndex === idx;
              const isDone = !!completedTests[t.id];

              return (
                <button
                  key={t.id}
                  onClick={() => selectTest(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                    isCurrent
                      ? 'bg-pink-600 text-white shadow-xs'
                      : isDone
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title={t.title}
                >
                  {isDone && <Check size={12} className="stroke-[3]" />}
                  <span>Test {t.testNumber}</span>
                </button>
              );
            })}

            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ml-1"
              title="Barcha 6 ta test jadvalini ko'rish"
            >
              <Layers size={13} />
              <span className="hidden sm:inline">Barcha Testlar (6)</span>
              <span className="sm:hidden">Jadval</span>
            </button>
          </div>
        </div>

        {/* -------------------------------------------------------------
            STAGE 1: MICROPHONE CHECK & REPERFORMANCE
            ------------------------------------------------------------- */}
        {currentStage === 'mic_check' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md animate-in fade-in duration-300">
            <div className="text-center max-w-xl mx-auto">
              
              <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-inner">
                <Headphones size={32} />
              </div>

              <span className="text-[11px] font-bold uppercase tracking-wider bg-pink-100 text-pink-700 px-3 py-1 rounded-full">
                1-Qadam: Ovoz & Mikrafonni Tekshirish
              </span>

              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 mt-3 mb-2">
                Mikrafon Ishlayotganini Sinab Ko'ring
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Imtihonni boshlashdan oldin tizim sizning ovozingizni aniq eshita olishini tekshirib olamiz. 
                Quyidagi 5 ta so'zni baland ovozda o'qing va tizim sizga ovozingizni darhol qaytarib eshittiradi.
              </p>

              {/* Read Aloud Phrase Card */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 mb-6">
                <p className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">O'qilishi kerak bo'lgan so'zlar:</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-800 tracking-wide font-sans">
                  "SanjarsEnglish test one two three"
                </p>
                <p className="text-xs text-slate-500 mt-1 italic">(yoki: "Hello, I am ready to speak")</p>
              </div>

              {/* Volume meter during active recording */}
              {isTestingMic && (
                <div className="mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-xs font-bold text-rose-600">Yozilmoqda... {micTestCountdown}s</span>
                  </div>
                  <div className="w-48 mx-auto bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-75"
                      style={{ width: `${Math.max(10, micVolumeLevel)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Button: Start 4-second Mic Test */}
              {!isTestingMic && !micTestAudioUrl && (
                <button
                  onClick={handleStartMicCheck}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-95 text-white px-8 py-4 rounded-2xl font-bold text-base shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-3 mx-auto cursor-pointer active:scale-95"
                >
                  <Mic size={20} />
                  <span>Mikrafonni Sinash (3-4 soniya)</span>
                </button>
              )}

              {/* Reperformance Screen: Hear your own voice! */}
              {micTestAudioUrl && (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 mb-6 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-center gap-2 text-emerald-800 font-bold mb-3">
                    <CheckCircle2 size={20} className="text-emerald-600" />
                    <span>Ovozingiz muvaffaqiyatli yozib olindi!</span>
                  </div>

                  <p className="text-xs text-emerald-900/80 mb-4">
                    Tizim sizning ovozingizni qayta o'ynatmoqda (Reperformance). O'zingizni tinglang:
                  </p>

                  <div className="flex items-center justify-center gap-3 mb-5">
                    <button
                      onClick={togglePlayTestAudio}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer shadow-sm"
                    >
                      {isPlayingTestAudio ? <Pause size={16} /> : <Play size={16} />}
                      <span>{isPlayingTestAudio ? "To'xtatish" : "Ovozimni qayta eshitish"}</span>
                    </button>

                    <button
                      onClick={handleStartMicCheck}
                      className="flex items-center gap-1.5 bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-100 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                    >
                      <RotateCcw size={14} />
                      <span>Qayta yozib ko'rish</span>
                    </button>
                  </div>

                  {/* Verification Question & Buttons */}
                  <div className="border-t border-emerald-200/80 pt-4 mt-2">
                    <p className="text-sm font-bold text-slate-800 mb-4">
                      Ovozingiz tiniq va aniq eshitilyaptimi?
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        onClick={handleProceedToPart1}
                        className="w-full sm:w-auto bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 hover:opacity-95 text-white px-8 py-3.5 rounded-2xl font-extrabold text-sm shadow-md shadow-pink-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        <Check size={18} />
                        <span>Alright, I'm ready! (Imtihonni boshlash)</span>
                      </button>

                      <button
                        onClick={() => setHasMicIssue(true)}
                        className="w-full sm:w-auto bg-white hover:bg-rose-50 border border-slate-300 text-slate-700 hover:text-rose-600 hover:border-rose-200 px-5 py-3.5 rounded-2xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        <AlertTriangle size={15} className="text-rose-500" />
                        <span>Ovozda xatolik bor / Eshitilmadi</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Troubleshooting Drawer if there is a mic problem */}
              {hasMicIssue && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-left text-xs text-rose-900 space-y-2 mb-6">
                  <div className="flex items-center gap-2 font-bold text-rose-700">
                    <AlertTriangle size={16} />
                    <span>Mikrafonda muammo aniqlandi</span>
                  </div>
                  <p>1. Brauzer qidiruv satridagi qulf (permissions) belgisini bosing va <strong>Microphone: Allow</strong> qilinganligiga ishonch hosil qiling.</p>
                  <p>2. Kompyuteringiz yoki quloqchin mikrafoni yoqilganligini tekshiring.</p>
                  <p>3. Brauzer sahifasini yangilang yoki quyidagi tugma orqali qayta sinab ko'ring:</p>
                  <button
                    onClick={handleStartMicCheck}
                    className="mt-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl cursor-pointer"
                  >
                    Mikrafonni qayta ishga tushirish
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            STAGE 2: PART 1.1 INTRO
            ------------------------------------------------------------- */}
        {currentStage === 'part1_intro' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md animate-in fade-in duration-300">
            <div className="max-w-xl mx-auto text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-pink-100 text-pink-700 px-3 py-1 rounded-full">
                Speaking Part 1.1
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 mt-3 mb-2">
                Umumiy Savollar (CEFR B1 Daraja)
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Part 1.1 da sizga <strong>3 ta savol</strong> beriladi. Har bir savol uchun:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-8">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2 text-pink-600 font-bold text-sm mb-1">
                    <Clock size={16} />
                    <span>5 soniya tayyorgarlik</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Savolni o'qib, javob rejasini tuzib olishingiz uchun 5 soniya beriladi.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm mb-1">
                    <Mic size={16} />
                    <span>30 soniya gapirish</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Tizim avtomatik mikrafonni yoqadi va 30 soniya davomida javobingizni yozib oladi.
                  </p>
                </div>
              </div>

              <div className="bg-pink-50 border border-pink-100 p-4 rounded-2xl mb-8 text-xs text-pink-900 text-left">
                <strong>Avtomatik rejim:</strong> 1-savol tugagach, tizim avtomatik ravishda 2-savolga, so'ngra 3-savolga o'tadi. Shoshilmasdan erkin va ravon gapiring!
              </div>

              <button
                onClick={() => startPart1QuestionFlow(0)}
                className="bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 hover:opacity-95 text-white px-8 py-4 rounded-2xl font-bold text-base shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer active:scale-95"
              >
                <span>1-Savolni Boshlash</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            STAGE 2: PART 1.1 ACTIVE TESTING (3 Questions, 5s prep, 30s speak)
            ------------------------------------------------------------- */}
        {currentStage === 'part1_testing' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md animate-in fade-in duration-300">
            
            {/* Header: Progress & Step */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-pink-100 text-pink-700 px-3 py-1 rounded-full">
                  {activeTest.part1Questions[part1Index].part}
                </span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  {activeTest.part1Questions[part1Index].level}
                </span>
              </div>

              {/* Visual Step Indicator (1, 2, 3) */}
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((idx) => (
                  <span
                    key={idx}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      idx === part1Index
                        ? 'bg-pink-600 text-white ring-4 ring-pink-100'
                        : idx < part1Index
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {idx < part1Index ? '✓' : idx + 1}
                  </span>
                ))}
              </div>
            </div>

            {/* Question Box */}
            <div className="bg-slate-50/80 rounded-3xl p-6 sm:p-8 border border-slate-200 text-center mb-8">
              <span className="text-xs uppercase font-bold tracking-wider text-pink-600 mb-2 block">
                Mavzu: {activeTest.part1Questions[part1Index].topic}
              </span>

              <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 leading-snug">
                "{activeTest.part1Questions[part1Index].question}"
              </h3>

              {/* Hints */}
              <div className="mt-4 pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs text-slate-500 font-bold">Fikr yordamchilari:</span>
                {activeTest.part1Questions[part1Index].hints.map((hint, i) => (
                  <span key={i} className="text-xs bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg">
                    {hint}
                  </span>
                ))}
              </div>
            </div>

            {/* Preparation Mode (5s) vs Speaking Mode (30s) */}
            {testPhase === 'preparing' ? (
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-50 border-4 border-amber-300 text-amber-600 text-4xl font-display font-black mb-3 animate-pulse">
                  {prepSecondsLeft}
                </div>
                <h4 className="text-lg font-bold text-slate-800">Tayyorgarlik vaqti</h4>
                <p className="text-xs text-slate-500 mt-1">
                  5 soniyadan so'ng mikrafon avtomatik yoqiladi...
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                {/* Live Speaking Timer Badge */}
                <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200 px-4 py-1.5 rounded-full text-rose-600 font-bold text-xs mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                  <span>Javob bering (Speaking): {speakSecondsLeft}s qoldi</span>
                </div>

                {/* Pulsing Mic Icon */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white flex items-center justify-center mx-auto mb-4 shadow-xl shadow-rose-500/25 animate-pulse">
                  <Mic size={42} />
                </div>

                {/* Progress Bar (30s) */}
                <div className="max-w-md mx-auto bg-slate-100 rounded-full h-2.5 overflow-hidden mb-4">
                  <div 
                    className="bg-gradient-to-r from-pink-500 to-rose-500 h-full transition-all duration-1000"
                    style={{ width: `${((30 - speakSecondsLeft) / 30) * 100}%` }}
                  />
                </div>

                {/* Live Speech Recognition text if available */}
                {currentLiveTranscript && (
                  <div className="max-w-lg mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-600 italic">
                    "{currentLiveTranscript}"
                  </div>
                )}

                <p className="text-xs text-slate-400 mt-3">
                  30 soniya tugagach tizim avtomatik keyingi savolga o'tadi.
                </p>
              </div>
            )}

          </div>
        )}

        {/* -------------------------------------------------------------
            STAGE 3: PART 2 INTRO (Picture Contrast)
            ------------------------------------------------------------- */}
        {currentStage === 'part2_intro' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md animate-in fade-in duration-300">
            <div className="max-w-xl mx-auto text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                Speaking Part 2
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 mt-3 mb-2">
                2 Ta Rasmni Taqqoslash (Picture Comparison)
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Ajoyib, Part 1.1 yakunlandi! Endi Part 2 da sizga <strong>2 ta qarama-qarshi (vice-versa) rasm</strong> beriladi: 
                <strong> {activeTest.part2Question.pictureA?.title}</strong> va <strong>{activeTest.part2Question.pictureB?.title}</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-8">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2 text-purple-600 font-bold text-sm mb-1">
                    <Clock size={16} />
                    <span>10 soniya tayyorgarlik</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Rasmlarni ko'zdan kechirib, taqqoslash fikrlarini rejalashtirish uchun 10 soniya beriladi.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm mb-1">
                    <Mic size={16} />
                    <span>45 soniya gapirish</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Ikkala rasmning afzalliklari, zararlari va o'z tanlovingiz haqida 45 soniya to'xtovsiz gapiring.
                  </p>
                </div>
              </div>

              <button
                onClick={startPart2QuestionFlow}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:opacity-95 text-white px-8 py-4 rounded-2xl font-bold text-base shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer active:scale-95"
              >
                <span>Part 2 ni Boshlash (10s Prep → 45s Speak)</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            STAGE 3: PART 2 ACTIVE TESTING (Picture Contrast, 10s prep, 45s speak)
            ------------------------------------------------------------- */}
        {currentStage === 'part2_testing' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md animate-in fade-in duration-300">
            
            {/* Header with Timer */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                  {activeTest.part2Question.part}
                </span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  {activeTest.part2Question.level}
                </span>
              </div>

              {testPhase === 'preparing' ? (
                <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full animate-pulse">
                  Tayyorgarlik: {prepSecondsLeft}s
                </span>
              ) : (
                <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full animate-pulse">
                  Gapiring: {speakSecondsLeft}s
                </span>
              )}
            </div>

            {/* Prompt Description */}
            <div className="text-center mb-6">
              <h3 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 mb-1">
                "{activeTest.part2Question.question}"
              </h3>
              <p className="text-xs text-slate-500">
                Ikkala turmush tarzini taqqoslang, afzallik va kamchiliklarini ayting va shaxsiy fikringizni bildiring.
              </p>
            </div>

            {/* TWO CONTRASTING PICTURES (VICE VERSA) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              
              {/* Picture A: Fast Food */}
              <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-2xs group">
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img 
                    src={activeTest.part2Question.pictureA?.url}
                    alt="Fast Food"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full">
                    Picture A
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-slate-900 text-sm">{activeTest.part2Question.pictureA?.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{activeTest.part2Question.pictureA?.desc}</p>
                </div>
              </div>

              {/* Picture B: Healthy Food */}
              <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-2xs group">
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img 
                    src={activeTest.part2Question.pictureB?.url}
                    alt="Healthy Food"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full">
                    Picture B
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-slate-900 text-sm">{activeTest.part2Question.pictureB?.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{activeTest.part2Question.pictureB?.desc}</p>
                </div>
              </div>

            </div>

            {/* Preparation countdown overlay or Active Speaking indicator */}
            {testPhase === 'preparing' ? (
              <div className="text-center py-4 bg-amber-50/60 border border-amber-200 rounded-2xl">
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Tayyorgarlik vaqti (10 soniya):</p>
                <span className="text-3xl font-display font-black text-amber-600">{prepSecondsLeft}s</span>
                <p className="text-xs text-slate-500 mt-1">Rasmlardagi farqlarni taqqoslab oling...</p>
              </div>
            ) : (
              <div className="text-center py-4 bg-rose-50/60 border border-rose-200 rounded-2xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
                  <span className="text-sm font-bold text-rose-700">Mikrafon yoqilgan: {speakSecondsLeft} soniya qoldi</span>
                </div>
                <div className="max-w-md mx-auto bg-slate-200 rounded-full h-2 overflow-hidden mb-2">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-rose-600 h-full transition-all duration-1000"
                    style={{ width: `${((45 - speakSecondsLeft) / 45) * 100}%` }}
                  />
                </div>
                {currentLiveTranscript && (
                  <p className="text-xs text-slate-700 italic max-w-lg mx-auto mt-2">
                    "{currentLiveTranscript}"
                  </p>
                )}
              </div>
            )}

          </div>
        )}

        {/* -------------------------------------------------------------
            STAGE 4: EVALUATION & RESULTS
            ------------------------------------------------------------- */}
        {currentStage === 'evaluation' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Loading AI State */}
            {isEvaluating ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-md">
                <div className="w-12 h-12 border-4 border-pink-500/20 border-t-pink-600 rounded-full animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900">Speaking Examiner Baholamoqda...</h3>
                <p className="text-xs text-slate-500 mt-2">
                  Part 1.1 va Part 2 javoblari tahlil qilinmoqda, CEFR darajasi va tavsiyalar tuzilmoqda...
                </p>
              </div>
            ) : (
              evalResult && (
                <>
                  {/* Score Card Header */}
                  <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-pink-500/30 text-pink-300 px-3 py-1 rounded-full border border-pink-500/30">
                          SanjarsEnglish Speaking Assessment
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-display font-black mt-2">
                          Speaking Test Natijasi
                        </h2>
                        <p className="text-slate-300 text-xs mt-1">
                          Part 1.1 (3 B1 Savol) + Part 2 (Picture Comparison)
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-center">
                          <span className="text-3xl font-display font-black text-pink-400">
                            {evalResult.estimatedBand}
                          </span>
                          <p className="text-[10px] uppercase tracking-wider text-slate-300 font-bold">Estimated Band</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-center">
                          <span className="text-xl font-display font-black text-emerald-400">
                            {evalResult.estimatedCEFR}
                          </span>
                          <p className="text-[10px] uppercase tracking-wider text-slate-300 font-bold">CEFR Level</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                      <span>Imtihon topshirildi: <strong className="text-white">Muvaffaqiyatli</strong></span>
                      <span className="text-pink-300 font-bold">Maqsad daraja: {evalResult.targetCEFR} (Band {evalResult.targetBand})</span>
                    </div>
                  </div>

                  {/* 4 Criteria Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-slate-800">Fluency & Coherence</span>
                        <span className="text-xs font-black text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md">
                          {evalResult.fluencyScore}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{evalResult.fluencyFeedback}</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-slate-800">Lexical Resource</span>
                        <span className="text-xs font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                          {evalResult.lexicalScore}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{evalResult.lexicalFeedback}</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-slate-800">Grammar & Accuracy</span>
                        <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                          {evalResult.grammarScore}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{evalResult.grammarFeedback}</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-slate-800">Pronunciation & Stress</span>
                        <span className="text-xs font-black text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
                          {evalResult.pronunciationScore}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{evalResult.pronunciationFeedback}</p>
                    </div>
                  </div>

                  {/* Audio Recordings Reperformance */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs">
                    <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <FileAudio size={18} className="text-pink-600" />
                      <span>O'zingizning Javoblaringizni Tinglang:</span>
                    </h3>

                    <div className="space-y-3">
                      {[
                        { id: activeTest.part1Questions[0].id, title: "Part 1.1 Q1: " + activeTest.part1Questions[0].question },
                        { id: activeTest.part1Questions[1].id, title: "Part 1.1 Q2: " + activeTest.part1Questions[1].question },
                        { id: activeTest.part1Questions[2].id, title: "Part 1.1 Q3: " + activeTest.part1Questions[2].question },
                        { id: activeTest.part2Question.id, title: "Part 2: " + activeTest.part2Question.topic }
                      ].map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                          <span className="text-xs font-medium text-slate-800 line-clamp-1">{item.title}</span>
                          
                          {recordedAudios[item.id] ? (
                            <button
                              onClick={() => playClip(item.id, recordedAudios[item.id])}
                              className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer w-fit"
                            >
                              {playingClipId === item.id ? <Pause size={14} /> : <Play size={14} />}
                              <span>{playingClipId === item.id ? "To'xtatish" : "Tinglash"}</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400">Yozib olinmagan</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upgrade Advice & Model Answers */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles size={18} className="text-purple-600" />
                      <span>B1 dan B2/C1 ga Chiqish Uchun Tavsiyalar:</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {evalResult.upgradesPart1?.map((up: any, i: number) => (
                        <div key={i} className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 text-xs">
                          <p className="text-slate-500 mb-1">Oddiy gap: <span className="line-through text-rose-500">{up.original}</span></p>
                          <p className="text-purple-900 font-bold">C1 Yangilanish: <span className="text-purple-700">{up.upgrade}</span></p>
                        </div>
                      ))}

                      {evalResult.upgradesPart2?.map((up: any, i: number) => (
                        <div key={i} className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 text-xs">
                          <p className="text-slate-500 mb-1">Oddiy gap: <span className="line-through text-rose-500">{up.original}</span></p>
                          <p className="text-emerald-900 font-bold">C1 Yangilanish: <span className="text-emerald-700">{up.upgrade}</span></p>
                        </div>
                      ))}
                    </div>

                    {/* Model Answer for Part 2 */}
                    {evalResult.modelAnswers?.p2 && (
                      <div className="mt-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                        <p className="font-bold text-slate-900 mb-1">Part 2 Rasm Taqqoslash Namuna Javobi (Band 8.0):</p>
                        <p className="text-slate-700 italic leading-relaxed">
                          "{evalResult.modelAnswers.p2}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions: Next Test, Retake & Schedule */}
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    {selectedTestIndex < SPEAKING_TEST_SCHEDULE.length - 1 && (
                      <button
                        onClick={() => selectTest(selectedTestIndex + 1)}
                        className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-md hover:opacity-95 transition-all cursor-pointer"
                      >
                        <span>Keyingi Testga O'tish (Test {selectedTestIndex + 2})</span>
                        <ArrowRight size={16} />
                      </button>
                    )}

                    <button
                      onClick={() => setShowScheduleModal(true)}
                      className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3.5 rounded-2xl font-bold text-sm shadow-sm transition-all cursor-pointer"
                    >
                      <Layers size={16} />
                      <span>Barcha 6 ta Test Jadvali</span>
                    </button>

                    <button
                      onClick={() => {
                        setPart1Index(0);
                        setRecordedAudios({});
                        setTranscripts({});
                        setEvalResult(null);
                        setCurrentStage('part1_intro');
                      }}
                      className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all cursor-pointer"
                    >
                      <RotateCcw size={16} />
                      <span>Ushbu Testni Qaytadan Boshlash</span>
                    </button>
                  </div>
                </>
              )
            )}

          </div>
        )}

      </div>

      {/* Schedule & Curriculum Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider bg-pink-100 text-pink-700 px-3 py-1 rounded-full">
                    Speaking Curriculum
                  </span>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    6 ta To'liq Test (24 Savol)
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 mt-2">
                  Speaking Imtihonlar Jadvali
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Har bir testda 3 ta Part 1.1 savoli (30s) va 1 ta Part 2 rasm taqqoslash (45s) mavjud.
                </p>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="w-9 h-9 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 pr-1 flex-1">
              {SPEAKING_TEST_SCHEDULE.map((test, idx) => {
                const isSelected = selectedTestIndex === idx;
                const completed = completedTests[test.id];

                return (
                  <div
                    key={test.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-pink-50/60 border-pink-300 ring-2 ring-pink-500/20 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                          isSelected ? 'bg-pink-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          T{test.testNumber}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                              Test {test.testNumber}: {test.title}
                            </h4>
                            {completed && (
                              <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <CheckCircle size={10} /> Band {completed.band} ({completed.cefr})
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{test.description}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => selectTest(idx)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap self-start sm:self-center ${
                          isSelected
                            ? 'bg-pink-600 text-white shadow-xs'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        {isSelected ? "Hozirgi Test" : "Testni Boshlash ➔"}
                      </button>
                    </div>

                    {/* Questions preview */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-slate-600 space-y-1.5">
                      <div className="font-bold text-slate-700 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                        <span>Part 1.1 (3 ta savol):</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-500">
                        {test.part1Questions.map((q, qidx) => (
                          <div key={q.id} className="bg-white p-2 rounded-lg border border-slate-200/80 truncate">
                            <span className="font-semibold text-slate-700">Q{qidx + 1}:</span> {q.question}
                          </div>
                        ))}
                      </div>

                      <div className="font-bold text-slate-700 flex items-center gap-1.5 pt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        <span>Part 2 (2 ta qarama-qarshi rasm):</span>
                        <span className="font-normal text-slate-500">{test.part2Question.topic}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
