// export async function POST(req) {
//   try {
//     const { questions } = await req.json();

//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [
//                 {
//                   text: `
// For the following aptitude questions:

// ${JSON.stringify(questions)}

// For each question provide:
// - correctAnswer
// - short explanation

// Return STRICT JSON:
// [
//   {
//     "question": "",
//     "correctAnswer": "",
//     "explanation": ""
//   }
// ]
// `
//                 }
//               ]
//             }
//           ]
//         })
//       }
//     );

//     const data = await response.json();
//     let text = data.candidates[0].content.parts[0].text;
//     text = text.replace(/```json|```/g, "");

//     return Response.json({
//       solutions: JSON.parse(text)
//     });

//   } catch (error) {
//     return Response.json({ error: error.message });
//   }
// }
