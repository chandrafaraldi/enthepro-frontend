import React from 'react';

export default function BackgroundStars() {
  // Generate random positions for stars
  const stars = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 3}s`,
  }));

  const shootingStars = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 10}s`,
    duration: `${3 + Math.random() * 5}s`
  }));

  return (
    <div className="night-background">
      {stars.map(star => (
        <div 
          key={star.id} 
          className="twinkle-star" 
          style={{ 
            top: star.top, 
            left: star.left, 
            animationDelay: star.delay 
          }} 
        />
      ))}
      
      <div className="shooting-star-container">
        {shootingStars.map(s => (
          <div 
            key={s.id} 
            className="shooting-star" 
            style={{ 
              top: s.top, 
              left: s.left, 
              animationDelay: s.delay,
              animationDuration: s.duration
            }} 
          />
        ))}
      </div>
    </div>
  );
}
