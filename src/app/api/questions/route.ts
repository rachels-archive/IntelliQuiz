import { authOptions } from "@/lib/auth";
import { strict_output } from "@/lib/gemini";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// POST /api/questions
export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);

    /*
    if (!session?.user) {
      return NextResponse.json(
        {
          error: "You must be logged in to create a quiz.",
        },
        { status: 401 }
      );
    }*/
    const body = await req.json();
    const { title, inputType, textInput, numOfQuestions, numOfChoices } = body;

    // Validate input
    if (!title || !inputType || (inputType === "text" && !textInput)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    let questions: any[] = [];

    if (inputType === "text") {
      // Modify the question generation logic
      let prompt = `You are a helpful assistant that generates ${numOfQuestions} quiz questions based on the following text:\n\n${textInput}\n\nPlease respond with a valid JSON array of question objects, each containing a "question", "answer", "option1", "option2", "option3 and option4".`;

      const outputFormat = {
        question: "question",
        answer: "answer with max length of 15 words",
        option1: "first option",
        option2: "second option",
        option3: "third option",
        option4: "fourth option",
      };

      // Call strict_output to generate questions
      questions = await strict_output(prompt, textInput, outputFormat);

      // Ensure answers match one of the options
      questions.forEach((q, index) => {
        const options = [q.option1, q.option2, q.option3, q.option4];
        if (!options.includes(q.answer)) {
          // If the answer does not match any option, adjust it
          q.answer = options[0]; // Or use a different strategy to select an answer
        }
      });
      if (
        !Array.isArray(questions) ||
        questions.some((q) => !q.question || !q.answer || !q.option1 || !q.option2 || !q.option3 || !q.option4)
      ) {
        throw new Error(
          "The output must be an array of question objects with 'question', 'answer', 'option1', 'option2', 'option3', and 'option4'."
        );
      }

      // Trim options to 3 if user chooses 3
      if (numOfChoices === 3) {
        questions.forEach((q) => {
          delete q.option4;
        });
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
