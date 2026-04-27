export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { userText, emergencyProfile, locationText, isOffline } = req.body;

    if (!userText || !userText.trim()) {
      return res.status(400).json({
        error: "Message missing",
        answer: "Please describe what happened. Example: my friend fell and blood is coming.",
      });
    }

    if (isOffline) {
      return res.status(200).json({
        mode: "offline",
        emergency: "Unknown",
        confidence: "low",
        answer:
          "You appear to be offline. I can still help with basic emergency guidance inside the app. Please use simple words like bleeding, fire, choking, snake bite, fracture, flood, or earthquake.",
        suggestedTopic: "none",
        suggestedProblem: "none",
        nextActions: [
          "Stay calm and move to a safe place if possible.",
          "Use Panic Mode to call 108, 101, or 112.",
          "Search the emergency category manually if AI is unavailable.",
        ],
      });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "OpenRouter API key missing",
        answer: "AI is not configured. Please use the emergency categories or Panic Mode.",
      });
    }

    const systemPrompt = `
You are SnapBot, an emergency guidance assistant for an app called SnapLearn.

Your job:
1. Understand the user's emergency situation from natural language.
2. Identify the likely emergency.
3. Give immediate step-by-step guidance.
4. Keep the response short, calm, and action-focused.
5. Always recommend calling local emergency services when serious.
6. For India, use these emergency numbers:
   - Ambulance: 108
   - Fire: 101
   - SOS: 112

Important safety rules:
- Do not give complicated medical explanations.
- Do not suggest dangerous actions.
- Do not replace professional emergency services.
- If unclear, ask for one short clarification but still give safe general steps.
- If the situation is life-threatening, prioritize calling emergency services.

Return JSON ONLY in this exact format:
{
  "emergency": "short emergency name",
  "confidence": "high | medium | low",
  "severity": "critical | serious | moderate | low",
  "suggestedTopic": "CPR Emergency | Fire Emergency | Road Accident | Choking | Disaster / Catastrophic Failure | Animal & Insect Injuries | none",
  "suggestedProblem": "Person Not Breathing | No Pulse | Room Fire | Clothes on Fire | Smoke Inhalation | Head Injury | Hand / Leg Fracture | Heavy Bleeding | Adult Choking | Baby Choking | Earthquake | Flood | Building Collapse | Snake Bite | Dog Bite | Bee / Wasp Sting | none",
  "answer": "short helpful paragraph",
  "nextActions": ["step 1", "step 2", "step 3", "step 4"],
  "callNow": true,
  "recommendedNumber": "108 | 101 | 112 | none"
}

Important mapping examples:
- not breathing, unconscious, CPR, no pulse -> CPR Emergency
- fire, smoke, burning, gas suffocation -> Fire Emergency
- accident, bleeding, fracture, head injury -> Road Accident
- choking, food stuck, throat blocked -> Choking
- earthquake, flood, building collapse, trapped in debris -> Disaster / Catastrophic Failure
- snake bite, dog bite, bee sting -> Animal & Insect Injuries
`;

    const userContext = `
User emergency message:
"${userText}"

Emergency profile, if available:
${JSON.stringify(emergencyProfile || {}, null, 2)}

Location text, if available:
${locationText || "Not available"}
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://snaplearn-app.vercel.app",
        "X-Title": "SnapLearn Emergency Assistant",
      },
      body: JSON.stringify({
        model: "openrouter/auto",
        temperature: 0.2,
        max_tokens: 700,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userContext,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("OPENROUTER SNAPBOT ERROR:", data);
      return res.status(500).json({
        error: "OpenRouter API error",
        details: data,
        answer: "AI failed. Please use Panic Mode or choose an emergency category manually.",
      });
    }

    const text = data?.choices?.[0]?.message?.content || "";

    let result;

    try {
      const cleaned = text
        .replace(/^```json/i, "")
        .replace(/^```/i, "")
        .replace(/```$/i, "")
        .trim();

      result = JSON.parse(cleaned);
    } catch {
      result = {
        emergency: "Unclear emergency",
        confidence: "low",
        severity: "serious",
        suggestedTopic: "none",
        suggestedProblem: "none",
        answer:
          "I could not fully understand the situation, but if someone is in danger, move to safety and call emergency services immediately.",
        nextActions: [
          "Stay calm and check if the person is breathing.",
          "Move away from danger if it is safe.",
          "Call 108 for ambulance or 112 for emergency help.",
          "Use the app emergency categories for specific steps.",
        ],
        callNow: true,
        recommendedNumber: "112",
      };
    }


    const TOPIC_PROBLEM_MAP = {
      "Person Not Breathing": "CPR Emergency",
      "No Pulse": "CPR Emergency",
      "Room Fire": "Fire Emergency",
      "Clothes on Fire": "Fire Emergency",
      "Smoke Inhalation": "Fire Emergency",
      "Head Injury": "Road Accident",
      "Hand / Leg Fracture": "Road Accident",
      "Heavy Bleeding": "Road Accident",
      "Adult Choking": "Choking",
      "Baby Choking": "Choking",
      "Earthquake": "Disaster / Catastrophic Failure",
      "Flood": "Disaster / Catastrophic Failure",
      "Building Collapse": "Disaster / Catastrophic Failure",
      "Snake Bite": "Animal & Insect Injuries",
      "Dog Bite": "Animal & Insect Injuries",
      "Bee / Wasp Sting": "Animal & Insect Injuries",
    };

    const PROBLEM_ALIASES = [
      ["Person Not Breathing", ["not breathing", "no breathing", "unconscious", "breath stopped", "cpr"]],
      ["No Pulse", ["no pulse", "no heartbeat", "heart stopped", "cardiac arrest"]],
      ["Room Fire", ["room fire", "house fire", "kitchen fire", "building fire", "fire"]],
      ["Clothes on Fire", ["clothes on fire", "person burning", "dress fire", "shirt fire"]],
      ["Smoke Inhalation", ["smoke", "smoke inhalation", "gas", "suffocation"]],
      ["Head Injury", ["head injury", "head hit", "head bleeding", "head trauma"]],
      ["Hand / Leg Fracture", ["fracture", "broken bone", "broken hand", "broken leg"]],
      ["Heavy Bleeding", ["bleeding", "blood", "wound", "deep cut"]],
      ["Adult Choking", ["adult choking", "choking", "food stuck", "throat blocked"]],
      ["Baby Choking", ["baby choking", "infant choking", "child choking"]],
      ["Earthquake", ["earthquake", "ground shaking", "tremor"]],
      ["Flood", ["flood", "flood water", "water logging", "trapped in water"]],
      ["Building Collapse", ["building collapse", "collapsed building", "debris", "rubble", "trapped"]],
      ["Snake Bite", ["snake bite", "snake", "cobra", "viper", "venom"]],
      ["Dog Bite", ["dog bite", "dog", "rabies"]],
      ["Bee / Wasp Sting", ["bee sting", "wasp sting", "insect sting"]],
    ];

    function normalizeText(value) {
      return String(value || "").toLowerCase().replace(/[^a-z0-9\s/]/g, " ").replace(/\s+/g, " ").trim();
    }

    function repairSuggestedTopic(result, originalInput) {
      const combined = normalizeText(`${result?.emergency || ""} ${result?.suggestedProblem || ""} ${result?.answer || ""} ${originalInput || ""}`);

      let problem = result?.suggestedProblem;
      if (!problem || problem === "none" || !TOPIC_PROBLEM_MAP[problem]) {
        for (const [problemName, aliases] of PROBLEM_ALIASES) {
          if (aliases.some((alias) => combined.includes(alias))) {
            problem = problemName;
            break;
          }
        }
      }

      const topic = TOPIC_PROBLEM_MAP[problem] || result?.suggestedTopic || "none";

      return {
        ...result,
        suggestedProblem: problem || "none",
        suggestedTopic: topic || "none",
      };
    }

    result = repairSuggestedTopic(result, userText);


    return res.status(200).json(result);
  } catch (error) {
    console.log("SNAPBOT API FAILED:", error);
    return res.status(500).json({
      error: "SnapBot AI failed",
      details: error.message,
      answer: "AI failed. Please use Panic Mode or choose an emergency category manually.",
    });
  }
}
