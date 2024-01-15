import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Html,
  useGLTF,
  useCursor,
  Text3D,
  Float,
  useMatcapTexture,
} from "@react-three/drei";
import Model from "../experience/clayno-ntf-model";

const ClickableMesh = () => {
  const groupRef = useRef<THREE.Group | null>(null);
  const trident = useGLTF("./models/trident.glb");
  const [matcapTexture] = useMatcapTexture("A27216_E9D036_D0AB24_DCB927", 256);

  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  // Update the mesh rotation in the animation loop

  const handleClick = (event) => {
    console.log("clicked");
  };

  return (
    <group
      ref={groupRef}
      scale={0.9}
      position={[-1.7, 2.4, 1.35]}
      rotation={[0, 0.2, 0]}
      onClick={handleClick}
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
  return (
    <>
      {/* <ambientLight intensity={0.5} /> */}
      {/* <pointLight position={[5, 5, 5]} /> */}

      {/* Your 3D scene components go here */}
      <ClickableMesh />

      {/* Drei Html component for pop-up window */}
      {/* <Html>
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            padding: 10,
            background: "white",
          }}
        >
          Pop-up window content
        </div>
      </Html> */}
    </>
  );
};

export default GuardRex;
