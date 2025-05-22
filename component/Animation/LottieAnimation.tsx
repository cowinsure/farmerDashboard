'use client'; // Optional: If you're using Next.js App Router

import { Player } from '@lottiefiles/react-lottie-player';
import React from 'react';

interface LottieAnimationProps {
  animationData: object;
  width?: number | string;
  height?: number | string;
  loop?: boolean;
  autoplay?: boolean;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({
  animationData,
  width = 300,
  height = 300,
  loop = true,
  autoplay = true,
}) => {
  return (
    <Player
      autoplay={autoplay}
      loop={loop}
      src={animationData}
      style={{ width, height }}
    />
  );
};

export default LottieAnimation;
