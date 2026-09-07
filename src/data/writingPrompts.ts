export interface WritingPrompt {
  id: string;
  category: 'multilevel_essay' | 'ielts_task2' | 'ielts_task1' | 'cefr_letter';
  title: string;
  prompt: string;
  type: string;
  recommendedWords: number;
  timeMinutes: number;
  sampleDraft?: string;
  keyVocabularyHints: string[];
}

export const WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: 'multilevel-online-education',
    category: 'multilevel_essay',
    title: 'Online vs Traditional Learning',
    type: 'Opinion / Discussion Essay',
    recommendedWords: 250,
    timeMinutes: 40,
    prompt: 'Some people believe that online learning is more effective than traditional classroom education, while others argue that face-to-face interaction with teachers is irreplaceable. Discuss both views and give your own opinion.',
    keyVocabularyHints: ['pedagogical methods', 'academic performance', 'self-discipline', 'interpersonal skills', 'blended learning'],
    sampleDraft: `In recent years, distance learning has become very popular across the world. Some people think online studying is better than normal school, but other people believe going to classroom is still important. In this essay I will discuss both points of view and give my opinion.

On the one hand, online education has many goods. First, students can study from anywhere and save a lot of time. They don't need to travel by bus or taxi every morning. Also, students can watch lessons again if they didn't understand first time. For example, many university students in Uzbekistan now use online platforms to learn foreign languages easily.

On the other hand, traditional education gives real human connection. When students sit together, they can make friends and ask questions directly to teacher. Teachers can see if a student is confused and help immediately. Furthermore, doing practical work like chemistry experiments in a real laboratory is impossible through a computer screen.

In conclusion, although online learning is very convenient and flexible, I believe traditional education is still better because socialization and direct teacher guidance are essential for real success.`
  },
  {
    id: 'multilevel-ai-workplace',
    category: 'multilevel_essay',
    title: 'Artificial Intelligence & Future Jobs',
    type: 'Problem & Solution / Prediction',
    recommendedWords: 250,
    timeMinutes: 40,
    prompt: 'The rapid development of artificial intelligence (AI) and automation is threatening many traditional jobs. What problems does this cause, and what measures can governments and individuals take to prepare for this future?',
    keyVocabularyHints: ['technological displacement', 'reskilling programs', 'cognitive adaptability', 'automation', 'future workforce'],
    sampleDraft: `Nowadays, artificial intelligence is developing very fast and changing how people work. Many people are worried that robots and computer programs will take their jobs. This issue causes several serious problems, but there are also solutions to handle it.

The main problem is high unemployment among ordinary workers. For instance, jobs in customer service, translation, and data entry are already being done by AI. People who lose their jobs might struggle to find another occupation, which can lead to poverty and psychological stress.

To solve this, governments must invest in training programs. They should teach citizens digital skills and computer literacy from early school age. Moreover, individuals themselves must be ready for lifelong learning instead of depending on one profession forever.`
  },
  {
    id: 'ielts-environment-tourism',
    category: 'ielts_task2',
    title: 'Ecotourism vs Environmental Impact',
    type: 'Advantages & Disadvantages',
    recommendedWords: 250,
    timeMinutes: 40,
    prompt: 'International tourism has brought significant economic benefits to many remote regions, but it has also caused irreversible environmental damage. Do the advantages of international tourism outweigh the disadvantages?',
    keyVocabularyHints: ['economic catalyst', 'ecological degradation', 'carbon footprint', 'sustainable development', 'pristine habitats'],
    sampleDraft: `Over the past decades, international tourism has grown dramatically. While it brings huge financial benefits to local communities, it also harms nature. In my perspective, the disadvantages of unregulated tourism outweigh the economic gains unless strict ecological rules are enforced.

Firstly, tourism creates jobs for local citizens. Hotels, restaurants, and souvenir shops generate revenue, improving the living standards of regional populations. In places like Samarkand and Bukhara, tourism is a vital source of income.

However, mass tourism often destroys delicate ecosystems. Tourists leave trash, consume scarce water resources, and accelerate pollution through air travel. Therefore, environmental damage often lasts longer than short-term profits.`
  },
  {
    id: 'cefr-formal-letter',
    category: 'cefr_letter',
    title: 'Complaint to a Language Center Director',
    type: 'Formal Letter (Task 1)',
    recommendedWords: 150,
    timeMinutes: 20,
    prompt: 'You recently enrolled in an intensive IELTS/CEFR preparation course at an English training center, but you are dissatisfied with the course materials and frequent teacher cancellations. Write a formal letter to the director of the center expressing your dissatisfaction and suggesting remedies.',
    keyVocabularyHints: ['express my dissatisfaction', 'discrepancy', 'unjustified cancellations', 'remedial sessions', 'refund of tuition fees'],
    sampleDraft: `Dear Sir or Madam,

I am writing to express my strong dissatisfaction with the Multilevel Preparation Course that I recently enrolled in at your academy.

When I registered for this three-month program, I was assured that we would receive official Cambridge textbooks and full-length weekly mock tests. However, the study materials provided are photocopies of poor quality, and many pages are illegible. Furthermore, our instructor has canceled three consecutive lessons over the past fortnight without prior notice.

Given that our national examination is scheduled for next month, this lack of structure is severely jeopardizing my preparation. I kindly request that you assign a dependable teacher and provide appropriate textbooks immediately, or otherwise grant me a full refund.

I look forward to hearing from you promptly.

Yours faithfully,
Azizbek Karimov`
  }
];

export const UPGRADE_TIPS_PRESETS = [
  {
    category: "Lexical Variety (C1/Band 8 Collocations)",
    items: [
      { from: "a lot of", to: "a substantial proportion of / an abundance of", note: "Academic register" },
      { from: "very bad", to: "severely detrimental / catastrophic", note: "Precise emotional weight" },
      { from: "good idea", to: "viable approach / prudent strategy", note: "Formal problem-solving" },
      { from: "big problem", to: "pressing dilemma / formidable obstacle", note: "Essay thesis framing" },
      { from: "make better", to: "ameliorate / optimize / cultivate", note: "Sophisticated verb choice" }
    ]
  },
  {
    category: "Cohesive Devices & Discourse Markers",
    items: [
      { from: "On the other hand", to: "Conversely, / On the flip side of the coin,", note: "Contrastive balance" },
      { from: "In conclusion", to: "Taking all these points into consideration, it can be concluded that...", note: "Holistic wrap-up" },
      { from: "Also", to: "Furthermore, / In addition to this, / Coupled with this,", note: "Layering arguments" },
      { from: "I think", to: "It is my firm conviction that / Evidence strongly suggests that", note: "Objective persuasion" }
    ]
  },
  {
    category: "Grammar Complexity",
    items: [
      { from: "Simple compound sentence", to: "Inverted conditional: 'Had governments acted sooner, ...'", note: "Grammar Range (GRA 8.0+)" },
      { from: "Basic reason", to: "Participle clause: 'Recognizing the urgency of climate change, leaders...'", note: "Compact syntactic density" },
      { from: "Passive voice", to: "Impersonal passive: 'It is widely contended that...'", note: "Academic detachment" }
    ]
  }
];
