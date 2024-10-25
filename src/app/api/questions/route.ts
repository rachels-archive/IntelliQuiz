import { strict_output } from "@/lib/gemini";
import { NextResponse } from "next/server";

// POST /api/questions
export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { title, inputType, textInput, numOfQuestions } = body;

    // Validate input
    if (!title || !inputType || (inputType === "text" && !textInput)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    let questions: any[] = [];

    if (inputType === "text") {
      const prompt = `You are a helpful assistant that generates ${numOfQuestions} quiz questions based on the following text:\n\n${textInput}\n\nPlease respond with a valid JSON array of question objects, each containing a "question" and an "answer".`;
      console.log("Prompt sent to model:", prompt);

      // Call strict_output to generate questions
      questions = await strict_output(prompt, textInput, {
        question: "question",
        answer: "answer with max length of 15 words",
      });

      // Log raw output for debugging
      console.log("Raw output from model:", questions);

      // Check if questions is an array and contains valid objects
      if (!Array.isArray(questions) || questions.some((q) => !q.question || !q.answer)) {
        throw new Error("The output must be an array of question objects with 'question' and 'answer' fields.");
      }

      // Limit to requested number of questions
      if (questions.length > numOfQuestions) {
        questions = questions.slice(0, numOfQuestions);
      }
    }

    return NextResponse.json({ questions, status: 200 });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 });
  }
};

/*import { strict_output } from "@/lib/gemini";
import { NextResponse } from "next/server";

// POST /api/questions
export const POST = async (req: Request, res: Response) => {
  try {
    const body = await req.json();

    const { title, inputType, textInput, numOfQuestions } = body;

    // Validate input
    if (!title || !inputType || (inputType === "text" && !textInput)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    let questions: any[] = [];

    if (inputType === "text") {
      // Generate questions based on text input
      questions = await strict_output(
        `You are a helpful assistant that generates ${numOfQuestions} quiz questions based on the provided text.`,
        textInput,
        {
          question: "question",
          answer: "answer with max length of 15 words",
        }
      );
      if (questions.length > numOfQuestions) {
        questions = questions.slice(0, numOfQuestions);
      }
    }

    return NextResponse.json({ questions, status: 200 });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 });
  }
};
*/
