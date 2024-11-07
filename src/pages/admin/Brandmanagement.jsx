import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';

const BrandManagement = () => {
  const [brandName, setBrandName] = useState('');
  const [description, setDescription] = useState('');
  const [brands, setBrands] = useState([]);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false); // To track if we are editing
  const [editBrandId, setEditBrandId] = useState(null); // To track the brand being edited

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await api.get('/admin/getbrands');
      setBrands(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const handleAddOrUpdateBrand = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
     
        const response = await api.put(`/admin/updatebrand/${editBrandId}`, {
          brandName,
          description,
        });
           console.log(response.data)
        setBrands(
          brands.map((brand) =>
            brand._id === editBrandId ? response.data.brand : brand
          )
        );
        console.log(brands)
        setEditMode(false);
      } else {
        // Add new brand
        const response = await api.post('/admin/brandadd', {
          brandName,
          description,
        });
        setBrands([...brands, response.data]);
      }
      setBrandName('');
      setDescription('');
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || "Error adding/updating brand");
    }
  };

  const handleEditBrand = (brand) => {




   

    setEditMode(true);
    setEditBrandId(brand._id);
    setBrandName(brand.brandName);
    setDescription(brand.description);

  




  };

  const handleDeleteBrand = async (id) => {
    try {
      await api.delete(`/admin/brandsdelete/${id}`);
      setBrands(brands.filter((brand) => brand._id !== id));
      console.log(brands)
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Brand Management</h1>

      
      <form onSubmit={handleAddOrUpdateBrand} className="bg-gray-100 shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-xl mx-auto">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="brandName">
            Brand Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="brandName"
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          />
        </div>

        <div className="flex items-center justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {editMode ? 'Update Brand' : 'Add Brand'}
          </button>
        </div>

        {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
      </form>

      {/* Brand List */}
      <h2 className="text-2xl font-bold text-center mb-6">Existing Brands</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <li key={brand._id} className="bg-white shadow-lg rounded-lg p-4">
            <div className="text-center">
              <h3 className="font-bold text-xl mb-2 text-blue-800">{brand.brandName}</h3>
              <p className="text-gray-700 text-base mb-4">{brand.description}</p>
              <div className="flex justify-around">
                <button
                  onClick={() => handleEditBrand(brand)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-1 px-4 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteBrand(brand._id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BrandManagement;
