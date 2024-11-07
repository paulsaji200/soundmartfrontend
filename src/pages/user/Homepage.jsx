import React from 'react'
import Homecomp from '../../components/user/Homecomp'
import Nav from '../../components/global/Nav'
import FilterComponent from '../../components/user/sorting'
import Productcomp from '../../components/admin/Productcard'
import { ProductCard } from '../../components/admin/Productcard'
const Homepage = () => {
  return (
    <div className="flex flex-col md:flex-row md:gap-4">
      <div className="w-full md:w-80 ">
        <FilterComponent />
      </div>
      <div className="w-full">
        <Productcomp />
      </div>
    </div>
  );
  
}
export default Homepage
