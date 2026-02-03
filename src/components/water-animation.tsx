
'use client';

export function WaterAnimation() {
  return (
    <div className="absolute inset-0 z-0 animate-spin-slow overflow-hidden rounded-full">
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.6)" />
            <stop offset="100%" stopColor="rgba(96, 165, 250, 0.8)" />
          </linearGradient>
        </defs>
        <path
          fill="url(#waterGradient)"
          d="M 0 50 C 20 30, 40 30, 50 50 S 70 70, 90 50 S 100 50, 100 50 L 100 100 L 0 100 Z"
        >
          <animate
            attributeName="d"
            dur="4s"
            repeatCount="indefinite"
            values="
              M 0 50 C 20 30, 40 30, 50 50 S 70 70, 90 50 S 100 50, 100 50 L 100 100 L 0 100 Z;
              M 0 50 C 20 70, 40 70, 50 50 S 70 30, 90 50 S 100 50, 100 50 L 100 100 L 0 100 Z;
              M 0 50 C 20 30, 40 30, 50 50 S 70 70, 90 50 S 100 50, 100 50 L 100 100 L 0 100 Z;
            "
          />
        </path>
      </svg>
    </div>
  );
}
