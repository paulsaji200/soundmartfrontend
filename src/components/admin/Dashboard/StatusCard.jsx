import React, { useState, useEffect } from 'react';
import { FaShoppingBag, FaDollarSign, FaBox, FaCoins } from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const StatusCard = ({ cardName, color , progressValueProp, totalAmout}) => {
  const [progressValue, setProgressValue] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      setProgressValue((prevValue) => {
        const maxProgress = Math.min(progressValueProp, 100); 
        if (prevValue < maxProgress) {
          return prevValue + 1;
        } else {
          clearInterval(interval);
          return maxProgress;
        }
      });
    }, 20);

    return () => clearInterval(interval);
  }, [progressValueProp]);

  const getIcon = (name) => {
    switch (name) {
      case 'Total Sale':
        return <FaDollarSign className="text-blue-600 w-6 h-6 mr-2 my-3" />;
      case 'Total Orders':
        return <FaShoppingBag className="text-blue-600 w-6 h-6 mr-2 my-3" />;
      case 'Total Products':
        return <FaBox className="text-blue-600 w-6 h-6 mr-2 my-3" />;
      case 'Total Revenue':
        return <FaCoins className="text-blue-600 w-6 h-6 mr-2 my-3" />;
      default:
        return <FaShoppingBag className="text-blue-600 w-6 h-6 mr-2 my-3" />;
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-gray-500 text-lg font-semibold">{cardName}</h3>
          <div className="flex items-center">
            {getIcon(cardName)}
            <span className="text-2xl font-bold">{totalAmout}</span>
          </div>
        </div>
        <div className="relative flex flex-col items-end">
          <div className="w-20 h-20 -translate-x-8">
            <CircularProgressbar
              value={progressValue}
              text={`${Math.round(progressValue)}%`}
              styles={buildStyles({
                textSize: '24px',
                textColor: color,
                pathColor: color,
                trailColor: '#d6d6d6',
                pathTransitionDuration: 0.5,
              })}
            />
          </div>
          <p className="text-gray-400 text-xs mt-2 text-center">Compared to Last Month</p>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;