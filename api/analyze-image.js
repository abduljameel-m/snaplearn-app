export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Image missing" });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "OpenRouter API key missing" });
    }

    const prompt = `
You are SnapLearn Vision Classifier for an Indian emergency guidance app.

Your job:
- Look at the uploaded image.
- Classify it into ONE emergency category and ONE exact problem.
- Return ONLY valid JSON.
- Do NOT give medical treatment advice.
- Do NOT invent new problem names.
- Do NOT choose CPR unless image clearly shows unconscious/no breathing/no pulse situation.

Fixed emergency list:

1. CPR Emergency
Problems:
- Person Not Breathing
- No Pulse

2. Fire Emergency
Problems:
- Room Fire
- Clothes on Fire
- Smoke Inhalation

3. Road Accident
Problems:
- Head Injury
- Hand / Leg Fracture
- Heavy Bleeding

4. Choking
Problems:
- Adult Choking
- Baby Choking

5. Disaster / Catastrophic Failure
Problems:
- Earthquake
- Flood
- Building Collapse

6. Animal & Insect Injuries
Problems:
- Snake Bite
- Dog Bite
- Bee / Wasp Sting

Visual decision rules:

Snake Bite:
- snake visible
- two red puncture marks
- fang marks
- venom, cobra, viper clue
- bite mark on hand, leg, foot
- swelling around small puncture marks

Dog Bite:
- dog visible
- teeth bite wound
- torn skin from animal bite
- rabies risk clue

Bee / Wasp Sting:
- bee/wasp/insect visible
- small sting mark
- itchy red swelling
- allergic swelling

Heavy Bleeding:
- visible blood
- open wound
- deep cut
- blood flow
- accident wound

Hand / Leg Fracture:
- broken bone
- bent limb
- swollen arm/leg
- bone deformity

Head Injury:
- head wound
- head bleeding
- helmet accident
- face/head trauma

Room Fire:
- flames inside room/building/kitchen
- burning objects

Clothes on Fire:
- fire on person's clothing/dress

Smoke Inhalation:
- smoke around person
- gas/smoke suffocation
- coughing in smoke

Adult Choking:
- adult holding throat
- unable to breathe from food/object

Baby Choking:
- baby/infant choking

Earthquake:
- shaking damage
- cracked walls/building damage

Flood:
- flood water
- trapped in water
- heavy rain flooding

Building Collapse:
- collapsed building
- rubble/debris
- person trapped under structure

Return ONLY this JSON format:
{
  "emergency": "Animal & Insect Injuries",
  "problem": "Snake Bite",
  "confidence": "low/medium/high",
  "reason": "short visual reason",
  "keywords": "snake bite fang puncture swelling"
}
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "SnapLearn Emergency App",
      },
      body: JSON.stringify({
        model: "openrouter/auto",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType || "image/jpeg"};base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        temperature: 0.1,
        max_tokens: 300,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("OPENROUTER ERROR:", JSON.stringify(data, null, 2));
      return res.status(response.status).json({
        error: "OpenRouter API error",
        details: data,
      });
    }

    let text = data?.choices?.[0]?.message?.content || "";
    text = text.replace(/```json|```/g, "").trim();

    let result;

    try {
      result = JSON.parse(text);
    } catch {
      result = {
        emergency: "",
        problem: "Unclear",
        confidence: "low",
        reason: text || "Could not classify image",
        keywords: "",
      };
    }

    const combinedText = `
      ${result.emergency || ""}
      ${result.problem || ""}
      ${result.reason || ""}
      ${result.keywords || ""}
    `.toLowerCase();

    // Backend safety correction
    if (
      combinedText.includes("snake") ||
      combinedText.includes("fang") ||
      combinedText.includes("venom") ||
      combinedText.includes("cobra") ||
      combinedText.includes("viper") ||
      combinedText.includes("puncture")
    ) {
      result.emergency = "Animal & Insect Injuries";
      result.problem = "Snake Bite";
      result.confidence = result.confidence || "medium";
      result.keywords = result.keywords || "snake bite fang puncture";
    }

    if (
      combinedText.includes("dog") ||
      combinedText.includes("rabies")
    ) {
      result.emergency = "Animal & Insect Injuries";
      result.problem = "Dog Bite";
    }

    if (
      combinedText.includes("bee") ||
      combinedText.includes("wasp") ||
      combinedText.includes("sting")
    ) {
      result.emergency = "Animal & Insect Injuries";
      result.problem = "Bee / Wasp Sting";
    }

    if (
      combinedText.includes("blood") ||
      combinedText.includes("bleeding") ||
      combinedText.includes("wound") ||
      combinedText.includes("cut")
    ) {
      result.emergency = "Road Accident";
      result.problem = "Heavy Bleeding";
    }

    if (
      combinedText.includes("fracture") ||
      combinedText.includes("broken") ||
      combinedText.includes("bone")
    ) {
      result.emergency = "Road Accident";
      result.problem = "Hand / Leg Fracture";
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      error: "AI failed",
      details: error.message,
    });
  }
}