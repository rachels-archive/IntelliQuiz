"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Question, Quiz } from "@prisma/client";
import { ChevronRightIcon, Timer, BarChart } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card"; // Assuming these are your custom components
import { Button, buttonVariants } from "./ui/button"; // Assuming this is your custom button component
import QuizCounter from "./ui/QuizCounter"; // Custom component for showing quiz stats
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { differenceInSeconds } from "date-fns";
import { cn, formatTimeDelta } from "@/lib/utils";

import Link from "next/link";

interface CheckAnswerPayload {
  questionId: string;
  userAnswer: string;
}

type Props = {
  quiz: Quiz & { questions: Pick<Question, "id" | "options" | "question">[] };
};

const QuizList = ({ quiz }: Props) => {
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedChoice, setSelectedChoice] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasEnded, setHasEnded] = useState<boolean>(false);
  const [startTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [finalTime, setFinalTime] = useState<number>(0);
  const [now, setNow] = useState<Date>(new Date());

  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasEnded) {
        setNow(new Date());
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [hasEnded]);

  // Update timer every second while quiz is active
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!hasEnded) {
      timer = setInterval(() => {
        setElapsedTime(differenceInSeconds(new Date(), startTime));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [startTime, hasEnded]);

  const currentQuestion = useMemo(() => {
    return quiz.questions[questionIndex];
  }, [questionIndex, quiz.questions]);

  const options = useMemo(() => {
    if (!currentQuestion || !currentQuestion.options) {
      return [];
    }
    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

  const checkAnswer = async (payload: CheckAnswerPayload) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/checkAnswer", payload);
      return response.data; // Expecting { isCorrect: boolean }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = useCallback(async () => {
    if (!currentQuestion) return;

    const payload = {
      questionId: currentQuestion.id,
      userAnswer: options[selectedChoice],
    };

    try {
      const result = await checkAnswer(payload);
      if (result.isCorrect) {
        setCorrectAnswers((prev) => prev + 1);
        toast({
          title: "Correct",
          description: "Good job!",
          variant: "success",
          duration: 1500,
        });
      } else {
        setWrongAnswers((prev) => prev + 1);
        toast({
          title: "Wrong",
          description: "Don't give up!",
          variant: "destructive",
          duration: 1500,
        });
      }

      /*
      if (questionIndex < quiz.questions.length - 1) {
        setQuestionIndex((prev) => prev + 1);
        setSelectedChoice(0); // Reset selected choice for next question
        setHasEnded(true);
        return;
      }*/

      if (questionIndex === quiz.questions.length - 1) {
        // Save the final time when quiz ends
        setFinalTime(differenceInSeconds(new Date(), startTime));
        setHasEnded(true);
      } else {
        setQuestionIndex((prev) => prev + 1);
        setSelectedChoice(0);
      }
    } catch (error) {
      console.error("Failed to check answer:", error);
      toast({
        title: "Error",
        description: "There was an issue checking your answer.",
        variant: "destructive",
      });
    }
  }, [currentQuestion, questionIndex, selectedChoice, options, quiz.questions.length, startTime]);

  if (hasEnded) {
    return (
      <div className="absolute flex flex-col justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <div className="px-4 py-2 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
          You Completed in {formatTimeDelta(differenceInSeconds(now, quiz.timeStarted))}
        </div>
        <Link href={`/statistics/${quiz.id}`} className={cn(buttonVariants({ size: "lg" }), "mt-2")}>
          View Statistics
          <BarChart className="w-4 h-4 ml-2" />
        </Link>
      </div>
    );
  }

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw] top-1/2 left-1/2">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <p>
            <span className="text-slate-400">Title</span> &nbsp;
            <span className="px-2 py-1 text-white rounded-lg bg-slate-800">{quiz.title}</span>
          </p>
          <div className="flex self-start mt-3 text-slate-400">
            <Timer className="mr-2" />
            <span>{formatTimeDelta(differenceInSeconds(now, quiz.timeStarted))}</span>
          </div>
        </div>
        <QuizCounter correctAnswers={correctAnswers} wrongAnswers={wrongAnswers} />
      </div>
      <Card className="w-full mt-4">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50">
            <div>{questionIndex + 1}</div>
            <div className="text-base text-slate-400">{quiz.questions.length}</div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg">{currentQuestion.question}</CardDescription>
        </CardHeader>
      </Card>
      <div className="flex flex-col items-center justify-center w-full mt-4">
        {options.map((option, index) => (
          <Button
            key={index}
            variant={selectedChoice === index ? "default" : "secondary"}
            onClick={() => setSelectedChoice(index)}
            className="justify-start w-full py-8 mb-4"
          >
            <div className="flex items-center justify-start">
              <div className="p-2 px-3 mr-5 border rounded-md">{index + 1}</div>
              <div className="text-start">{option}</div>
            </div>
          </Button>
        ))}
        <div className="w-full flex justify-end">
          <Button
            className={`py-2 px-5 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isLoading}
            onClick={handleNext}
          >
            Next
            <ChevronRightIcon className="ml-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizList;
