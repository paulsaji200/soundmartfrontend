import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactImageMagnify from "react-image-magnify";
import api from "../../utils/axios";
import { FaHeart } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { addToCartAsync } from "../../redux/user/Cart";
import { useDispatch } from "react-redux";
import { addToWishlistAsync } from "../../redux/user/wishlist";

const ProductDetailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  const fetchData = async () => {
    try {
      const response = await api.get(`user/productdetails/${productId}`);
      const productData = response?.data?.data;

      const breadcrumbs = [
        { label: "Home", url: "/" },
        { label: productData.category, url: `/${productData.category}` },
        { label: productData.productName, url: "" }
      ];

      setProductData({ ...productData, breadcrumbs });

      if (productData?.images?.length > 0) {
        setSelectedImage(productData.images[0]);
      }

      setIsInWishlist(false);
      setIsInCart(false);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [productId]);

  const handleAddToCart = (product) => {
    const res = dispatch(addToCartAsync(product));
    console.log(res);
    if (res.status == 401) {
      navigate("/login");
    }
  };

  
  const toggleWishlist = async (event, productId) => {
    event.stopPropagation();
  
    try {
      // Send the request with `withCredentials: true` to ensure cookies (including token) are sent
      setIsInWishlist(true)
      const response = await api.post(
        `/user/addtowishlist/${productId}`, 
        {}, // No body needed
        {
          withCredentials: true,  // Ensure credentials (cookies) are sent
        }
      );
  
     
     
  
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      // Handle any errors (e.g., token missing, expired, etc.)
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const magnifyProps = {
    smallImage: {
      alt: product.productName,
      isFluidWidth: true,
      src: selectedImage,
    },
    largeImage: {
      src: selectedImage,
      width: 1600,
      height: 2400,
    },
    enlargedImageContainerStyle: {
      zIndex: 9999,
    },
    enlargedImagePosition: "beside",
    enlargedImageContainerDimensions: {
      width: "200%",
      height: "100%",
    },
    isHintEnabled: true,
    shouldHideHintAfterFirstActivation: false,
    hintTextMouse: "Hover to zoom",
    imageClassName: "w-full h-auto",
  };
  
  return (
    <div className="container mx-auto p-6">
      <nav className="text-sm text-gray-500 mb-4">
        {product.breadcrumbs
          ? product.breadcrumbs.map((crumb, index) => (
              <span key={index}>
                {crumb.url ? (
                  <Link to={crumb.url} className="text-blue-500 hover:underline">
                    {crumb.label}
                  </Link>
                ) : (
                  crumb.label
                )}
                {index < product.breadcrumbs.length - 1 && " > "}
              </span>
            ))
          : "Home > Product"}
      </nav>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 lg:w-3/5">
          <div className="flex lg:flex-col space-y-0 lg:space-y-4 space-x-4 lg:space-x-0">
            {product.images?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Product ${index + 1}`}
                onClick={() => setSelectedImage(image)}
                className={`cursor-pointer rounded-lg border-2 ${
                  selectedImage === image
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
                style={{ objectFit: "cover", height: "80px", width: "80px" }}
              />
            ))}
          </div>

          <div className="relative flex-1" style={{ maxWidth: "500px" }}>
            <div style={{ width: '100%', position: 'relative' }}>
              <ReactImageMagnify {...magnifyProps} />
            </div>
          </div>
        </div>

        <div className="lg:w-2/5 pl-0 lg:pl-12">
          <h1 className="text-2xl lg:text-3xl font-semibold mb-2">{product.productName}</h1>

          <div className="flex items-center mb-4">
            <div className="flex items-center mr-4">
              <span className="text-yellow-500">
                {"★".repeat(4)}
                {"☆".repeat(5 - 4)}
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="text-xl font-bold">4.0</span>
              <span className="ml-2 text-sm">
                ({product.reviews || 120} reviews)
              </span>
            </div>
          </div>

          <div className="text-lg lg:text-2xl font-bold text-gray-900 mb-2">
            <span className="line-through text-gray-600">
              ${product.productPrice}
            </span>
          </div>
          <div className="text-lg lg:text-2xl font-bold text-gray-900 mb-2">
            ${product.salePrice}
          </div>
          {product.discount && (
            <div className="text-green-600 font-medium mb-4">
              Discount: {product.discount}
            </div>
          )}
          <div className="text-green-500 font-semibold mb-4">
            {product.quantity > 0 ? "In Stock" : "Out of Stock"}
          </div>

          <div className="text-sm text-gray-600 mb-4">
            <p>
              <strong>Free Shipping:</strong> Eligible for free shipping on
              orders over $50
            </p>
            <p>
              <strong>Delivery Options:</strong> Standard (3-5 days), Express
              (1-2 days)
            </p>
          </div>

          <div className="text-red-500 font-semibold mb-4">
  {product.salePrice && product.productPrice && (
    <p>
      Special Offer: Save ₹
      {Math.round(product.productPrice - product.salePrice)} (
      {Math.round(((product.productPrice - product.salePrice) / product.productPrice) * 100)}% off)
    </p>
  )}
</div>


          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-2">Product Description</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-2">Product Highlights</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Brand: {product.brandName}</li>
              <li>Category: {product.category}</li>
              <li>Warranty: {product.warranty || "1 year"}</li>
              <li>Model Number: {product.modelNumber || "XYZ123"}</li>
              <li>Dimensions: {product.dimensions || "10 x 8 x 4 inches"}</li>
              <li>Weight: {product.weight || "2 lbs"}</li>
              <li>Battery Life: {product.batteryLife || "Up to 12 hours"}</li>
              <li>Color: {product.color || "Black"}</li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-2">Customer Reviews</h3>
            <p className="text-gray-700">
              {product.reviews || "No reviews available."}
            </p>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => handleAddToCart(product)}
              className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              <AiOutlineShoppingCart className="mr-2" /> {isInCart ? "Added to Cart" : "Add to Cart"}
            </button>
            <button
              onClick={(e) => toggleWishlist(e, product._id)} 
              className={`flex items-center py-2 px-4 rounded-lg ${
                isInWishlist ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"
              } hover:bg-gray-300`}
            >
              <FaHeart className={`mr-2 ${isInWishlist ? "text-white" : "text-red-500"}`} />
              {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;