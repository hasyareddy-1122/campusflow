import Groq from "groq-sdk";

const groq = new Groq({ 
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true // Necessary for client-side calls in hackathon demos
});

export async function generateStudyPlan(subject: string, topics: string[], examDate: string, timetable: string) {
  const prompt = `
    You are an expert academic strategist. 
    Subject: ${subject}
    Topics: ${topics.join(", ")}
    Exam Date: ${examDate}
    College Timetable: ${timetable}
    
Create a study plan where the topics are spread out over ${topics.length} days.
  Return ONLY a JSON array format (no extra text): 
  [{"dayIndex": 1, "topic": "Name", "hours": number}] 
  (Use dayIndex as an integer representing the day, starting at 1).
  `;

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful AI assistant that outputs only valid JSON." },
      { role: "user", content: prompt },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.5,
  });

  const content = chatCompletion.choices[0]?.message?.content || "[]";
  const cleanedContent = content.replace(/```json/g, "").replace(/```/g, "").trim();
  
  return JSON.parse(cleanedContent);
}