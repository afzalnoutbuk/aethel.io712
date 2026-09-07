export interface Part1Question {
  id: string;
  part: string;
  level: string;
  topic: string;
  question: string;
  hints: string[];
  prepTimeSeconds: number;
  speakTimeSeconds: number;
}

export interface PictureContrast {
  id: string;
  part: string;
  level: string;
  topic: string;
  question: string;
  hints: string[];
  prepTimeSeconds: number;
  speakTimeSeconds: number;
  pictureA: { url: string; title: string; desc: string };
  pictureB: { url: string; title: string; desc: string };
}

export interface SpeakingTestSet {
  id: string;
  testNumber: number;
  title: string;
  category: string;
  level: string;
  durationMinutes: number;
  totalQuestions: number;
  description: string;
  part1Questions: Part1Question[];
  part2Question: PictureContrast;
  sampleModelPart2: string;
}

export const SPEAKING_TEST_SCHEDULE: SpeakingTestSet[] = [
  {
    id: "test-1",
    testNumber: 1,
    title: "Daily Routine & Eating Lifestyles",
    category: "Health & Lifestyle",
    level: "CEFR B1 (Multilevel)",
    durationMinutes: 4,
    totalQuestions: 4,
    description: "Study hours, hobbies, messaging technology, and contrasting fast food with wholesome nutrition.",
    part1Questions: [
      {
        id: "t1_p1_q1",
        part: "Part 1.1 - Question 1 of 3",
        level: "CEFR B1",
        topic: "Daily Routine & Productivity",
        question: "Do you prefer studying in the morning or in the evening? Why?",
        hints: ["State preference clearly", "Explain 1-2 reasons (mental alertness, quiet house)", "Mention what subjects you study"],
        prepTimeSeconds: 5,
        speakTimeSeconds: 30
      },
      {
        id: "t1_p1_q2",
        part: "Part 1.1 - Question 2 of 3",
        level: "CEFR B1",
        topic: "Free Time & Hobbies",
        question: "What is your favorite hobby, and how much time do you spend on it each week?",
        hints: ["Name your hobby", "State frequency and days", "Explain how it helps you unwind"],
        prepTimeSeconds: 5,
        speakTimeSeconds: 30
      },
      {
        id: "t1_p1_q3",
        part: "Part 1.1 - Question 3 of 3",
        level: "CEFR B1",
        topic: "Modern Communication",
        question: "How has technology changed the way you stay in touch with your friends and family?",
        hints: ["Mention messengers/video calls (Telegram, etc.)", "Compare with the past", "Give an advantage or disadvantage"],
        prepTimeSeconds: 5,
        speakTimeSeconds: 30
      }
    ],
    part2Question: {
      id: "t1_p2_pic",
      part: "Part 2 - Picture Comparison",
      level: "CEFR B1 / B2",
      topic: "Eating Habits: Fast Food vs. Healthy Diet",
      question: "Compare these two contrasting eating lifestyles. What are the advantages and disadvantages of each? Which diet do you personally prefer and why?",
      hints: [
        "Contrast instant convenience with nutritional quality",
        "Mention long-term health, physical energy, and expense",
        "State your personal habit and clear conclusion"
      ],
      prepTimeSeconds: 10,
      speakTimeSeconds: 45,
      pictureA: {
        url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80",
        title: "Picture A: Fast Food / Junk Food",
        desc: "Burgers, french fries, soda, high calories, sodium & instant convenience."
      },
      pictureB: {
        url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80",
        title: "Picture B: Wholesome Organic Diet",
        desc: "Fresh vegetables, avocado, vitamins, promotes vitality & cardiovascular health."
      }
    },
    sampleModelPart2: "Looking closely at both images, Picture A exemplifies the temptation of modern fast food convenience, whereas Picture B illustrates a vibrant, nutrient-dense organic plate. While fast food appeals to individuals with hectic schedules due to quick preparation, its elevated saturated fats and sodium can lead to chronic fatigue. On the other hand, fresh vegetables and balanced proteins promote enduring vitality and sharp cognitive focus. In my daily life, I make a deliberate effort to prioritize home-cooked organic meals."
  },

  {
    id: "test-2",
    testNumber: 2,
    title: "Urban Environments & Peaceful Nature",
    category: "Environment & Society",
    level: "CEFR B1 (Multilevel)",
    durationMinutes: 4,
    totalQuestions: 4,
    description: "Living in big cities versus quiet villages, public transit networks, and outdoor recreation.",
    part1Questions: [
      {
        id: "t2_p1_q1",
        part: "Part 1.1 - Question 1 of 3",
        level: "CEFR B1",
        topic: "Living Location Preference",
        question: "Do you prefer living in a bustling big city or in a quiet rural village? Why?",
        hints: ["Give your preference directly", "Compare career opportunities vs peace/clean air", "Mention noise and pace of life"],
        prepTimeSeconds: 5,
        speakTimeSeconds: 30
      },
      {
        id: "t2_p1_q2",
        part: "Part 1.1 - Question 2 of 3",
        level: "CEFR B1",
        topic: "Public Transportation",
        question: "What kind of transportation do you usually use to travel around your town or city?",
        hints: ["Name the transport (bus, metro, car, bicycle)", "Explain cost and speed", "Mention any traffic challenges"],
        prepTimeSeconds: 5,
        speakTimeSeconds: 30
      },
      {
        id: "t2_p1_q3",
        part: "Part 1.1 - Question 3 of 3",
        level: "CEFR B1",
        topic: "Green Spaces & Parks",
        question: "How often do you visit parks or natural open spaces, and what do you do there?",
        hints: ["State frequency (e.g. every weekend)", "Describe activities (walking, chatting, reading)", "Explain how fresh air affects your mood"],
        prepTimeSeconds: 5,
        speakTimeSeconds: 30
      }
    ],
    part2Question: {
      id: "t2_p2_pic",
      part: "Part 2 - Picture Comparison",
      level: "CEFR B1 / B2",
      topic: "Living Environment: Busy Metropolis vs Serene Countryside",
      question: "Compare these two distinct living environments. What are the key benefits and drawbacks of each? Where would you choose to live at this stage of your life?",
      hints: [
        "Contrast modern infrastructure and nightlife with tranquility and pure nature",
        "Discuss stress levels, pollution, and access to services",
        "Conclude with your personal preference and rationale"
      ],
      prepTimeSeconds: 10,
      speakTimeSeconds: 45,
      pictureA: {
        url: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=700&q=80",
        title: "Picture A: Bustling Metropolis",
        desc: "Skyscrapers, glowing highways, 24/7 commercial activity, urban density."
      },
      pictureB: {
        url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80",
        title: "Picture B: Serene Countryside",
        desc: "Rolling green meadows, fresh air, peaceful solitude, connection to nature."
      }
    },
    sampleModelPart2: "These two images present a profound contrast in living environments. Picture A showcases a vibrant, high-density metropolis illuminated by night lights, which offers endless career prospects, advanced healthcare, and entertainment. However, city residents often grapple with pollution and elevated stress. In stark contrast, Picture B depicts a peaceful countryside setting characterized by fresh air, scenic tranquility, and an unhurried lifestyle, though amenities might be less accessible. For my current phase of life as an ambitious student, I favor the city's dynamic opportunities, though I hope to retreat to rural tranquility later."
  },

  {
    id: "test-3",
    testNumber: 3,
    title: "Education, Classrooms & Digital Careers",
    category: "Learning & Work",
    level: "CEFR B1 (Multilevel)",
    durationMinutes: 4,
    totalQuestions: 4,
    description: "Classroom learning versus online study, favorite academic subjects, and corporate office versus remote work.",
    part1Questions: [
      {
        id: "t3_p1_q1",
        part: "Part 1.1 - Question 1 of 3",
        level: "CEFR B1",
        topic: "Classroom vs Online Learning",
        question: "Do you prefer studying in a physical classroom or attending online classes? Why?",
        hints: ["Compare face-to-face interaction with digital flexibility", "Mention comfort at home vs teacher interaction", "Provide clear conclusion"],
        prepTimeSeconds: 5,
        speakTimeSeconds: 30
      },
      {
        id: "t3_p1_q2",
        part: "Part 1.1 - Question 2 of 3",
        level: "CEFR B1",
        topic: "School Subjects & Skills",
        question: "Which subject at school or university do you find most interesting or useful?",
        hints: ["Name the subject (English, Math, IT, History)", "Explain why it excites you", "Mention how it prepares you for life"],
        prepTimeSeconds: 5,
        speakTimeSeconds: 30
      },
      {
        id: "t3_p1_q3",
        part: "Part 1.1 - Question 3 of 3",
        level: "CEFR B1",
        topic: "Future Career Aspirations",
        question: "What kind of job or profession would you like to have in the future?",
        hints: ["State the job role", "Explain reasons (helping people, financial growth, creativity)", "Mention qualifications needed"],
        prepTimeSeconds: 5,
        speakTimeSeconds: 30
      }
    ],
    part2Question: {
      id: "t3_p2_pic",
      part: "Part 2 - Picture Comparison",
      level: "CEFR B1 / B2",
      topic: "Workplace Dynamics: Corporate Office vs Remote Digital Freelancing",
      question: "Compare these two working environments. What are the advantages and disadvantages of each style? Which work setting would suit your personality better?",
      hints: [
        "Contrast formal teamwork and supervision with autonomy and flexibility",
        "Mention commute time, social isolation, and discipline",
        "Conclude with your ideal workplace preference"
      ],
      prepTimeSeconds: 10,
      speakTimeSeconds: 45,
      pictureA: {
        url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=700&q=80",
        title: "Picture A: Corporate Office Teamwork",
        desc: "Professional desks, colleagues collaborating face-to-face, structured corporate hierarchy."
      },
      pictureB: {
        url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=700&q=80",
        title: "Picture B: Remote Freelancing / Home Office",
        desc: "Laptop workspace, coffee, independence, flexible schedule, no daily commute."
      }
    },
    sampleModelPart2: "The two pictures illustrate contrasting modern work settings. Picture A portrays a structured corporate office where professionals work collaboratively, fostering instantaneous communication and team cohesion. Yet, office employees must endure stressful daily commutes and rigid schedules. In contrast, Picture B shows an independent remote workspace, offering geographical freedom, personalized pacing, and zero commute time. The downside is that working from home demands fierce self-discipline and can feel socially isolating. Given my self-motivated nature, I lean toward the remote model with occasional hybrid team meetings."
  },

  {
    id: "test-4",
    testNumber: 4,
    title: "Travel Styles & Cultural Exploration",
    category: "Travel & Culture",
    level: "CEFR B1 (Multilevel)",
    durationMinutes: 4,
    totalQuestions: 4,
    description: "Historical tours vs scenic adventures, past memorable journeys, and tropical beach resorts vs mountain trekking.",
    part1Questions: [
      {
        id: "t4_p1_q1",
        part: "Part 1.1 - Question 1 of 3",
        level: "CEFR B1",
        topic: "Travel Destination Preferences",
        question: "Do you enjoy visiting historical monuments or exploring scenic natural wonders when you travel?",
        hints: ["State your preference directly", "Describe what excites you (ancient architecture vs mountains/lakes)", "Give an example city or park"],
        prepTimeSeconds: 5,
        speakTimeSeconds: 30
      },
      {
        id: "t4_p1_q2",
        part: "Part 1.1 - Question 2 of 3",
        level: "CEFR B1",
        topic: "Memorable Journey",
        question: "Can you describe a memorable trip you took in the past? What made it special?",
        hints: ["Where did you go and who with?", "What activities did you enjoy?", "Why is the memory unforgettable?"],
        prepTimeSeconds: 5,
        speakTimeSeconds: 30
      },
      {
        id: "t4_p1_q3",
        part: "Part 1.1 - Question 3 of 3",
        level: "CEFR B1",
        topic: "Cross-Cultural Learning",
        question: "Why do you think it is valuable to learn about the customs and traditions of foreign countries?",
        hints: ["Mention overcoming stereotypes", "Explain open-mindedness and mutual respect", "Note benefits for business and travel"],
        prepTimeSeconds: 5,
        speakTimeSeconds: 30
      }
    ],
    part2Question: {
      id: "t4_p2_pic",
      part: "Part 2 - Picture Comparison",
      level: "CEFR B1 / B2",
      topic: "Vacation Styles: Tropical Beach Resort vs Adventurous Mountain Expedition",
      question: "Compare these two vacation styles. What kind of travelers enjoy each experience, and what are their merits? Which holiday would you choose for your next vacation?",
      hints: [
        "Contrast relaxation and warmth with physical challenge and breathtaking alpine scenery",
        "Mention cost, activity level, and stress relief",
        "Conclude with your preferred travel itinerary"
      ],
      prepTimeSeconds: 10,
      speakTimeSeconds: 45,
      pictureA: {
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80",
        title: "Picture A: Tropical Beach Resort",
        desc: "Crystal turquoise water, sunny golden sands, relaxing sun loungers, tranquil ocean breeze."
      },
      pictureB: {
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80",
        title: "Picture B: Mountain Trekking & Hiking",
        desc: "Majestic alpine peaks, rugged rocky trails, backpackers exploring untamed wilderness."
      }
    },
    sampleModelPart2: "These photographs capture two completely opposite holiday philosophies. Picture A portrays a serene tropical beach where holidaymakers can unwind under palm trees, absorb vitamin D, and leave behind work-related pressure. This appeals primarily to individuals seeking deep rest. Conversely, Picture B highlights an adventurous mountain expedition involving strenuous physical trekking and altitude challenges. While demanding, mountain hiking rewards travelers with unmatched panoramic vistas and a proud sense of triumph. If I were planning my upcoming holiday, I would choose the mountain adventure to push my physical boundaries."
  },

  {
    id: "test-5",
    testNumber: 5,
    title: "Fitness Routines & Athletic Wellness",
    category: "Sports & Vitality",
    level: "CEFR B1 (Multilevel)",
    durationMinutes: 4,
    totalQuestions: 4,
    description: "Team sports versus solo training, morning health habits, and indoor gym workout versus outdoor calisthenics.",
    part1Questions: [
      {
        id: "t5_p1_q1",
        part: "Part 1.1 - Question 1 of 3",
        level: "CEFR B1",
        topic: "Team Sports vs Individual Fitness",
        question: "Do you prefer participating in team sports like football or engaging in individual workouts like running? Why?",
        hints: ["State preference clearly", "Mention camaraderie and competition vs individual pacing", "Explain physical benefits"],
        prepTimeSeconds: 5,
        speakTimeSeconds: 30
      },
      {
        id: "t5_p1_q2",
        part: "Part 1.1 - Question 2 of 3",
        level: "CEFR B1",
        topic: "Morning Routine for Wellness",
        question: "What healthy habits do you try to practice each morning to stay energized throughout the day?",
        hints: ["Mention drinking water/lemon", "Describe light stretching or walking", "Mention a nutritious breakfast"],
        prepTimeSeconds: 5,
        speakTimeSeconds: 30
      },
      {
        id: "t5_p1_q3",
        part: "Part 1.1 - Question 3 of 3",
        level: "CEFR B1",
        topic: "Physical Education in Schools",
        question: "Should schools allocate more hours each week for sports and physical education? Why?",
        hints: ["Discuss rising screen time among youth", "Explain cardiovascular health and stress reduction", "Give personal recommendation"],
        prepTimeSeconds: 5,
        speakTimeSeconds: 30
      }
    ],
    part2Question: {
      id: "t5_p2_pic",
      part: "Part 2 - Picture Comparison",
      level: "CEFR B1 / B2",
      topic: "Workout Regimes: Modern Indoor Gym vs Open-Air Calisthenics & Jogging",
      question: "Compare these two different methods of physical conditioning. What are the benefits and limitations of each? Which training approach do you personally favor?",
      hints: [
        "Contrast specialized gym machinery and climate control with fresh air and zero financial cost",
        "Mention motivation, weather dependency, and accessibility",
        "Conclude with your favorite training regime"
      ],
      prepTimeSeconds: 10,
      speakTimeSeconds: 45,
      pictureA: {
        url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80",
        title: "Picture A: High-Tech Indoor Gym",
        desc: "State-of-the-art weights, treadmills, air-conditioned workout hall, mirrors & trainers."
      },
      pictureB: {
        url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=700&q=80",
        title: "Picture B: Outdoor Open-Air Jogging",
        desc: "Park trail, natural trees, sunlight, bodyweight exercise, zero subscription fees."
      }
    },
    sampleModelPart2: "The two pictures present contrasting approaches to physical fitness. In Picture A, we observe a modern indoor gym equipped with specialized resistance machines, heavy barbells, and temperature regulation, making it ideal for progressive muscle building regardless of weather. However, expensive monthly memberships and crowded spaces can be deterring. In contrast, Picture B shows an athlete running outdoors in a sunlit park, which combines cardiovascular exercise with fresh oxygen and natural daylight at zero expense, though unpredictable weather can halt training. Personally, I prefer outdoor jogging because being immersed in nature relieves my mental stress."
  },

  {
    id: "test-6",
    testNumber: 6,
    title: "Media, Reading & Artificial Intelligence",
    category: "Technology & Culture",
    level: "CEFR B1 (Multilevel)",
    durationMinutes: 4,
    totalQuestions: 4,
    description: "Printed books versus digital e-readers, daily news consumption, and traditional libraries versus AI smart learning.",
    part1Questions: [
      {
        id: "t6_p1_q1",
        part: "Part 1.1 - Question 1 of 3",
        level: "CEFR B1",
        topic: "Printed Books vs E-books",
        question: "Do you prefer reading traditional printed paper books or reading e-books on a tablet or screen? Why?",
        hints: ["Mention smell and feel of paper vs convenience of storing 1,000 books", "Discuss eye fatigue", "State your habit"],
        prepTimeSeconds: 5,
        speakTimeSeconds: 30
      },
      {
        id: "t6_p1_q2",
        part: "Part 1.1 - Question 2 of 3",
        level: "CEFR B1",
        topic: "News & Social Media",
        question: "How much time do you spend each day following news and updates on social media?",
        hints: ["State average hours or minutes", "Mention trusted channels (Telegram, news sites)", "Discuss positive or negative impact on attention"],
        prepTimeSeconds: 5,
        speakTimeSeconds: 30
      },
      {
        id: "t6_p1_q3",
        part: "Part 1.1 - Question 3 of 3",
        level: "CEFR B1",
        topic: "Artificial Intelligence in Education",
        question: "How do you think Artificial Intelligence and smart apps will change the way students learn languages in the future?",
        hints: ["Mention 24/7 instant feedback on speaking/writing", "Personalized study pacing", "Role of human teachers in the future"],
        prepTimeSeconds: 5,
        speakTimeSeconds: 30
      }
    ],
    part2Question: {
      id: "t6_p2_pic",
      part: "Part 2 - Picture Comparison",
      level: "CEFR B1 / B2",
      topic: "Study Spaces: Traditional Grand Library vs High-Tech AI Smart Study",
      question: "Compare these two study environments. How does each setting influence a learner's concentration and study efficiency? Which environment enhances your learning productivity more?",
      hints: [
        "Contrast classic academic silence and physical archives with instant digital search and AI assistance",
        "Discuss distraction potential vs deep cognitive immersion",
        "Conclude with your preferred academic environment"
      ],
      prepTimeSeconds: 10,
      speakTimeSeconds: 45,
      pictureA: {
        url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=700&q=80",
        title: "Picture A: Traditional Grand Library",
        desc: "Classic wooden shelves, thousands of hardbound volumes, sacred silence, zero digital notifications."
      },
      pictureB: {
        url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=80",
        title: "Picture B: High-Tech Smart Study Setup",
        desc: "Multiple displays, AI assistants, online databases, rapid research, interactive digital tools."
      }
    },
    sampleModelPart2: "These images capture the evolution of academic research. Picture A depicts a solemn, traditional library surrounded by vast rows of printed texts, which fosters profound mental stillness, reverent focus, and zero digital pop-up distractions. However, locating specific references across thousands of books can be cumbersome. On the other hand, Picture B illustrates a cutting-edge digital workstation featuring multiple screens and AI tools, enabling instantaneous data retrieval, translation, and automated analysis. While technology drastically boosts speed, students must combat notification temptations. In my personal study, I utilize a blend of both."
  }
];
