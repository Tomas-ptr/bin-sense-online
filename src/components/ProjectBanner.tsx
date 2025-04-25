
import React from 'react';
import ssecLogo from '/ssec-logo.png';

export function ProjectBanner() {
  return (
    <div className="bg-white/80 backdrop-blur-sm py-4 flex items-center space-x-4 border-b border-gray-100 px-6 shadow-sm">
      <img 
        src={ssecLogo} 
        alt="SSEC Logo" 
        className="h-12 w-12 object-contain"
      />
      <div>
        <h2 className="text-xl font-bold text-gray-800">
          Vauvenargues Projet STI2D2 Application
        </h2>
        <p className="text-sm text-gray-600">
          Smart Sewer Eco Channel (SSEC)
        </p>
      </div>
    </div>
  );
}
