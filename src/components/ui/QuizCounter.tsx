import React from "react";
import { Card } from "./card";
import { CheckCircle2Icon, XCircle } from "lucide-react";

type Props = {
  correctAnswers: number;
  wrongAnsers: number;
};

const QuizCounter = ({ correctAnswers, wrongAnsers }: Props) => {
  return (
    <Card className="flex flex-row items-center justify-center p-2">
      <CheckCircle2Icon color="green" size={30} />
      <span className="mx-2 text-2xl text-green mr-5">{correctAnswers}</span>
      <XCircle color="red" size={30} />
      <span className="mx-2 text-2xl text-red">{wrongAnsers}</span>
    </Card>
  );
};

export default QuizCounter;
