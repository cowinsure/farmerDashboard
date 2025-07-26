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
            fill={"var(--firstWave-color)"} 
            paused={false}
            options={{
              height: 6,
              amplitude: 40,
              speed: 0.08,
              points: 8,
            }}
          />
        </div>

        {/* Middle wave – light beige */}
        <div className="absolute bottom-0 w-full z-10">
          <Wave
            fill={"var(--middleWave-color)"}
            paused={false}
            options={{
              height: 25,
              amplitude: 25,
              speed: 0.1,
              points: 5,
            }}
          />
        </div>

        {/* Front wave – subtle greenish white tint */}
        <div className="absolute bottom-0 w-full z-20">
          <Wave
            fill={"var(--backWave-color)"}
            paused={false}
            options={{
              height: 30,
              amplitude: 50,
              speed: 0.12,
              points: 4,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LayeredWaves;
