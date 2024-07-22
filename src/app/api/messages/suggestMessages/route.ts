import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from "ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three short open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent([prompt]);
    return Response.json(
      {
        success: true,
        message: result.response.text(),
      },
      {
        status: 200,
      }
    );

    // const geminiStream = await genAI
    //   .getGenerativeModel({ model: "gemini-pro" })
    //   .generateContentStream(prompt);

    // const stream = GoogleGenerativeAIStream(geminiStream);

    // Respond with the stream
    // return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Error generating text",
      },
      { status: 500 }
    );
  }
}
