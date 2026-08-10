import React from 'react';

const AnimatedGridBackground = ({ children, className = '' }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #00366B 1px, transparent 1px),
            linear-gradient(to bottom, #00366B 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          animation: 'gridMove 20s linear infinite'
        }}
      />
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
      <style>{`
        @keyframes gridMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(40px); }
        }
      `}</style>
    </div>
  );
};

export default AnimatedGridBackground;
