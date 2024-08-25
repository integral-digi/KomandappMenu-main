import React, { useState } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
}

const Toast = ({ message, isVisible, setIsVisible }: ToastProps) => {

  if (!isVisible) return null;

  setTimeout(() => {
    setIsVisible(false);
  }, 3000); // Automatically hide after 3 seconds

  return (
    <div className={`toast ${isVisible ? 'show' : 'hide'}`}>
      {message}
    </div>
  );
};

export default Toast;
