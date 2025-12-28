import React, { useEffect } from 'react';

const Toast = ({ show, message, type = 'info', onClose }) => {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => onClose?.(), 3000);
    return () => clearTimeout(t);
  }, [show, onClose]);

  if (!show) return null;

  const bg = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-gray-800';

  return (
    <div className={`fixed right-4 top-4 z-[9999] ${bg} text-white px-4 py-2 rounded-lg shadow-lg`} role="status">
      {message}
    </div>
  );
};

export default Toast;
