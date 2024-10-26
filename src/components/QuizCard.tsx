import React from "react";
import { Question, Quiz } from "@prisma/client";

type Props = {
  quiz: Quiz & { questions: Pick<Question, "id" | "options" | "question">[] };
};

const QuizCard = (props: Props) => {
  return <div>QuizCard</div>;
};

export default QuizCard;
