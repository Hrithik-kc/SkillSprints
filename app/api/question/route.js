export async function POST(req) {
  try {
    const body = await req.json();

    if (body.type === "generate") {

      const levels = ["easy", "medium", "hard"];
      const difficulty = levels[Math.floor(Math.random() * levels.length)];

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `
Generate 5 ${difficulty} level aptitude multiple choice questions.

Return STRICT JSON:
[
  {
    "question": "",
    "options": ["", "", "", ""],
    "correctAnswer": "",
    "explanation": ""
  }
]
`
                  }
                ]
              }
            ]
          })
        }
      );

      const data = await response.json();

      if (!data.candidates) {
        return new Response(
          JSON.stringify({ error: "Gemini failed" }),
          { status: 500 }
        );
      }

      let text = data.candidates[0].content.parts[0].text;
      text = text.replace(/```json|```/g, "").trim();

      let parsed;

      try {
        parsed = JSON.parse(text);
      } catch {
        return new Response(
          JSON.stringify({ error: "Invalid JSON from Gemini" }),
          { status: 500 }
        );
      }

      return Response.json({
        difficulty,
        questions: parsed
      });
    }

    return Response.json({ error: "Invalid request type" });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
