import { useRef, useState } from "react";
// import { useFrame } from "@react-three/fiber";
import {
  Html,
  useGLTF,
  useCursor,
  Text3D,
  Float,
  useMatcapTexture,
} from "@react-three/drei";
import Model from "../experience/clayno-ntf-model";

const ClickableMesh = ({ onMeshClick }: { onMeshClick: () => void }) => {
  const groupRef = useRef<THREE.Group | null>(null);
  const trident = useGLTF("./models/trident.glb");
  const [matcapTexture] = useMatcapTexture("A27216_E9D036_D0AB24_DCB927", 256);

  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  return (
    <group
      ref={groupRef}
      onClick={onMeshClick}
      scale={0.9}
      position={[-1.7, 2.4, 1.35]}
      rotation={[0, 0.2, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Model modelName="rex-idle-confident" nftId="6069" />
      <primitive
        object={trident.scene}
        position={[0.39, -1.51, 0.13]}
        rotation={[1.51, 0.32, -0.7]}
      />
      <Float
        speed={5} // Animation speed, defaults to 1
        rotationIntensity={0.5} // XYZ rotation intensity, defaults to 1
        floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
        floatingRange={[0, 0.1]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
      >
        <Text3D
          position={[0.1, -0.7, 0.5]}
          rotation={[0, 0.8, 0]}
          font="./fonts/Titan_One_Regular.json"
          scale={0.35}
        >
          !{/* <meshBasicMaterial color="yellow" /> */}
          <meshMatcapMaterial matcap={matcapTexture} />
        </Text3D>
      </Float>
    </group>
  );
};

const GuardRex = () => {
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
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-zinc-900 w-11/12 md:w-[400px] text-white border-2 border-amber-500">
            <h2 className="text-xl text-left text-amber-500 font-extrabold justify-start w-full">
              Enter the Capital
            </h2>
            <p className="text-md text-left justify-start font-extrabold">
              Rawrrr!! Welcome to the Capital.
            </p>
            <p className="text-md justify-start">
              The Capital is home to some of the finest{" "}
              <b>
                <a
                  className="text-sky-500"
                  target="_blank"
                  href="https://claynosaurz.com/"
                >
                  Claynosaurz{" "}
                </a>
              </b>
              collectors.
            </p>
            <p className="text-md justify-start">
              I cannot permit you to enter without at least{" "}
              <b>
                25{" "}
                <a
                  className="text-sky-500"
                  href="https://www.tensor.trade/trade/claynosaurz"
                  target="_blank"
                >
                  OG Claynosaurz
                </a>
              </b>{" "}
              or <b>1 Ancient</b> in your possession.
            </p>
            <p className="text-md justify-start">
              If you need more information, our elder mystic may have the
              answers you seek.
            </p>
            <p className="text-md justify-start font-extrabold">
              Now go forth and collect, then return when you are ready.
            </p>

            <div className="flex flex-row w-full justify-end mt-2">
              <button
                onClick={handleMeshClick}
                className="bg-amber-600/80 rounded-lg text-lg font-extrabold px-4 py-1 place-self-end border-2 border-amber-600/80 hover:border-amber-500"
              >
                I accept
              </button>
            </div>
          </div>
        </Html>
      )}
    </>
  );
};

export default GuardRex;
