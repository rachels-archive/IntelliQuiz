import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Progress } from "./ui/progress";

type Props = {
  finished: Boolean;
  onLoadingComplete?: () => void; // Add callback prop
};

const LoadingQuestions = ({ finished, onLoadingComplete }: Props) => {
  const [progress, setProgress] = useState<number>(10);
  const loadingText = "We are generating your questions, thank you for your patience....";

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!finished) {
      // Using a logarithmic progression for more natural loading feel
      interval = setInterval(() => {
        setProgress((prev) => {
          // Slower as it gets closer to target
          const remainingProgress = 75 - prev;
          const increment = Math.max(
            0.1, // Minimum increment
            remainingProgress * 0.05 + Math.random() * 0.5 // Random factor for natural feel
          );

          // Ensure we don't exceed our target
          return Math.min(prev + increment, 75);
        });
      }, 100);
    } else {
      // Smooth completion when finished
      interval = setInterval(() => {
        setProgress((prev) => {
          const remainingProgress = 100 - prev;
          const increment = Math.max(1, remainingProgress * 0.1);
          const newProgress = Math.min(prev + increment, 100);

          // If we've reached 100%, notify parent component
          if (newProgress === 100) {
            clearInterval(interval);
            onLoadingComplete?.();
          }

          return newProgress;
        });
      }, 50);
    }

    /*
      setProgress((prev) => {
        if (finished) return 100;
        if (prev === 100) {
          return 0;
        }
        if (Math.random() < 0.1) {
          return prev + 2;
        }
        return prev + 0.5;
      });
    }, 100);
     */
    return () => clearInterval(interval);
  }, [finished]);

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-[70vw] md:w-[60vw] flex flex-col items-center">
      <Image src={"/images/loading.png"} width={250} height={250} alt="loading" />
      <Progress value={progress} className="w-full mt-4" />
      <h1 className="mt-2 text-xl">{loadingText}</h1>
    </div>
  );
};

export default LoadingQuestions;
