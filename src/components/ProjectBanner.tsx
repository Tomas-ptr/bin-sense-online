
import React from 'react';
import ssecLogo from '/ssec-logo.png';

export function ProjectBanner() {
  return (
    <div className="bg-blue-50 py-4 px-6 flex items-center space-x-4 border-b border-blue-100">
      <img 
        src={ssecLogo} 
        alt="SSEC Logo" 
        className="h-16 w-16 object-contain"
      />
      <div>
        <h2 className="text-xl font-bold text-blue-800">
          Vauvenargues Projet STI2D2 Application
        </h2>
        <p className="text-sm text-blue-600">
          Smart Sewer Eco Channel (SSEC)
        </p>
      </div>
    </div>
  );
}
