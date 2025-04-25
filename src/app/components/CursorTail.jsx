'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const greetings = [
  'Hello 👋',
  'Namaste 🙏',
  'Hola 🌞',
  'Bonjour 🥐',
  'નમસ્કાર 🪔', 
  'నమస్తే 🎉'     
];

export default function CursorGreeting() {
  const [greeting, setGreeting] = useState(greetings[0]);
  const bubbleRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  // Update greeting every 2.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(prev => {
        const currentIndex = greetings.indexOf(prev);
        return greetings[(currentIndex + 1) % greetings.length];
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Follow cursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current = { x: e.clientX + 20, y: e.clientY + 20 };
    };

    const follow = () => {
      if (bubbleRef.current) {
        gsap.to(bubbleRef.current, {
          x: mouse.current.x,
          y: mouse.current.y,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
      requestAnimationFrame(follow);
    };

    window.addEventListener('mousemove', handleMouseMove);
    follow();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={bubbleRef}
      className="fixed top-0 left-0 bg-black text-white text-sm px-4 py-2 rounded-xl shadow-lg pointer-events-none z-[9999] transition-all"
      style={{ transform: 'translate(-50%, -50%)' }}
    >
      {greeting}
    </div>
  );
}
