import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Award, Trophy } from "lucide-react";

type Props = {
  score: number;
};

const ResultsCard = ({ score }: Props) => {
  return (
    <Card className="md:col-span-7">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-2xl font-bold">Results</CardTitle>
        <Award />
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-3/5">
        {score > 74 ? (
          <>
            <Trophy className="mr-4" stroke="gold" size={50} />
            <div className="flex flex-col text-2xl font-semibold text-yellow-400">
              <span>Impressive!</span>
              <span className="text-sm text-center text-black opacity-50">{"> 75% accuracy"}</span>
            </div>
          </>
        ) : score > 49 ? (
          <>
            <Trophy className="mr-4" stroke="silver" size={50} />
            <div className="flex flex-col text-2xl font-semibold text-gray-400">
              <span>Good Job!</span>
              <span className="text-sm text-center text-black opacity-50">{"> 50% accuracy"}</span>
            </div>
          </>
        ) : (
          <>
            <Trophy className="mr-4" color="#cd7f32" size={50} />
            <div className="flex flex-col text-2xl font-semibold text-[#cd7f32]">
              <span>Keep Trying!</span>
              <span className="text-sm text-center text-black opacity-50">{"< 50% accuracy"}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultsCard;
