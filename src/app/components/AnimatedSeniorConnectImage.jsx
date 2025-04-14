// components/AnimatedSeniorConnectImage.js
'use client'; // Required for useEffect and useRef

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';

// --- Icon Suggestions (Using simple divs here, replace with actual icons) ---
// You can use libraries like react-icons: npm install react-icons
// import { FaCode, FaUsers, FaGraduationCap, FaLightbulb, FaNetworkWired } from 'react-icons/fa';
// const icons = [
//   { component: FaCode, color: '#4285F4' },       // Google Blue
//   { component: FaUsers, color: '#DB4437' },      // Google Red
//   { component: FaGraduationCap, color: '#F4B400' },// Google Yellow
//   { component: FaLightbulb, color: '#0F9D58' },    // Google Green
//   { component: FaNetworkWired, color: '#607D8B'} // Greyish Blue
// ];
// --- End Icon Suggestions ---

// Simple colored circles for demonstration
const iconsData = [
    { id: 1, color: '#4285F4', initialOffset: { x: -320, y: -200 } }, // Top-leftish
    { id: 2, color: '#DB4437', initialOffset: { x: 300, y: -200 } },  // Top-rightish
    { id: 3, color: '#F4B400', initialOffset: { x: -320, y: 100 } }, // Bottom-leftish
    { id: 4, color: '#0F9D58', initialOffset: { x: 300, y: 100 } },  // Bottom-rightish
    { id: 5, color: '#607D8B', initialOffset: { x: 0, y: -360 } },   // Top-centerish
    { id: 6, color: '#9C27B0', initialOffset: { x: 0, y: 300 } },   // Bottom-centerish - Added one more
];

const AnimatedSeniorConnectImage = () => {
    const containerRef = useRef(null);
    const imageRef = useRef(null);
    const iconRefs = useRef([]);
    iconRefs.current = []; // Reset on re-render before collecting refs

    const addToRefs = (el) => {
        if (el && !iconRefs.current.includes(el)) {
            iconRefs.current.push(el);
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        const icons = iconRefs.current;
        const imageW = 500; // Match image width
        const imageH = 500; // Match image height

        if (!container || icons.length === 0) return;

        const ctx = gsap.context(() => {
            // --- 1. Initial Positioning & Floating Animation ---
            icons.forEach((icon, index) => {
                const data = iconsData[index];
                const initialX = data.initialOffset.x;
                const initialY = data.initialOffset.y;

                // Set initial absolute position (relative to container center)
                gsap.set(icon, {
                    x: initialX,
                    y: initialY,
                    scale: 1,
                    opacity: 0.8, // Start slightly transparent
                    // Set transform origin to center for scaling/rotation effects if needed
                    transformOrigin: "center center"
                });

                // Continuous floating animation
                gsap.to(icon, {
                    x: `+=${gsap.utils.random(-20, 20)}`, // Small random horizontal drift
                    y: `+=${gsap.utils.random(-25, 25)}`, // Small random vertical drift
                    scale: `*=${gsap.utils.random(0.95, 1.05)}`, // Slight size variation
                    opacity: gsap.utils.random(0.7, 0.9),       // Slight opacity variation
                    duration: gsap.utils.random(3, 5),      // Random duration
                    repeat: -1,                             // Loop indefinitely
                    yoyo: true,                             // Go back and forth
                    ease: 'sine.inOut',                     // Smooth easing
                    delay: gsap.utils.random(0, 2),         // Stagger start times
                });
            });

            // --- 2. Mouse Follow Animation ---
            let mouseX = 0;
            let mouseY = 0;
            let containerBounds = null;

            const handleMouseMove = (e) => {
                if (!containerBounds) {
                     containerBounds = container.getBoundingClientRect();
                }
                // Mouse position relative to the container's center
                mouseX = e.clientX - containerBounds.left - containerBounds.width / 2;
                mouseY = e.clientY - containerBounds.top - containerBounds.height / 2;

                // Animate icons towards the mouse
                icons.forEach((icon, index) => {
                    const data = iconsData[index];
                    // Calculate target position: base position + move towards mouse
                    // The 'followFactor' determines how much they follow (0 = none, 1 = directly to mouse)
                    const followFactor = 0.1; // Adjust this for more/less follow strength
                    const targetX = data.initialOffset.x + mouseX * followFactor * (1 + index * 0.05); // Add slight variation per icon
                    const targetY = data.initialOffset.y + mouseY * followFactor * (1 + index * 0.05);

                    gsap.to(icon, {
                        x: targetX,
                        y: targetY,
                        scale: 1.1, // Slightly bigger on hover follow
                        opacity: 1, // Fully opaque
                        duration: 0.6, // Quick but smooth reaction
                        ease: 'power2.out',
                        overwrite: 'auto', // Let this tween overwrite the float's position part
                    });
                });
            };

            const handleMouseLeave = () => {
                 containerBounds = null; // Reset bounds calculation on leave
                // Animate icons back to their floating state/initial offsets
                icons.forEach((icon, index) => {
                     const data = iconsData[index];
                    gsap.to(icon, {
                        // Go back towards the initial offset, the float will take over
                        x: data.initialOffset.x,
                        y: data.initialOffset.y,
                        scale: 1, // Back to normal size
                        opacity: 0.8, // Back to base opacity
                        duration: 0.8,
                        ease: 'power2.out',
                        overwrite: 'auto',
                    });
                });
            };

            container.addEventListener('mousemove', handleMouseMove);
            container.addEventListener('mouseleave', handleMouseLeave);

            // Cleanup function
            return () => {
                container.removeEventListener('mousemove', handleMouseMove);
                container.removeEventListener('mouseleave', handleMouseLeave);
                // GSAP context automatically handles cleanup of tweens created within it
            };

        }, containerRef); // Scope GSAP animations to the container

        // GSAP Context cleanup
         return () => ctx.revert();

    }, []); // Empty dependency array ensures this runs only once on mount

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative', // Needed for absolute positioning of icons
                width: '500px', // Match image width
                height: '500px', // Match image height
                margin: 'auto', // Center the container itself if needed
                marginTop: '-200px', // Your original margins
                marginBottom: '200px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                // border: '1px dashed lightgrey', // Optional: visualize container
            }}
        >
            {/* The Main Image */}
            <Image
                ref={imageRef}
                style={{
                    borderRadius: '50%', // Make it perfectly round if square
                    // borderRadius: '50px', // Or keep your original style
                    display: 'block', // Prevents extra space below image
                }}
                height={500}
                width={500}
                src="/image.png" // Your image path
                alt="Newton School Senior Connect"
            />

            {/* Floating Icons Container (positioned over the image) */}
            <div style={{
                position: 'absolute',
                top: '50%', // Center the icon origin point
                left: '50%',
                width: '1px', // No dimensions needed, just an origin
                height: '1px',
                // border: '1px solid red', // Optional: visualize icon origin
             }}>
                {iconsData.map((iconData) => (
                    <div
                        key={iconData.id}
                        ref={addToRefs}
                        style={{
                            position: 'absolute', // Positioned relative to the centered div
                            width: '40px', // Size of the icon circle
                            height: '40px',
                            backgroundColor: iconData.color,
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'white',
                            fontSize: '18px', // Adjust if using icon fonts
                            // Place icons initially via GSAP, not static CSS top/left
                            // Remove initial transform translate if GSAP handles position fully
                            // transform: 'translate(-50%, -50%)', // Center the icon itself on its position
                            willChange: 'transform, opacity', // Hint browser for performance
                            cursor: 'pointer', // Indicate interactivity
                            // boxShadow: '0 4px 8px rgba(0,0,0,0.2)', // Optional shadow
                        }}
                    >
                        {/* --- Render Actual Icons Here --- */}
                        {/* Example using react-icons (install it first!)
                        {(() => {
                            const IconComponent = icons.find(i => i.color === iconData.color)?.component;
                            return IconComponent ? <IconComponent /> : iconData.id;
                        })()}
                        */}
                        {/* Using simple text/ID for now */}
                         {/* {iconData.id} */}
                         {/* Or specific Emojis/Text */}
                         {iconData.id === 1 && '🧑‍💻'}
                         {iconData.id === 2 && '🤝'}
                         {iconData.id === 3 && '🎓'}
                         {iconData.id === 4 && '💡'}
                         {iconData.id === 5 && '🔗'}
                         {iconData.id === 6 && '🚀'}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnimatedSeniorConnectImage;