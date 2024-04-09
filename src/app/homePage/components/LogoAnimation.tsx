import { AsciiRenderer } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import s from '../HomePage.module.css';
import { SaltLogo } from './Models';

export const LogoAnimation = () => {
  const ref = useRef(null);
  const { scrollY } = useScroll({ target: ref });
  const opacity = useTransform(scrollY, [0, 1024], [1, 0]);

  return (
    <motion.div style={{ opacity }} transition={{ duration: 2, ease: 'easeOut' }} className="relative h-full w-full">
      <Canvas className={s.canvas} onCreated={(state) => state.gl.setClearColor('black')}>
        <SaltLogo />
        <AsciiRenderer fgColor={'var(--color-surface-10)'} resolution={0.114} />
      </Canvas>
    </motion.div>
  );
};

// eslint-disable-next-line import/no-default-export
export default LogoAnimation;
