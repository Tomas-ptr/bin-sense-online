import React from 'react';
import ssecLogo from '/ssec-logo.png';
export function ProjectBanner() {
  return <div className="bg-white/80 backdrop-blur-sm py-4 flex items-center space-x-4 border-b border-gray-100 shadow-sm px-0">
      
      <div>
        <h2 className="text-xl font-bold text-gray-800 px-[240px] mx-[165px]">
          Vauvenargues Projet STI2D2 Application
        </h2>
        <p className="text-sm text-gray-600">
          Smart Sewer Eco Channel (SSEC)
        </p>
      </div>
    </div>;
}