export async function POST(req) {
  try {
    const body = await req.json();

    // ------------------------------------
    // 1️⃣ GENERATE QUESTIONS
    // ------------------------------------
    if (body.type === "generate") {

      const levels = ["easy", "medium", "hard"];
      const difficulty = levels[Math.floor(Math.random() * levels.length)];

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
    "correctAnswer": ""
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
      let text = data.candidates[0].content.parts[0].text;
      text = text.replace(/```json|```/g, "");

      return Response.json({
        difficulty,
        questions: JSON.parse(text)
      });
    }

    // ------------------------------------
    // 2️⃣ SUBMIT QUIZ (RETURN SCORE ONLY)
    // ------------------------------------
    if (body.type === "submit") {

      const { questions, userAnswers } = body;

      let score = 0;

      questions.forEach((q, index) => {
        if (userAnswers[index] === q.correctAnswer) {
          score++;
        }
      });

      return Response.json({
        score,
        total: questions.length
      });
    }

    return Response.json({ error: "Invalid request type" });

  } catch (error) {
    return Response.json({ error: error.message });
  }
}
