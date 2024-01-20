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
  const clickableBoxRef = useRef<THREE.Mesh | null>(null);
  const trident = useGLTF("./models/trident.glb");
  const [matcapTexture] = useMatcapTexture("A27216_E9D036_D0AB24_DCB927", 256);

  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  return (
    <group scale={0.9} position={[-1.7, 2.5, 1.35]} rotation={[0, 0.2, 0]}>
      <mesh
        ref={clickableBoxRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onMeshClick}
        position={[0, -1, 0.5]}
        visible={false} // Set it invisible
      >
        <boxGeometry args={[1, 2.5, 1]} />
      </mesh>
      <Model modelName="rex-idle-confident" nftId="3495" />
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
      <ClickableMesh onMeshClick={handleMeshClick} />

      {isPopupOpen && (
        <Html center className="w-screen flex justify-center items-center">
          <div className="flex justify-center w-full md:w-2/5 xl:w-1/3 aspect-[5/6] relative">
            <img
              src="/textures/parchment.png"
              alt="Parchment"
              className="w-full"
            ></img>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-3 rounded-xl w-3/5 text-black font-grape tracking-wider">
              <h2 className="text-2xl md:text-4xl text-left text-amber-600 font-extrabold justify-start w-full">
                Enter the Capital
              </h2>

              <p className="text-sm md:text-xl font-semibold justify-start">
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
              <p className="text-sm md:text-xl justify-start">
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
              <p className="text-sm md:text-xl justify-start">
                If you need more information, our elder mystic may have the
                answers you seek.
              </p>
              <p className="text-sm md:text-xl justify-start font-extrabold">
                Now go forth and collect, then return when you are ready.
              </p>
              <div className="flex flex-row w-full justify-end">
                <button
                  onClick={handleMeshClick}
                  className="text-xl md:text-3xl font-extrabold px-2 py-1 flex items-center justify-center hover:underline underline-offset-2"
                >
                  I accept
                </button>
              </div>
            </div>
          </div>
        </Html>
      )}
    </>
  );
};

export default GuardRex;
