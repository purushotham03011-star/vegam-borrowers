
import React from 'react';

// Custom 3D Map Pin SVG - White/Orange Theme
const RedMapPin = () => (
  <svg width="100" height="120" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform hover:scale-110 transition-transform duration-500 drop-shadow-lg scale-75 md:scale-100">
     {/* Shadow Base on the 'floor' */}
    <ellipse cx="50" cy="110" rx="20" ry="6" fill="black" fillOpacity="0.2" filter="blur(6px)"/>

    {/* 3D Pin Body - Outer Shape with Gradient */}
    <path d="M50 0C22.3858 0 0 22.3858 0 50C0 85 50 120 50 120C50 120 100 85 100 50C100 22.3858 77.6142 0 50 0Z" fill="white"/>
    
    {/* Inner Bevel/Edge for 3D depth */}
    <path d="M50 5C26 5 6 25 6 50C6 80 50 115 50 115" stroke="#F97316" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>

    {/* Inner Hole */}
    <circle cx="50" cy="45" r="18" fill="#EA580C"/> {/* Orange 600 */}
    <circle cx="50" cy="45" r="10" fill="white"/>

    {/* Glossy Highlights */}
    <ellipse cx="25" cy="25" rx="10" ry="15" transform="rotate(-45 25 25)" fill="white" fillOpacity="0.5"/>
  </svg>
);

export const LocationsSection = () => {
  const locations = [
    { name: "Anantapur", delay: "delay-0" },
    { name: "Vizag", delay: "delay-100" },
    { name: "Bangalore", delay: "delay-200" }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-orange-400 to-red-500 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-8 items-center">
          
          {/* Part 1: Big Text Description */}
          {/* On Mobile: Col-span-3 (Full width), On Desktop: Col-span-1 */}
          <div className="col-span-3 md:col-span-1 text-center md:text-left relative z-10 mb-8 md:mb-0">
            <h2 className="text-3xl md:text-3xl lg:text-5xl font-serif font-bold text-white leading-tight drop-shadow-md">
              Our <br/>
              Locations <br/>
              in India
            </h2>
            <div className="w-24 h-1.5 bg-white rounded-full mt-4 md:mt-6 mx-auto md:mx-0 shadow-sm"></div>
            <p className="mt-4 md:mt-6 text-white/90 leading-relaxed text-sm lg:text-base font-medium hidden md:block">
              We are expanding our digital lending footprint. Visit our partner hubs for physical verification and secure asset storage.
            </p>
          </div>

          {/* Parts 2, 3, 4: Locations with Pins */}
          {/* On Mobile: 1 Col each (Total 3 cols side by side) */}
          {locations.map((loc) => (
            <div key={loc.name} className="col-span-1 flex flex-col items-center justify-center group">
               {/* 3D Map Base Plate Effect */}
               <div className="relative">
                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 md:w-28 md:h-28 bg-white/20 rounded-full transform rotate-x-[60deg] border border-white/30 group-hover:bg-white/30 transition-all duration-500"></div>
                 
                 {/* The Pin */}
                 <div className="relative z-10 -translate-y-2 group-hover:-translate-y-6 transition-transform duration-500 ease-out cursor-pointer">
                   <RedMapPin />
                 </div>
               </div>
               
               {/* Location Name */}
               <h3 className="mt-2 md:mt-6 text-sm md:text-xl lg:text-2xl font-bold text-white group-hover:text-yellow-200 transition-colors font-serif tracking-wide drop-shadow-sm text-center">
                 {loc.name}
               </h3>
            </div>
          ))}

        </div>
        
        {/* Mobile only text description bottom */}
        <p className="mt-8 text-white/90 leading-relaxed text-sm text-center md:hidden px-4">
             Expanding our digital footprint to partner hubs near you.
        </p>
      </div>
    </section>
  );
};
