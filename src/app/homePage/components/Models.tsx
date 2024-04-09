/* eslint-disable react/no-unknown-property */
import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { MeshStandardMaterial } from 'three';

type ModelProps = React.PropsWithChildren<{
  className?: string;
}>;

export const SaltLogo: React.FC<ModelProps> = () => {
  const { scrollY } = useScroll();
  const groupRef = useRef(null);
  useThree(({ camera }) => {
    camera.position.set(0, 5, 3);
    camera.lookAt(0, 0, 0);
  });
  const { scene, animations } = useGLTF('/salt.glb');
  const { actions, mixer } = useAnimations(animations, groupRef);

  const material = new MeshStandardMaterial({
    color: '0x134444',
    metalness: 0.4,
    roughness: 0.8,
  });

  useEffect(() => {
    actions?.spinAction?.play();
  }, [mixer, actions, animations]);

  /**
   * Using scroll position to slow down and speed up the animation.
   */
  useFrame((_state, delta) => {
    const scrollPosition = scrollY.get();
    const minScroll = 0;
    const maxScroll = 800;
    const minTimeScale = 0.35;
    const maxTimeScale = 0.05;

    const timeScale =
      minTimeScale + ((scrollPosition - minScroll) / (maxScroll - minScroll)) * (maxTimeScale - minTimeScale);

    // Clamp the timeScale between minTimeScale and maxTimeScale
    const clampedTimeScale = Math.max(maxTimeScale, Math.min(minTimeScale, timeScale));

    actions?.spinAction?.setEffectiveTimeScale(clampedTimeScale);
    mixer.update(delta);
  });

  return (
    <primitive
      ref={groupRef}
      scale={9}
      object={scene}
      material={material}
      animations={[animations[0]]}
      position={[0, 0, -1]}
    />
  );
};
