// /app/api/quiz/route.ts
import { NextResponse } from "next/server";
import { strict_output } from "@/lib/gemini";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { title, inputType, textInput, numOfQuestions, numOfChoices } = body;

    // Input validation
    if (!title || !inputType || !textInput) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate text length
    if (textInput.length > 5000) {
      return NextResponse.json({ error: "Text input exceeds maximum length of 5000 characters" }, { status: 400 });
    }

    let questions: any[] = [];

    let prompt = `You are a helpful assistant that generates ${numOfQuestions} quiz questions based on the following text:\n\n${textInput}\n\nPlease respond with a valid JSON array of question objects, each containing a "question", "answer", "option1", "option2", "option3 and option4". Do not include any backticks or additional formatting.
`;

    const outputFormat = {
      question: "The question text",
      answer: "The correct answer (must match exactly one of the options)",
      option1: "First option",
      option2: "Second option",
      option3: "Third option",
      ...(numOfChoices === 4 ? { option4: "Fourth option" } : {}),
    };

    questions = await strict_output(prompt, textInput, outputFormat);
    //let questions = await strict_output(promptTemplate, textInput, outputFormat);

    // Validate and process questions
    if (!Array.isArray(questions)) {
      throw new Error("Invalid question format received from AI");
    }

    // Validate each question
    questions = questions.map((q) => {
      // Ensure all required fields are present
      if (!q.question || !q.answer || !q.option1 || !q.option2 || !q.option3 || (numOfChoices === 4 && !q.option4)) {
        throw new Error("Invalid question format: missing required fields");
      }

      // Get all options for this question
      const options = [q.option1, q.option2, q.option3];
      if (numOfChoices === 4) {
        options.push(q.option4);
      }

      // Validate answer is in options
      if (!options.includes(q.answer)) {
        // Set first option as answer if answer isn't in options
        q.answer = q.option1;
      }

      return q;
    });

    // Limit to requested number of questions
    if (questions.length > numOfQuestions) {
      questions = questions.slice(0, numOfQuestions);
    }

    // Generate a quiz ID (you might want to store this in a database)
    const quizId = Date.now().toString();

    return NextResponse.json({
      quizId,
      questions,
      status: 200,
    });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json({ error: "Failed to generate quiz. Please try again." }, { status: 500 });
  }
};

/*import { authOptions } from "@/lib/auth";
import { strict_output } from "@/lib/gemini";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// POST /api/questions
export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);

    
    if (!session?.user) {
      return NextResponse.json(
        {
          error: "You must be logged in to create a quiz.",
        },
        { status: 401 }
      );
    }
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
*/
