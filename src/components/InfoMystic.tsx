import { useRef, useState } from "react";
// import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  Html,
  useCursor,
  Text3D,
  Float,
  useMatcapTexture,
  // useTexture,
  useGLTF,
  // OrbitControls,
} from "@react-three/drei";
import Model from "../experience/clayno-ntf-model";
import { useThree } from "@react-three/fiber";

type ClickableMeshProps = {
  onMeshClick: (event: any) => void;
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
      position={[-5, 2.35, 4.5]}
      rotation={[0, -1.7, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Model modelName="trice-idle-smug" nftId="277" />
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

const InfoMystic = ({
  controlsEnabled,
  setControlsEnabled,
}: {
  controlsEnabled: boolean;
  setControlsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const mapRef = useRef<THREE.Group | null>(null);
  const { camera } = useThree();
  console.log(camera);
  // const [popupPosition, setPopupPosition] = useState({ x: 6, y: 3, z: 2 });
  const [isPopupOpen, setPopupOpen] = useState(false);

  // const handleMeshClick = () => {
  //   setPopupOpen(!isPopupOpen);
  // };

  const map = useGLTF("./models/map.glb");

  const handleMeshClick = () => {
    // Convert the world coordinates to screen coordinates
    // const screenPosition = new THREE.Vector3();
    // screenPosition.copy(event.object.position);
    // screenPosition.project(camera);

    // // Map the screen coordinates to the 2D space ([-1,1] to [0,1])
    // const xCoord = (screenPosition.x + 1) / 2;
    // const yCoord = (-screenPosition.y + 1) / 2;

    // // Set the position of the plane in the center of the screen
    // setPopupPosition({ x: xCoord, y: yCoord, z: 0 });
    camera.position.set(-7.5, 8, 24);
    setControlsEnabled(!controlsEnabled);
    // camera.lookAt(
    //   mapRef.current?.position.x,
    //   mapRef.current?.position.y,
    //   mapRef.current?.position.z
    // );
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
        <group
          ref={mapRef}
          position={[-2, 6, 12]}
          rotation={[Math.PI / 2, Math.PI, 0]}
          scale={1}
        >
          {/* <mesh geometry={(map.scene.children[0] as THREE.Mesh).geometry}>
            <boxGeometry args={[100, 100]} />
            <meshBasicMaterial color="orange" />
          </mesh> */}
          <primitive object={map.scene} />
          <Html position={[2, 0, -2]} rotation={[2, 0, 0]}>
            <div className="flex flex-col gap-4 p-4 rounded-xl w-11/12 md:w-[500px] text-white">
              <h2 className="text-xl text-left text-sky-500 font-extrabold justify-start w-full">
                Frequently Asked Questions
              </h2>
              <p className="text-md text-left font-semibold justify-start border-2 border-sky-500 p-3 rounded-lg">
                What are the benefits of being in Clayno Capital?
              </p>
              <p className="text-md text-left font-semibold justify-start border-2 border-sky-500 p-3 rounded-lg">
                Who are the other members?
              </p>
              <p className="text-md text-left font-semibold justify-start border-2 border-sky-500 p-3 rounded-lg">
                How do I join?
              </p>
              <p className="text-md text-left font-semibold justify-start border-2 border-sky-500 p-3 rounded-lg">
                What else does Clayno Capital do?
              </p>
              <p className="text-md text-left font-semibold justify-start border-2 border-sky-500 p-3 rounded-lg">
                How can I contact the Capital?
              </p>
              <div className="flex flex-row w-full justify-end mt-2">
                <button
                  onClick={handleMeshClick}
                  className="bg-sky-600 rounded-lg font-bold px-4 py-1 place-self-end border-2 border-sky-600 hover:border-sky-400"
                >
                  I'm done here
                </button>
              </div>
            </div>
          </Html>
        </group>
      )}
    </>
  );
};

export default InfoMystic;
