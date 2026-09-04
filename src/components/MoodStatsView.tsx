import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, 
  Calendar as CalendarIcon, 
  Award, 
  Activity, 
  BarChart3, 
  HelpCircle,
  Home,
  Info
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";
import { MoodConfig } from "./EmotionalPebble";

interface MoodStatsViewProps {
  calendarHistory: Record<string, string>;
  moods: MoodConfig[];
  onSelectDate: (dateKey: string) => void;
  onSeedSampleData: () => void;
  onClearSampleData: () => void;
  onNavigateToHome: () => void;
}

// Mood numeric scale mapping for chart
const MOOD_SCORES: Record<string, { score: number; label: string; color: string; bgHex: string }> = {
  happy: { score: 7, label: "Happy", color: "#FDE047", bgHex: "#FFE066" },
  calm: { score: 6, label: "Calm", color: "#48CAE4", bgHex: "#48CAE4" },
  tired: { score: 5, label: "Tired", color: "#CBD5E1", bgHex: "#94A3B8" },
  anxious: { score: 4, label: "Anxious", color: "#E87EA1", bgHex: "#E87EA1" },
  sad: { score: 3, label: "Sad", color: "#B8C0FF", bgHex: "#889BEE" },
  disgust: { score: 2, label: "Disgust", color: "#6EE7B7", bgHex: "#10B981" },
  anger: { score: 1, label: "Anger", color: "#FCA5A5", bgHex: "#EF4444" },
};

export const MoodStatsView: React.FC<MoodStatsViewProps> = ({
  calendarHistory,
  moods,
  onSelectDate,
  onSeedSampleData,
  onClearSampleData,
  onNavigateToHome
}) => {
  const [activeTab, setActiveTab] = useState<"line" | "heatmap">("line");
  const [selectedDayDetail, setSelectedDayDetail] = useState<{ dateKey: string; moodId: string | null; formattedDate: string } | null>(null);

  // Generate date array for the last 30 days (ending today)
  const today = new Date();
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (29 - i));
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateKey = `${year}-${month}-${day}`;
    
    const moodId = calendarHistory[dateKey] || null;
    const moodObj = moods.find((m) => m.id === moodId) || null;
    const scoreInfo = moodId ? MOOD_SCORES[moodId] : null;

    const shortDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const dayOfWeek = d.toLocaleDateString("en-US", { weekday: "short" });

    return {
      dateKey,
      dateObj: d,
      shortDate,
      dayOfWeek,
      dayNum: d.getDate(),
      moodId,
      moodObj,
      score: scoreInfo ? scoreInfo.score : null,
      moodLabel: moodObj ? moodObj.label : "Unlogged",
      moodColor: moodObj ? moodObj.textColorHex : "#6B7280"
    };
  });

  // Calculate Summary Statistics
  const loggedDays = last30Days.filter((d) => d.moodId);
  const totalLoggedCount = loggedDays.length;
  const checkInRate = Math.round((totalLoggedCount / 30) * 100);

  // Frequency count per mood
  const moodCounts: Record<string, number> = {
    happy: 0,
    calm: 0,
    tired: 0,
    anxious: 0,
    sad: 0,
    disgust: 0,
    anger: 0,
  };

  loggedDays.forEach((d) => {
    if (d.moodId && moodCounts[d.moodId] !== undefined) {
      moodCounts[d.moodId]++;
    }
  });

  // Find dominant mood
  let dominantMoodId = "calm";
  let maxCount = -1;
  Object.entries(moodCounts).forEach(([id, count]) => {
    if (count > maxCount) {
      maxCount = count;
      dominantMoodId = id;
    }
  });
  const dominantMoodObj = moods.find((m) => m.id === dominantMoodId) || moods[2];

  // Calculate gradient stops aligned precisely with logged mood dots along the path bounding box
  const loggedMoodEntries = last30Days
    .map((d, index) => ({ index, dateKey: d.dateKey, color: d.moodObj?.solidColor }))
    .filter((d): d is { index: number; dateKey: string; color: string } => Boolean(d.color));

  const gradientStops: { offset: string; color: string; key: string }[] = [];

  if (loggedMoodEntries.length > 0) {
    const minIndex = loggedMoodEntries[0].index;
    const maxIndex = loggedMoodEntries[loggedMoodEntries.length - 1].index;
    const range = maxIndex - minIndex;

    if (range === 0) {
      // Single logged point: solid color across path
      gradientStops.push({ offset: "0%", color: loggedMoodEntries[0].color, key: "single-0" });
      gradientStops.push({ offset: "100%", color: loggedMoodEntries[0].color, key: "single-100" });
    } else {
      // Multiple logged points: map relative to the path's bounding box [minIndex, maxIndex]
      loggedMoodEntries.forEach((entry) => {
        const offsetPct = (((entry.index - minIndex) / range) * 100).toFixed(2);
        gradientStops.push({
          offset: `${offsetPct}%`,
          color: entry.color,
          key: `logged-${entry.dateKey}-${entry.index}`
        });
      });
    }
  } else {
    // Fallback when NO moods are logged in the 30-day period
    const defaultSpectrum = ["#FDE047", "#48CAE4", "#94A3B8", "#E87EA1", "#889BEE", "#10B981", "#EF4444"];
    defaultSpectrum.forEach((color, idx) => {
      const offsetPct = ((idx / (defaultSpectrum.length - 1)) * 100).toFixed(2);
      gradientStops.push({
        offset: `${offsetPct}%`,
        color,
        key: `default-${idx}`
      });
    });
  }

  // Calculate streak ending today
  let currentStreak = 0;
  for (let i = last30Days.length - 1; i >= 0; i--) {
    if (last30Days[i].moodId) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Custom Recharts Tooltip
  // Custom Dot component that colors each point according to its day's logged mood
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (cx === undefined || cy === undefined || payload?.score === null || payload?.score === undefined) return null;
    const color = payload.moodObj?.solidColor || "#64748B";
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={color}
        stroke="#FFFFFF"
        strokeWidth={1.5}
        style={{ filter: "drop-shadow(0px 1px 3px rgba(0,0,0,0.5))" }}
      />
    );
  };

  const CustomActiveDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (cx === undefined || cy === undefined) return null;
    const color = payload.moodObj?.solidColor || "#5EEAD4";
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={10}
          fill={color}
          fillOpacity={0.3}
        />
        <circle
          cx={cx}
          cy={cy}
          r={5.5}
          fill={color}
          stroke="#FFFFFF"
          strokeWidth={2}
          style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.6))" }}
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel p-3.5 rounded-2xl bg-[#0c1816]/95 border border-white/20 shadow-2xl text-white text-xs max-w-xs space-y-1.5">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-1.5">
            <span className="font-semibold text-teal-300">{data.shortDate} ({data.dayOfWeek})</span>
            <span className="text-[10px] text-white/50 uppercase tracking-wider">{data.dateKey}</span>
          </div>
          {data.moodObj ? (
            <div className="flex items-center gap-2 pt-1">
              <div 
                className="w-4 h-4 rounded-full border border-white/80 shadow-sm"
                style={{ background: data.moodObj.selectorGradient }}
              />
              <span className={`font-semibold ${data.moodObj.textColor}`}>
                {data.moodObj.label} Mood
              </span>
            </div>
          ) : (
            <p className="text-white/50 italic text-[11px]">No mood check-in recorded</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-5xl flex flex-col items-center py-2 sm:py-6 gap-6 z-10">
      
      {/* Main Container Glass Panel */}
      <div 
        className="glass-panel rounded-[28px] sm:rounded-[32px] w-full p-5 sm:p-8 md:p-10 flex flex-col gap-8 relative overflow-hidden"
        style={{
          background: "rgba(10, 20, 20, 0.35)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)"
        }}
      >
        {/* Background glow accents */}
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-300 animate-pulse" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
                Emotional Currents Analytics
              </p>
            </div>
            <h2 className="text-2xl sm:text-3xl font-light tracking-wider text-white uppercase">
              LAST 30 DAYS MOOD STATS
            </h2>
          </div>
        </div>

        {/* Summary Metric Cards (4 Grid) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 z-10">
          {/* Card 1: Check-in Rate */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-white/60 mb-2">
              <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">30-Day Logs</span>
              <CalendarIcon className="w-4 h-4 text-teal-300" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-light text-white tracking-tight">
                {totalLoggedCount} <span className="text-sm text-white/50 font-normal">/ 30</span>
              </p>
              <p className="text-[11px] text-teal-300/80 mt-1 font-medium">
                {checkInRate}% Check-in Rate
              </p>
            </div>
          </div>

          {/* Card 2: Dominant Mood */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-white/60 mb-2">
              <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">Dominant Mood</span>
              <div 
                className="w-4 h-4 rounded-full border border-white/80 shadow-sm"
                style={{ background: dominantMoodObj.selectorGradient }}
              />
            </div>
            <div>
              <p className={`text-xl sm:text-2xl font-light tracking-wide ${dominantMoodObj.textColor}`}>
                {dominantMoodObj.label}
              </p>
              <p className="text-[11px] text-white/60 mt-1">
                {maxCount > 0 ? `${maxCount} days logged` : "No entries yet"}
              </p>
            </div>
          </div>

          {/* Card 3: Current Streak */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-white/60 mb-2">
              <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">Active Streak</span>
              <Award className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-light text-amber-200 tracking-tight">
                {currentStreak} <span className="text-sm text-white/50 font-normal">days</span>
              </p>
              <p className="text-[11px] text-white/60 mt-1">
                {currentStreak > 0 ? "Keep your stream flowing!" : "Log today to start streak"}
              </p>
            </div>
          </div>

          {/* Card 4: Emotional Balance */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-white/60 mb-2">
              <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">Grounded Days</span>
              <Activity className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-light text-emerald-300 tracking-tight">
                {moodCounts.happy + moodCounts.calm} <span className="text-sm text-white/50 font-normal">days</span>
              </p>
              <p className="text-[11px] text-white/60 mt-1">
                Happy & Calm
              </p>
            </div>
          </div>
        </div>

        {/* Chart View Selector Header (Line Chart vs Heatmap Grid) */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 pt-2 z-10">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-teal-300" />
            <span className="text-xs uppercase tracking-widest text-white/90 font-medium">Visual Overview</span>
          </div>

          <div className="flex items-center p-1 rounded-full bg-white/5 border border-white/10">
            <button
              onClick={() => setActiveTab("line")}
              className={`px-3.5 py-1 rounded-full text-xs transition-all cursor-pointer ${
                activeTab === "line"
                  ? "bg-teal-500/30 text-teal-200 font-semibold border border-teal-300/40 shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Trend Chart
            </button>
            <button
              onClick={() => setActiveTab("heatmap")}
              className={`px-3.5 py-1 rounded-full text-xs transition-all cursor-pointer ${
                activeTab === "heatmap"
                  ? "bg-teal-500/30 text-teal-200 font-semibold border border-teal-300/40 shadow-sm"
                  : "text-white/60 hover:text-white"
              }`}
            >
              30-Day Grid
            </button>
          </div>
        </div>

        {/* VIEW 1: Line / Area Chart */}
        {activeTab === "line" && (
          <div className="flex flex-col gap-4 z-10">
            <div className="w-full h-64 sm:h-80 bg-black/20 rounded-2xl p-3 border border-white/10 relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={last30Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    {/* Horizontal gradient across the 30 days for the trend line stroke */}
                    <linearGradient id="lineMoodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      {gradientStops.map((stop) => (
                        <stop
                          key={`line-${stop.key}`}
                          offset={stop.offset}
                          stopColor={stop.color}
                          stopOpacity={1}
                        />
                      ))}
                    </linearGradient>

                    {/* Horizontal gradient across the 30 days for the area fill */}
                    <linearGradient id="areaMoodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      {gradientStops.map((stop) => (
                        <stop
                          key={`area-${stop.key}`}
                          offset={stop.offset}
                          stopColor={stop.color}
                          stopOpacity={0.3}
                        />
                      ))}
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis 
                    dataKey="shortDate" 
                    stroke="rgba(255,255,255,0.4)" 
                    tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 10 }}
                    interval={4}
                  />
                  <YAxis 
                    domain={[1, 7]} 
                    ticks={[1, 2, 3, 4, 5, 6, 7]}
                    stroke="rgba(255,255,255,0.2)"
                    tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 10 }}
                    tickFormatter={(val) => {
                      const found = Object.values(MOOD_SCORES).find((m) => m.score === val);
                      return found ? found.label : "";
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="url(#lineMoodGradient)" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#areaMoodGradient)" 
                    connectNulls
                    dot={<CustomDot />}
                    activeDot={<CustomActiveDot />}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Legend / Mood Scale Explanation */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2 text-[11px]">
              {moods.map((m) => (
                <div key={m.id} className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                  <span 
                    className="w-2.5 h-2.5 rounded-full border border-white/60"
                    style={{ background: m.solidColor }}
                  />
                  <span className={m.textColor}>{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: 30-Day Heatmap Grid */}
        {activeTab === "heatmap" && (
          <div className="flex flex-col gap-4 z-10">
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2 sm:gap-2.5">
              {last30Days.map((item) => {
                const isSelected = selectedDayDetail?.dateKey === item.dateKey;
                return (
                  <motion.div
                    key={item.dateKey}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedDayDetail({
                        dateKey: item.dateKey,
                        moodId: item.moodId,
                        formattedDate: `${item.shortDate} (${item.dayOfWeek})`
                      });
                      onSelectDate(item.dateKey);
                    }}
                    className={`aspect-square rounded-2xl p-2 flex flex-col items-center justify-between border transition-all cursor-pointer relative overflow-hidden group ${
                      item.moodObj 
                        ? item.moodObj.calBgOverlay 
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    } ${isSelected ? "ring-2 ring-white scale-105" : ""}`}
                  >
                    <span className="text-[10px] font-medium text-white/70 leading-none">
                      {item.dayNum}
                    </span>

                    {item.moodObj ? (
                      <div 
                        className="w-6 h-6 rounded-full relative my-auto shadow-sm transition-transform group-hover:scale-110"
                        style={{
                          background: item.moodObj.selectorGradient,
                          border: "1px solid rgba(255, 255, 255, 0.8)",
                          boxShadow: `0 0 10px ${item.moodObj.glowColor}`
                        }}
                      />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white/20 my-auto" />
                    )}

                    <span className="text-[9px] text-white/50 leading-none uppercase">
                      {item.dayOfWeek}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <p className="text-center text-xs text-[#bfc8c7]/70 italic font-light pt-1">
              Click any day tile above to view or update your mood stone log for that date.
            </p>
          </div>
        )}

        {/* Mood Distribution Breakdown Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col gap-3 z-10">
          <div className="flex items-center justify-between text-xs text-white/80">
            <span className="uppercase tracking-wider font-medium">30-Day Emotion Breakdown</span>
            <span className="text-teal-300 font-semibold">{totalLoggedCount} days recorded</span>
          </div>

          <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden flex shadow-inner">
            {moods.map((m) => {
              const count = moodCounts[m.id] || 0;
              const pct = totalLoggedCount > 0 ? (count / totalLoggedCount) * 100 : 0;
              if (pct === 0) return null;
              return (
                <div
                  key={m.id}
                  style={{ width: `${pct}%`, background: m.solidColor }}
                  className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
                  title={`${m.label}: ${count} days (${Math.round(pct)}%)`}
                />
              );
            })}
          </div>

          {/* Detailed Counts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-2">
            {moods.map((m) => {
              const count = moodCounts[m.id] || 0;
              const pct = totalLoggedCount > 0 ? Math.round((count / totalLoggedCount) * 100) : 0;
              return (
                <div key={m.id} className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full border border-white/60"
                      style={{ background: m.solidColor }}
                    />
                    <span className="text-xs text-white/90 font-medium">{m.label}</span>
                  </div>
                  <span className={`text-xs font-semibold ${m.textColor}`}>
                    {count}d <span className="text-[10px] text-white/40 font-normal">({pct}%)</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA to Return to the Pond */}
        <div className="pt-4 flex justify-center z-10">
          <button
            onClick={onNavigateToHome}
            className="primary-btn w-full max-w-md py-4 rounded-full font-semibold uppercase tracking-widest text-xs cursor-pointer shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 ring-2 ring-teal-300/40"
          >
            <Home className="w-4 h-4 text-gray-900" />
            <span>Return to the Pond</span>
          </button>
        </div>

      </div>
    </div>
  );
};
