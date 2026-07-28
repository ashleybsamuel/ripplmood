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
        `Processing thoughts like "${userNote}" when feeling ${cleanMood} takes a genuine emotional toll, but putting them into words lets the surface ripple settle.`,
        `Carrying "${userNote}" on a day where you're feeling ${cleanMood} feels heavy, like navigating deep, turbulent waters.`,
        `Directly acknowledging "${userNote}" takes real courage, especially when your mood is leaning ${cleanMood}.`,
        `Writing down "${userNote}" gives your mind a safe harbor to unpack what you've been carrying today.`,
        `It is completely natural that "${userNote}" is weighing on you right now while feeling ${cleanMood}.`,
        `Taking a quiet moment to write about "${userNote}" allows you to step back and observe those thoughts as gentle ripples passing by.`,
        `Acknowledging "${userNote}" out loud is a deeply honest way to bring calm back to your inner waters today.`,
        `Holding space for "${userNote}" on a ${cleanMood} day requires gentle patience as the currents quiet down.`,
      ];
      const insights = [
        `Remember that stressful moments and heavy thoughts are temporary ripples, not a permanent reflection of your path.`,
        `Giving yourself room to feel without judgment allows the emotional waters to settle naturally into clarity.`,
        `You don't need to solve or fix everything tonight; simply letting yourself rest by quiet waters is enough.`,
        `Be patient with yourself as your nervous system settles down like a still, peaceful pond after a storm.`,
        `Remind yourself that your worth isn't measured by how fast today's waves calm down, but by your gentle presence.`,
        `Allowing today's demands to rest here creates a tranquil boundary between today's weight and tomorrow's gentle sunrise.`,
        `Even when thoughts feel tangled, taking slow, deliberate breaths brings a soothing stillness back to your center.`,
      ];
      const closings = [
        `Unclench your shoulders, take a slow deep breath, and let peace wash over you tonight.`,
        `Set your worries aside for the evening and allow your mind to drift into deep, uninterrupted rest.`,
        `Treat yourself with the same gentle warmth you would offer to a dear friend sitting by a quiet shore.`,
        `Let tonight be a quiet sanctuary where you don't have to carry any extra weight against the tide.`,
        `Focus only on this present moment and let tonight be as calm and unhurried as a still pond.`,
        `Give yourself permission to log off, unwind, and rest peacefully in these tranquil hours tonight.`,
      ];

      const op = pickNonRepeating(openings);
      const ins = pickNonRepeating(insights);
      const cl = pickNonRepeating(closings);
      result = `${op} ${ins} ${cl}`;
    } else if (moodId === "happy" || moodId === "content" || moodId === "calm") {
      const openings = [
        `Noticing "${userNote}" captures a bright, joyful ripple that lit up your entire day.`,
        `Reflecting on "${userNote}" anchors a peaceful, clear momentum as your evening unfolds like still waters.`,
        `Capturing your thoughts around "${userNote}" gives you a clear, beautiful moment of quiet appreciation.`,
        `Writing down "${userNote}" is a wonderful way to honor the gentle warmth flowing through your day.`,
        `Focusing on "${userNote}" brings out the clear, shimmering details that made today special.`,
        `Sharing "${userNote}" highlights a lovely ray of sunlight reflecting across your day.`,
      ];
      const insights = [
        `Savoring these meaningful highlights builds a lasting reservoir of inner peace and quiet joy.`,
        `Moments like these remind us how much clarity exists when we pause by quiet waters.`,
        `Carrying this grounded energy forward nurtures a calm, resilient current for whatever lies ahead.`,
        `Taking time to celebrate small wins sends a gentle ripple of gratitude through your whole evening.`,
        `Allowing yourself to rest in these good feelings gives your mind a wonderful, soothing refresh.`,
      ];
      const closings = [
        `Enjoy the rest of your evening with a light heart and a tranquil, peaceful mind.`,
        `Let this sense of ease gently guide you into a deep, refreshing rest tonight.`,
        `Hold onto this genuine warmth as you wind down at your own comfortable pace like a calm stream.`,
        `Let this peaceful momentum linger softly as you transition into a restful night.`,
      ];

      const op = pickNonRepeating(openings);
      const ins = pickNonRepeating(insights);
      const cl = pickNonRepeating(closings);
      result = `${op} ${ins} ${cl}`;
    } else {
      const openings = [
        `Putting "${userNote}" into words brings an honest, grounded clarity to your evening like clear water.`,
        `Taking time to write about "${userNote}" gives you space to let today's events settle at their own natural speed.`,
        `Reflecting on "${userNote}" helps bring clear sight to where your focus and energy flowed today.`,
        `Writing about "${userNote}" offers a thoughtful, quiet checkpoint as you close out your day.`,
      ];
      const insights = [
        `Every experience—smooth or stirred—adds another layer of wisdom to your quiet journey.`,
        `Taking a quiet moment to process your thoughts creates a clear, peaceful boundary between today and tomorrow.`,
        `Giving your experiences a clear name helps quiet the noise and lets your mind rest like a serene pond.`,
      ];
      const closings = [
        `Unwind peacefully tonight knowing you navigated your day with care and gentle intention.`,
        `Take a slow, deep breath and let your evening be unhurried, steady, and calm.`,
        `Rest comfortably tonight, trusting that tomorrow will bring its own natural, gentle flow.`,
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
          `Pouring mental energy into study deadlines while feeling ${cleanMood} takes a lot of stamina, stirring up deep emotional waters.`,
          `Pushing through heavy academic tasks on a ${cleanMood} day takes a quiet toll on your momentum.`,
          `Navigating intense coursework today required real perseverance when your energy was running low.`,
          `Juggling study pressure alongside feeling ${cleanMood} is exhausting, so give yourself permission to step away from the current.`
        );
      } else if (moodId === "happy" || moodId === "content") {
        part1.push(
          `Making tangible progress on your academic goals today leaves you with a well-earned sense of smooth, clear accomplishment.`,
          `Crossing major assignments off your list today has lifted a real weight, letting your evening flow freely.`,
          `Tackling your study commitments paid off, leaving your evening feeling light and clear.`,
          `Seeing your hard study work pay off today brings a satisfying, bright ripple of joy.`
        );
      } else {
        part1.push(
          `Focusing your energy on academic tasks today brought a steady, productive flow to your hours.`,
          `Putting in solid study effort today sets a strong, calm foundation for the days ahead.`,
          `Stepping through your study goals today kept your mindset grounded like deep, quiet waters.`
        );
      }
    } else if (has("fresh_air") && has("sleep")) {
      if (moodId === "anxious" || moodId === "sad") {
        part1.push(
          `Even though you prioritized outdoor air and restful sleep today, it's completely natural if feeling ${cleanMood} still stirs below the surface.`,
          `Nourishing your body with good sleep and fresh air builds quiet resilience over time, helping the waters clear.`,
          `Taking time for fresh air and rest provided a supportive shoreline, even as you navigate feeling ${cleanMood}.`
        );
      } else {
        part1.push(
          `Giving your body good sleep and stepping outdoors gave your day a fresh, clear momentum like a crisp mountain stream.`,
          `Recharging with physical rest and outdoor fresh air brought a clean, refreshing clarity to your mindset.`,
          `Connecting with fresh outdoor air and prioritizing sleep refreshed both your body and spirit today.`
        );
      }
    } else if (has("fresh_air")) {
      if (moodId === "anxious" || moodId === "sad") {
        part1.push(
          `Stepping outdoors for fresh air was a gentle step today, even if feeling ${cleanMood} still weighs on your heart.`,
          `Connecting with outdoor air gives your spirit a gentle breath of space when navigating ${cleanMood} feelings.`,
          `Taking time to get fresh air brought a brief moment of open sky, even while working through a ${cleanMood} day.`
        );
      } else {
        part1.push(
          `Stepping outside for fresh air gave your day a bright, refreshing momentum like a gentle breeze across the water.`,
          `Connecting with outdoor air brought a clean, invigorating clarity to your mindset today.`,
          `Getting outside and breathing in fresh air refreshed your spirit and grounded your energy.`
        );
      }
    } else if (has("sleep")) {
      if (moodId === "anxious" || moodId === "sad") {
        part1.push(
          `Nourishing your body with good sleep provided essential rest today, even if feeling ${cleanMood} still lingers.`,
          `Prioritizing full rest gives your nervous system a gentle foundation, helping quiet feelings of ${cleanMood}.`,
          `Giving yourself permission to get good sleep was a supportive act of care on a heavy ${cleanMood} day.`
        );
      } else {
        part1.push(
          `Prioritizing solid, restorative sleep gave your mindset a clear, grounded energy throughout the day.`,
          `Starting with good physical sleep brought an easy, quiet stamina to your entire day.`,
          `Recharging deeply with good rest set a serene, balanced tone for your hours.`
        );
      }
    } else if (has("alone")) {
      if (moodId === "anxious" || moodId === "sad") {
        part1.push(
          `Spending time alone when feeling ${cleanMood} can sometimes make inner thoughts echo louder across quiet waters.`,
          `Carving out solo time allowed you to step back to a peaceful shore, even if lingering ${cleanMood} thoughts felt close.`,
          `Taking quiet time for yourself provided space to rest, letting ripples settle at your own pace.`
        );
      } else {
        part1.push(
          `Carving out uninterrupted solo time allowed you to float at your own natural pace today.`,
          `Taking space for quiet solitude gave your mind a serene, still sanctuary away from external noise.`,
          `Enjoying your own company today brought a peaceful, soothing pause to your schedule.`
        );
      }
    } else if (has("chores")) {
      part1.push(
        `Tending to your space and clearing up chores brought a satisfying, clear order to your surroundings.`,
        `Taking care of daily details today created a fresh, tidy sanctuary where your mind can rest like calm water.`,
        `Organizing your environment today makes it much easier to unwind and let your thoughts float freely.`
      );
    } else {
      // Pure mood openings
      if (moodId === "happy") {
        part1.push(
          `A genuine, bright energy moved through your day like sunlight dancing across a clear pond.`,
          `Your positive spirits today created a light, uplifting ripple that naturally radiates outward.`,
          `Flowing through today with joy brought a wonderful, vibrant warmth to your hours.`
        );
      } else if (moodId === "content" || moodId === "calm") {
        part1.push(
          `A steady, quiet sense of balance settled gracefully into your day like a clear, still pond.`,
          `Navigating your hours with a peaceful, grounded mindset gave today a smooth, easy flow.`,
          `Your calm energy today created a serene, anchored sanctuary wherever you went.`
        );
      } else if (moodId === "anxious") {
        part1.push(
          `When internal pressure or anxiety runs high, letting the surface turbulence settle with self-compassion is a quiet victory.`,
          `Navigating feelings of anxiety requires immense inner strength, even when the waters feel stirred.`,
          `Honoring your need to slow down when anxiety is present allows your mind to return to still waters.`
        );
      } else if (moodId === "sad") {
        part1.push(
          `On days when sadness feels close, letting yourself rest by quiet waters is the most supportive thing you can do.`,
          `Some days carry a heavier tide, and allowing yourself to feel without judgment takes true courage.`,
          `Treating yourself gently on a somber day allows your spirit to heal in tranquil quiet.`
        );
      } else {
        part1.push(
          `Taking time to check in with yourself is like pausing by a calm pool to reflect.`,
          `Pausing to observe your thoughts at the end of the day lets the water settle into clear reflection.`,
          `Checking in with your emotional baseline helps you stay centered in your own peaceful flow.`
        );
      }
    }

    // Part 2: Insight / Reframe
    const part2: string[] = [];
    if (moodId === "anxious" || moodId === "sad") {
      part2.push(
        `Remember that difficult feelings are passing ripples, not a permanent reflection of your worth or future.`,
        `Stepping back from worries and allowing your mind to rest is essential for letting the water clear.`,
        `You do not have to carry tomorrow's expectations into tonight's sleep; let today's current rest here.`,
        `Gentle self-compassion is the most soothing balm when thoughts feel overwhelming.`,
        `Focusing on taking just one calm breath at a time helps ease the waves and restore inner quiet.`
      );
    } else if (moodId === "happy" || moodId === "content") {
      part2.push(
        `Holding onto this sense of ease creates a strong, serene foundation for whatever comes next.`,
        `Savoring these bright moments sends peaceful ripples through your mind for lasting gratitude.`,
        `Allowing yourself to feel accomplished gives your mind a wonderful chance to rest deeply.`,
        `Resting in this positive mood helps recharge your spirit like a clear, nourishing spring.`
      );
    } else {
      part2.push(
        `Finding time to balance effort with quiet rest keeps your spirit centered and steady.`,
        `Allowing your evening to unfold without pressing demands creates space for genuine restoration.`,
        `Stepping away from the day's noise lets your thoughts naturally settle into still water.`,
        `Giving yourself permission to pause at the end of the day restores quiet, crystal clarity.`
      );
    }

    // Part 3: Warm Closing
    const part3: string[] = [
      `Unclench your shoulders, take a slow deep breath, and enjoy a quiet, restful evening.`,
      `Set your tasks aside for tonight and let yourself settle into deep, calm sleep.`,
      `Give yourself credit for today and allow tomorrow to unfold in its own gentle rhythm.`,
      `Rest comfortably tonight knowing you have done enough for today.`,
      `Let tonight be a peaceful reset, allowing your mind and body to relax completely by still waters.`,
      `Close your eyes with peace of mind and wake up refreshed like clear morning dew.`,
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
