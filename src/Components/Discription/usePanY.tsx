import React, { useRef, useState } from 'react';

export const usePanY = (contentHeight: number, scrollSpeed = 0.05) => {
  const initialY = useRef(0); // Store initial touch position (Y)
  const offsetY = useRef(0); // Store current vertical offset

  const [isPanning, setIsPanning] = useState(false);

  const onTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    setIsPanning(true);
    initialY.current = event.touches[0].clientY;
  };

  const onTouchMove = (event: React.TouchEvent<HTMLElement>) => {
    if (!isPanning) return;

    const deltaY = event.touches[0].clientY - initialY.current;
    const newOffsetY = Math.max(-100, Math.min(contentHeight, offsetY.current + deltaY * scrollSpeed)); // Enforce boundaries

    offsetY.current = newOffsetY;

    // Apply the vertical offset to the target element (replace with your element selector)
    const pannableElement = document.getElementById('pannable-element');
    if (pannableElement) {
      pannableElement.style.transform = `translateY(${offsetY.current}px)`;
    } else {
      // Handle the case where the element is not found
    }
  };

  const onTouchEnd = () => {
    setIsPanning(false);
  };

  return { onTouchStart, onTouchMove, onTouchEnd };
};
