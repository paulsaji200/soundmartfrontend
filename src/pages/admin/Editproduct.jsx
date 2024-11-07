import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/admin/Category";
import axios from "axios";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { FaTimes } from "react-icons/fa";
import api from "../../utils/axios";
import { useNavigate, useParams } from "react-router-dom";

const EditProductPage = () => {
  const naviagate = useNavigate();
  const { productId } = useParams();
  const [productData, setProductData] = useState({
    productName: "",
    category: "",
    description: "",
    productPrice: "",
    salePrice: "",
    quantity: "",
    brandName: "",
    images: [],
    files: [],
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [currentImage, setCurrentImage] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [showPopup, setShowPopup] = useState(false);


  const cropperRef = useRef(null);
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories);

  useEffect(() => {
    dispatch(fetchCategories());

    const fetchProductDetails = async () => {
      try {
        const response = await api.get(`/admin/geteditproduct/${productId}`);
        const product = response.data.data;

        if (product) {
          setProductData({
            productName: product.productName || "",
            category: product.category || "",
            description: product.description || "",
            productPrice: product.productPrice || "",
            salePrice: product.salePrice || "",
            quantity: product.quantity || "",
            brandName: product.brandName || "",
            images: product.images || [],
            files: [],
          });
          setImagePreviews(product.images.map((img) => img));
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [dispatch, productId]);

  const url = "https://api.cloudinary.com/v1_1/dasqrolmh/upload";
  const uploadPreset = "mern_product";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };
  const deleteImage = async (img, pid) => {
    console.log(img, pid);
    try {
      // Call the backend to delete the image
      const response = await api.delete(`/admin/deleteimageproduct`, {
        params: {
          img: img,
          pid: pid,
        },
      });
  
      // Log the successful deletion
      console.log("Image deleted successfully:", response.data);
  
      // After successful deletion, update the productData.images array by filtering out the deleted image
      const updatedImages = productData.images.filter((image) => image !== img);
  
      // Update the productData state with the new array of images
      setProductData((prevData) => ({
        ...prevData,
        images: updatedImages,
      }));
  
   
      setImagePreviews(updatedImages);
  
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };
  
  

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentImage(URL.createObjectURL(file));
    }
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current.cropper;
      if (cropper) {
        const croppedCanvas = cropper.getCroppedCanvas();
        const croppedImageUrl = croppedCanvas.toDataURL();
        const newFile = dataURLtoFile(croppedImageUrl, "cropped-image.jpg");
        setProductData((prevState) => ({
          ...prevState,
          files: [...prevState.files, newFile],
        }));
        setImagePreviews((prev) => [...prev, URL.createObjectURL(newFile)]);
        setCurrentImage(null);
      }
    }
  };

  const dataURLtoFile = (dataURL, filename) => {
    const [header, data] = dataURL.split(",");
    const mime = header.match(/:(.*?);/)[1];
    const binary = atob(data);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new File([new Uint8Array(array)], filename, { type: mime });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!productData.productName) {
      newErrors.productName = "Product name is required";
    }
    if (!productData.category) {
      newErrors.category = "Category is required";
    }
    if (!productData.description) {
      newErrors.description = "Description is required";
    }
    
    // Product price validation: ensure it's a number and greater than or equal to 0
    if (!productData.productPrice || isNaN(productData.productPrice) || productData.productPrice < 0) {
      newErrors.productPrice = "Valid product price is required";
    }

    // Sale price validation: ensure it's a number and greater than or equal to 0
    if (!productData.salePrice || isNaN(productData.salePrice) || productData.salePrice < 0) {
      newErrors.salePrice = "Valid sale price is required";
    }

    // Quantity validation: ensure it's a number and greater than or equal to 0
    if (!productData.quantity || isNaN(productData.quantity) || productData.quantity < 0) {
      newErrors.quantity = "Valid quantity is required";
    }
    
    if (!productData.brandName) {
      newErrors.brandName = "Brand name is required";
    }


    const totalImages = productData.files.length + productData.images.length;
console.log(totalImages)
    if (totalImages < 3) {
      newErrors.files =
        "At least three images (including existing ones) are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const uploadedImages = await Promise.all(
        productData.files.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", uploadPreset);

          const response = await fetch(url, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Failed to upload image");
          }

          const data = await response.json();
          return data.secure_url;
        })
      );

      const finalProductData = {
        ...productData,
        images: [...productData.images, ...uploadedImages],
      };

      await api.put(`/admin/updateproduct/${productId}`, finalProductData);

      setSuccessMessage("Product successfully updated!");
     
     
      setImagePreviews([]);
      setErrors({});
      setShowPopup(true);

      // Hide the popup after a few seconds
      setTimeout(() => {
        naviagate("/admin/products")
        setShowPopup(false);
      }, 3000); 



    } catch (error) {
      console.error("Error uploading product:", error);
    }
  };

  return (
    <div className="w-3/4 p-8">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      {successMessage && (
        <p className="text-green-500 mb-4">{successMessage}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block text-gray-700">Product Name:</label>
            <input
              type="text"
              name="productName"
              value={productData.productName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter product name"
            />
            {errors.productName && (
              <p className="text-red-500 text-sm">{errors.productName}</p>
            )}
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700">Category:</label>
            <select
              name="category"
              value={productData.category}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-gray-700">Description:</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter product description"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>

        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block text-gray-700">Product Price:</label>
            <input
              type="number"
              name="productPrice"
              value={productData.productPrice}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter product price"
            />
            {errors.productPrice && (
              <p className="text-red-500 text-sm">{errors.productPrice}</p>
            )}
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700">Sale Price:</label>
            <input
              type="number"
              name="salePrice"
              value={productData.salePrice}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter sale price"
            />
            {errors.salePrice && (
              <p className="text-red-500 text-sm">{errors.salePrice}</p>
            )}
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block text-gray-700">Quantity:</label>
            <input
              type="number"
              name="quantity"
              value={productData.quantity}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter quantity"
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm">{errors.quantity}</p>
            )}
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700">Brand Name:</label>
            <input
              type="text"
              name="brandName"
              value={productData.brandName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter brand name"
            />
            {errors.brandName && (
              <p className="text-red-500 text-sm">{errors.brandName}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-gray-700">Images:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full mb-2"
          />
          {currentImage && (
            <div>
              <Cropper
                src={currentImage}
                ref={cropperRef}
                style={{ height: 200, width: "100%" }}
                initialAspectRatio={1}
                aspectRatio={1}
                guides={false}
              />
              <button
                type="button"
                onClick={handleCrop}
                className="mt-2 p-2 bg-blue-500 text-white rounded"
              >
                Crop and Upload
              </button>
            </div>
          )}
          <div className="mt-4">
            {imagePreviews.map((img, index) => (
              <div key={index} className="relative inline-block mr-2">
                <img
                  src={img}
                  alt={`Product ${index}`}
                  className="h-20 w-20 object-cover"
                />
                <button
                  onClick={() => {
                    const newImages = imagePreviews.filter(
                      (_, i) => i !== index
                    );
                    setImagePreviews(newImages);
                    deleteImage(img,productId);
                  }}
                  className="absolute top-0 right-0 text-red-500"

                  

                >
                  < FaTimes />
                </button>
              </div>
            ))}
          </div>
          {errors.files && (
            <p className="text-red-500 text-sm">{errors.files}</p>
          )}
        </div>

        <button
          type="submit"
          className="mt-4 p-2 bg-green-500 text-white rounded"
        >
          Update Product
        </button>
        
      </form>
      
      {showPopup && (
        <div className="fixed top-5 right-5 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          <p>Product successfully updated!</p>
        </div>
      )}
    </div>
  );
};

export default EditProductPage;
