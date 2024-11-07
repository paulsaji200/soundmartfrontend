import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../redux/admin/Category';
import axios from 'axios';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { FaTimes } from 'react-icons/fa';
import api from '../../utils/axios';

const Addproductcomp = () => {
  const [productData, setProductData] = useState({
    productName: '',
    category: '',
    description: '',
    productPrice: null,
    salePrice: null,
    quantity: null,
    brandName: '',
    images: [],
    files: [],
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [currentImage, setCurrentImage] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [brands,setBrands] = useState([])
  const cropperRef = useRef(null);

  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories);
  const fetchBrands = async () => {
    try {
      const response = await api.get('/admin/getbrands');
      setBrands(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  useEffect(() => {
    dispatch(fetchCategories());
    fetchBrands();
  }, [dispatch]);

  const url = "https://api.cloudinary.com/v1_1/dasqrolmh/upload";
  const uploadPreset = "mern_product";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentImage(URL.createObjectURL(file));
    }
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current?.cropper;
      if (cropper) {
        const croppedCanvas = cropper.getCroppedCanvas();
        const croppedImageUrl = croppedCanvas.toDataURL();
        const newFile = dataURLtoFile(croppedImageUrl, "cropped-image.jpg");
        setProductData(prevState => ({
          ...prevState,
          files: [...prevState.files, newFile],
        }));
        setImagePreviews(prev => [...prev, URL.createObjectURL(newFile)]);
        setCurrentImage(null);
      } else {
        console.error("Cropper instance is not available");
      }
    }
  };

  const dataURLtoFile = (dataURL, filename) => {
    const [header, data] = dataURL.split(',');
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

    // Validate that at least three images have been uploaded
    if (!productData.files || productData.files.length < 3) {
      newErrors.files = "At least three images are required";
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
            throw new Error('Failed to upload image');
          }

          const data = await response.json();
          return data.secure_url;
        })
      );

      const finalProductData = {
        ...productData,
        images: uploadedImages,
      };
          console.log(finalProductData)
      await axios.post("http://localhost:5000/api/admin/addproduct", finalProductData);

      setSuccessMessage('Product successfully added!');
      setProductData({
        productName: '',
        category: '',
        description: '',
        productPrice: '',
        salePrice: '',
        quantity: '',
        brandName: '',
        images: [],
        files: [],
      });
      setImagePreviews([]);
      setErrors({});
    } catch (error) {
      console.error("Error uploading product:", error);
    }
  };

  return (
    <div className="w-3/4 p-8">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input fields for product data */}
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
            {errors.productName && <p className="text-red-500 text-sm">{errors.productName}</p>}
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
            {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
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
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
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
            {errors.productPrice && <p className="text-red-500 text-sm">{errors.productPrice}</p>}
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
            {errors.salePrice && <p className="text-red-500 text-sm">{errors.salePrice}</p>}
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
            {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
          </div>
          <div className="w-1/2">
  <label className="block text-gray-700">Brand Name:</label>
  <select
    name="brandName"
    value={productData.brandName}
    onChange={handleInputChange}
    className="w-full p-2 border border-gray-300 rounded"
  >
    <option value="">Select a brand</option>
    {brands.map((brand) => (
      <option key={brand._id} value={brand.brandName}>
        {brand.brandName}
      </option>
    ))}
  </select>
  {errors.brandName && <p className="text-red-500 text-sm">{errors.brandName}</p>}
</div>

        </div>

        <div>
          <label className="block text-gray-700">Upload Images:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-4"
          />
          {currentImage && (
            <div className="relative">
              <Cropper
                src={currentImage}
                style={{ height: 400, width: '100%' }}
                initialAspectRatio={1}
                aspectRatio={1}
                guides={false}
                ref={cropperRef}
              />
              <button
                type="button"
                onClick={handleCrop}
                className="absolute top-2 right-2 p-2 bg-blue-500 text-white rounded"
              >
                Crop
              </button>
            </div>
          )}
        </div>

        {imagePreviews.length > 0 && (
          <div className="flex space-x-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className="w-24 h-24 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImagePreviews(prev => prev.filter((_, i) => i !== index))}
                  className="absolute top-0 right-0 p-1 bg-red-500 text-white text-xs rounded"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        )}

        {errors.files && <p className="text-red-500 text-sm">{errors.files}</p>}

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default Addproductcomp;
