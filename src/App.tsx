// import Experience from "./Experience/Experience"
import { Canvas } from "@react-three/fiber";
import Experience1 from "./experience/experience";
import { Suspense, useState } from "react";
// import { Loader } from "@react-three/drei";
import { LoadingScreen } from "./components/LoadingScreen";

function App() {
  const [start, setStart] = useState(false);

  return (
    <>
      <Canvas shadows camera={{ position: [-7, 12, 27.5], fov: 30 }}>
        <color attach="background" args={["black"]} />
        <Suspense fallback={null}>
          <Experience1 />
          {/* <Preload all /> */}
        </Suspense>
      </Canvas>
      {/* <Loader /> */}
      <LoadingScreen started={start} startExperience={() => setStart(true)} />
    </>
  );
}

export default App;
