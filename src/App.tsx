// import Experience from "./Experience/Experience"
import { Canvas } from "@react-three/fiber";
import Experience1 from "./experience/experience";
import { Suspense } from "react";
import { Loader } from "@react-three/drei";

function App() {
  return (
    <>
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 30 }}>
        <color attach="background" args={["black"]} />
        <Suspense fallback={null}>
          <Experience1 />
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
}

export default App;
