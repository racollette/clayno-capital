import { useProgress } from "@react-three/drei";
import { TOTAL_FILES } from "../constants";
import { useEffect, useState } from "react";

export const LoadingScreen = ({
  started,
  startExperience,
}: {
  started: boolean;
  startExperience: () => void;
}) => {
  const [showExperience, setShowExperience] = useState(false);
  const { loaded } = useProgress();

  // const { active, progress, errors, item, loaded, total } = useProgress();
  // console.log("active", active);
  // console.log("progress", progress);
  // console.log("errors", errors);
  // console.log("item", item);
  // console.log("loaded", loaded);
  // console.log("total", total);

  const loadingProgress = (loaded / TOTAL_FILES) * 100;

  useEffect(() => {
    if (loadingProgress >= 100) {
      startExperience();
      setTimeout(() => {
        setShowExperience(true);
      }, 5000);
    }
  }, [loadingProgress]);

  return (
    <div
      className={`fixed top-0 left-0 bottom-0 right-0 bg-inherit flex items-center justify-center transition-opacity duration-[5000ms] ${
        started && `opacity-0`
      } ${showExperience && `hidden`}`}
    >
      <div className="flex flex-col justify-center items-center gap-3 md:gap-6 w-full mx-8 md:mx-0">
        <div className="text-xl md:text-3xl font-extrabold font-pangolin text-white">
          Journeying to The Capital...
        </div>
        <div className="relative flex items-center justify-center p-4 border-4 border-amber-600 w-full md:w-1/3 h-[45px] rounded-xl overflow-clip">
          <div
            className="absolute left-0 top-0 h-full bg-amber-400/80"
            style={{
              width: `${loadingProgress.toFixed(0)}%`,
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-pangolin text-xl text-white font-extrabold">
            {loadingProgress.toFixed(0)}%
          </div>
        </div>
      </div>
    </div>
  );
};
