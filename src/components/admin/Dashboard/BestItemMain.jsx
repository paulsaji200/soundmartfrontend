import React, {useEffect, useState} from "react";
import {FaShoppingBag} from "react-icons/fa";

import api from "../../../config/axiosConfig";
import BestItemCard from "./BestItemCard";

const BestItems = () => {
  const [activeFilter, setActiveFilter] = useState("Product");
  const [topProducts, setTopProducts] = useState(null);
  const [topBrands, setTopBrands] = useState(null);
  const [topCategory, setTopCategory] = useState(null);

  const fetchBestItems = async () => {
    try {
      const response = await api.get("dashboard/top-most");
      setTopProducts(response?.data?.topProducts);
      setTopBrands(response?.data?.topBrands);
      setTopCategory(response?.data?.topCategories)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBestItems();
  }, []);




  const filters = ["Product", "Brand", "Category"];

  console.log(topProducts);

  const renderTableContent = () => {
    if (activeFilter === "Product") {
      return (
        <div className="flex flex-col items-center p-2">
          {topProducts?.map((products) => {
            const highestSales = Math.max(
              ...topProducts.map((p) => p.totalSales)
            );
            const percentage = (products.totalSales / highestSales) * 100;

            return (
              <BestItemCard image={products?.thumbnail} bestName={products?.productName?.split(" ").slice(0, 2).join(" ")}  percentage={percentage}/>
            );
          })}
        </div>

       
      );
    } else if (activeFilter === "Brand") {
      return (
        <div className="flex flex-col items-center p-2">
          {topBrands?.map((brand) => {
            const highestSales = Math.max(
              ...topBrands.map((p) => p.totalSales)
            );
            const percentage = (brand.totalSales / highestSales) * 100;

            return (
              <BestItemCard image={brand?.logo} bestName={brand?.brandName?.split(" ").slice(0, 2).join(" ")}  percentage={percentage}/>
            );
          })}
        </div>
      );
    } else if (activeFilter === "Category") {
      return (
        <div className="flex flex-col items-center p-2">
        {topCategory?.map((category) => {
          const highestSales = Math.max(
            ...topCategory.map((p) => p.totalSales)
          );
          const percentage = (category.totalSales / highestSales) * 100;

          return (
            <BestItemCard image={false} bestName={category?.categoryName?.split(" ").slice(0, 2).join(" ")}  percentage={percentage}/>
          );
        })}
      </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg">
      <div className="px-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Best {activeFilter}s</h2>
        <div className="flex space-x-4 p-4">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`text-sm px-2 py-1 font-medium rounded-full ${
                activeFilter === filter
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <div className="p-2">
        {/* Render the table based on the active filter */}
        {renderTableContent()}
      </div>
    </div>
  );
};

export default BestItems;