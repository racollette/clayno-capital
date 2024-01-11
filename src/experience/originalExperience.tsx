// import { Canvas } from "@react-three/fiber";
// import {
//   Environment,
//   Float,
//   Text,
//   OrbitControls,
//   // ContactShadows,
//   // MeshReflectorMaterial,
//   // PerspectiveCamera,
// } from "@react-three/drei";
// import Model from "./clayno-ntf-model";
// import { useControls } from "leva";
// // import Pose from "./Pose";
// import { Perf } from "r3f-perf";

// export default function Experience() {
//   const { position } = useControls({
//     position: {
//       value: { x: 3, y: -2 },
//       step: 0.01,
//       joystick: "invertY",
//     },
//   });

//   const { perfVisible } = useControls({
//     perfVisible: false,
//   });

//   return (
//     <Canvas>
//       {perfVisible && <Perf position="top-left" />}

//       <Environment
//         background
//         files="./environments/Dreamlike_hdri-hdr_a_medieval_style_castle_1329746997_9832466.hdr"
//         // ground={{
//         //   height: 1,
//         // }}
//       />

//       <group position-x={2} position-z={2}>
//         <Model modelName="rex-walk-happy" nftId="6721" />
//       </group>
//       <group position-x={0} position-z={0}>
//         <Model modelName="bronto-trot-excited" nftId="792" />
//       </group>
//       {/* <group position-x={1} position-z={0}>
//       <Model modelName="ankylo-walk-happy" nftId="200" />
//     </group> */}
//       <group position-x={0} position-z={1}>
//         <Model modelName="raptor-walk-confident" nftId="7824" />
//       </group>
//       <group position-x={1} position-z={1}>
//         <Model modelName="trice-gallop-happy" nftId="511" />
//       </group>
//       {/* <group position-x={2} position-z={1}>
//       <Model modelName="stego-idle-smug" nftId="3910" />
//     </group> */}

//       {/* <mesh position={[position.x, position.y, 0]}>
//       <boxGeometry />
//       <meshStandardMaterial color="cyan" />
//     </mesh> */}

//       {/* <mesh rotation-x={-Math.PI * 0.5} scale={10} position-y={-2}>
//       <planeGeometry />
//       <meshStandardMaterial color="greenyellow" />

//       <MeshReflectorMaterial
//         resolution={512}
//         blur={[1000, 1000]}
//         mixBlur={1}
//         mirror={0.75}
//         color="greenyellow"
//       />
//     </mesh> */}

//       {/* <Pose nftId="818" /> */}
//       <Float speed={3} floatIntensity={2}>
//         <Text fontSize={0.5} color="black">
//           Clayno Capital
//         </Text>
//       </Float>

//       <OrbitControls />
//       <spotLight
//         color={"#ffffff"}
//         intensity={550}
//         position={[5, 6, 7.5]}
//         castShadow
//         angle={0.371}
//         receiveShadow
//         penumbra={0.5}
//         frustumCulled
//         visible
//         distance={0}
//         decay={2}
//       />
//       <ambientLight
//         color={"#BB4B3C"}
//         intensity={20}
//         position={[0, 0, 0]}
//         visible
//         frustumCulled
//       />
//       {/* <ContactShadows /> */}
//     </Canvas>
//   );
// }
