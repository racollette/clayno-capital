import { useRef } from "react";
// import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Model from "../experience/clayno-ntf-model";
import { useFrame } from "@react-three/fiber";

const FlyingDactyl = () => {
  const dactylRef = useRef<THREE.Group | null>(null);

  const radius = 6;
  const speed = 1;
  const timeRef = useRef(0);
  const center = new THREE.Vector3(1, 5, -3);

  useFrame((_state, delta) => {
    timeRef.current += delta;

    if (dactylRef.current) {
      // Calculate new positions for stego and ankylo
      const x = radius * Math.cos(speed * timeRef.current) + radius / 2 - 5;
      const y = (radius * Math.cos(timeRef.current)) / 2 + 7;
      const z = radius * Math.sin(speed * timeRef.current) + radius / 2 - 4;

      // Set the new positions for stego
      dactylRef.current.position.x = x;
      dactylRef.current.position.y = y;
      dactylRef.current.position.z = z;
      // dactylRef.current.position.y = stegoTransform.y;
      dactylRef.current.lookAt(center);
    }
  });

  return (
    <>
      <group
        ref={dactylRef}
        scale={1}
        position={[0, 7, 0]}
        rotation={[0, 0, 0]}
      >
        <Model modelName="dactyl-soar-confident" nftId="10147" />
      </group>
      {/* <mesh position={[-1, 5, -3]}>
        <boxGeometry />
        <meshBasicMaterial color="red" />
      </mesh>
      <mesh position={[2, 6, 3]}>
        <sphereGeometry />
        <meshBasicMaterial color="green" />
      </mesh> */}
    </>
  );
};

export default FlyingDactyl;
