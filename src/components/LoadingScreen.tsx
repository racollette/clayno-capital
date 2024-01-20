import { useProgress } from "@react-three/drei";

export const LoadingScreen = () => {
  const { active, progress, errors, item, loaded, total } = useProgress();

  console.log("active", active);
  console.log("progress", progress);
  console.log("errors", errors);
  console.log("item", item);
  console.log("loaded", loaded);
  console.log("total", total);

  return (
    <div>
      <div>
        <div
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
      <div>
        <h1>Please help me!</h1>
        <button
          disabled={progress < 100}
          //   onClick={onStarted}
        >
          Start
        </button>
      </div>
    </div>
  );
};
