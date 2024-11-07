import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../redux/admin/Category';
import { updateCategory, addCategory } from '../../redux/admin/Category'; 

const CategoryManagement = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categories);

  const [newCategory, setNewCategory] = React.useState("");
  const [categoryOffer, setCategoryOffer] = React.useState(0);

  const [isListed, setIsListed] = React.useState(true);
  const [editCategoryId, setEditCategoryId] = React.useState(null);
  const [editMode, setEditMode] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddOrEditCategory = () => {
    if (!newCategory) {
      setErrorMessage('Category name cannot be empty');
      return;
    }

    if (categoryOffer < 0 ) {
      setErrorMessage('Offers cannot be negative');
      return;
    }

    const categoryExists = categories.some((category) => category.name.toLowerCase() === newCategory.toLowerCase());
    if (categoryExists && !editMode) {
      setErrorMessage('Category already exists');
      return;
    }

    const categoryData = {
      name: newCategory,
      listed: isListed,
      offer:categoryOffer,
     
    };

    if (editMode) {
      dispatch(updateCategory({ id: editCategoryId, ...categoryData }));
      resetForm();
    } else {
      dispatch(addCategory(categoryData));
      resetForm();
    }
  };

  const startEditingCategory = (category) => {
    setNewCategory(category.name);
    setCategoryOffer(category.categoryOffer || 0);
   
    setIsListed(category.listed);
    setEditCategoryId(category._id);
    setEditMode(true);
    setErrorMessage(null);
  };

  const resetForm = () => {
    setNewCategory('');
    setCategoryOffer(0);

    setIsListed(true);
    setEditCategoryId(null);
    setEditMode(false);
    setErrorMessage(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Category Management</h2>
      </div>

      <div className="bg-white rounded shadow-md p-4">
        <table className="min-w-full bg-white mb-4">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">S.No</th>
              <th className="py-2 px-4 border-b">Category Name</th>
              <th className="py-2 px-4 border-b">Offer</th>
   
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category._id}>
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">{category.name}</td>
                <td className="py-2 px-4 border-b">{category.categoryOffer || 0}%</td>
                
                <td className="py-2 px-4 border-b">
                  {category.listed ? (
                    <span className="text-green-500 font-semibold">Listed</span>
                  ) : (
                    <span className="text-gray-500 font-semibold">Unlisted</span>
                  )}
                </td>
                <td className="py-2 px-4 border-b flex justify-center space-x-2">
                  <button onClick={() => startEditingCategory(category)} className="bg-blue-500 text-white p-2 rounded">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="bg-gray-100 p-4 rounded shadow-md">
          <h3 className="text-xl mb-4">{editMode ? 'Edit Category' : 'Add New Category'}</h3>
          <div className="flex flex-col space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category Name</label>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category Name"
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category Offer (%)</label>
              <input
                type="number"
                value={categoryOffer}
                onChange={(e) => setCategoryOffer(e.target.value)}
                placeholder="Category Offer"
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:border-green-500"
                min="0"
              />
            </div>
         
            <div className="flex items-center">
              <label className="mr-4">Listed</label>
              <input
                type="checkbox"
                checked={isListed}
                onChange={() => setIsListed(!isListed)}
                className="form-checkbox h-5 w-5 text-green-600"
              />
            </div>
            <div className="flex space-x-4">
              <button onClick={handleAddOrEditCategory} className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-900">
                {editMode ? 'Update' : 'Save'}
              </button>
              {editMode && (
                <button onClick={resetForm} className="bg-gray-500 text-white py-2 px-4 rounded">
                  Cancel
                </button>
              )}
            </div>
          </div>
          {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
