import { useRef, useState } from "react";
// import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  Html,
  useCursor,
  Text3D,
  Float,
  useTexture,
  // OrbitControls,
} from "@react-three/drei";
import Model from "../experience/clayno-ntf-model";
import { FAQ_PROMPTS } from "../constants";

type ClickableMeshProps = {
  onMeshClick: () => void;
};

const ClickableMesh = ({ onMeshClick }: ClickableMeshProps) => {
  const clickableBoxRef = useRef<THREE.Mesh | null>(null);
  const matcapTexture = useTexture(
    "/textures/7877EE_D87FC5_75D9C7_1C78C0-256px.png"
  );
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  return (
    <group scale={1.2} position={[-5.5, 2.35, 4.5]} rotation={[0, -1.7, 0]}>
      <mesh
        ref={clickableBoxRef}
        onClick={onMeshClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        position={[0, -1.5, 0.25]}
        visible={false} // Set it invisible
      >
        <boxGeometry args={[1, 1.5, 1]} />
      </mesh>
      <Model modelName="trice-idle-smug" nftId="277" />
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
  const [pageNumber, setPageNumber] = useState(0);

  const handleMeshClick = () => {
    setPopupOpen(!isPopupOpen);
  };

  return (
    <>
      <ClickableMesh onMeshClick={handleMeshClick} />
      {isPopupOpen && (
        <Html center className="w-screen flex justify-center items-center">
          <div className="flex justify-center w-full md:w-4/5 lg:w-3/5 xl:w-1/2 2xl:w-1/3 aspect-[5/6] relative">
            <img
              src="/textures/parchment.png"
              alt="Parchment"
              className="w-full"
            ></img>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 md:gap-3 rounded-xl w-3/5 text-black font-pangolin">
              {pageNumber === 0 ? (
                <>
                  <h2 className="text-lg md:text-3xl mb-0 md:mb-2 text-left text-cyan-600 font-extrabold justify-start w-full">
                    The Scroll of Enlightenment
                  </h2>
                  {FAQ_PROMPTS.map((prompt) => (
                    <div
                      key={prompt.id}
                      onClick={() => setPageNumber(prompt.id)}
                      className="cursor-pointer hover:scale-110"
                    >
                      <p className="text-sm md:text-lg text-left font-semibold justify-start">
                        {prompt.id}. {prompt.question}
                      </p>
                    </div>
                  ))}
                  <div className="flex flex-row w-full justify-end mt-2">
                    <button
                      onClick={handleMeshClick}
                      className="text-lg md:text-2xl font-bold px-4 py-1 place-self-end hover:underline underline-offset-2"
                    >
                      I'm done here
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2 md:gap-4">
                  <p className="text-sm md:text-xl text-left font-semibold justify-start">
                    {FAQ_PROMPTS[pageNumber - 1].question}
                  </p>
                  <div className="text-xs md:text-lg">
                    {FAQ_PROMPTS[pageNumber - 1].answer}
                  </div>

                  <div className="flex flex-row w-full justify-between mt-0 md:mt-4">
                    <button onClick={() => setPageNumber(0)}>
                      <img
                        src="/icons/back-arrow.svg"
                        alt="Go back"
                        width={32}
                        height={32}
                        className="hover:scale-110"
                      />
                    </button>
                    <button
                      onClick={() => {
                        setPageNumber(0);
                        handleMeshClick();
                      }}
                      className="font-bold text-lg md:text-xl px-4 py-1 hover:underline underline-offset-2"
                    >
                      I'm done here
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Html>
      )}
    </>
  );
};

export default InfoMystic;
