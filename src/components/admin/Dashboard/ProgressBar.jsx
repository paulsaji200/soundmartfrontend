import React, { useEffect, useState } from 'react';

const ProgressBar = ({ value }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(value), 200); 
    return () => clearTimeout(timer); 
  }, [value]);


  const getColor = (value) => {
    if (value >= 90) return 'bg-green-600';
    if (value >= 80) return 'bg-blue-600';  
    if (value >= 70) return 'bg-yellow-500'; 
    if (value >= 60) return 'bg-orange-500'; 
    return 'bg-red-500'; 
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className={`h-2 rounded-full ${getColor(progress)}`}
        style={{
          width: `${progress}%`,
          transition: 'width 1.5s ease-in-out', 
        }}
      />
    </div>
  );
};

export default ProgressBar;