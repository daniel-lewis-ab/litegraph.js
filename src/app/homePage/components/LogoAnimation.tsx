import { Canvas } from '@react-three/fiber';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { AsciiRenderer } from '@react-three/drei';
import s from '../HomePage.module.css';
import { SaltLogo } from './Models';

export const LogoAnimation = () => {
  const ref = useRef(null);
  const { scrollY } = useScroll({ target: ref });
  const opacity = useTransform(scrollY, [0, 1024], [1, 0]);

  return (
    <motion.div style={{ opacity }} className="relative h-full w-full" ref={ref}>
      <Canvas className={s.canvas} onCreated={(state) => state.gl.setClearColor(0x000000)}>
        <SaltLogo />
        <AsciiRenderer fgColor={'var(--color-surface-11)'} characters={' ˚.+salt%∆'} resolution={0.12} />
      </Canvas>
    </motion.div>
  );
};

// eslint-disable-next-line import/no-default-export
export default LogoAnimation;
