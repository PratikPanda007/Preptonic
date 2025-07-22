import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } = await request.json();

  try {
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]

        Thank you! <3
    `,
    });

    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(","),
      questions: JSON.parse(questions),
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}

// import { generateText } from "ai";
// import { google } from "@ai-sdk/google";

// import { db } from "@/firebase/admin";
// import { getRandomInterviewCover } from "@/lib/utils";

// export async function POST(request: Request) {
//   const { type, role, level, techstack, amount, userid } = await request.json();

//   console.log("Received parameters:", {
//     type,
//     role,
//     level,
//     techstack,
//     amount,
//     userid,
//   });

//   // Validate required parameters
//   if (!type || !role || !level || !techstack || !amount || !userid) {
//     return Response.json(
//       {
//         success: false,
//         error: "Missing required parameters",
//         received: { type, role, level, techstack, amount, userid },
//       },
//       { status: 400 }
//     );
//   }

//   try {
//     const prompt = `Prepare questions for a job interview.
// The job role is ${role}.
// The job experience level is ${level}.
// The tech stack used in the job is: ${techstack}.
// The focus between behavioural and technical questions should lean towards: ${type}.
// The amount of questions required is: ${amount}.
// Please return only the questions, without any additional text.
// The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
// Return the questions formatted like this:
// ["Question 1", "Question 2", "Question 3"]

// IMPORTANT: Return ONLY the JSON array, no markdown formatting, no code blocks, no additional text.

// Thank you! <3`;

//     console.log("Generated prompt:", prompt);

//     const { text: questions } = await generateText({
//       model: google("gemini-2.0-flash-001"),
//       prompt: prompt,
//     });

//     console.log("Raw AI response:", questions);

//     // Clean the response to extract only the JSON array
//     const cleanQuestions = questions
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .trim();

//     let parsedQuestions;
//     try {
//       parsedQuestions = JSON.parse(cleanQuestions);
//       console.log("Parsed questions:", parsedQuestions);
//     } catch (parseError) {
//       console.error("Failed to parse questions:", cleanQuestions);
//       throw new Error(
//         `Invalid JSON format received from AI: ${parseError.message}`
//       );
//     }

//     if (!Array.isArray(parsedQuestions)) {
//       throw new Error("AI response is not an array of questions");
//     }

//     const techstackArray =
//       typeof techstack === "string"
//         ? techstack.split(",").map((tech) => tech.trim())
//         : techstack;

//     const interview = {
//       role,
//       type,
//       level,
//       techstack: techstackArray,
//       questions: parsedQuestions,
//       userId: userid,
//       finalized: true,
//       coverImage: getRandomInterviewCover(),
//       createdAt: new Date().toISOString(),
//     };

//     console.log("Interview object to save:", interview);

//     await db.collection("interviews").add(interview);

//     return Response.json({ success: true }, { status: 200 });
//   } catch (error) {
//     console.error("Error:", error);
//     return Response.json(
//       {
//         success: false,
//         error: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 }
//     );
//   }
// }
