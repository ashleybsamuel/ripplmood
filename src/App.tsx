/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
// @ts-ignore
import koiPondBackground from "./assets/images/KoiFish_Background.webp";
import { 
  Moon, 
  BookOpen, 
  User, 
  Wind, 
  FileText, 
  CheckSquare,
  Bell, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  Home,
  Check, 
  Calendar,
  X,
  Menu,
  RefreshCw,
  Award,
  Notebook
} from "lucide-react";
import { EmotionalPebble, MoodConfig, WARM_WHITE_MOOD } from "./components/EmotionalPebble";
import { KoiFishIcon } from "./components/KoiFishIcon";
import { generateDynamicOrganicReflection } from "./lib/guidance";

const MOODS: MoodConfig[] = [
  { 
    id: "happy", 
    label: "Happy", 
    colorClass: "bg-yellow-300", 
    glowClass: "glow-yellow", 
    textColor: "text-yellow-200",
    gradient: "from-yellow-200 to-amber-300",
    orbGradient: "radial-gradient(circle at 50% 20%, #FFFDE7 0%, #FFF176 50%, #FACC15 100%)",
    selectorGradient: "radial-gradient(circle, #FFE066 0%, #FFFFFF 100%)",
    glowColor: "rgba(250, 204, 21, 0.75)",
    solidColor: "#FFE066",
    textColorHex: "#FDE047",
    calBgOverlay: "bg-yellow-500/25 border-yellow-300/60 shadow-[inset_0_0_12px_rgba(253,224,71,0.35)]",
    calBorder: "border-yellow-400/60",
    calDot: "bg-yellow-300 shadow-[0_0_8px_rgba(253,224,71,0.9)]"
  },
  { 
    id: "content", 
    label: "Content", 
    colorClass: "bg-amber-400", 
    glowClass: "glow-orange", 
    textColor: "text-amber-200",
    gradient: "from-amber-300 to-orange-400",
    orbGradient: "radial-gradient(circle at 50% 20%, #FFF3B0 0%, #FFAA80 50%, #FF7B42 100%)",
    selectorGradient: "radial-gradient(circle, #FF8A50 0%, #FFFFFF 100%)",
    glowColor: "rgba(255, 123, 66, 0.75)",
    solidColor: "#FF8A50",
    textColorHex: "#FFAA80",
    calBgOverlay: "bg-amber-500/25 border-amber-300/60 shadow-[inset_0_0_12px_rgba(251,191,36,0.35)]",
    calBorder: "border-amber-400/60",
    calDot: "bg-amber-300 shadow-[0_0_8px_rgba(252,211,77,0.9)]"
  },
  { 
    id: "calm", 
    label: "Calm", 
    colorClass: "bg-teal-300", 
    glowClass: "glow-blue", 
    textColor: "text-teal-200",
    gradient: "from-teal-300 to-emerald-400",
    orbGradient: "radial-gradient(circle at 30% 20%, #C2F2E2 0%, #48CAE4 50%, #0096C7 100%)",
    selectorGradient: "radial-gradient(circle, #48CAE4 0%, #FFFFFF 100%)",
    glowColor: "rgba(72, 202, 228, 0.75)",
    solidColor: "#48CAE4",
    textColorHex: "#48CAE4",
    calBgOverlay: "bg-teal-500/25 border-teal-300/60 shadow-[inset_0_0_12px_rgba(45,212,191,0.35)]",
    calBorder: "border-teal-400/60",
    calDot: "bg-teal-300 shadow-[0_0_8px_rgba(94,234,212,0.9)]"
  },
  { 
    id: "anxious", 
    label: "Anxious", 
    colorClass: "bg-rose-300", 
    glowClass: "glow-red", 
    textColor: "text-rose-200",
    gradient: "from-rose-300 to-pink-400",
    orbGradient: "radial-gradient(circle at 50% 20%, #F8B4C8 0%, #E87EA1 50%, #D94E73 100%)",
    selectorGradient: "radial-gradient(circle, #E87EA1 0%, #FFFFFF 100%)",
    glowColor: "rgba(232, 126, 161, 0.75)",
    solidColor: "#E87EA1",
    textColorHex: "#E87EA1",
    calBgOverlay: "bg-rose-500/25 border-rose-300/60 shadow-[inset_0_0_12px_rgba(244,63,94,0.35)]",
    calBorder: "border-rose-400/60",
    calDot: "bg-rose-300 shadow-[0_0_8px_rgba(253,164,175,0.9)]"
  },
  { 
    id: "sad", 
    label: "Sad", 
    colorClass: "bg-indigo-300", 
    glowClass: "glow-purple", 
    textColor: "text-indigo-200",
    gradient: "from-indigo-300 to-blue-500",
    orbGradient: "radial-gradient(circle at 50% 20%, #E0E4FF 0%, #B8C0FF 50%, #5390D9 100%)",
    selectorGradient: "radial-gradient(circle, #889BEE 0%, #FFFFFF 100%)",
    glowColor: "rgba(184, 192, 255, 0.75)",
    solidColor: "#889BEE",
    textColorHex: "#B8C0FF",
    calBgOverlay: "bg-indigo-500/25 border-indigo-300/60 shadow-[inset_0_0_12px_rgba(129,140,248,0.35)]",
    calBorder: "border-indigo-400/60",
    calDot: "bg-indigo-300 shadow-[0_0_8px_rgba(165,180,252,0.9)]"
  },
];

// Helper to format Date key as YYYY-MM-DD
const formatDateKey = (year: number, month: number, day: number): string => {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
};

// Get initial calendar history from localStorage, or return empty object if none exists
const getInitialCalendarHistory = (): Record<string, string> => {
  const saved = localStorage.getItem("koi_calendar_history");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse calendar history", e);
    }
  }

  return {};
};

interface ActivityConfig {
  id: string;
  label: string;
  icon: any;
  glowClass: string;
  bgGlow: string;
}

const ACTIVITIES: ActivityConfig[] = [
  { 
    id: "sleep", 
    label: "Slept 7+ hours", 
    icon: Moon, 
    glowClass: "icon-glow-green", 
    bgGlow: "bg-green-200/20" 
  },
  { 
    id: "assignment", 
    label: "Finished an assignment", 
    icon: BookOpen, 
    glowClass: "icon-glow-blue", 
    bgGlow: "bg-blue-200/20" 
  },
  { 
    id: "alone", 
    label: "Spent the day alone", 
    icon: User, 
    glowClass: "icon-glow-purple", 
    bgGlow: "bg-purple-200/20" 
  },
  { 
    id: "fresh_air", 
    label: "Got some fresh air", 
    icon: Wind, 
    glowClass: "icon-glow-teal", 
    bgGlow: "bg-teal-200/20" 
  },
  { 
    id: "exam", 
    label: "Exam or quiz day", 
    icon: FileText, 
    glowClass: "icon-glow-orange", 
    bgGlow: "bg-orange-200/20" 
  },
  { 
    id: "chores", 
    label: "Did chores", 
    icon: CheckSquare, 
    glowClass: "icon-glow-yellow", 
    bgGlow: "bg-amber-200/20" 
  }
];

interface BibleVerse {
  reference: string;
  text: string;
  theme?: string;
}

const BIBLE_VERSES: BibleVerse[] = [
  {
    reference: "Psalm 23:1-3",
    text: "The LORD is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.",
    theme: "Peace & Rest"
  },
  {
    reference: "Philippians 4:6-7",
    text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
    theme: "Peace & Rest"
  },
  {
    reference: "Psalm 46:10",
    text: "Be still, and know that I am God.",
    theme: "Stillness & Faith"
  },
  {
    reference: "Matthew 11:28",
    text: "Come to me, all you who are weary and burdened, and I will give you rest.",
    theme: "Rest & Comfort"
  },
  {
    reference: "Isaiah 40:31",
    text: "Those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
    theme: "Strength & Renewal"
  },
  {
    reference: "Joshua 1:9",
    text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.",
    theme: "Courage & Comfort"
  },
  {
    reference: "John 14:27",
    text: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
    theme: "Peace"
  },
  {
    reference: "Proverbs 3:5-6",
    text: "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    theme: "Trust & Guidance"
  },
  {
    reference: "Lamentations 3:22-23",
    text: "Because of the LORD’s great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.",
    theme: "New Beginnings"
  },
  {
    reference: "Psalm 121:1-2",
    text: "I lift up my eyes to the mountains—where does my help come from? My help comes from the LORD, the Maker of heaven and earth.",
    theme: "Hope & Protection"
  },
  {
    reference: "2 Timothy 1:7",
    text: "For God has not given us a spirit of fear, but of power and of love and of a sound mind.",
    theme: "Clarity & Strength"
  },
  {
    reference: "Psalm 94:19",
    text: "When anxiety was great within me, your consolation brought me joy.",
    theme: "Comfort & Joy"
  },
  {
    reference: "Romans 15:13",
    text: "May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.",
    theme: "Hope & Joy"
  },
  {
    reference: "Psalm 119:105",
    text: "Your word is a lamp for my feet, a light on my path.",
    theme: "Guidance & Light"
  },
  {
    reference: "Isaiah 26:3",
    text: "You will keep in perfect peace those whose minds are steadfast, because they trust in you.",
    theme: "Perfect Peace"
  }
];

function getInitialVerseIndex(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return dayOfYear % BIBLE_VERSES.length;
}

export default function App() {
  const today = new Date();
  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const [currentScreen, setCurrentScreen] = useState<"welcome" | "selector" | "reflection">("welcome");
  const [selectedMood, setSelectedMood] = useState<MoodConfig | null>(() => {
    try {
      const saved = localStorage.getItem("koi_selected_mood");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [selectedActivities, setSelectedActivities] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("koi_selected_activities");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [personalNote, setPersonalNote] = useState<string>(() => {
    try {
      return localStorage.getItem("koi_personal_note") || "";
    } catch {
      return "";
    }
  });
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [activeNav, setActiveNav] = useState<"home" | "reflections" | "stats">("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [hasScrolledToGuidance, setHasScrolledToGuidance] = useState<boolean>(false);
  const [aiGuidance, setAiGuidance] = useState<string>(() => {
    try {
      return localStorage.getItem("koi_ai_guidance") || "";
    } catch {
      return "";
    }
  });
  const [isGeneratingGuidance, setIsGeneratingGuidance] = useState<boolean>(false);
  const [verseIndex, setVerseIndex] = useState<number>(getInitialVerseIndex);

  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [calendarHistory, setCalendarHistory] = useState<Record<string, string>>(getInitialCalendarHistory);
  const [editingDateKey, setEditingDateKey] = useState<string | null>(null);

  // Persist selected mood, activities, note, and guidance to localStorage
  useEffect(() => {
    if (selectedMood) {
      localStorage.setItem("koi_selected_mood", JSON.stringify(selectedMood));
    }
  }, [selectedMood]);

  useEffect(() => {
    localStorage.setItem("koi_selected_activities", JSON.stringify(selectedActivities));
  }, [selectedActivities]);

  useEffect(() => {
    localStorage.setItem("koi_personal_note", personalNote);
  }, [personalNote]);

  useEffect(() => {
    if (aiGuidance) {
      localStorage.setItem("koi_ai_guidance", aiGuidance);
    }
  }, [aiGuidance]);

  // Sync selected mood to today's date in calendar history
  useEffect(() => {
    if (selectedMood && selectedMood.id !== "unselected") {
      setCalendarHistory((prev) => {
        const updated = { ...prev, [todayKey]: selectedMood.id };
        localStorage.setItem("koi_calendar_history", JSON.stringify(updated));
        return updated;
      });
    } else {
      setCalendarHistory((prev) => {
        if (prev[todayKey]) {
          const updated = { ...prev };
          delete updated[todayKey];
          localStorage.setItem("koi_calendar_history", JSON.stringify(updated));
          return updated;
        }
        return prev;
      });
    }
  }, [selectedMood, todayKey]);

  // Scroll window to top whenever screen or top navigation tab changes
  useEffect(() => {
    setHasScrolledToGuidance(false);
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    scrollToTop();
    const rafId = requestAnimationFrame(scrollToTop);
    const timer1 = setTimeout(scrollToTop, 100);
    const timer2 = setTimeout(scrollToTop, 400);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [currentScreen, activeNav]);

  const handlePrevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleGoToToday = () => {
    setViewDate(new Date());
  };

  const setMoodForDate = (dateKey: string, moodId: string | null) => {
    setCalendarHistory((prev) => {
      const updated = { ...prev };
      if (moodId && moodId !== "unselected") {
        updated[dateKey] = moodId;
      } else {
        delete updated[dateKey];
      }
      localStorage.setItem("koi_calendar_history", JSON.stringify(updated));
      return updated;
    });

    if (dateKey === todayKey) {
      if (moodId && moodId !== "unselected") {
        const found = MOODS.find((m) => m.id === moodId) || null;
        setSelectedMood(found);
      } else {
        setSelectedMood(null);
      }
    }

    setEditingDateKey(null);
  };

  // Toggle activity selection
  const toggleActivity = (id: string) => {
    setSelectedActivities((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Helper to format recent calendar history into a concise summary string
  const getRecentHistorySummary = (history: Record<string, string>): string => {
    const entries = Object.entries(history).sort();
    if (entries.length === 0) return "No prior history";
    const recent = entries.slice(-5);
    return recent.map(([dateKey, moodId]) => `${dateKey}: ${moodId}`).join(", ");
  };

  // Get fallback Rippli guidance text dynamically based on mood, activities, and user notes
  const getRippliGuidance = (moodObj?: MoodConfig | null, actsList?: string[], noteText?: string) => {
    const moodToUse = moodObj !== undefined ? moodObj : selectedMood;
    const actsToUse = actsList !== undefined ? actsList : selectedActivities;
    const noteToUse = noteText !== undefined ? noteText : personalNote;
    const moodId = moodToUse?.id || "";
    const moodName = moodToUse?.label || moodId || "calm";

    return generateDynamicOrganicReflection(moodId, moodName, actsToUse, noteToUse);
  };

  // Function to call Gemini server endpoint for dynamic, personalized AI guidance
  const fetchAIGuidance = async (
    overrideMood?: MoodConfig | null, 
    overrideActivities?: string[], 
    overrideNote?: string
  ) => {
    setIsGeneratingGuidance(true);
    const moodToUse = overrideMood !== undefined ? overrideMood : selectedMood;
    const activitiesToUse = overrideActivities !== undefined ? overrideActivities : selectedActivities;
    const noteToUse = overrideNote !== undefined ? overrideNote : personalNote;

    try {
      const response = await fetch("/api/gemini/guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: moodToUse ? { id: moodToUse.id, label: moodToUse.label } : null,
          activities: activitiesToUse,
          note: noteToUse,
          verse: BIBLE_VERSES[verseIndex],
          history: getRecentHistorySummary(calendarHistory),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.guidance) {
          setAiGuidance(data.guidance);
          localStorage.setItem("koi_ai_guidance", data.guidance);
          setIsGeneratingGuidance(false);
          return;
        }
      }
    } catch (e) {
      console.error("Failed to fetch Gemini guidance:", e);
    }

    const fallbackGuidance = getRippliGuidance(moodToUse, activitiesToUse, noteToUse);
    setAiGuidance(fallbackGuidance);
    localStorage.setItem("koi_ai_guidance", fallbackGuidance);
    setIsGeneratingGuidance(false);
  };

  // Automatically fetch fresh dynamic Gemini guidance whenever user transitions to reflection screen
  useEffect(() => {
    if (currentScreen === "reflection") {
      fetchAIGuidance();
    }
  }, [currentScreen]);

  return (
    <div id="koi-app" className="relative min-h-screen text-[#e1e3e2] select-none flex flex-col items-center bg-[#0a1614]">
      {/* Dynamic Background Image - high-fidelity koi pond backdrop */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#0a1614]">
        <img 
          src="/KoiFish_Background.webp" 
          alt="Koi Pond Background" 
          className="w-full h-full object-cover object-center transition-all duration-700 ease-in-out"
          style={{ objectFit: "cover", objectPosition: "center" }}
          onError={(e) => {
            if (koiPondBackground && e.currentTarget.src !== koiPondBackground) {
              e.currentTarget.src = koiPondBackground;
            }
          }}
        />
      </div>

      {/* Top Header & Navigation Bar */}
      <header id="koi-header" className="sticky top-0 w-full max-w-7xl px-4 sm:px-8 pt-4 pb-2 z-40 transition-all duration-300">
        <div className="glass-panel w-full flex items-center justify-between px-4 sm:px-6 md:px-8 py-3.5 rounded-full shadow-2xl bg-black/30 backdrop-blur-2xl border border-white/20 relative">
          
          {/* Mobile Hamburger Button (Left side on mobile) */}
          <div className="flex items-center md:hidden w-10">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#e1e3e2] hover:text-teal-300 transition-colors p-1 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo (Center aligned on mobile, left on desktop) */}
          <div className="flex-1 text-center md:text-left md:flex-none">
            <h1 
              onClick={() => { setCurrentScreen("welcome"); setSelectedActivities([]); setSelectedMood(null); setMobileMenuOpen(false); }}
              className="text-2xl md:text-3xl font-light tracking-widest text-white cursor-pointer font-sans hover:opacity-95 transition-opacity inline-block"
            >
              RIPPL
            </h1>
          </div>

          {/* Desktop Navigation Links (Hidden on mobile) */}
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => { setCurrentScreen("welcome"); setSelectedActivities([]); setSelectedMood(null); setActiveNav("home"); }}
              className={`text-xs md:text-sm tracking-widest uppercase py-1 border-b-2 transition-all cursor-pointer ${
                activeNav === "home" && currentScreen === "welcome"
                  ? "text-teal-300 border-teal-300 font-semibold" 
                  : "text-[#bfc8c7] border-transparent opacity-80 hover:text-white hover:opacity-100"
              }`}
            >
              HOME
            </button>
            <span className="text-[#bfc8c7]/30">|</span>
            <button 
              onClick={() => { setCurrentScreen("selector"); setActiveNav("reflections"); }}
              className={`text-xs md:text-sm tracking-widest uppercase py-1 border-b-2 transition-all cursor-pointer ${
                currentScreen === "selector"
                  ? "text-teal-300 border-teal-300 font-semibold"
                  : "text-[#bfc8c7] border-transparent opacity-80 hover:text-white hover:opacity-100"
              }`}
            >
              SELECTOR
            </button>
            <span className="text-[#bfc8c7]/30">|</span>
            <button 
              onClick={() => { setCurrentScreen("reflection"); setActiveNav("stats"); }}
              className={`text-xs md:text-sm tracking-widest uppercase py-1 border-b-2 transition-all cursor-pointer ${
                currentScreen === "reflection"
                  ? "text-teal-300 border-teal-300 font-semibold"
                  : "text-[#bfc8c7] border-transparent opacity-80 hover:text-white hover:opacity-100"
              }`}
            >
              REFLECTION
            </button>
          </nav>

          {/* User Utilities & Notification Trigger */}
          <div className="flex items-center justify-end w-10 md:w-auto relative">
            <button 
              onClick={() => { setShowNotification(!showNotification); setMobileMenuOpen(false); }}
              className="text-[#e1e3e2] hover:text-teal-300 transition-colors p-1 cursor-pointer"
            >
              <div className="relative">
                <Bell className="w-5 h-5 font-light" />
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#95d1ce] animate-pulse" />
              </div>
            </button>
            
            {/* Simulated Notification panel */}
            <AnimatePresence>
              {showNotification && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-12 w-72 rounded-2xl p-4 z-50 bg-[#0c1618]/95 backdrop-blur-2xl border border-white/20 shadow-2xl text-[#e1e3e2]"
                >
                  <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-teal-300">Daily Zen Reminder</span>
                    <button onClick={() => setShowNotification(false)} className="text-white/40 hover:text-white cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-[#bfc8c7] leading-relaxed">
                    Welcome to Rippl. Remember to check in your mood stone every day to track your emotional currents over time.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-2 glass-panel w-full p-3 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/20 shadow-2xl flex flex-col gap-2 z-50"
            >
              <button
                onClick={() => {
                  setCurrentScreen("welcome");
                  setSelectedActivities([]);
                  setSelectedMood(null);
                  setActiveNav("home");
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-between ${
                  currentScreen === "welcome"
                    ? "bg-teal-500/20 text-teal-300 border border-teal-400/40 font-semibold"
                    : "text-[#bfc8c7] hover:text-white hover:bg-white/10"
                }`}
              >
                <span>HOME</span>
                {currentScreen === "welcome" && <span className="w-2 h-2 rounded-full bg-teal-300" />}
              </button>

              <button
                onClick={() => {
                  setCurrentScreen("selector");
                  setActiveNav("reflections");
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-between ${
                  currentScreen === "selector"
                    ? "bg-teal-500/20 text-teal-300 border border-teal-400/40 font-semibold"
                    : "text-[#bfc8c7] hover:text-white hover:bg-white/10"
                }`}
              >
                <span>SELECTOR</span>
                {currentScreen === "selector" && <span className="w-2 h-2 rounded-full bg-teal-300" />}
              </button>

              <button
                onClick={() => {
                  setCurrentScreen("reflection");
                  setActiveNav("stats");
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-between ${
                  currentScreen === "reflection"
                    ? "bg-teal-500/20 text-teal-300 border border-teal-400/40 font-semibold"
                    : "text-[#bfc8c7] hover:text-white hover:bg-white/10"
                }`}
              >
                <span>REFLECTION</span>
                {currentScreen === "reflection" && <span className="w-2 h-2 rounded-full bg-teal-300" />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Workspace with Fluid Animation Transitions */}
      <main className="w-full max-w-7xl px-3 sm:px-8 py-2 sm:py-4 flex-grow flex items-center justify-center z-10">
        <AnimatePresence mode="wait">
          
          {/* ==================== SCREEN 1: WELCOME SCREEN ==================== */}
          {currentScreen === "welcome" && (
            <motion.div 
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-3xl flex flex-col items-center py-1 sm:py-6"
            >
              <div 
                className="glass-panel rounded-[28px] sm:rounded-[32px] w-full p-6 sm:p-10 md:p-16 flex flex-col items-center justify-center gap-6 sm:gap-10 md:gap-12 min-h-[340px] sm:min-h-[500px] text-center relative overflow-hidden"
                style={{ 
                  background: "rgba(255, 255, 255, 0.04)", 
                  backdropFilter: "blur(40px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  boxShadow: "rgba(0, 0, 0, 0.4) 0px 25px 50px -12px"
                }}
              >
                {/* Decorative floating circular accent to draw eye */}
                <div className="absolute -top-12 -left-12 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 border border-white/15 flex items-center justify-center mb-1 sm:mb-2">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-teal-300" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-tight text-white leading-tight">
                    Welcome to Rippl
                  </h2>

                </div>

                {/* Primary CTA button with glowing warm white light orb in the center */}
                <button 
                  onClick={() => setCurrentScreen("selector")}
                  className="relative overflow-hidden rounded-full px-7 py-4 sm:px-14 sm:py-6 text-gray-900 text-xs sm:text-base font-normal tracking-wide border border-white/60 shadow-[0_10px_35px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-[1.02] hover:border-white/80 active:scale-95 group cursor-pointer min-h-[56px] sm:min-h-[76px]"
                  style={{ background: "rgba(255, 255, 255, 0.28)", backdropFilter: "blur(20px)" }}
                >
                  {/* Defined Warm White Light Orb positioned directly in center, sized to fit comfortably inside button */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                    <div 
                      className="w-10 h-10 sm:w-14 sm:h-14 rounded-full transition-transform duration-500 group-hover:scale-105 relative" 
                      style={{ 
                        background: "radial-gradient(circle at 35% 28%, #ffffff 0%, #fffcf5 25%, #faf0e1 60%, #f4e3cd 100%)", 
                        filter: "blur(1px)",
                        boxShadow: "0 0 14px rgba(255, 248, 235, 0.95), 0 0 24px rgba(255, 230, 200, 0.5), inset 0 2px 5px rgba(255, 255, 255, 1)"
                      }} 
                    >
                      {/* Inner specular highlight for clean 3D light glow */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/90 via-transparent to-black/5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Button Text */}
                  <span className="relative z-10 flex items-center justify-center gap-2 text-slate-900 font-normal">
                    <span>Begin Today's Reflection</span>
                  </span>
                </button>

                <p className="text-white/60 text-xs font-light tracking-wider uppercase mt-1 sm:mt-4">
                  Take a moment to center yourself.
                </p>
              </div>
            </motion.div>
          )}

          {/* ==================== SCREEN 2: SELECTOR SCREEN ==================== */}
          {currentScreen === "selector" && (
            <motion.div 
              key="selector"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-6xl mx-auto my-auto flex flex-col gap-4 sm:gap-6 justify-center"
            >
              <div className="w-full grid lg:grid-cols-2 gap-4 lg:gap-8 items-stretch justify-center">
                
                {/* Left Panel: How are you feeling today? */}
                <section className="glass-panel rounded-[20px] sm:rounded-[24px] p-4 sm:p-8 md:p-10 flex flex-col items-center justify-between relative overflow-hidden h-auto lg:h-[630px]">
                  <div className="text-center mt-1 sm:mt-2 z-10">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-light tracking-widest text-white leading-tight uppercase">
                      HOW ARE YOU<br />FEELING TODAY?
                    </h2>
                    <p className="text-[11px] sm:text-xs text-[#bfc8c7] tracking-wider uppercase mt-1 opacity-75">
                      {selectedMood ? `Selected: ${selectedMood.label}` : "Touch an emotional pebble below"}
                    </p>
                  </div>

                  {/* Main central 3D emotional pebble with dynamic mood gradient */}
                  <div className="my-2 sm:my-4 relative z-10 flex items-center justify-center w-full">
                    <EmotionalPebble 
                      mood={selectedMood} 
                      size="responsive" 
                    />
                  </div>

                  {/* Mood Selector Buttons arranged in a horseshoe arc beneath the main orb */}
                  <div className="w-full flex justify-center items-start gap-1.5 sm:gap-4 md:gap-5 pt-1 sm:pt-2 pb-2 sm:pb-10 z-10 min-h-[85px] sm:min-h-[140px]">
                    {MOODS.map((mood, idx) => {
                      const isSelected = selectedMood?.id === mood.id;
                      // Downward U-curve offsets for the 5 items: Happy, Content, Calm, Anxious, Sad
                      const arcOffsets = [
                        "-translate-y-1 sm:-translate-y-3",      // Happy (top-left)
                        "translate-y-1 sm:translate-y-4",        // Content (mid-left)
                        "translate-y-3 sm:translate-y-10",       // Calm (bottom-center)
                        "translate-y-1 sm:translate-y-4",        // Anxious (mid-right)
                        "-translate-y-1 sm:-translate-y-3",      // Sad (top-right)
                      ];

                      return (
                        <div 
                          key={mood.id} 
                          className={`flex flex-col items-center gap-1 sm:gap-1.5 transition-transform duration-300 ${arcOffsets[idx] || ""}`}
                        >
                          {/* Concentric Bubble Selector */}
                          <button
                            onClick={() => setSelectedMood(mood)}
                            className={`w-11 h-11 sm:w-15 sm:h-15 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 relative backdrop-blur-md ${
                              isSelected 
                                ? "scale-110 sm:scale-115 z-10" 
                                : "hover:scale-105 opacity-90 hover:opacity-100"
                            }`}
                            style={{
                              background: isSelected 
                                ? "rgba(255, 255, 255, 0.22)" 
                                : "rgba(255, 255, 255, 0.1)",
                              border: isSelected 
                                ? "1.5px solid rgba(255, 255, 255, 0.95)" 
                                : "1px solid rgba(255, 255, 255, 0.45)",
                              boxShadow: "none"
                            }}
                          >
                            {/* Inner Radial Gradient Circle */}
                            <div 
                              className="w-6 h-6 sm:w-9 sm:h-9 rounded-full transition-transform duration-300 relative flex items-center justify-center"
                              style={{
                                background: mood.selectorGradient,
                                border: "1px solid rgba(255, 255, 255, 0.8)",
                                boxShadow: "none"
                              }}
                            />
                          </button>

                          {/* Text Label Underneath */}
                          <span className={`text-[10px] sm:text-xs font-medium tracking-wide select-none transition-colors ${
                            isSelected 
                              ? "text-white font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]" 
                              : "text-white/85 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                          }`}>
                            {mood.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Right Panel: What did you do today? */}
                <section className="glass-panel rounded-[20px] sm:rounded-[24px] p-4 sm:p-8 md:p-10 flex flex-col justify-between h-auto lg:h-[630px]">
                  <div className="text-center mt-1 sm:mt-2">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-light tracking-widest text-white uppercase leading-tight">
                      WHAT DID YOU DO TODAY?
                    </h2>
                    <p className="text-[11px] sm:text-xs text-[#bfc8c7] tracking-wider uppercase mt-1 opacity-75">
                      Select all actions that represent your day
                    </p>
                  </div>

                  {/* Activities Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4 my-2 sm:my-4 flex-grow items-center">
                    {ACTIVITIES.map((act) => {
                      const Icon = act.icon;
                      const isSelected = selectedActivities.includes(act.id);
                      return (
                        <button
                          key={act.id}
                          onClick={() => toggleActivity(act.id)}
                          className={`rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex flex-col items-center justify-center h-full gap-1.5 sm:gap-2.5 transition-all cursor-pointer border ${
                            isSelected 
                              ? "bg-white/15 border-white/40 scale-[1.02] shadow-md shadow-white/5" 
                              : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                          }`}
                        >
                          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center relative">
                            <div className={`absolute inset-0 ${act.bgGlow} rounded-full blur-lg`} />
                            <Icon className={`w-4 h-4 sm:w-6 sm:h-6 ${act.glowClass}`} />
                          </div>
                          <span className="text-[11px] sm:text-xs font-light text-center leading-tight tracking-wide text-white/95">
                            {act.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Optional Personal Thought / Detail Input for deep AI personalization */}
                  <div className="w-full my-2 text-left">
                    <label className="block text-[11px] uppercase tracking-wider text-[#bfc8c7] mb-1 font-light pl-0.5">
                      Personal Detail or Thought <span className="opacity-60 text-[10px] lowercase">(optional)</span>
                    </label>
                    <textarea
                      value={personalNote}
                      onChange={(e) => setPersonalNote(e.target.value)}
                      placeholder="Share a specific detail or feeling about today for Rippli..."
                      rows={2}
                      className="w-full bg-white/[0.08] border border-white/20 focus:border-teal-300/70 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none transition-all resize-none font-sans backdrop-blur-sm"
                    />
                  </div>

                  {/* Dynamic proceeding button for Screen 3 */}
                  <div className="w-full flex justify-center pt-1">
                    <button 
                      onClick={() => { setCurrentScreen("reflection"); setActiveNav("stats"); }}
                      className="primary-btn w-full py-3 sm:py-4 rounded-full font-semibold uppercase tracking-widest text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>Formulate Rippli's Insight</span>
                      <ChevronRight className="w-4 h-4 text-gray-900" />
                    </button>
                  </div>
                </section>

              </div>
            </motion.div>
          )}

          {/* ==================== SCREEN 3: REFLECTION SCREEN ==================== */}
          {currentScreen === "reflection" && (
            <motion.div 
              key="reflection"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-6xl mx-auto my-auto flex flex-col gap-6 justify-center"
            >
              <div className="w-full grid lg:grid-cols-2 gap-8 items-stretch justify-center">
                
                {/* Left Panel: Reflection Summary (Orb, Active list, July 2026 Calendar) */}
                <section className="glass-panel rounded-[24px] p-6 md:p-8 flex flex-col justify-between relative h-auto min-h-[580px]">
                  <div>
                    <h2 className="text-lg md:text-xl font-light tracking-wider text-white mb-4 uppercase">
                      REFLECTION SUMMARY
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 items-center mb-4">
                      {/* Tracked Mood Pebble visualizer from selection screen */}
                      <div className="flex flex-col items-center">
                        <EmotionalPebble 
                          mood={selectedMood} 
                          size="medium" 
                        />
                        <div className="text-center mt-2">
                          <p className={`text-xs font-semibold tracking-widest uppercase ${(selectedMood || WARM_WHITE_MOOD).textColor}`}>
                            {(selectedMood || WARM_WHITE_MOOD).label}
                          </p>
                        </div>
                      </div>

                      {/* Render chosen activities or placeholder */}
                      <div className="flex flex-col gap-2 w-full max-w-xs">
                        {selectedActivities.length > 0 ? (
                          selectedActivities.map((actId) => {
                            const act = ACTIVITIES.find((a) => a.id === actId);
                            if (!act) return null;
                            const Icon = act.icon;
                            return (
                              <div key={act.id} className="activity-pill active rounded-full px-4 py-2 flex items-center gap-3">
                                <Icon className={`w-4 h-4 ${act.glowClass}`} />
                                <span className="text-xs tracking-wider uppercase font-light text-white">{act.label}</span>
                              </div>
                            );
                          })
                        ) : (
                          <>
                            {/* Visual defaults representing tranquil static state */}
                            <div className="activity-pill rounded-full px-4 py-2 flex items-center gap-3 opacity-60">
                              <Moon className="w-4 h-4 text-emerald-300" />
                              <span className="text-xs tracking-wider uppercase font-light text-white">QUIET REFLECTION</span>
                            </div>
                            <div className="activity-pill rounded-full px-4 py-2 flex items-center gap-3 opacity-60">
                              <Notebook className="w-4 h-4 text-indigo-300" />
                              <span className="text-xs tracking-wider uppercase font-light text-white">NO RECENT ACTIONS</span>
                            </div>
                          </>
                        )}

                        {/* Optional user note preview badge */}
                        {personalNote.trim() && (
                          <div className="mt-1 p-2.5 bg-white/[0.08] border border-white/15 rounded-xl text-left">
                            <p className="text-[10px] uppercase tracking-wider text-teal-300 font-semibold mb-0.5">Your Personal Detail</p>
                            <p className="text-xs text-white/90 italic font-sans leading-snug line-clamp-3">"{personalNote.trim()}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Calendar Widget with Real-time Navigation & Interactive Date Selection */}
                  <div className="flex-grow flex flex-col justify-center pt-2">
                    {(() => {
                      const viewYear = viewDate.getFullYear();
                      const viewMonth = viewDate.getMonth();
                      const isCurrentRealMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();

                      const monthName = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

                      const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
                      const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
                      const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

                      const prevMonthDays = Array.from({ length: firstDayOfWeek }, (_, i) => daysInPrevMonth - firstDayOfWeek + 1 + i);
                      const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

                      const totalCellsSoFar = prevMonthDays.length + currentMonthDays.length;
                      const totalGridCells = totalCellsSoFar > 35 ? 42 : 35;
                      const nextMonthDaysCount = totalGridCells - totalCellsSoFar;
                      const nextMonthDays = Array.from({ length: nextMonthDaysCount }, (_, i) => i + 1);

                      return (
                        <>
                          <div className="flex items-center justify-between mb-3 px-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-teal-300" />
                              <h3 className="text-sm font-semibold text-white/95 uppercase tracking-widest">
                                {monthName}
                              </h3>
                              {/* Month Navigation Controls */}
                              <div className="flex items-center gap-1 ml-2 bg-black/20 rounded-lg p-0.5 border border-white/10">
                                <button 
                                  onClick={handlePrevMonth}
                                  title="Previous Month"
                                  className="p-1 hover:bg-white/10 rounded transition-colors text-white/70 hover:text-white"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  onClick={handleNextMonth}
                                  title="Next Month"
                                  className="p-1 hover:bg-white/10 rounded transition-colors text-white/70 hover:text-white"
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              {!isCurrentRealMonth && (
                                <button
                                  onClick={handleGoToToday}
                                  className="text-[10px] text-teal-300 hover:text-white underline uppercase font-semibold tracking-wider ml-1"
                                >
                                  Today
                                </button>
                              )}
                            </div>
                            <span className="text-[10px] text-[#95d1ce] uppercase font-light tracking-wider bg-teal-900/30 px-2.5 py-0.5 rounded-full border border-teal-500/20 hidden sm:inline-block">
                              Click any day to log
                            </span>
                          </div>

                          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                            {/* Days Header */}
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                              <div key={day} className="text-xs text-[#bfc8c7]/70 text-center uppercase tracking-wider font-semibold py-1">
                                {day}
                              </div>
                            ))}
                            
                            {/* Previous Month Padding Days */}
                            {prevMonthDays.map((num) => (
                              <div 
                                key={`prev-${num}`}
                                onClick={handlePrevMonth}
                                className="flex flex-col items-center justify-center min-h-[44px] rounded-xl bg-white/[0.02] border border-white/[0.03] text-white/20 text-xs hover:bg-white/5 transition-all cursor-pointer opacity-40 hover:opacity-80"
                              >
                                {num}
                              </div>
                            ))}

                            {/* Current Month Days */}
                            {currentMonthDays.map((num) => {
                              const dateKey = formatDateKey(viewYear, viewMonth, num);
                              const isToday = viewYear === today.getFullYear() && viewMonth === today.getMonth() && num === today.getDate();
                              const moodId = calendarHistory[dateKey];
                              const mood = (moodId && moodId !== "unselected" ? MOODS.find((m) => m.id === moodId) : null) 
                                || (isToday && selectedMood && selectedMood.id !== "unselected" ? selectedMood : null);

                              if (mood) {
                                return (
                                  <div
                                    key={dateKey}
                                    onClick={() => setEditingDateKey(dateKey)}
                                    title={`${monthName} ${num} · ${mood.label} Mood (Click to edit)`}
                                    className={`group relative flex flex-col items-center justify-center min-h-[44px] rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                                      mood.calBgOverlay || "bg-teal-500/25 border-teal-300/60"
                                    } ${
                                      isToday
                                        ? "ring-2 ring-white/90 scale-[1.04] shadow-[0_0_18px_rgba(255,255,255,0.4)] z-10"
                                        : "hover:scale-[1.03] hover:brightness-125"
                                    }`}
                                  >
                                    {/* Today Label */}
                                    {isToday ? (
                                      <span className="text-[9px] text-teal-200 uppercase font-semibold tracking-tighter -mb-0.5">
                                        Today
                                      </span>
                                    ) : null}
                                    <span className={`text-xs font-semibold ${isToday ? "text-white text-sm" : "text-white/90"}`}>
                                      {num}
                                    </span>

                                    {/* Mood Dot Indicator */}
                                    <span className={`mt-0.5 w-1.5 h-1.5 rounded-full ${mood.calDot || "bg-teal-300"}`} />

                                    {/* Hover Tooltip Badge */}
                                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 whitespace-nowrap bg-gray-900/95 text-white text-[10px] font-medium px-2 py-0.5 rounded-md border border-white/20 shadow-lg">
                                      {num}: <span className={mood.textColor}>{mood.label}</span>
                                    </div>
                                  </div>
                                );
                              }

                              return (
                                <div
                                  key={dateKey}
                                  onClick={() => setEditingDateKey(dateKey)}
                                  title={`${monthName} ${num} · Click to log mood`}
                                  className={`flex flex-col items-center justify-center min-h-[44px] rounded-xl border transition-all cursor-pointer ${
                                    isToday 
                                      ? "bg-white/10 border-teal-300/60 text-white font-bold ring-2 ring-teal-300/50 shadow-md" 
                                      : "bg-white/5 border-white/5 text-white/50 hover:bg-white/15 hover:text-white"
                                  }`}
                                >
                                  {isToday && (
                                    <span className="text-[8px] text-teal-300 uppercase font-bold tracking-tight -mb-0.5">
                                      Today
                                    </span>
                                  )}
                                  <span className="text-xs">{num}</span>
                                </div>
                              );
                            })}

                            {/* Next Month Padding Days */}
                            {nextMonthDays.map((num) => (
                              <div 
                                key={`next-${num}`}
                                onClick={handleNextMonth}
                                className="flex flex-col items-center justify-center min-h-[44px] rounded-xl bg-white/[0.02] border border-white/[0.03] text-white/20 text-xs hover:bg-white/5 transition-all cursor-pointer opacity-40 hover:opacity-80"
                              >
                                {num}
                              </div>
                            ))}
                          </div>
                        </>
                      );
                    })()}

                    {/* Mood Color Legend */}
                    <div className="flex items-center justify-between mt-3 px-1 pt-2 border-t border-white/10">
                      <span className="text-[10px] text-[#bfc8c7]/60 uppercase tracking-wider font-medium">Mood Colors:</span>
                      <div className="flex items-center gap-2 sm:gap-2.5">
                        {MOODS.map((m) => (
                          <div key={m.id} className="flex items-center gap-1.5 group relative cursor-pointer">
                            <span 
                              className="w-2.5 h-2.5 rounded-full inline-block transition-transform duration-200 group-hover:scale-125" 
                              style={{
                                backgroundColor: m.solidColor,
                                boxShadow: `0 0 6px ${m.glowColor}`
                              }}
                            />
                            <span className="text-[10px] text-[#bfc8c7]/80 capitalize font-light">{m.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Right Panel: AI Guidance & Poetic Koi Illustration */}
                <section id="ai-guidance-section" className="glass-panel rounded-[24px] flex-1 p-6 md:p-10 flex flex-col justify-between relative h-auto min-h-[580px]">
                  <div className="z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                      <h2 className="text-xl md:text-2xl font-light tracking-wider text-white uppercase">
                        AI GUIDANCE: MOVING UPSTREAM
                      </h2>
                      <button
                        onClick={() => fetchAIGuidance(selectedMood, selectedActivities, personalNote)}
                        disabled={isGeneratingGuidance}
                        title="Generate a fresh dynamic reflection from Gemini"
                        className="flex items-center gap-1.5 text-xs text-teal-300 hover:text-white bg-teal-500/15 hover:bg-teal-500/25 border border-teal-300/40 px-3.5 py-1.5 rounded-full transition-all cursor-pointer disabled:opacity-50 shadow-sm active:scale-95"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingGuidance ? "animate-spin text-teal-200" : ""}`} />
                        <span>{isGeneratingGuidance ? "Listening..." : "Regenerate"}</span>
                      </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start justify-center py-2">
                      {/* Stylized custom SVG Koi fish vector matching reference image */}
                      <div className="w-24 h-24 flex-shrink-0 mx-auto md:mx-0 filter drop-shadow-[0_0_15px_rgba(255,235,230,0.3)]">
                        <KoiFishIcon className="w-full h-full" />
                      </div>

                      {/* Rippli Poetic Metaphor text box */}
                      <div className="flex-grow text-center md:text-left">
                        <p className="text-xs uppercase tracking-[0.2em] text-[#95d1ce] font-semibold mb-3 flex items-center justify-center md:justify-start gap-1.5">
                          <Sparkles className="w-4 h-4 text-[#FFD1B3]" />
                          <span>From your Glimmer Guide, Rippli:</span>
                        </p>

                        {isGeneratingGuidance ? (
                          <div className="py-4 flex flex-col items-center md:items-start gap-3">
                            <div className="flex items-center gap-2 text-teal-200 text-sm italic font-serif animate-pulse">
                              <RefreshCw className="w-4 h-4 animate-spin text-teal-300" />
                              <span>Rippli is reading your currents and crafting your personalized reflection...</span>
                            </div>
                            <div className="w-full max-w-md h-1.5 bg-teal-500/20 rounded-full overflow-hidden relative">
                              <div className="h-full bg-gradient-to-r from-teal-400 via-amber-200 to-teal-300 rounded-full animate-pulse w-3/4" />
                            </div>
                          </div>
                        ) : (
                          <p className="text-base md:text-lg font-light text-[#e1e3e2] leading-relaxed italic font-serif">
                            "{aiGuidance || getRippliGuidance()}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Daily Scripture / Bible Verse section */}
                    <div className="mt-8 pt-5 border-t border-white/10 flex flex-col gap-2.5 bg-white/[0.04] p-5 rounded-2xl border border-white/[0.08] shadow-inner">
                      <div className="flex items-center justify-between">
                        <p className="text-xs uppercase tracking-[0.2em] text-amber-200/90 font-semibold flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-amber-300" />
                          <span>Daily Scripture</span>
                        </p>
                        <button
                          onClick={() => setVerseIndex((prev) => (prev + 1) % BIBLE_VERSES.length)}
                          className="text-[11px] text-amber-200/80 hover:text-amber-100 flex items-center gap-1.5 transition-colors cursor-pointer bg-white/5 hover:bg-white/15 px-2.5 py-1 rounded-full border border-white/10"
                          title="Read another scripture"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Another Verse</span>
                        </button>
                      </div>
                      <blockquote className="text-sm md:text-base font-serif italic text-amber-100/90 leading-relaxed pl-3 border-l-2 border-amber-300/50 py-0.5 mt-1">
                        "{BIBLE_VERSES[verseIndex].text}"
                      </blockquote>
                      <p className="text-xs font-sans font-semibold text-amber-200/80 text-right pr-1 tracking-wide">
                        — {BIBLE_VERSES[verseIndex].reference}
                      </p>
                    </div>
                  </div>

                  {/* Primary interactive CTA button resetting/progressing flow */}
                  <div id="return-to-pond-btn" className="mt-8 flex justify-center w-full z-10 pt-2 pb-2">
                    <button 
                      onClick={() => { 
                        setCurrentScreen("welcome"); 
                        setSelectedActivities([]); 
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="primary-btn w-full max-w-md py-4 rounded-full font-semibold uppercase tracking-widest text-xs cursor-pointer shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 ring-2 ring-teal-300/40"
                    >
                      <Home className="w-4 h-4 text-gray-900" />
                      <span>Return to the Pond</span>
                    </button>
                  </div>
                </section>

              </div>
            </motion.div>
          )}

        </AnimatePresence>

      {/* Date Mood Log Modal */}
      <AnimatePresence>
        {editingDateKey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setEditingDateKey(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel w-full max-w-md p-6 rounded-3xl border border-white/20 shadow-2xl bg-gray-950/80 text-white flex flex-col gap-5 relative overflow-hidden"
            >
              <button
                onClick={() => setEditingDateKey(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <span className="text-[10px] uppercase tracking-widest text-teal-300 font-semibold bg-teal-900/40 px-2.5 py-1 rounded-full border border-teal-500/30">
                  {editingDateKey === todayKey ? "Today's Mood Entry" : "Log Mood Entry"}
                </span>
                <h3 className="text-xl font-light text-white tracking-wide mt-2">
                  {(() => {
                    const [y, m, d] = editingDateKey.split("-").map(Number);
                    return new Date(y, m - 1, d).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric"
                    });
                  })()}
                </h3>
                <p className="text-xs text-[#bfc8c7] mt-1 font-light">
                  Select a mood stone to record your emotional currents for this day.
                </p>
              </div>

              {/* Mood Stones Selector */}
              <div className="grid grid-cols-5 gap-2 my-2">
                {MOODS.map((m) => {
                  const isCurrent = calendarHistory[editingDateKey] === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMoodForDate(editingDateKey, m.id)}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-white/20 border-white/50 scale-105"
                          : "bg-white/5 border-white/10 hover:bg-white/15 hover:border-white/20"
                      }`}
                    >
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center relative"
                        style={{
                          background: isCurrent ? "rgba(255, 255, 255, 0.18)" : "rgba(255, 255, 255, 0.08)",
                          border: isCurrent ? "1.5px solid rgba(255, 255, 255, 0.9)" : "1px solid rgba(255, 255, 255, 0.4)",
                          boxShadow: "none"
                        }}
                      >
                        <div 
                          className="w-6 h-6 rounded-full relative"
                          style={{
                            background: m.selectorGradient,
                            border: "1px solid rgba(255, 255, 255, 0.8)",
                            boxShadow: "none"
                          }}
                        />
                      </div>
                      <span className="text-[11px] font-medium tracking-wide text-white/90">
                        {m.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                {calendarHistory[editingDateKey] ? (
                  <button
                    onClick={() => setMoodForDate(editingDateKey, null)}
                    className="text-xs text-rose-300 hover:text-rose-200 underline tracking-wider cursor-pointer"
                  >
                    Clear Mood for this Date
                  </button>
                ) : (
                  <span />
                )}
                <button
                  onClick={() => setEditingDateKey(null)}
                  className="px-5 py-2 rounded-full bg-white/15 hover:bg-white/25 text-xs font-semibold uppercase tracking-wider text-white transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </main>

      {/* Persistent Elegant Brand Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-8 pb-8 pt-4 flex flex-col items-center justify-center text-center z-10 gap-2 border-t border-white/5 mt-auto">
        <p className="text-xs text-[#bfc8c7]/50 font-light text-center">
          Rippl Wellness Sanctuary — Powered by the Zen-Glass Theme
        </p>
        <div className="flex flex-col items-center justify-center text-center mt-1">
          <div className="text-xl font-light text-white tracking-widest text-center">RIPPL.</div>
          <div className="text-[10px] text-[#bfc8c7]/50 tracking-wider mt-0.5 text-center">
            <a href="#" className="hover:text-white transition-colors">Privacy</a> | <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
