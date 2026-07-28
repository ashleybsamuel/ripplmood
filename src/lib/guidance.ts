// Keep track of recently generated output strings to prevent repeating previous responses
const recentOutputsHistory: string[] = [];
const MAX_HISTORY_SIZE = 20;

function pickNonRepeating<T>(items: T[]): T {
  if (items.length === 0) throw new Error("Empty items array");
  if (items.length === 1) return items[0];

  // Try up to 30 times to pick an item that hasn't been used in recent outputs
  for (let attempt = 0; attempt < 30; attempt++) {
    const candidate = items[Math.floor(Math.random() * items.length)];
    const candidateStr = String(candidate);
    
    // Check if this sentence fragment or full phrase appears in recent history
    const isRecent = recentOutputsHistory.some(historyText => historyText.includes(candidateStr));
    if (!isRecent) {
      return candidate;
    }
  }

  // Fallback: pick a random item if all candidates have been seen recently
  return items[Math.floor(Math.random() * items.length)];
}

export function generateDynamicOrganicReflection(
  moodId: string,
  moodName: string,
  activitiesList: string[],
  note?: string
): string {
  const userNote = note && note.trim() ? note.trim() : "";
  const has = (id: string) => activitiesList.includes(id);
  const cleanMood = moodName || moodId || "calm";

  let result = "";

  // 1. DIRECT REAL-LIFE SYNTHESIS WHEN USER NOTE IS PRESENT
  if (userNote) {
    if (moodId === "anxious" || moodId === "sad") {
      const openings = [
        `Processing thoughts like "${userNote}" when feeling ${cleanMood} takes a genuine emotional toll, but putting them into words shows real strength.`,
        `Carrying "${userNote}" on a day where you're feeling ${cleanMood} is heavy, and it makes complete sense that it's on your mind.`,
        `Directly acknowledging "${userNote}" takes courage, especially when your mood is leaning ${cleanMood}.`,
        `Writing down "${userNote}" gives your mind a safe place to unpack what you've been carrying today.`,
        `It is completely natural that "${userNote}" is weighing on you right now while feeling ${cleanMood}.`,
        `Taking a moment to write about "${userNote}" allows you to step back and observe those feelings without letting them overpower you.`,
        `Acknowledging "${userNote}" out loud is a deeply honest way to honor how real your feelings are today.`,
        `Holding space for "${userNote}" on a ${cleanMood} day requires gentle patience with yourself.`,
      ];
      const insights = [
        `Remember that stressful moments and difficult thoughts are temporary, not a permanent reflection of your path.`,
        `Giving yourself room to feel without harsh self-judgment is an essential step toward finding peace tonight.`,
        `You don't need to solve or fix everything before going to sleep; simply letting yourself pause is enough.`,
        `Be patient with yourself as your nervous system settles down after a challenging day.`,
        `Remind yourself that your worth isn't measured by how perfectly today went or how quickly you process hard emotions.`,
        `Allowing today's demands to rest here creates a necessary boundary between today's weight and tomorrow's possibilities.`,
        `Even when thoughts feel tangled, taking slow, deliberate breaths helps restore a quiet center.`,
      ];
      const closings = [
        `Unclench your shoulders, take a slow deep breath, and extend grace to yourself tonight.`,
        `Set your worries aside for the evening and allow yourself to rest deeply.`,
        `Treat yourself with the same gentle kindness you would offer to a dear friend.`,
        `Let tonight be a quiet sanctuary where you don't have to carry any extra weight.`,
        `Focus only on this present moment and let tonight be completely unhurried and calm.`,
        `Give yourself permission to log off, unwind, and sleep peacefully tonight.`,
      ];

      const op = pickNonRepeating(openings);
      const ins = pickNonRepeating(insights);
      const cl = pickNonRepeating(closings);
      result = `${op} ${ins} ${cl}`;
    } else if (moodId === "happy" || moodId === "content" || moodId === "calm") {
      const openings = [
        `Noticing "${userNote}" captures the genuine warmth and positivity that brightened your day.`,
        `Reflecting on "${userNote}" anchors a peaceful, fulfilling momentum as you move into your evening.`,
        `Capturing your thoughts around "${userNote}" gives you a clear, beautiful moment of appreciation.`,
        `Writing down "${userNote}" is a wonderful way to honor what truly mattered to you today.`,
        `Focusing on "${userNote}" brings out the subtle, delightful details that made today special.`,
        `Sharing "${userNote}" highlights a lovely ray of brightness in your day.`,
      ];
      const insights = [
        `Savoring these meaningful highlights builds a lasting sense of fulfillment and inner quiet.`,
        `Moments like these remind us how much brightness can exist in simple, intentional experiences.`,
        `Carrying this grounded energy forward nurtures a calm and resilient mindset for whatever lies ahead.`,
        `Taking time to celebrate small wins creates an enduring reservoir of gratitude.`,
        `Allowing yourself to fully enjoy these good feelings gives your mind a wonderful boost.`,
      ];
      const closings = [
        `Enjoy the rest of your evening with a light heart and a peaceful mind.`,
        `Let this sense of ease gently guide you into a deep, refreshing rest tonight.`,
        `Hold onto this genuine warmth as you wind down at your own comfortable pace.`,
        `Let this joyful momentum linger as you transition into a restful night.`,
      ];

      const op = pickNonRepeating(openings);
      const ins = pickNonRepeating(insights);
      const cl = pickNonRepeating(closings);
      result = `${op} ${ins} ${cl}`;
    } else {
      const openings = [
        `Putting "${userNote}" into words brings an honest, grounded perspective to your evening.`,
        `Taking time to write about "${userNote}" gives you space to digest today's events at your own speed.`,
        `Reflecting on "${userNote}" helps bring clarity to where your focus and energy went today.`,
        `Writing about "${userNote}" offers a thoughtful checkpoint as you close out your day.`,
      ];
      const insights = [
        `Every experience—smooth or complicated—adds another layer of self-awareness to your journey.`,
        `Taking a quiet moment to process your thoughts creates a healthy boundary between today and tomorrow.`,
        `Giving your experiences a clear name helps quiet the noise and brings an easy sense of perspective.`,
      ];
      const closings = [
        `Unwind peacefully tonight knowing you navigated your day with care and intention.`,
        `Take a slow, deep breath and let your evening be unhurried, steady, and restful.`,
        `Rest comfortably tonight, trusting that tomorrow will bring its own natural rhythm.`,
      ];

      const op = pickNonRepeating(openings);
      const ins = pickNonRepeating(insights);
      const cl = pickNonRepeating(closings);
      result = `${op} ${ins} ${cl}`;
    }
  } else {
    // 2. MULTI-ACTIVITY & MOOD REAL-LIFE SYNTHESIS
    const part1: string[] = [];

    if (has("exam") || has("assignment")) {
      if (moodId === "anxious" || moodId === "sad") {
        part1.push(
          `Pouring mental energy into study deadlines while feeling ${cleanMood} demands a lot of emotional stamina.`,
          `Pushing through heavy academic tasks on a ${cleanMood} day takes a quiet toll on your momentum.`,
          `Navigating intense coursework today required real perseverance when energy was already low.`,
          `Juggling study pressure alongside feeling ${cleanMood} is exhausting, so give yourself credit for finishing today.`
        );
      } else if (moodId === "happy" || moodId === "content") {
        part1.push(
          `Making tangible progress on your academic goals today leaves you with a well-earned sense of achievement.`,
          `Crossing major assignments off your list today has lifted a real weight off your shoulders.`,
          `Tackling your study commitments paid off, leaving your evening feeling light and accomplished.`,
          `Seeing your hard study work pay off today brings a satisfying, well-deserved boost.`
        );
      } else {
        part1.push(
          `Focusing your energy on academic tasks today brought a steady, productive rhythm to your hours.`,
          `Putting in solid study effort today sets a strong, organized foundation for the days ahead.`,
          `Stepping through your study goals today kept your mindset grounded and focused.`
        );
      }
    } else if (has("fresh_air") || has("sleep")) {
      if (moodId === "anxious" || moodId === "sad") {
        part1.push(
          `Even though you prioritized outdoor time and sleep today, it's completely okay if feeling ${cleanMood} lingers.`,
          `Nourishing your body with rest and fresh air builds quiet resilience over time, even on tougher days.`,
          `Taking time for fresh air and sleep provided a supportive foundation, even as you navigate feeling ${cleanMood}.`
        );
      } else {
        part1.push(
          `Giving your body good sleep and stepping outdoors gave your day a grounded, refreshing momentum.`,
          `Recharging with physical rest and fresh air brought a clean, healthy clarity to your mindset.`,
          `Connecting with outdoor air and prioritizing sleep refreshed both your body and mind today.`
        );
      }
    } else if (has("alone")) {
      if (moodId === "anxious" || moodId === "sad") {
        part1.push(
          `Spending time alone when feeling ${cleanMood} can sometimes make thoughts feel louder, so treat yourself gently tonight.`,
          `Carving out solo time allowed you to step back, even if lingering ${cleanMood} thoughts felt close.`,
          `Taking quiet time for yourself provided space to rest, even while working through ${cleanMood} moments.`
        );
      } else {
        part1.push(
          `Carving out uninterrupted solo time allowed you to move at your own natural pace today.`,
          `Taking space for quiet solitude gave your mind a peaceful sanctuary away from external noise.`,
          `Enjoying your own company today brought an easy, restorative pause to your schedule.`
        );
      }
    } else if (has("chores")) {
      part1.push(
        `Tending to your space and clearing up chores brought a satisfying sense of order to your surroundings.`,
        `Taking care of daily details today created a fresh, tidy sanctuary for your evening.`,
        `Organizing your environment today makes it much easier to unwind and let your mind rest.`
      );
    } else {
      // Pure mood openings
      if (moodId === "happy") {
        part1.push(
          `A genuine, bright energy moved through your day, bringing a noticeable warmth to your interactions.`,
          `Your positive spirits today created a light, uplifting momentum that naturally radiates outward.`,
          `Flowing through today with joy brought a wonderful, vibrant brightness to your hours.`
        );
      } else if (moodId === "content" || moodId === "calm") {
        part1.push(
          `A steady, quiet sense of balance settled gracefully into your day like a clear, still stream.`,
          `Navigating your hours with a peaceful, grounded mindset gave today a comfortable and easy flow.`,
          `Your calm energy today created a serene, anchored space wherever you went.`
        );
      } else if (moodId === "anxious") {
        part1.push(
          `When internal pressure or worry runs high, making it through the day with self-compassion is a quiet victory.`,
          `Navigating feelings of anxiety requires immense inner strength, even when it feels draining.`,
          `Honoring your need to slow down when anxiety is present is a courageous act of care.`
        );
      } else if (moodId === "sad") {
        part1.push(
          `On days when sadness feels close, honoring your need to slow down is the most supportive thing you can do.`,
          `Some days carry a heavier tide, and allowing yourself to feel without judgment takes true courage.`,
          `Treating yourself gently on a somber day is the kindest gift you can offer your spirit.`
        );
      } else {
        part1.push(
          `Taking time to check in with yourself is a simple yet powerful habit for your well-being.`,
          `Pausing to observe your thoughts at the end of the day gives you a clear moment to recalibrate.`,
          `Checking in with your emotional baseline helps you stay connected and centered.`
        );
      }
    }

    // Part 2: Insight / Reframe
    const part2: string[] = [];
    if (moodId === "anxious" || moodId === "sad") {
      part2.push(
        `Remember that difficult feelings are temporary states, not a reflection of your worth or future.`,
        `Stepping back from worries and allowing your mind to rest is essential for healing and clarity.`,
        `You do not have to carry tomorrow's expectations into tonight's sleep; let today end here.`,
        `Gentle self-compassion is the most effective remedy when thoughts feel overwhelming.`,
        `Focusing on taking just one small step at a time helps calm the mind and ease tension.`
      );
    } else if (moodId === "happy" || moodId === "content") {
      part2.push(
        `Holding onto this sense of ease creates a strong, positive foundation for whatever comes next.`,
        `Savoring these bright moments helps build lasting resilience and genuine peace of mind.`,
        `Allowing yourself to feel accomplished gives your mind a wonderful chance to rest deeply.`,
        `Resting in this positive mood helps recharge your spirit for the days ahead.`
      );
    } else {
      part2.push(
        `Finding time to balance effort with quiet rest keeps your mindset centered and steady.`,
        `Allowing your evening to unfold without pressing demands creates space for genuine restoration.`,
        `Stepping away from the day's noise lets your mind naturally find its balance again.`,
        `Giving yourself permission to pause at the end of the day restores quiet clarity.`
      );
    }

    // Part 3: Warm Closing
    const part3: string[] = [
      `Unclench your shoulders, take a slow deep breath, and enjoy a quiet, restful evening.`,
      `Set your tasks aside for tonight and let yourself settle into deep, uninterrupted sleep.`,
      `Give yourself credit for today and allow tomorrow to unfold one gentle step at a time.`,
      `Rest comfortably tonight knowing you have done enough for today.`,
      `Let tonight be a peaceful reset, allowing your mind and body to relax completely.`,
      `Close your eyes with peace of mind and wake up refreshed for a new day.`,
    ];

    const p1 = pickNonRepeating(part1);
    const p2 = pickNonRepeating(part2);
    const p3 = pickNonRepeating(part3);
    result = `${p1} ${p2} ${p3}`;
  }

  // Push to history buffer so subsequent calls never duplicate recent outputs
  recentOutputsHistory.push(result);
  if (recentOutputsHistory.length > MAX_HISTORY_SIZE) {
    recentOutputsHistory.shift();
  }

  return result;
}
