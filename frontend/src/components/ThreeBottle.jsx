import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ProceduralBottle = () => {
  const group = useRef();

  // Create a bottle profile curve
  const points = [];
  points.push(new THREE.Vector2(0, -3));
  points.push(new THREE.Vector2(1.2, -3)); // base
  points.push(new THREE.Vector2(1.2, -2.8));
  points.push(new THREE.Vector2(1.15, -2.5));
  points.push(new THREE.Vector2(1.2, 0.5)); // body
  points.push(new THREE.Vector2(1.1, 1.2)); // shoulder
  points.push(new THREE.Vector2(0.5, 2.0)); // neck start
  points.push(new THREE.Vector2(0.4, 3.5)); // neck straight
  points.push(new THREE.Vector2(0.5, 3.6)); // lip bottom
  points.push(new THREE.Vector2(0.5, 3.8)); // lip top
  points.push(new THREE.Vector2(0.3, 3.9)); // inner lip
  points.push(new THREE.Vector2(0, 3.9));

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh castShadow receiveShadow>
          <latheGeometry args={[points, 64]} />
          <MeshTransmissionMaterial
            backside
            samples={4}
            thickness={0.5}
            chromaticAberration={0.05}
            anisotropy={0.1}
            distortion={0.1}
            distortionScale={0.5}
            temporalDistortion={0.0}
            color="#ffe5b4" // Amber/whiskey tint
            transmission={0.9}
            roughness={0.1}
            metalness={0.1}
            ior={1.5}
          />
        </mesh>
        
        {/* Label (Cylinder wrapped around body) */}
        <mesh position={[0, -1, 0]}>
          <cylinderGeometry args={[1.21, 1.21, 1.5, 64]} />
          <meshStandardMaterial 
            color="#0a0a0a" 
            roughness={0.8}
            metalness={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Cap */}
        <mesh position={[0, 4, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.5, 32]} />
          <meshStandardMaterial color="#c9a84c" metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>
    </group>
  );
};

const ThreeBottle = () => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '500px' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <Environment preset="studio" />
        <ProceduralBottle />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
      </Canvas>
    </div>
  );
};

export default ThreeBottle;
