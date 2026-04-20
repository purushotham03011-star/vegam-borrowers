
import React from 'react';

export const RadarScanner: React.FC = () => {
  return (
    <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center">
      {/* Concentric Rings */}
      <div className="absolute w-full h-full rounded-full border border-violet-200/50"></div>
      <div className="absolute w-3/4 h-3/4 rounded-full border border-violet-200/40"></div>
      <div className="absolute w-1/2 h-1/2 rounded-full border border-violet-200/30"></div>
      <div className="absolute w-1/4 h-1/4 rounded-full border border-violet-200/20"></div>

      {/* Axis Lines */}
      <div className="absolute w-full h-px bg-violet-200/20"></div>
      <div className="absolute h-full w-px bg-violet-200/20"></div>

      {/* Rotating Scanner Sweep */}
      <div className="absolute w-full h-full animate-[spin_4s_linear_infinite]">
        <div className="absolute top-0 left-1/2 w-1/2 h-1/2 bg-gradient-to-tr from-violet-500/50 to-transparent rounded-tr-full origin-bottom-left"></div>
        {/* Leading edge of the scanner */}
        <div className="absolute top-0 left-1/2 w-px h-1/2 bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.8)] origin-bottom-left"></div>
      </div>

      {/* Center Point */}
      <div className="w-4 h-4 bg-violet-500 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.6)]">
        <div className="w-full h-full bg-violet-300 rounded-full animate-ping opacity-75"></div>
      </div>

      {/* Location Blips */}
      {/* Anantapur */}
      <div className="absolute top-[25%] left-[20%] flex flex-col items-center">
        <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(249,115,22,1)]"></div>
        <span className="mt-2 text-xs font-bold text-orange-600 bg-white/80 px-2 py-1 rounded-full backdrop-blur-sm border border-orange-100">Anantapur</span>
      </div>

      {/* Vizag */}
      <div className="absolute top-[30%] right-[15%] flex flex-col items-center animate-pulse [animation-delay:500ms]">
        <div className="w-3 h-3 bg-violet-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,1)]"></div>
        <span className="mt-2 text-xs font-bold text-violet-600 bg-white/80 px-2 py-1 rounded-full backdrop-blur-sm border border-violet-100">Vizag</span>
      </div>

      {/* Bangalore */}
      <div className="absolute bottom-[20%] left-[35%] flex flex-col items-center animate-pulse [animation-delay:1000ms]">
        <div className="w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,1)]"></div>
        <span className="mt-2 text-xs font-bold text-orange-600 bg-white/80 px-2 py-1 rounded-full backdrop-blur-sm border border-orange-100">Bangalore</span>
      </div>
    </div>
  );
};
