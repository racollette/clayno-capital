import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Environment,
  MeshPortalMaterial,
  // Float,
  // useMatcapTexture,
  // Center,
  Text3D,
  // Text,
  OrbitControls,
  // PerspectiveCamera,
  RoundedBox,
  // ContactShadows,
  // MeshReflectorMaterial,
  // PerspectiveCamera,
  useGLTF,
  useTexture,
} from "@react-three/drei";
// import { useControls } from "leva";
// import { Perf } from "r3f-perf";
import * as THREE from "three";
import Model from "./clayno-ntf-model";
import { useControls } from "leva";

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

export default function Experience1() {
  const terrain = useGLTF("./models/terrain1.glb");
  const terrainTexture = useTexture("./textures/terrain_texture1.jpg");
  terrainTexture.flipY = false;

  const volcano = useGLTF("./models/volcano1.glb");
  const volcanoTexture = useTexture("./textures/volcano_texture1.jpg");
  volcanoTexture.flipY = false;

  const stairs = useGLTF("./models/stairs.glb");
  const stairsTexture = useTexture("./textures/stairs_texture.jpg");
  stairsTexture.flipY = false;

  // const yingyang = useGLTF("./models/yingyang.glb");

  const map = useTexture(
    "./textures/Fantasy_equirectangular-jpg_Subterranean_citadel_in_VR360_1873830655_9870915.jpg"
  );
  const oceanRef = useRef<THREE.Mesh<
    THREE.PlaneGeometry,
    THREE.ShaderMaterial
  > | null>(null);

  const stegoRef = useRef<THREE.Group | null>(null);

  const boxControls = useControls("box", {
    position: {
      value: { x: -0.81, y: 1.5, z: 1.63 },
      step: 0.01,
    },
    rotation: {
      value: { x: -0.28, y: -0.45, z: -0.13 },
      step: 0.01,
    },
    args: {
      value: [1.17, 1.33, 0.0],
      step: 0.01,
    },
  });

  const stegoControls = useControls("stego", {
    position: {
      value: { x: 4.49, y: 1.2, z: 5.13 },
      step: 0.01,
    },
    rotation: {
      value: { x: -0.28, y: -0.45, z: -0.13 },
      step: 0.01,
    },
  });

  const center = new THREE.Vector3(
    stegoControls.position.x + 0.85,
    stegoControls.position.y,
    stegoControls.position.z + 0.85
  );

  const timeRef = useRef(0);
  useFrame((_state, delta) => {
    timeRef.current += delta;
    if (oceanRef.current) {
      oceanRef.current.material.uniforms.uTime.value = timeRef.current;
    }

    if (stegoRef.current) {
      // Adjust the radius and speed based on your requirements
      const radius = 0.85;
      const speed = 0.5;

      // Calculate new position
      const x =
        radius * Math.cos(speed * timeRef.current) + stegoControls.position.x;
      const z =
        radius * Math.sin(speed * timeRef.current) + stegoControls.position.z;

      // Set the new position
      stegoRef.current.position.z = z;
      stegoRef.current.position.x = x;

      stegoRef.current.lookAt(center);
    }
  });

  return (
    <>
      <ambientLight intensity={0} />
      {/* <pointLight position={[2, 1, -6]} intensity={50} /> */}
      <OrbitControls
        maxDistance={50}
        minDistance={15}
        maxPolarAngle={1.4}
        minPolarAngle={0.1}
      />

      <Environment
        preset="sunset"
        // background
        // ground
        // files="./environments/kloofendal_overcast_puresky_2k.hdr"
        // files="./environments/Fantasy_equirectangular-jpg_VR360_view_of_molten_670336408_9869197.jpg"
      />

      {/* Watching Bronto */}
      <group
        position={[-5.9, 1.97, -2.56]}
        // ref={stegoRef}
        rotation-y={Math.PI / 1}
        scale={0.6}
      >
        <Model modelName="bronto-idle-bored" nftId="8006" />
      </group>

      {/* Running Stego */}
      <group
        position={[
          stegoControls.position.x,
          stegoControls.position.y,
          stegoControls.position.z,
        ]}
        ref={stegoRef}
        rotation={[
          stegoControls.rotation.x,
          stegoControls.rotation.y,
          stegoControls.rotation.z,
        ]}
        scale={0.35}
      >
        <Model modelName="stego-trot-excited" nftId="5592" />
      </group>

      <group position={[0, 0, 0]}>
        {/* Terrain */}
        <group rotation-y={Math.PI}>
          <mesh
            geometry={(terrain.scene.children[0] as THREE.Mesh).geometry}
            position={[-1, 0, -2.5]}
            scale={1.5}
            rotation={[0, Math.PI * 1.5, 0]}
          >
            <meshStandardMaterial map={terrainTexture} map-flipY={false} />
          </mesh>
        </group>

        <group scale={1.6}>
          {/* Volcano */}
          <mesh
            geometry={(volcano.scene.children[0] as THREE.Mesh).geometry}
            position={[-0.9, 0.32, -0.63]}
            rotation={[0.23, 4.97, 0.2]}
          >
            <meshStandardMaterial map={volcanoTexture} map-flipY={false} />
          </mesh>
          {/* Arch */}
          <mesh
            geometry={(stairs.scene.children[0] as THREE.Mesh).geometry}
            position={[-0.55, -2.01, -0.08]}
            rotation={[1.61, 0.92, -0.49]}
            scale={1.1}
          >
            <meshStandardMaterial map={stairsTexture} map-flipY={false} />
          </mesh>
          {/* Stairs */}
          <mesh
            geometry={(stairs.scene.children[1] as THREE.Mesh).geometry}
            position={[1.34, -0.34, 4.95]}
            rotation={[-0.03, -1.21, 0.05]}
            scale={1.1}
          >
            <meshStandardMaterial map={stairsTexture} map-flipY={false} />
          </mesh>
        </group>
      </group>

      <RoundedBox
        args={boxControls.args}
        position={[0, -2, 0]}
        rotation={[1.61, 0.92, -0.49]}
      >
        <MeshPortalMaterial side={THREE.DoubleSide}>
          <ambientLight intensity={0.75} />
          <Environment preset="sunset" />
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial map={map} side={THREE.BackSide} />
          </mesh>
        </MeshPortalMaterial>
      </RoundedBox>

      <mesh
        ref={oceanRef}
        position={[1, -1, 1]}
        rotation={[-Math.PI * 0.5, 0, 0]}
        scale={1}
      >
        <planeGeometry args={[60, 60, 512, 512]} />

        <shaderMaterial attach="material" args={[waterMaterial]} />
      </mesh>

      <Text3D
        position={[3, 7, -4]}
        rotation={[0, -0.4, 0]}
        font="./fonts/Titan_One_Regular.json"
      >
        THE CAPITAL
      </Text3D>
    </>
  );
}
