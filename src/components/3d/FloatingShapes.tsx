import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, Box, Torus } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const FloatingShape = ({ position, color, type }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += 0.001;
    meshRef.current.rotation.y += 0.002;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
  });

  const ShapeComponent = type === "sphere" ? Sphere : type === "box" ? Box : Torus;

  return (
    <ShapeComponent ref={meshRef} position={position} args={type === "torus" ? [0.5, 0.2, 16, 100] : [1, 32, 32]}>
      <meshStandardMaterial color={color} transparent opacity={0.3} wireframe />
    </ShapeComponent>
  );
};

export const FloatingShapes = () => {
  return (
    <div className="absolute inset-0 -z-10 opacity-40">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <FloatingShape position={[-3, 1, 0]} color="#5BA3FF" type="sphere" />
        <FloatingShape position={[3, -1, -2]} color="#5BA3FF" type="box" />
        <FloatingShape position={[0, 2, -1]} color="#5BA3FF" type="torus" />
        
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};
