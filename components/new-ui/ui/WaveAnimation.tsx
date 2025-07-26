import React from "react";
import Wave from "react-wavify";

const LayeredWaves = () => {
  return (
    <div className="fixed -bottom-2 left-0 w-full h-32 z-0 pointer-events-none">
      {/* Back wave - light green */}
      <div className="absolute bottom-0 w-full z-0">
        {/* Back wave – soft creamy white */}
        <div className="absolute bottom-0 w-full z-0">
          <Wave
            fill="rgba(255, 255, 240, 0.3)" // ivory/cream with 30% opacity
            paused={false}
            options={{
              height: 20,
              amplitude: 10,
              speed: 0.08,
              points: 3,
            }}
          />
        </div>

        {/* Middle wave – light beige */}
        <div className="absolute bottom-0 w-full z-10">
          <Wave
            fill="rgba(245, 235, 220, 0.5)" // light beige with 50% opacity
            paused={false}
            options={{
              height: 25,
              amplitude: 15,
              speed: 0.1,
              points: 4,
            }}
          />
        </div>

        {/* Front wave – subtle greenish white tint */}
        <div className="absolute bottom-0 w-full z-20">
          <Wave
            fill="rgba(230, 255, 240, 0.6)" // mint-cream style with 60% opacity
            paused={false}
            options={{
              height: 30,
              amplitude: 20,
              speed: 0.12,
              points: 5,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LayeredWaves;
