import { useRef, useState } from "react";
// import { useFrame } from "@react-three/fiber";
import {
  Html,
  useCursor,
  Text3D,
  Float,
  useMatcapTexture,
} from "@react-three/drei";
import Model from "../experience/clayno-ntf-model";

type ClickableMeshProps = {
  onMeshClick: () => void;
};

const ClickableMesh = ({ onMeshClick }: ClickableMeshProps) => {
  const groupRef = useRef<THREE.Group | null>(null);
  const [matcapTexture] = useMatcapTexture("7877EE_D87FC5_75D9C7_1C78C0", 256);

  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  return (
    <group
      ref={groupRef}
      onClick={onMeshClick}
      scale={1.2}
      position={[-6, 2.4, 5.35]}
      rotation={[0, -1.7, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Model modelName="trice-idle-bored" nftId="277" />
      {/* <primitive
        object={trident.scene}
        position={[0.39, -1.51, 0.13]}
        rotation={[1.51, 0.32, -0.7]}
      /> */}
      <Float
        speed={5} // Animation speed, defaults to 1
        rotationIntensity={0.5} // XYZ rotation intensity, defaults to 1
        floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
        floatingRange={[0, 0.1]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
      >
        <Text3D
          position={[-0.2, -1.2, 0.2]}
          rotation={[0, 0.8, 0]}
          font="./fonts/Titan_One_Regular.json"
          scale={0.35}
        >
          i
          <meshMatcapMaterial matcap={matcapTexture} />
        </Text3D>
      </Float>
    </group>
  );
};

const InfoMystic = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);

  const handleMeshClick = () => {
    setPopupOpen(!isPopupOpen);
  };

  return (
    <>
      {/* <ambientLight intensity={0.5} /> */}
      {/* <pointLight position={[5, 5, 5]} /> */}

      {/* Your 3D scene components go here */}
      <ClickableMesh onMeshClick={handleMeshClick} />

      {/* Drei Html component for pop-up window */}
      {isPopupOpen && (
        <Html center>
          <div className="flex flex-col gap-4 p-4 rounded-xl bg-zinc-900 w-[500px] text-white border-2 border-indigo-500">
            <h2 className="text-xl text-left text-indigo-400/90 font-extrabold justify-start w-full">
              Frequently Asked Questions
            </h2>
            <p className="text-md text-left font-semibold justify-start border-2 border-indigo-500 p-3 rounded-lg">
              What are the benefits of being in Clayno Capital?
            </p>
            <p className="text-md text-left font-semibold justify-start border-2 border-indigo-500 p-3 rounded-lg">
              Who are the other members?
            </p>
            <p className="text-md text-left font-semibold justify-start border-2 border-indigo-500 p-3 rounded-lg">
              How do I join?
            </p>
            <p className="text-md text-left font-semibold justify-start border-2 border-indigo-500 p-3 rounded-lg">
              What else does Clayno Capital do?
            </p>
            <p className="text-md text-left font-semibold justify-start border-2 border-indigo-500 p-3 rounded-lg">
              How can I contact the Capital?
            </p>
            <div className="flex flex-row w-full justify-end mt-2">
              <button
                onClick={handleMeshClick}
                className="bg-indigo-600 rounded-lg font-bold px-4 py-1 place-self-end border-2 border-indigo-600 hover:border-indigo-400"
              >
                I'm done here
              </button>
            </div>
          </div>
        </Html>
      )}
    </>
  );
};

export default InfoMystic;
