/* eslint-disable react/no-unknown-property */
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll } from 'framer-motion';
import { motion } from 'framer-motion-3d';
import { useRef } from 'react';
import { Mesh, MeshStandardMaterial } from 'three';

type ModelProps = React.PropsWithChildren<{
  className?: string;
}>;

export const SaltLogo: React.FC<ModelProps> = () => {
  const { scrollY } = useScroll();
  const groupRef = useRef(null);
  const { nodes } = useGLTF('/salt.glb');

  const material = new MeshStandardMaterial({
    color: '0xffffff',
    metalness: 0.8,
    roughness: 0.2,
  });

  useThree(({ camera }) => {
    camera.position.set(0, 5, 5);
    camera.lookAt(0, 0, 0);
  });

  useFrame(() => {
    const scrollPosition = scrollY.get();
    const minScroll = 0;
    const maxScroll = 800;
    const minTimeScale = 0.5;
    const maxTimeScale = 0.1;

    const timeScale =
      minTimeScale + ((scrollPosition - minScroll) / (maxScroll - minScroll)) * (maxTimeScale - minTimeScale);

    const clampedTimeScale = Math.max(maxTimeScale, Math.min(minTimeScale, timeScale));

    if (groupRef.current) {
      (groupRef.current as Mesh).rotation.x += 0.008 * clampedTimeScale;
      (groupRef.current as Mesh).rotation.y += 0.01 * clampedTimeScale;
    }
  });

  return (
    <motion.group>
      <ambientLight intensity={0.1} castShadow={false} />
      <pointLight position={[0, 4, 5]} intensity={40} castShadow={false} />
      <directionalLight position={[10, 10, 0]} intensity={1} castShadow={false} />
      <mesh
        ref={groupRef}
        material={material}
        geometry={(nodes.mark as Mesh).geometry}
        position={[0, 0, 0]}
        scale={7.5}
      />
    </motion.group>
  );
};
