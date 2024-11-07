import React, { useEffect, useState } from 'react';
import { 
  ChevronRight, 
  Speaker, 
  Headphones,
  Radio,
  Star,
  ShoppingCart,
  Heart,
  ArrowRight,
  Home
} from 'lucide-react';
import Nav from '../../components/global/Nav';
import api from '../../utils/axios';
import Footer from '../../components/global/Footer';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  // Sample product data
 const [featuredProducts,setfeaturedproducts]  = useState([]);
  const navigate = useNavigate();
  const categories = [
    { name: "Speakers", icon: <Speaker />, count: 120 },
    { name: "Headphones", icon: <Headphones />, count: 85 },
    { name: "Earbuds", icon: <Radio />, count: 95 },
    { name: "Gaming Headsets", icon: <Headphones />, count: 45 },
  ];

  const fproducts = async()=>{
   const response =  await api.get("/user/fproducts")
   setfeaturedproducts(response.data)
  }

useEffect(()=>{
fproducts();


},[])



  return (
    <div>
    <Nav/>
    <div className="min-h-screen bg-gray-50 mt-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center space-x-2 text-sm">
            <Home size={16} />
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-gray-600">Electronics</span>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-gray-900">Audio</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Banner */}
        <div  onClick={()=>navigate("/")} className="relative rounded-lg overflow-hidden mb-8">
          <img 
            src={"https://res.cloudinary.com/dasqrolmh/image/upload/v1729810460/img1_ancn4l.webp"} 
            alt="Hero Banner" 
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
            <div className="text-white p-8">
              <h1 className="text-4xl font-bold mb-4">Premium Audio Experience</h1>
              <p className="text-lg mb-6">Discover our latest collection of high-quality audio devices</p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                Shop Now <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div key={category.name} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    {category.icon}
                  </div>
                  <span className="text-sm text-gray-500">{category.count} Products</span>
                </div>
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <a href="#" className="text-blue-600 text-sm flex items-center gap-1 mt-2 hover:underline">
                  Browse All <ChevronRight size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <a href="#" className="text-blue-600 hover:underline flex items-center gap-1">
              View All <ChevronRight size={16} />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <img 
                  src={product.images[0]} 
                  alt={product.productName} 
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{product.productName}</h3>
                  <div className="flex items-center mb-2">
                    <Star size={16} className="text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600"></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">${product.salePrice}</span>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-full hover:bg-gray-100">
                        <Heart size={20} />
                      </button>
                      <button className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700">
                        <ShoppingCart size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        
       
      </div>
    </div>
    <Footer/>
    </div>
    
  );
};

export default LandingPage;