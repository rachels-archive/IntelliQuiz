import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Target } from "lucide-react";

type Props = {
  score: number;
};

const ScoreCard = ({ score }: Props) => {
  return (
    <Card className="md:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-2xl font-bold">Latest Score</CardTitle>
        <Target />
      </CardHeader>
      <CardContent>
        <div className="text-sm font-medium">{score.toString() + "%"}</div>
      </CardContent>
    </Card>
  );
};

export default ScoreCard;
