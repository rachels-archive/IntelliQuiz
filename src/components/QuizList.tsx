"use client";
import React, { useMemo, useState } from "react";
import { Question, Quiz } from "@prisma/client";
import { ChevronRightIcon, Timer } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

type Props = {
  quiz: Quiz & { questions: Pick<Question, "id" | "options" | "question">[] };
};

const QuizList = ({ quiz }: Props) => {
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedChoice, setSelectedChoice] = useState<number>(0);

  const currentQuestion = useMemo(() => {
    return quiz.questions[questionIndex];
  }, [questionIndex, quiz.questions]);

  const options = useMemo(() => {
    if (!currentQuestion || !currentQuestion.options) {
      return [];
    }
    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw] top-1/2 left-1/2">
      <div className="flex flex-row justify-between">
        <p>
          <span className="text-slate-400">Title</span> &nbsp;
          <span className="px-2 py-1 text-white rounded-lg bg-slate-800">{quiz.title}</span>
        </p>
        <div className="flex self-start mt-3 text-slate-400">
          <Timer className="mr-2" />
          <span>00:00</span>
        </div>
      </div>
      {/*TODO: COUNTER */}
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
        {options.map((option, index) => {
          return (
            <Button
              variant={selectedChoice === index ? "default" : "secondary"}
              onClick={() => setSelectedChoice(index)}
              className="justify-start w-full py-8 mb-4"
              key={index}
            >
              <div className="flex items-center justify-start">
                <div className="p-2 px-3 mr-5 border rounded-md">{index + 1}</div>
                <div className="text-start">{option}</div>
              </div>
            </Button>
          );
        })}
        <div className="w-full flex justify-end">
          <Button className="py-2 px-5">
            Next
            <ChevronRightIcon className="ml-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizList;
