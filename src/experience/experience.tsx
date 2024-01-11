import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Environment,
  // MeshPortalMaterial,
  // Float,
  // useMatcapTexture,
  // Center,
  // Text3D,
  // Text,
  OrbitControls,
  // PerspectiveCamera,
  // RoundedBox,
  // ContactShadows,
  // MeshReflectorMaterial,
  // PerspectiveCamera,
  useGLTF,
  useTexture,
  // PresentationControls,
} from "@react-three/drei";
// import { useControls } from "leva";
// import { Perf } from "r3f-perf";
import * as THREE from "three";
// import Model from "./clayno-ntf-model";

// const Moat = () => {
//   return (
//     <mesh position={[0, -1, 0]}>
//       <sphereGeometry args={[6, 32, 32]} />
//       <meshStandardMaterial color="blue" />
//     </mesh>
//   );
// };

// const Castle = () => {
//   return (
//     <mesh position={[0, 0, 0]}>
//       <boxGeometry args={[3, 3, 3]} />
//       <meshStandardMaterial color="gray" />
//     </mesh>
//   );
// };

// const Portcullis = () => {
//   return (
//     <mesh position={[0, -1.5, 1.5]}>
//       <boxGeometry args={[2.5, 2, 0.1]} />
//       <meshStandardMaterial color="darkgray" />
//     </mesh>
//   );
// };

// const CustomBridge = () => {
//   const curve = new THREE.Shape();
//   curve.moveTo(-5, 0);
//   curve.quadraticCurveTo(0, 2, 2, 0); // Example quadratic curve

//   const extrudeSettings = {
//     steps: 100,
//     bevelEnabled: false,
//     depth: 1, // Depth of the bridge
//   };

//   const geometry = new THREE.ExtrudeGeometry(curve, extrudeSettings);

//   return (
//     <mesh position={[0, -1, 0]}>
//       <bufferGeometry attach="geometry" {...geometry} />
//       <meshStandardMaterial color="orange" />
//     </mesh>
//   );
// };

const waterMaterial = {
  vertexShader: `uniform float uTime;
  uniform float uBigWavesElevation;
  uniform vec2 uBigWavesFrequency;
  uniform float uBigWavesSpeed;
  
  uniform float uSmallWavesElevation;
  uniform float uSmallWavesFrequency;
  uniform float uSmallWavesSpeed;
  uniform float uSmallIterations;
  
  varying float vElevation;
  
  // Classic Perlin 3D Noise 
  // by Stefan Gustavson
  //
  vec4 permute(vec4 x)
  {
      return mod(((x*34.0)+1.0)*x, 289.0);
  }
  vec4 taylorInvSqrt(vec4 r)
  {
      return 1.79284291400159 - 0.85373472095314 * r;
  }
  vec3 fade(vec3 t)
  {
      return t*t*t*(t*(t*6.0-15.0)+10.0);
  }
  
  float cnoise(vec3 P)
  {
      vec3 Pi0 = floor(P); // Integer part for indexing
      vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
      Pi0 = mod(Pi0, 289.0);
      Pi1 = mod(Pi1, 289.0);
      vec3 Pf0 = fract(P); // Fractional part for interpolation
      vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
      vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
      vec4 iy = vec4(Pi0.yy, Pi1.yy);
      vec4 iz0 = Pi0.zzzz;
      vec4 iz1 = Pi1.zzzz;
  
      vec4 ixy = permute(permute(ix) + iy);
      vec4 ixy0 = permute(ixy + iz0);
      vec4 ixy1 = permute(ixy + iz1);
  
      vec4 gx0 = ixy0 / 7.0;
      vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
      gx0 = fract(gx0);
      vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
      vec4 sz0 = step(gz0, vec4(0.0));
      gx0 -= sz0 * (step(0.0, gx0) - 0.5);
      gy0 -= sz0 * (step(0.0, gy0) - 0.5);
  
      vec4 gx1 = ixy1 / 7.0;
      vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
      gx1 = fract(gx1);
      vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
      vec4 sz1 = step(gz1, vec4(0.0));
      gx1 -= sz1 * (step(0.0, gx1) - 0.5);
      gy1 -= sz1 * (step(0.0, gy1) - 0.5);
  
      vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
      vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
      vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
      vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
      vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
      vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
      vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
      vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
  
      vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
      g000 *= norm0.x;
      g010 *= norm0.y;
      g100 *= norm0.z;
      g110 *= norm0.w;
      vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
      g001 *= norm1.x;
      g011 *= norm1.y;
      g101 *= norm1.z;
      g111 *= norm1.w;
  
      float n000 = dot(g000, Pf0);
      float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
      float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
      float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
      float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
      float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
      float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
      float n111 = dot(g111, Pf1);
  
      vec3 fade_xyz = fade(Pf0);
      vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
      vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
      float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
      return 2.2 * n_xyz;
  }
  
  void main()
  {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  
      // Elevation
      float elevation = sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
                        sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) *
                        uBigWavesElevation;
  
      for(float i = 1.0; i <= uSmallIterations; i++)
      {
          elevation -= abs(cnoise(vec3(modelPosition.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) * uSmallWavesElevation / i);
      }
      
      modelPosition.y += elevation;
  
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      gl_Position = projectedPosition;
  
      vElevation = elevation;
  }`,
  fragmentShader: `uniform vec3 uDepthColor;
  uniform vec3 uSurfaceColor;
  uniform float uColorOffset;
  uniform float uColorMultiplier;
  
  varying float vElevation;
  
  void main()
  {
      float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
      vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
      
      gl_FragColor = vec4(color, 1.0);
      #include <colorspace_fragment>
  }`,
  uniforms: {
    uTime: { value: 0 },

    uBigWavesElevation: { value: 0.3 },
    uBigWavesFrequency: { value: new THREE.Vector2(0.3, 0.2) },
    uBigWavesSpeed: { value: 0.6 },

    uSmallWavesElevation: { value: 0.45 },
    uSmallWavesFrequency: { value: 0.45 },
    uSmallWavesSpeed: { value: 0.6 },
    uSmallIterations: { value: 2 },

    uDepthColor: { value: new THREE.Color("#1d7caf") },
    uSurfaceColor: { value: new THREE.Color("#66c4ff") },
    uColorOffset: { value: 0.1 },
    uColorMultiplier: { value: 1.2 },
  },
};

// Define Leva controls for the shader uniforms

export default function Experience1() {
  // const bridgeRef = useRef<THREE.Object3D | null>(null);
  // const { position } = useControls("ocean", {
  //   position: {
  //     value: { x: 0, z: 0 },
  //     step: 0.01,
  //     min: 0,
  //     max: 10,
  //     joystick: "invertY",
  //   },
  // });

  const terrain = useGLTF("./models/terrain.glb");
  const terrainTexture = useTexture("./textures/terrain_texture.jpg");

  const volcano = useGLTF("./models/volcano.glb");
  const volcanoTexture = useTexture("./textures/volcano_texture.jpg");
  volcanoTexture.flipY = false;

  // console.log(terrain);
  // console.log(terrainTexture);

  // terrain.traverse((child) => {
  //   if (child instanceof THREE.Mesh) {
  //     // Apply the texture to the mesh
  //     child.material = new THREE.MeshStandardMaterial({ map: terrainTexture });
  //   }
  // });

  // const map = useTexture(
  //   "./textures/Fantasy_equirectangular-jpg_Subterranean_citadel_in_VR360_1873830655_9870915.jpg"
  // );
  // const oceanGeometry = new THREE.CircleGeometry(100, 64);
  const oceanRef = useRef<THREE.Mesh<
    THREE.PlaneGeometry,
    THREE.ShaderMaterial
  > | null>(null);
  const timeRef = useRef(0);
  useFrame((_state, delta) => {
    timeRef.current += delta;
    if (oceanRef.current) {
      oceanRef.current.material.uniforms.uTime.value = timeRef.current;
    }
  });

  return (
    <>
      {/* <ambientLight intensity={} /> */}
      {/* <pointLight position={[10, 10, 10]} /> */}
      <OrbitControls />

      <Environment
        preset="city"
        // background
        // ground
        // files="./environments/kloofendal_overcast_puresky_2k.hdr"
        // files="./textures/Fantasy_equirectangular-jpg_VR360_view_of_molten_670336408_9869197.jpg"
      />

      {/* <PresentationControls
        global
        rotation={[0.3, -0.8, 0]}
        polar={[0, Math.PI / 2]}
        azimuth={[9, 100]}
        // config={{ mass: 2, tension: 400 }}
        // snap={{ mass: 4, tension: 400 }}
      > */}
      {/* <group position={[50, -20, 20]}> */}
      {/* <mesh>
          <sphereGeometry args={[100, 64, 64]} />
          <meshStandardMaterial map={map} side={THREE.BackSide} />
        </mesh> */}

      {/* <primitive object={terrain} position={[0, 0, 0]} scale={1} /> */}
      <mesh
        geometry={(terrain.scene.children[0] as THREE.Mesh).geometry}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial map={terrainTexture} map-flipY={false} />
      </mesh>

      <mesh
        geometry={(volcano.scene.children[0] as THREE.Mesh).geometry}
        position={[-0.9, 0, -5]}
      >
        <meshStandardMaterial map={volcanoTexture} map-flipY={false} />
      </mesh>

      {/* <mesh
        geometry={terrain.scene.children[1].geometry}
        position={[0.9, 0, 5.3]}
      >
        <meshStandardMaterial map={terrainTexture} map-flipY={false} />
      </mesh> */}

      {/* <RoundedBox
          args={[10, 14, 0.1]}
          position={[-15, 7, 15]}
          rotation={[0, -Math.PI / 4, 0]}
        > */}
      {/* <MeshPortalMaterial side={THREE.DoubleSide}> */}
      {/* <ambientLight intensity={0.75} /> */}
      {/* <Environment preset="sunset" /> */}
      {/* <Model modelName="rex-walk-happy" nftId="6721" /> */}
      {/* <mesh rotation={[0, Math.PI / 2, 0]}> */}
      {/* <sphereGeometry args={[9, 64, 64]} /> */}
      {/* <meshStandardMaterial map={map} side={THREE.BackSide} /> */}
      {/* </mesh> */}
      {/* </MeshPortalMaterial> */}
      {/* </RoundedBox> */}

      <mesh
        // geometry={oceanGeometry}
        ref={oceanRef}
        position={[0, 0, -4]}
        rotation={[-Math.PI * 0.5, 0, 0]}
        scale={1}
      >
        <planeGeometry args={[30, 30, 512, 512]} />

        <shaderMaterial
          attach="material"
          args={[waterMaterial]}
          // uniforms-resolution-value={[100, 100]}
        />
      </mesh>
      {/* </group> */}
      {/* </PresentationControls> */}
      {/* <mesh position={[0, 0, 0]} rotation={[-Math.PI * 0.5, 0, 0]} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="blue" />
      </mesh> */}
      {/* <primitive
        object={bridge}
        ref={bridgeRef}
        rotation={[0, Math.PI * 0.5, 0]}
        position={[position.x, 0, position.z]}
        scale={15}
      /> */}
      {/* <primitive object={castleDoor} position={[0, 1, -4]} scale={0.75} /> */}
      {/* <Center>
        <Text3D font="./fonts/Claynotopia_Regular.json">Hello Clayno</Text3D>
        </Center>
      */}
    </>
  );
}
