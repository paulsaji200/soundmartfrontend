import React from "react";
import ProgressBar from "./ProgressBar";
import {MdOutlineCategory} from "react-icons/md";

const BestItemCard = ({image, bestName, percentage}) => {
  return (
    <div className={`w-full flex items-center ${image ? "gap-6" : "gap-3"}`}>
      {image ? (
        <div className="w-16">
          <img src={image} alt="" className="w-10 h-10 object-cover" />
        </div>
      ) : (
        <div className="text-center">
          <MdOutlineCategory size={24} color={"gray"}/>
        </div>
      )}

      <div className="w-full">
        <div className="flex items-center justify-between">
          <div>{bestName}</div>
          <div>
            <span></span>
            <span>{percentage.toFixed(1)}%</span>
          </div>
        </div>
        <ProgressBar value={percentage} />
      </div>
    </div>
  );
};

export default BestItemCard;