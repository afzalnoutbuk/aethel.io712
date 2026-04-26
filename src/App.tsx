import { useState, FormEvent, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Globe, MessageSquare, Users, ChevronRight, PlayCircle, Star, CheckCircle2, X, Mail, Lock, User, Instagram, Send, Phone, Mic, Headphones, PenTool, ArrowLeft, Bot, BarChart3, Brain, ClipboardCheck, Timer, Calendar, Target, Sparkles, Loader2, BookA, Search, Zap, Award, Download, ShieldCheck, History, Clock } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function App() {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>("Aethel.io");
  const [currentView, setCurrentView] = useState<'landing' | 'learning'>('landing');

  const handleStartLearning = () => {
    if (userName) {
      setCurrentView('learning');
    } else {
      setIsSignUpOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        onSignUp={() => setIsSignUpOpen(true)} 
        userName={userName} 
        onDashboard={() => setCurrentView('learning')}
        onHome={() => setCurrentView('landing')}
      />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {currentView === 'landing' ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Hero onSignUp={handleStartLearning} />
              <Stats />
              <Features />
              <Games />
              <Testimonials />
              <CTA onSignUp={handleStartLearning} />
            </motion.div>
          ) : (
            <motion.div
              key="learning"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
            >
              <LearningDashboard onBack={() => setCurrentView('landing')} userName={userName} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <Footer />

      <AnimatePresence>
        {isSignUpOpen && (
          <SignUpModal 
            onClose={() => setIsSignUpOpen(false)} 
            onSuccess={(name) => {
              setUserName(name);
              setCurrentView('learning');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Navbar({ onSignUp, userName, onDashboard, onHome }: { 
  onSignUp: () => void; 
  userName: string | null;
  onDashboard: () => void;
  onHome: () => void;
}) {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <button onClick={onHome} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-pink-200">
              <Globe size={24} />
            </div>
            <span className="text-2xl font-display font-bold tracking-tight text-slate-900">
              Aethel<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">.io</span>
            </span>
          </button>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={onHome} className="text-sm font-medium text-slate-600 hover:text-pink-600 transition-colors">Home</button>
            <a href="#games" className="text-sm font-medium text-slate-600 hover:text-pink-600 transition-colors">Games</a>
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-pink-600 transition-colors">Features</a>
            
            {userName ? (
              <button 
                onClick={onDashboard}
                className="flex items-center gap-2 px-4 py-2 bg-pink-50 rounded-full text-pink-700 font-bold text-sm border border-pink-100 hover:bg-pink-100 transition-colors"
              >
                <Star size={16} fill="currentColor" className="text-amber-500" />
                <span>Dear, {userName}</span>
              </button>
            ) : (
              <button 
                onClick={onSignUp}
                className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                Sign In
              </button>
            )}
          </div>
          
          <button className="md:hidden p-2 text-slate-600">
            <Users size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}

function Hero({ onSignUp }: { onSignUp: () => void }) {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      {/* Warm pink background glow */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-pink-50/50 blur-3xl rounded-full -z-10 translate-x-1/3 -translate-y-1/4"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="max-w-2xl">
            <h1 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 tracking-tight mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Exclusive</span> <br/>
              English for a Life Well Lived
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-xl">
              Tailored language services designed to meet unique needs, offering unmatched speaking practice, personalized tutoring, and global opportunities.
            </p>
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <button onClick={onSignUp} className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-pink-500/30 transition-all">
                Start Learning
              </button>
              <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all">
                View Courses
              </button>
            </div>

            {/* Partners & Video (Simplified) */}
            <div className="flex items-center gap-8">
               {/* Video Thumbnail Mock */}
               <div className="w-48 h-32 bg-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center group cursor-pointer shadow-lg shadow-slate-200">
                  <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center mix-blend-overlay"></div>
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 z-10 group-hover:scale-110 transition-transform">
                    <PlayCircle size={24} className="ml-1" />
                  </div>
                  <span className="absolute bottom-3 left-4 text-white text-sm font-medium z-10">Play Introduction</span>
               </div>
               {/* Socials/Reviews */}
               <div className="flex flex-col gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-pink-100 border-2 border-white overflow-hidden"><img src="https://i.pravatar.cc/100?img=5" alt="User" /></div>
                    <div className="w-8 h-8 rounded-full bg-rose-100 border-2 border-white overflow-hidden"><img src="https://i.pravatar.cc/100?img=9" alt="User" /></div>
                    <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">+</div>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">Loved by 200K+ Users</div>
               </div>
            </div>
          </div>

          {/* Right Content - Floating English Visuals */}
          <div className="relative h-[500px] hidden lg:block">
             {/* Floating Card 1 (Pink) */}
             <motion.div
                animate={{ y: [-10, 10, -10], rotate: [-2, 2, -2] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-10 w-80 h-48 bg-gradient-to-br from-pink-500 to-rose-500 rounded-3xl shadow-2xl shadow-pink-500/20 p-6 text-white transform rotate-12"
             >
                <div className="flex justify-between items-start mb-8">
                   <BookOpen size={32} className="opacity-80" />
                   <span className="text-sm font-bold bg-white/20 px-3 py-1 rounded-full">C1 Advanced</span>
                </div>
                <div className="text-2xl font-display font-bold tracking-widest mb-2">VOCABULARY</div>
                <div className="text-sm opacity-80">Mastery Level</div>

                {/* Floating Tooltip */}
                <div className="absolute -top-6 -left-12 bg-white text-slate-900 px-4 py-2 rounded-2xl shadow-xl flex items-center gap-3 transform -rotate-12">
                   <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                      <img src="https://i.pravatar.cc/100?img=1" alt="User" />
                   </div>
                   <div>
                     <div className="text-xs font-bold">Sarah Jenkins</div>
                     <div className="text-[10px] text-emerald-500 font-bold">Passed IELTS 8.0</div>
                   </div>
                </div>
             </motion.div>

             {/* Floating Card 2 (Dark) */}
             <motion.div
                animate={{ y: [10, -10, 10], rotate: [2, -2, 2] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-10 left-10 w-96 h-56 bg-slate-900 rounded-3xl shadow-2xl p-6 text-white transform -rotate-6"
             >
                <div className="flex justify-between items-start mb-12">
                   <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                     <Mic size={24} className="text-pink-400" />
                   </div>
                   <span className="text-sm font-bold bg-white/10 px-3 py-1 rounded-full">Live Sessions</span>
                </div>
                <div className="text-xl font-display font-bold mb-1">Speaking Practice</div>
                <div className="text-sm text-slate-400 mb-4">With Native Tutors</div>

                {/* Floating Tooltip */}
                <div className="absolute -bottom-6 right-10 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-2xl shadow-xl flex items-center gap-3 transform rotate-6">
                   <div className="w-8 h-8 rounded-full bg-white/20 overflow-hidden">
                      <img src="https://i.pravatar.cc/100?img=11" alt="User" />
                   </div>
                   <div>
                     <div className="text-xs font-bold">David Chen</div>
                     <div className="text-[10px] text-pink-100 font-bold">Fluent in 6 months</div>
                   </div>
                </div>
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { label: "Active Students", value: "50k+" },
    { label: "Expert Tutors", value: "200+" },
    { label: "Course Modules", value: "1,200+" },
    { label: "Success Rate", value: "98%" },
  ];

  return (
    <section className="py-12 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-display font-bold text-pink-600 mb-1">{stat.value}</p>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: <Globe className="text-pink-600" />,
      title: "Global Community",
      description: "Connect with learners from over 120 countries and practice together in real-time."
    },
    {
      icon: <MessageSquare className="text-emerald-600" />,
      title: "AI Conversation",
      description: "Practice speaking with our advanced AI that provides instant grammar and accent feedback."
    },
    {
      icon: <BookOpen className="text-amber-600" />,
      title: "Personalized Path",
      description: "Our algorithm adapts to your learning style and goals for the most efficient progress."
    },
    {
      icon: <Users className="text-rose-600" />,
      title: "Native Tutors",
      description: "Book 1-on-1 sessions with certified native speakers whenever you need extra help."
    }
  ];

  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-pink-600 uppercase tracking-widest mb-3">Why Choose Us</h2>
          <p className="text-4xl font-display font-bold text-slate-900">Features that make learning easy</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Games() {
  const [activeGame, setActiveGame] = useState<'scramble' | 'match'>('scramble');
  const [score, setScore] = useState(0);

  return (
    <section id="games" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-sm font-bold text-pink-600 uppercase tracking-widest mb-3">Interactive Learning</h2>
          <p className="text-4xl font-display font-bold text-slate-900">Fun & Games</p>
          <p className="text-slate-500 mt-4">Practice your English skills with interactive challenges.</p>
        </div>

        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveGame('scramble')}
            className={`px-6 py-3 rounded-2xl font-bold transition-all ${
              activeGame === 'scramble' 
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-200' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Sentence Scramble
          </button>
          <button
            onClick={() => setActiveGame('match')}
            className={`px-6 py-3 rounded-2xl font-bold transition-all ${
              activeGame === 'match' 
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-200' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Word Match
          </button>
        </div>

        <div className="bg-slate-50 rounded-[3rem] p-8 md:p-12 shadow-inner border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <div className="bg-white px-6 py-2 rounded-full shadow-sm border border-slate-100">
              <span className="text-sm font-bold text-slate-400 uppercase mr-2">Total Score:</span>
              <span className="text-xl font-display font-bold text-pink-600">{score}</span>
            </div>
          </div>

          {activeGame === 'scramble' ? (
            <SentenceScramble onScoreUpdate={(s) => setScore(prev => prev + s)} />
          ) : (
            <WordMatchGame onScoreUpdate={(s) => setScore(prev => prev + s)} />
          )}
        </div>
      </div>
    </section>
  );
}

function SentenceScramble({ onScoreUpdate }: { onScoreUpdate: (s: number) => void }) {
  const sentences = [
    { 
      correct: "I am learning English", 
      scrambled: ["learning", "I", "English", "am"], 
      hint: "A common self-introduction" 
    },
    { 
      correct: "The cat is on the mat", 
      scrambled: ["on", "The", "mat", "is", "the", "cat"], 
      hint: "A classic simple sentence" 
    },
    { 
      correct: "She loves to read books", 
      scrambled: ["read", "loves", "to", "books", "She"], 
      hint: "Talking about a hobby" 
    },
    { 
      correct: "We went to the park yesterday", 
      scrambled: ["yesterday", "went", "to", "the", "park", "We"], 
      hint: "Something that happened in the past" 
    },
    { 
      correct: "Can you help me please", 
      scrambled: ["me", "please", "help", "Can", "you"], 
      hint: "A polite request" 
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>(sentences[0].scrambled);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');

  const handleWordClick = (word: string, index: number) => {
    setSelectedWords([...selectedWords, word]);
    const newAvailable = [...availableWords];
    newAvailable.splice(index, 1);
    setAvailableWords(newAvailable);
  };

  const handleRemoveWord = (word: string, index: number) => {
    const newSelected = [...selectedWords];
    newSelected.splice(index, 1);
    setSelectedWords(newSelected);
    setAvailableWords([...availableWords, word]);
  };

  const checkSentence = () => {
    const currentSentence = selectedWords.join(" ");
    if (currentSentence === sentences[currentIndex].correct) {
      setFeedback('correct');
      onScoreUpdate(10);
    } else {
      setFeedback('incorrect');
    }
  };

  const nextSentence = () => {
    const nextIndex = (currentIndex + 1) % sentences.length;
    setCurrentIndex(nextIndex);
    setSelectedWords([]);
    setAvailableWords(sentences[nextIndex].scrambled);
    setFeedback('none');
  };

  const resetSentence = () => {
    setSelectedWords([]);
    setAvailableWords(sentences[currentIndex].scrambled);
    setFeedback('none');
  };

  return (
    <div>
      <div className="text-sm font-medium text-slate-400 italic mb-8 text-center">
        Hint: {sentences[currentIndex].hint}
      </div>

      {/* Selected Words Area */}
      <div className="min-h-[100px] bg-white rounded-3xl p-6 mb-8 border-2 border-dashed border-slate-200 flex flex-wrap gap-3 items-center justify-center">
        {selectedWords.length === 0 && (
          <span className="text-slate-300 font-medium italic">Click words below to build your sentence...</span>
        )}
        {selectedWords.map((word, i) => (
          <motion.button
            key={`selected-${i}`}
            layoutId={`word-${word}-${i}`}
            onClick={() => handleRemoveWord(word, i)}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium shadow-md shadow-pink-200 hover:shadow-lg transition-all"
          >
            {word}
          </motion.button>
        ))}
      </div>

      {/* Available Words Area */}
      <div className="flex flex-wrap gap-3 justify-center mb-12">
        {availableWords.map((word, i) => (
          <motion.button
            key={`available-${i}`}
            layoutId={`word-${word}-${i}`}
            onClick={() => handleWordClick(word, i)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-white text-slate-700 rounded-xl font-medium border border-slate-200 shadow-sm hover:border-pink-300 hover:text-pink-600 transition-all"
          >
            {word}
          </motion.button>
        ))}
      </div>

      {/* Controls & Feedback */}
      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-4">
          <button
            onClick={resetSentence}
            className="px-8 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={checkSentence}
            disabled={selectedWords.length === 0 || feedback === 'correct'}
            className="px-12 py-3 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Check Sentence
          </button>
        </div>

        <AnimatePresence mode="wait">
          {feedback === 'correct' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-lg">
                <CheckCircle2 /> Correct! Well done.
              </div>
              <button
                onClick={nextSentence}
                className="flex items-center gap-2 text-pink-600 font-bold hover:underline"
              >
                Next Sentence <ChevronRight size={20} />
              </button>
            </motion.div>
          )}
          {feedback === 'incorrect' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-rose-600 font-bold text-lg flex items-center gap-2"
            >
              <X /> Not quite right. Try again!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function WordMatchGame({ onScoreUpdate }: { onScoreUpdate: (s: number) => void }) {
  const pairs = [
    { en: "Apple", uz: "Olma" },
    { en: "Book", uz: "Kitob" },
    { en: "School", uz: "Maktab" },
    { en: "Water", uz: "Suv" },
    { en: "Friend", uz: "Do'st" },
    { en: "Family", uz: "Oila" },
  ];

  const [selectedEn, setSelectedEn] = useState<string | null>(null);
  const [selectedUz, setSelectedUz] = useState<string | null>(null);
  const [matches, setMatches] = useState<string[]>([]);
  const [shuffledEn, setShuffledEn] = useState<string[]>([]);
  const [shuffledUz, setShuffledUz] = useState<string[]>([]);

  useEffect(() => {
    setShuffledEn([...pairs].map(p => p.en).sort(() => Math.random() - 0.5));
    setShuffledUz([...pairs].map(p => p.uz).sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (selectedEn && selectedUz) {
      const pair = pairs.find(p => p.en === selectedEn && p.uz === selectedUz);
      if (pair) {
        setMatches([...matches, selectedEn]);
        setSelectedEn(null);
        setSelectedUz(null);
        onScoreUpdate(5);
      } else {
        setTimeout(() => {
          setSelectedEn(null);
          setSelectedUz(null);
        }, 500);
      }
    }
  }, [selectedEn, selectedUz]);

  return (
    <div>
      <p className="text-center text-slate-500 mb-8">Match the English words with their Uzbek translations.</p>
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-3">
          {shuffledEn.map(word => (
            <button
              key={word}
              disabled={matches.includes(word)}
              onClick={() => setSelectedEn(word)}
              className={`w-full p-4 rounded-2xl font-bold transition-all border-2 ${
                matches.includes(word) 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600 opacity-50' 
                  : selectedEn === word 
                    ? 'bg-pink-50 border-pink-500 text-pink-600 shadow-lg' 
                    : 'bg-white border-slate-100 text-slate-700 hover:border-pink-200'
              }`}
            >
              {word}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {shuffledUz.map(word => (
            <button
              key={word}
              disabled={matches.some(en => pairs.find(p => p.en === en)?.uz === word)}
              onClick={() => setSelectedUz(word)}
              className={`w-full p-4 rounded-2xl font-bold transition-all border-2 ${
                matches.some(en => pairs.find(p => p.en === en)?.uz === word)
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600 opacity-50' 
                  : selectedUz === word 
                    ? 'bg-pink-50 border-pink-500 text-pink-600 shadow-lg' 
                    : 'bg-white border-slate-100 text-slate-700 hover:border-pink-200'
              }`}
            >
              {word}
            </button>
          ))}
        </div>
        {matches.length === pairs.length && (
          <div className="col-span-2 text-center mt-8">
            <p className="text-2xl font-bold text-emerald-600 mb-4">All Matched! 🎉</p>
            <button 
              onClick={() => {
                setMatches([]);
                setShuffledEn([...pairs].map(p => p.en).sort(() => Math.random() - 0.5));
                setShuffledUz([...pairs].map(p => p.uz).sort(() => Math.random() - 0.5));
              }}
              className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-gradient-to-br from-pink-500 to-rose-500 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-400/20 rounded-full blur-3xl -ml-48 -mb-48" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-sm font-bold text-pink-200 uppercase tracking-widest mb-6">Testimonials</h2>
            <p className="text-5xl font-display font-bold mb-8 leading-tight">
              What our students say about their experience
            </p>
            <div className="flex items-center gap-4 mb-12">
              <div className="flex -space-x-3">
                {[5, 6, 7, 8].map(i => (
                  <img 
                    key={i}
                    src={`https://i.pravatar.cc/100?u=${i}`} 
                    alt="User" 
                    className="w-12 h-12 rounded-full border-2 border-pink-500 shadow-lg"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
              <p className="text-pink-100 font-medium">Joined by 50,000+ happy learners</p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg p-10 rounded-4xl border border-white/20">
            <div className="flex text-amber-400 mb-6">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} fill="currentColor" />)}
            </div>
            <p className="text-xl font-medium mb-8 leading-relaxed italic">
              "Aethel.io completely changed how I learn. The AI feedback is incredible, and I felt comfortable speaking from day one. I passed my IELTS with an 8.0 thanks to them!"
            </p>
            <div className="flex items-center gap-4">
              <img 
                src="https://i.pravatar.cc/100?u=9" 
                alt="Sarah" 
                className="w-14 h-14 rounded-full border-2 border-white/20"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="font-bold text-lg">Sarah Jenkins</p>
                <p className="text-pink-200 text-sm">Business Analyst, Berlin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA({ onSignUp }: { onSignUp: () => void }) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-64 h-64 bg-pink-500 rounded-full blur-3xl -ml-32 -mt-32" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-rose-500 rounded-full blur-3xl -mr-32 -mb-32" />
          </div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Ready to start your journey?</h2>
            <p className="text-slate-400 text-lg mb-10">
              Join thousands of students who are already mastering English. Start your 7-day free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={onSignUp}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-10 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-pink-500/30 transition-all"
              >
                Get Started Now
              </button>
              <button className="bg-white/10 text-white border border-white/10 px-10 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all backdrop-blur-sm">
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SignUpModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (name: string) => void }) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Mock API call and unique username check
    setTimeout(() => {
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      const usernameExists = existingUsers.some((u: any) => u.name.toLowerCase() === formData.name.toLowerCase());
      
      if (usernameExists) {
        setError("This username is already taken. Please choose another one.");
        setIsLoading(false);
        return;
      }

      // Save new user
      existingUsers.push(formData);
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

      setIsLoading(false);
      setIsSuccess(true);
      onSuccess(formData.name);
    }, 1000);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      onSuccess("Google User");
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8 md:p-12">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-3xl font-display font-bold text-slate-900 mb-4">Welcome aboard!</h3>
              <p className="text-slate-500 mb-8">
                Your account has been created successfully. You can now start your English journey.
              </p>
              <button 
                onClick={onClose}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-pink-500/30 transition-all"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h3 className="text-3xl font-display font-bold text-slate-900 mb-2">Create Account</h3>
                <p className="text-slate-500">Join Aethel.io today</p>
              </div>

              <div className="mb-6">
                <button 
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full bg-white border border-slate-200 text-slate-700 py-3.5 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign in with Google
                </button>
              </div>

              <div className="relative flex items-center py-2 mb-6">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">or continue with email</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium border border-rose-100 flex items-start gap-2">
                  <X size={16} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Username</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      required
                      type="text" 
                      placeholder="johndoe123"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      required
                      type="email" 
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      required
                      type="password" 
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                    />
                  </div>
                </div>

                <button 
                  disabled={isLoading}
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-pink-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-slate-500 mt-8">
                Already have an account? <button className="text-pink-600 font-bold hover:underline">Sign In</button>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function LearningDashboard({ onBack, userName }: { onBack: () => void, userName: string | null }) {
  const [activeApp, setActiveApp] = useState<string | null>(null);

  const sections = [
    {
      id: "listening",
      title: "Listening",
      description: "Exam recordings, all four parts and strict timing just like the real test!",
      icon: <Headphones size={24} />,
      color: "pink",
      bg: "bg-pink-50",
      accent: "bg-pink-600",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400",
      illustration: "🎧"
    },
    {
      id: "reading",
      title: "Reading",
      description: "Academic and exam-style passages with timed questions and detailed feedback.",
      icon: <BookOpen size={24} />,
      color: "rose",
      bg: "bg-rose-50",
      accent: "bg-rose-600",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400",
      illustration: "📖"
    },
    {
      id: "writing",
      title: "Writing",
      description: "Task-based writing assessed using real band descriptors and actionable improvement tips.",
      icon: <PenTool size={24} />,
      color: "fuchsia",
      bg: "bg-fuchsia-50",
      accent: "bg-fuchsia-600",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=400",
      illustration: "✍️"
    },
    {
      id: "speaking",
      title: "Speaking",
      description: "Examiner-style questions with performance-based feedback and native-like tips.",
      icon: <Mic size={24} />,
      color: "purple",
      bg: "bg-purple-50",
      accent: "bg-purple-600",
      image: "https://images.unsplash.com/photo-1551732998-9573f695f8b7?auto=format&fit=crop&q=80&w=400",
      illustration: "🎙️"
    }
  ];

  const apps = [
    {
      id: "ai-assistant",
      title: "AI English Assistant",
      description: "Chat + Voice Interaction",
      icon: <Bot className="text-pink-600" />,
      bg: "bg-pink-50"
    },
    {
      id: "listening",
      title: "Interactive Listening",
      description: "Practice Modules",
      icon: <Headphones className="text-rose-600" />,
      bg: "bg-rose-50"
    },
    {
      id: "speaking",
      title: "Speak & Improve",
      description: "Real-Time Feedback",
      icon: <Mic className="text-fuchsia-600" />,
      bg: "bg-fuchsia-50"
    },
    {
      id: "progress",
      title: "Progress Tracking",
      description: "Lesson Analytics",
      icon: <BarChart3 className="text-purple-600" />,
      bg: "bg-purple-50"
    },
    {
      id: "roadmap",
      title: "Personalized Roadmap",
      description: "AI-Driven Path",
      icon: <Brain className="text-amber-600" />,
      bg: "bg-amber-50"
    },
    {
      id: "quiz",
      title: "Smart Quiz",
      description: "Skill Assessment",
      icon: <ClipboardCheck className="text-purple-600" />,
      bg: "bg-purple-50"
    },
    {
      id: "timer",
      title: "Time-Based Practice",
      description: "Focus Sessions",
      icon: <Timer className="text-cyan-600" />,
      bg: "bg-cyan-50"
    },
    {
      id: "summary",
      title: "Weekly Summary",
      description: "Learning Insights",
      icon: <Calendar className="text-orange-600" />,
      bg: "bg-orange-50"
    },
    {
      id: "journey",
      title: "Structured Journey",
      description: "Step-by-Step Guide",
      icon: <Target className="text-indigo-600" />,
      bg: "bg-indigo-50"
    },
    {
      id: "daily-word",
      title: "Daily Word Challenge",
      description: "Learn & Build Streaks",
      icon: <Zap className="text-pink-600" />,
      bg: "bg-pink-50"
    },
    {
      id: "dictionary",
      title: "EN-UZ Dictionary",
      description: "Instant Translation",
      icon: <BookA className="text-teal-600" />,
      bg: "bg-teal-50"
    },
    {
      id: "certificates",
      title: "Premium Certificates",
      description: "Earn & Verify",
      icon: <Award className="text-rose-600" />,
      bg: "bg-rose-50"
    },
    {
      id: "time-machine",
      title: "AI Time Machine",
      description: "Chat with History",
      icon: <History className="text-pink-600" />,
      bg: "bg-pink-50"
    }
  ];

  if (activeApp === 'quiz') return <SmartQuizApp onBack={() => setActiveApp(null)} />;
  if (activeApp === 'roadmap') return <RoadmapApp onBack={() => setActiveApp(null)} />;
  if (activeApp === 'ai-assistant') return <AIAssistantApp onBack={() => setActiveApp(null)} />;
  if (activeApp === 'listening') return <ListeningApp onBack={() => setActiveApp(null)} />;
  if (activeApp === 'speaking') return <SpeakingApp onBack={() => setActiveApp(null)} />;
  if (activeApp === 'progress') return <ProgressApp onBack={() => setActiveApp(null)} />;
  if (activeApp === 'timer') return <TimerApp onBack={() => setActiveApp(null)} />;
  if (activeApp === 'summary') return <SummaryApp onBack={() => setActiveApp(null)} />;
  if (activeApp === 'journey') return <JourneyApp onBack={() => setActiveApp(null)} />;
  if (activeApp === 'dictionary') return <DictionaryApp onBack={() => setActiveApp(null)} />;
  if (activeApp === 'daily-word') return <DailyWordChallenge onBack={() => setActiveApp(null)} />;
  if (activeApp === 'certificates') return <CertificateApp onBack={() => setActiveApp(null)} userName={userName || "Learner"} />;
  if (activeApp === 'time-machine') return <TimeMachineApp onBack={() => setActiveApp(null)} />;

  return (
    <section className="py-12 md:py-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-500 hover:text-pink-600 font-medium mb-4 transition-colors"
            >
              <ArrowLeft size={20} /> Back to Home
            </button>
            <h2 className="text-4xl font-display font-bold text-slate-900">Your Learning Journey</h2>
            <p className="text-slate-500 mt-2">Select a skill to start practicing today.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {sections.map((section, i) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 items-center group hover:shadow-xl transition-all duration-500"
            >
              <div className="flex-1 order-2 md:order-1">
                <div className={`w-12 h-12 ${section.bg} rounded-2xl flex items-center justify-center ${section.accent.replace('bg-', 'text-')} mb-6`}>
                  {section.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{section.title}</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">
                  {section.description}
                </p>
                <button className={`px-8 py-3.5 ${section.accent} text-white rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-${section.color}-200 active:scale-95`}>
                  Start Journey
                </button>
              </div>
              
              <div className={`w-full md:w-48 h-48 ${section.bg} rounded-3xl flex items-center justify-center text-6xl order-1 md:order-2 relative overflow-hidden group-hover:scale-105 transition-transform duration-500 shadow-inner`}>
                <div className="absolute inset-0 opacity-10">
                  <img 
                    src={section.image} 
                    alt={section.title} 
                    className="w-full h-full object-cover grayscale"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="relative z-10 drop-shadow-2xl">{section.illustration}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mb-12">
          <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">Learning Apps & Tools</h3>
          <p className="text-slate-500">Powerful AI-driven tools to accelerate your progress.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app, i) => (
            <motion.div
              key={i}
              onClick={() => setActiveApp(app.id)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-5 group cursor-pointer"
            >
              <div className={`w-14 h-14 ${app.bg} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                {app.icon}
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{app.title}</h4>
                <p className="text-sm text-slate-500">{app.description}</p>
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight size={18} className="text-slate-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-50 pt-20 pb-10 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center text-white">
                <Globe size={18} />
              </div>
              <span className="text-xl font-display font-bold tracking-tight text-slate-900">
                Aethel<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">.io</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Empowering learners worldwide to master the English language through technology and expert teaching.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com/aethel.io" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-pink-600 hover:border-pink-100 hover:bg-pink-50 transition-all">
                <Instagram size={20} />
              </a>
              <a href="https://t.me/isomiddinov11" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-pink-600 hover:border-pink-100 hover:bg-pink-50 transition-all">
                <Send size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-pink-600 transition-colors">Courses</a></li>
              <li><a href="#" className="hover:text-pink-600 transition-colors">Tutors</a></li>
              <li><a href="#" className="hover:text-pink-600 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-pink-600 transition-colors">Mobile App</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center text-pink-600">
                  <Phone size={16} />
                </div>
                <a href="tel:+998940200532" className="hover:text-pink-600 transition-colors">+998 94 020 05 32</a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center text-pink-600">
                  <Send size={16} />
                </div>
                <a href="https://t.me/isomiddinov11" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 transition-colors">@isomiddinov11</a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center text-pink-600">
                  <Instagram size={16} />
                </div>
                <a href="https://instagram.com/aethel.io" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 transition-colors">@aethel.io</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Newsletter</h4>
            <p className="text-sm text-slate-500 mb-4">Get the latest tips and course updates.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
              />
              <button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-2 rounded-xl hover:opacity-90 transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Aethel.io. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function SmartQuizApp({ onBack }: { onBack: () => void }) {
  const questions = [
    {
      q: "Which sentence is grammatically correct?",
      options: [
        "She don't like playing tennis.",
        "She doesn't likes playing tennis.",
        "She doesn't like playing tennis.",
        "She not like playing tennis."
      ],
      answer: 2
    },
    {
      q: "Choose the correct preposition: 'I am good ___ playing chess.'",
      options: ["in", "at", "on", "with"],
      answer: 1
    },
    {
      q: "What is the synonym of 'ubiquitous'?",
      options: ["Rare", "Expensive", "Everywhere", "Complicated"],
      answer: 2
    },
    {
      q: "If I ___ you, I would study harder.",
      options: ["am", "was", "were", "be"],
      answer: 2
    },
    {
      q: "By this time next year, I ___ my degree.",
      options: ["will finish", "will have finished", "finish", "would finish"],
      answer: 1
    }
  ];

  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const handleAnswer = (index: number) => {
    setSelected(index);
    setTimeout(() => {
      if (index === questions[currentQ].answer) {
        setScore(s => s + 1);
      }
      if (currentQ < questions.length - 1) {
        setCurrentQ(q => q + 1);
        setSelected(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium mb-8 transition-colors">
        <ArrowLeft size={20} /> Back to Dashboard
      </button>
      
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <ClipboardCheck size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Smart English Quiz</h2>
            <p className="text-slate-500">Test your grammar and vocabulary</p>
          </div>
        </div>

        {showResult ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star size={48} />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">Quiz Completed!</h3>
            <p className="text-xl text-slate-600 mb-8">You scored {score} out of {questions.length}</p>
            <button onClick={() => { setCurrentQ(0); setScore(0); setShowResult(false); setSelected(null); }} className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold hover:opacity-90 transition-colors">
              Try Again
            </button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-bold text-slate-400 uppercase">Question {currentQ + 1} of {questions.length}</span>
              <span className="text-sm font-bold text-pink-600">Score: {score}</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mb-8">
              <div className="bg-pink-600 h-2 rounded-full transition-all" style={{ width: `${((currentQ) / questions.length) * 100}%` }}></div>
            </div>
            
            <h3 className="text-xl font-medium text-slate-900 mb-8">{questions[currentQ].q}</h3>
            
            <div className="space-y-3">
              {questions[currentQ].options.map((opt, i) => {
                let btnClass = "w-full text-left px-6 py-4 rounded-xl border font-medium transition-all ";
                if (selected === null) {
                  btnClass += "border-slate-200 hover:border-pink-600 hover:bg-pink-50 text-slate-700";
                } else if (i === questions[currentQ].answer) {
                  btnClass += "border-emerald-500 bg-emerald-50 text-emerald-700";
                } else if (i === selected) {
                  btnClass += "border-rose-500 bg-rose-50 text-rose-700";
                } else {
                  btnClass += "border-slate-200 text-slate-400 opacity-50";
                }
                
                return (
                  <button 
                    key={i} 
                    onClick={() => selected === null && handleAnswer(i)}
                    className={btnClass}
                    disabled={selected !== null}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RoadmapApp({ onBack }: { onBack: () => void }) {
  const steps = [
    {
      level: "B1 Intermediate",
      title: "Build the Foundation",
      desc: "Master core grammar tenses (Present Perfect, Conditionals) and everyday vocabulary.",
      status: "completed"
    },
    {
      level: "B2 Upper-Intermediate",
      title: "Expand & Express",
      desc: "Learn phrasal verbs, idioms, and complex sentence structures. Start thinking in English.",
      status: "current"
    },
    {
      level: "C1 Advanced",
      title: "Achieve Fluency",
      desc: "Understand implicit meanings, use academic vocabulary, and speak spontaneously without searching for words.",
      status: "upcoming"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-pink-600 font-medium mb-8 transition-colors">
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Brain size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900">How to Achieve C1 Level</h2>
            <p className="text-slate-500">Your personalized roadmap to advanced English fluency.</p>
          </div>
        </div>

        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          {steps.map((step, i) => (
            <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${step.status === 'completed' ? 'bg-emerald-500 text-white' : step.status === 'current' ? 'bg-pink-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                {step.status === 'completed' ? <CheckCircle2 size={20} /> : <Target size={20} />}
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl border border-slate-100 bg-slate-50 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${step.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : step.status === 'current' ? 'bg-pink-100 text-pink-700' : 'bg-slate-200 text-slate-500'}`}>
                    {step.level}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                
                {step.level === "C1 Advanced" && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <h4 className="font-bold text-sm text-slate-900 mb-2">Actionable Tips for C1:</h4>
                    <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
                      <li>Read academic articles and literature daily.</li>
                      <li>Listen to native podcasts at 1.2x speed.</li>
                      <li>Practice speaking with our AI Assistant focusing on complex topics.</li>
                      <li>Write essays and get feedback on coherence and cohesion.</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AIAssistantApp({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Hello! I'm your AI English Tutor. Let's practice speaking or typing. I will correct any grammar or vocabulary mistakes you make. What would you like to talk about today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `
You are an expert English tutor. The user is practicing English with you.
Your goal is to have a natural conversation, but you MUST correct any grammar, spelling, or vocabulary mistakes they make.
If they make a mistake, gently point it out and provide the correct version, then continue the conversation.
If their English is perfect, just reply naturally.
Keep your responses relatively concise.

User's message: "${userMsg}"
`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setMessages(prev => [...prev, { role: 'ai', text: response.text || "I'm sorry, I couldn't process that." }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 h-screen flex flex-col">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-pink-600 font-medium mb-4 transition-colors shrink-0">
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col flex-grow overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-pink-50/50">
          <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">AI English Tutor</h2>
            <p className="text-sm text-slate-500">Practice speaking & get instant corrections</p>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'}`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2 text-slate-500">
                <Loader2 className="animate-spin" size={20} /> Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message here..."
              className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Send size={20} />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListeningApp({ onBack }: { onBack: () => void }) {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-pink-600 font-medium mb-8 transition-colors">
        <ArrowLeft size={20} /> Back to Dashboard
      </button>
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
            <Headphones size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Interactive Listening</h2>
            <p className="text-slate-500">Listen to the audio and answer the questions</p>
          </div>
        </div>
        
        <div className="bg-slate-50 rounded-2xl p-6 mb-8 flex flex-col items-center justify-center gap-4">
           <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-colors shadow-lg shadow-pink-200">
             <PlayCircle size={32} />
           </div>
           <div className="w-full max-w-md bg-slate-200 h-2 rounded-full overflow-hidden">
             <div className="bg-gradient-to-r from-pink-500 to-rose-500 w-1/3 h-full"></div>
           </div>
           <div className="flex justify-between w-full max-w-md text-sm text-slate-500 font-medium">
             <span>0:45</span>
             <span>2:15</span>
           </div>
        </div>

        <div className="space-y-6">
          <h3 className="font-bold text-lg text-slate-900">1. What is the main topic of the conversation?</h3>
          <div className="space-y-3">
            {["Booking a flight", "Reserving a hotel room", "Ordering food", "Asking for directions"].map((opt, i) => (
              <button key={i} className="w-full text-left px-6 py-4 rounded-xl border border-slate-200 hover:border-pink-600 hover:bg-pink-50 text-slate-700 font-medium transition-all">
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SpeakingApp({ onBack }: { onBack: () => void }) {
  const [isRecording, setIsRecording] = useState(false);
  
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-pink-600 font-medium mb-8 transition-colors">
        <ArrowLeft size={20} /> Back to Dashboard
      </button>
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-12 h-12 bg-fuchsia-50 text-fuchsia-600 rounded-xl flex items-center justify-center">
            <Mic size={24} />
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-bold text-slate-900">Speak & Improve</h2>
            <p className="text-slate-500">Read the sentence aloud</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-8 mb-8">
          <p className="text-2xl font-medium text-slate-800 leading-relaxed">
            "The quick brown fox jumps over the lazy dog."
          </p>
        </div>

        <button 
          onClick={() => setIsRecording(!isRecording)}
          className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 transition-all shadow-xl ${isRecording ? 'bg-rose-500 text-white shadow-rose-200 animate-pulse' : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-pink-200 hover:scale-105'}`}
        >
          <Mic size={40} />
        </button>
        <p className="text-slate-500 font-medium">
          {isRecording ? "Listening... Click to stop." : "Click the microphone to start recording"}
        </p>
      </div>
    </div>
  );
}

function ProgressApp({ onBack }: { onBack: () => void }) {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-pink-600 font-medium mb-8 transition-colors">
        <ArrowLeft size={20} /> Back to Dashboard
      </button>
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <BarChart3 size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Progress Tracking</h2>
            <p className="text-slate-500">Your learning analytics</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Hours Learned", value: "42.5" },
            { label: "Lessons Completed", value: "18" },
            { label: "Current Streak", value: "5 Days" },
            { label: "Words Mastered", value: "340" }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
              <p className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500 mb-2">{stat.value}</p>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 flex items-center justify-center min-h-[300px]">
          <p className="text-slate-400 font-medium flex items-center gap-2">
            <BarChart3 /> Detailed charts will appear here as you learn more.
          </p>
        </div>
      </div>
    </div>
  );
}

function TimerApp({ onBack }: { onBack: () => void }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (!isActive && timeLeft !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-pink-600 font-medium mb-8 transition-colors">
        <ArrowLeft size={20} /> Back to Dashboard
      </button>
      <div className="bg-white rounded-3xl p-8 md:p-16 shadow-sm border border-slate-100 text-center">
        <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Timer size={32} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Focus Session</h2>
        <p className="text-slate-500 mb-12">Stay focused on your English studies</p>

        <div className="text-8xl font-display font-bold text-slate-900 mb-12 tracking-tight">
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>

        <div className="flex justify-center gap-4">
          <button 
            onClick={() => setIsActive(!isActive)}
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-bold hover:opacity-90 transition-colors shadow-lg shadow-pink-200 text-lg w-40"
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button 
            onClick={() => { setIsActive(false); setTimeLeft(25 * 60); }}
            className="px-8 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-colors text-lg w-40"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryApp({ onBack }: { onBack: () => void }) {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-pink-600 font-medium mb-8 transition-colors">
        <ArrowLeft size={20} /> Back to Dashboard
      </button>
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
            <Calendar size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Weekly Summary</h2>
            <p className="text-slate-500">Your achievements this week</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-3xl p-8 text-white mb-8 shadow-lg shadow-pink-200">
          <h3 className="text-xl font-medium mb-2 opacity-90">Great job, learner!</h3>
          <p className="text-3xl font-bold mb-6">You were active for 4 days this week.</p>
          <div className="flex gap-2">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${[1, 2, 4, 5].includes(i) ? 'bg-white text-pink-600' : 'bg-white/20 text-white'}`}>
                {day}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-slate-900">Key Achievements</h4>
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-4 border border-slate-100">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="font-bold text-slate-900">Completed B1 Grammar Module</p>
              <p className="text-sm text-slate-500">You scored 95% on the final test.</p>
            </div>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-4 border border-slate-100">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="font-bold text-slate-900">Learned 50 new words</p>
              <p className="text-sm text-slate-500">Added to your vocabulary bank.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JourneyApp({ onBack }: { onBack: () => void }) {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-pink-600 font-medium mb-8 transition-colors">
        <ArrowLeft size={20} /> Back to Dashboard
      </button>
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center">
            <Target size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Structured Journey</h2>
            <p className="text-slate-500">Your step-by-step curriculum</p>
          </div>
        </div>

        <div className="space-y-6">
          {[
            { title: "Module 1: Introductions & Basics", status: "completed", progress: 100 },
            { title: "Module 2: Daily Routines", status: "completed", progress: 100 },
            { title: "Module 3: Travel & Directions", status: "current", progress: 60 },
            { title: "Module 4: Work & Business", status: "locked", progress: 0 },
            { title: "Module 5: Advanced Conversations", status: "locked", progress: 0 },
          ].map((mod, i) => (
            <div key={i} className={`p-6 rounded-2xl border ${mod.status === 'current' ? 'border-pink-200 bg-pink-50/50' : 'border-slate-100 bg-slate-50'} flex items-center gap-6`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${mod.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : mod.status === 'current' ? 'bg-pink-600 text-white shadow-lg shadow-pink-200' : 'bg-slate-200 text-slate-400'}`}>
                {mod.status === 'completed' ? <CheckCircle2 size={24} /> : mod.status === 'current' ? <PlayCircle size={24} /> : <Lock size={24} />}
              </div>
              <div className="flex-grow">
                <h3 className={`font-bold text-lg mb-2 ${mod.status === 'locked' ? 'text-slate-400' : 'text-slate-900'}`}>{mod.title}</h3>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${mod.status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-600'}`} style={{ width: `${mod.progress}%` }}></div>
                </div>
              </div>
              <div className="font-bold text-slate-400 w-12 text-right">
                {mod.progress}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DailyWordChallenge({ onBack }: { onBack: () => void }) {
  const [wordData, setWordData] = useState<{ word: string, definition: string, example: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLearned, setHasLearned] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetchWord = async () => {
      setIsLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const today = new Date().toISOString().split('T')[0];
        
        const prompt = `
Generate a "Word of the Day" for English learners for the date ${today}.
Provide the word, its definition, and an example sentence.
Format the response as JSON:
{
  "word": "...",
  "definition": "...",
  "example": "..."
}
`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
        });

        const text = response.text || "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          setWordData(JSON.parse(jsonMatch[0]));
        }
      } catch (error) {
        console.error("Daily Word Error:", error);
        setWordData({
          word: "Resilience",
          definition: "The capacity to recover quickly from difficulties; toughness.",
          example: "She showed great resilience in the face of adversity."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWord();

    // Load streak data
    const savedStreak = localStorage.getItem('dailyStreak');
    const lastDate = localStorage.getItem('lastLearnedDate');
    const today = new Date().toISOString().split('T')[0];

    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    }

    if (lastDate === today) {
      setHasLearned(true);
    }
  }, []);

  const handleGotIt = () => {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = localStorage.getItem('lastLearnedDate');
    let newStreak = streak;

    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastDate === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }

      localStorage.setItem('dailyStreak', newStreak.toString());
      localStorage.setItem('lastLearnedDate', today);
      setStreak(newStreak);
      setHasLearned(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 h-screen flex flex-col">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-pink-600 font-medium mb-4 transition-colors shrink-0">
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden flex-grow">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-pink-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center">
              <Zap size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Daily Word Challenge</h2>
              <p className="text-sm text-slate-500">Expand your vocabulary every day</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-pink-100 shadow-sm">
            <Sparkles className="text-pink-500" size={20} />
            <span className="font-bold text-slate-900">{streak} Day Streak</span>
          </div>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 text-slate-400">
              <Loader2 className="animate-spin" size={48} />
              <p className="text-lg font-medium">Generating your word of the day...</p>
            </div>
          ) : wordData ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl w-full"
            >
              <span className="text-sm font-bold text-pink-600 uppercase tracking-widest mb-4 block">Word of the Day</span>
              <h3 className="text-6xl font-display font-bold text-slate-900 mb-6">{wordData.word}</h3>
              
              <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 mb-8 shadow-inner">
                <p className="text-2xl text-slate-700 leading-relaxed font-medium mb-6">
                  {wordData.definition}
                </p>
                <div className="h-px bg-slate-200 w-24 mx-auto mb-6" />
                <p className="text-lg text-slate-500 italic">
                  "{wordData.example}"
                </p>
              </div>

              {!hasLearned ? (
                <button 
                  onClick={handleGotIt}
                  className="px-12 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-bold text-xl hover:opacity-90 transition-all shadow-xl shadow-pink-200 active:scale-95"
                >
                  I've learned it!
                </button>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xl">
                    <CheckCircle2 size={28} />
                    Challenge Completed!
                  </div>
                  <p className="text-slate-500">Come back tomorrow for a new word.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="text-slate-400">
              <p>Failed to load word. Please try again.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TimeMachineApp({ onBack }: { onBack: () => void }) {
  const [selectedFigure, setSelectedFigure] = useState<any>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const figures = [
    { 
      id: 'steve-jobs', 
      name: 'Steve Jobs', 
      era: 'Digital Revolution', 
      avatar: "🍎",
      description: "Co-founder of Apple, visionary of the personal computer revolution.",
      prompt: "You are Steve Jobs. Speak with passion about design, simplicity, and 'denting the universe'. Use simplified English for a learner."
    },
    { 
      id: 'marie-curie', 
      name: 'Marie Curie', 
      era: 'Early 20th Century', 
      avatar: "🧪",
      description: "Physicist and chemist who conducted pioneering research on radioactivity.",
      prompt: "You are Marie Curie. Speak with scientific curiosity and determination. Use simplified English for a learner."
    },
    { 
      id: 'leonardo-da-vinci', 
      name: 'Leonardo da Vinci', 
      era: 'Renaissance', 
      avatar: "🎨",
      description: "Italian polymath of the High Renaissance who was active as a painter, draughtsman, engineer, and scientist.",
      prompt: "You are Leonardo da Vinci. Speak with artistic wonder and a thirst for knowledge across all disciplines. Use simplified English for a learner."
    },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedFigure) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const systemPrompt = `
${selectedFigure.prompt}
Rules:
1. Speak in the characteristic tone and vocabulary of ${selectedFigure.name}.
2. Use slightly simplified English suitable for a language learner.
3. If the user makes a significant grammatical mistake, gently correct it in a post-script (P.S.) after your historical response.
4. Keep the conversation engaging and encourage the user to ask more about your life and era.
`;

      const result = await ai.models.generateContentStream({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: systemPrompt + "\n\nUser says: " + userMessage }] }
        ],
      });

      let fullResponse = "";
      for await (const chunk of result) {
        fullResponse += chunk.text || "";
      }

      setMessages(prev => [...prev, { role: 'ai', content: fullResponse }]);
    } catch (error) {
      console.error("Time Machine Error:", error);
      setMessages(prev => [...prev, { role: 'ai', content: "I am sorry, the time machine seems to be malfunctioning. Let us try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedFigure) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-pink-600 font-medium mb-8 transition-colors">
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold text-slate-900 mb-4">Travel Back in Time</h2>
          <p className="text-xl text-slate-500">Vaqtga sayohat qiling</p>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Step into the 'AI Time Machine' and practice your English with legendary figures from history. 
            Engage in immersive conversations with innovators, leaders, and artists.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {figures.map((fig) => (
            <motion.button
              key={fig.id}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedFigure(fig)}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-pink-100 transition-all text-left group"
            >
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{fig.avatar}</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{fig.name}</h3>
              <p className="text-pink-600 font-bold text-sm mb-4 uppercase tracking-wider">{fig.era}</p>
              <p className="text-slate-500 text-sm leading-relaxed">{fig.description}</p>
              <div className="mt-6 flex items-center gap-2 text-pink-600 font-bold group-hover:translate-x-2 transition-transform">
                Suhbatni boshlash <ChevronRight size={18} />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <button onClick={() => setSelectedFigure(null)} className="flex items-center gap-2 text-slate-500 hover:text-pink-600 font-medium transition-colors">
          <ArrowLeft size={20} /> Change Figure
        </button>
        <div className="flex items-center gap-3 bg-pink-50 px-4 py-2 rounded-2xl border border-pink-100">
          <span className="text-2xl">{selectedFigure.avatar}</span>
          <div>
            <p className="text-xs font-bold text-pink-600 uppercase tracking-widest">Now chatting with</p>
            <p className="font-bold text-slate-900">{selectedFigure.name}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col flex-grow overflow-hidden">
        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50/50"
        >
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">{selectedFigure.avatar}</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Greetings, learner!</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                I am {selectedFigure.name}. I am delighted to speak with you today. 
                What would you like to know about my life or my era?
              </p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-pink-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
              }`}>
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2">
                <Loader2 className="animate-spin text-pink-600" size={20} />
                <span className="text-slate-500 font-medium">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white border-t border-slate-100">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Ask ${selectedFigure.name} something...`}
              className="flex-grow bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-lg"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:opacity-90 transition-all shadow-lg shadow-pink-200 disabled:opacity-50 shrink-0"
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CertificateApp({ onBack, userName }: { onBack: () => void, userName: string }) {
  const [streak, setStreak] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedStreak = localStorage.getItem('dailyStreak');
    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    }
  }, []);

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    setIsGenerating(true);

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Aethel.io_Certificate_${userName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("Certificate Generation Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const test30DayStreak = () => {
    localStorage.setItem('dailyStreak', '30');
    setStreak(30);
  };

  const resetStreak = () => {
    localStorage.setItem('dailyStreak', '0');
    setStreak(0);
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 min-h-screen flex flex-col">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-pink-600 font-medium mb-8 transition-colors shrink-0">
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div className="grid lg:grid-cols-3 gap-8 flex-grow">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-6">
              <Award size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Certificates</h2>
            <p className="text-slate-500 mb-8 text-sm">Earn premium certificates by achieving learning milestones.</p>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl border ${streak >= 30 ? 'border-emerald-100 bg-emerald-50/50' : 'border-slate-100 bg-slate-50 opacity-60'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Milestone</span>
                  {streak >= 30 && <CheckCircle2 size={16} className="text-emerald-500" />}
                </div>
                <h3 className="font-bold text-slate-900">30-Day Learning Streak</h3>
                <p className="text-xs text-slate-500 mt-1">Status: {streak >= 30 ? 'Earned' : `${streak}/30 days`}</p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50 opacity-60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Milestone</span>
                </div>
                <h3 className="font-bold text-slate-900">Course Completion</h3>
                <p className="text-xs text-slate-500 mt-1">Status: In Progress</p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 mb-4">Testing Controls</h4>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={test30DayStreak}
                  className="w-full py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-all"
                >
                  Simulate 30-Day Streak
                </button>
                <button 
                  onClick={resetStreak}
                  className="w-full py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-200 transition-all"
                >
                  Reset Streak
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {streak >= 30 ? (
            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Certificate Preview</h3>
                    <p className="text-sm text-slate-500">30-Day Streak Achievement</p>
                  </div>
                  <button 
                    onClick={handleDownload}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-pink-200 disabled:opacity-50"
                  >
                    {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                    Download PDF
                  </button>
                </div>

                {/* Certificate Template */}
                <div className="overflow-hidden rounded-xl border border-slate-200 shadow-2xl">
                  <div 
                    ref={certificateRef}
                    className="relative w-[800px] h-[560px] bg-white p-12 flex flex-col items-center justify-between text-center font-sans overflow-hidden"
                    style={{ 
                      backgroundImage: 'radial-gradient(circle at 0% 0%, rgba(244, 63, 94, 0.05) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(244, 63, 94, 0.05) 0%, transparent 50%)' 
                    }}
                  >
                    {/* Decorative Border */}
                    <div className="absolute inset-4 border-2 border-pink-100 rounded-lg pointer-events-none" />
                    <div className="absolute inset-6 border border-pink-50 rounded-lg pointer-events-none" />
                    
                    {/* Header */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center text-white">
                          <Globe size={24} />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-slate-900">
                          Aethel<span className="text-pink-600">.io</span>
                        </span>
                      </div>
                      <div className="h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent w-64 mx-auto" />
                    </div>

                    {/* Content */}
                    <div className="space-y-8">
                      <h1 className="text-5xl font-display font-bold text-slate-900 tracking-tight uppercase">
                        Certificate of Achievement
                      </h1>
                      <p className="text-slate-500 text-lg">This is to certify that</p>
                      <h2 className="text-4xl font-display font-bold text-pink-600 underline decoration-pink-200 underline-offset-8">
                        {userName}
                      </h2>
                      <p className="text-slate-600 text-lg max-w-lg mx-auto leading-relaxed">
                        has successfully maintained a consistent learning habit for <span className="font-bold text-slate-900">30 consecutive days</span> on the Aethel.io platform.
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="w-full flex justify-between items-end px-8">
                      <div className="text-left space-y-2">
                        <div className="w-32 h-px bg-slate-300" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date Issued</p>
                        <p className="text-sm font-bold text-slate-900">{new Date().toLocaleDateString()}</p>
                      </div>
                      
                      <div className="flex flex-col items-center gap-2">
                         <div className="w-16 h-16 rounded-full border-4 border-pink-50 flex items-center justify-center text-pink-500">
                           <ShieldCheck size={32} />
                         </div>
                         <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Verified Premium</p>
                      </div>

                      <div className="text-right space-y-2">
                        <div className="w-32 h-px bg-slate-300" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Instructor</p>
                        <p className="text-sm font-bold text-slate-900 italic font-serif">Sanjar Isomiddinov</p>
                      </div>
                    </div>

                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-bl-full opacity-50 -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-50 rounded-tr-full opacity-50 -ml-16 -mb-16" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-white rounded-3xl p-12 border border-slate-100 text-center">
              <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
                <Lock size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Certificate Locked</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-8">
                You need a 30-day learning streak to unlock your first premium certificate. Keep learning every day!
              </p>
              <div className="w-full max-w-md bg-slate-100 h-3 rounded-full overflow-hidden mb-2">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-rose-500 h-full transition-all duration-1000" 
                  style={{ width: `${(streak / 30) * 100}%` }}
                />
              </div>
              <p className="text-sm font-bold text-pink-600">{streak} / 30 Days</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DictionaryApp({ onBack }: { onBack: () => void }) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `
You are an expert English-Uzbek dictionary.
Translate the following English word or phrase to Uzbek (or Uzbek to English).
Provide the response in this exact format (do not use markdown bolding in the labels, just output exactly as shown):

Word: [The word]
Translation: [Uzbek translation]
Part of Speech: [e.g., Noun, Verb]
Definition: [Simple English definition]
Example (EN): [Example sentence in English]
Example (UZ): [Example sentence translated to Uzbek]

Word/Phrase: "${query}"
`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setResult(response.text || "Could not find translation.");
    } catch (error) {
      console.error("Dictionary Error:", error);
      setResult("Sorry, I'm having trouble connecting to the dictionary right now.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 h-screen flex flex-col">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-pink-600 font-medium mb-4 transition-colors shrink-0">
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-pink-50/50">
          <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center">
            <BookA size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">EN-UZ Dictionary</h2>
            <p className="text-sm text-slate-500">Translate English to Uzbek and vice versa</p>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-b border-slate-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for a word or phrase..."
              className="flex-grow bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-lg"
            />
            <button
              onClick={handleSearch}
              disabled={isLoading || !query.trim()}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>

        <div className="flex-grow p-6 bg-white min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
              <Loader2 className="animate-spin" size={32} />
              <p>Searching dictionary...</p>
            </div>
          ) : result ? (
            <div className="max-w-2xl mx-auto bg-slate-50 rounded-2xl p-8 border border-slate-100">
              <div className="whitespace-pre-wrap text-slate-700 text-lg leading-relaxed font-medium">
                {result.split('\n').map((line, i) => {
                  if (line.startsWith('Word:')) return <h3 key={i} className="text-3xl font-display font-bold text-slate-900 mb-4">{line.replace('Word:', '').trim()}</h3>;
                  if (line.startsWith('Translation:')) return <p key={i} className="text-2xl text-pink-600 font-bold mb-4">{line.replace('Translation:', '').trim()}</p>;
                  if (line.startsWith('Part of Speech:')) return <p key={i} className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-6">{line.replace('Part of Speech:', '').trim()}</p>;
                  if (line.startsWith('Definition:')) return <p key={i} className="mb-4"><strong className="text-slate-900">Definition:</strong> {line.replace('Definition:', '').trim()}</p>;
                  if (line.startsWith('Example (EN):')) return <p key={i} className="mb-2 italic text-slate-600">"{line.replace('Example (EN):', '').trim()}"</p>;
                  if (line.startsWith('Example (UZ):')) return <p key={i} className="mb-4 italic text-pink-700">"{line.replace('Example (UZ):', '').trim()}"</p>;
                  return <p key={i}>{line}</p>;
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
              <BookA size={48} className="opacity-20" />
              <p>Type a word above to see its translation and examples.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
