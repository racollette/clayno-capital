// import Experience from "./Experience/Experience"
import { Canvas } from "@react-three/fiber";
import Experience1 from "./experience/experience";

function App() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 10], fov: 30 }}>
      <color attach="background" args={["black"]} />
      <Experience1 />;
    </Canvas>
  );
}

export default App;
