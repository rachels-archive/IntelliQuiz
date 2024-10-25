import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prisma from "@/lib/db";
import axios from "axios";
import { NextResponse } from "next/server";

// POST /api/quiz
export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "You must be logged in with a valid user ID.",
        },
        { status: 401 }
      );
    }

    console.log("Session User ID:", session.user.id);

    const body = await req.json();
    const { title, inputType, textInput, numOfQuestions, numOfChoices } = body;

    // Validate input
    if (!title || !inputType || (inputType === "text" && !textInput)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const quiz = await prisma.quiz.create({
      data: {
        timeStarted: new Date(),
        timeEnded: new Date(),
        userId: session.user.id, // Ensure this is a valid number
      },
    });

    const apiUrl = process.env.API_URL || "https://localhost:3000"; // Use HTTPS

    const { data } = await axios.post(`${apiUrl}/api/questions`, {
      title,
      inputType,
      textInput,
      numOfQuestions,
      numOfChoices,
    });

    // Validate response data
    if (!data || !data.questions || !Array.isArray(data.questions)) {
      throw new Error("Invalid response from /api/questions endpoint");
    }

    interface McqQuestion {
      question: string;
      answer: string;
      option1: string;
      option2: string;
      option3: string;
      option4?: string; // Optional property for when numOfChoices is 4
    }

    let quizData = data.questions.map((question: McqQuestion) => {
      let options = [
        question.answer,
        ...Object.values(question).filter((value) => value !== question.question && value !== question.answer),
      ];

      // Ensure options are shuffled to maintain randomness
      options = shuffleArray(options);

      return {
        question: question.question,
        answer: question.answer,
        options: JSON.stringify(options),
        quizId: quiz.id,
      };
    });

    const shuffleArray = (array: string[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    try {
      // Create questions in the database
      await prisma.question.createMany({
        data: quizData,
      });
    } catch (error) {
      console.error("Error creating questions in database:", error);
      throw error;
    }

    return NextResponse.json({ quizId: quiz.id, questions: quizData }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving quiz:", error);

    return NextResponse.json({ error: "Failed to retrieve quiz" }, { status: 500 });
  }
};
