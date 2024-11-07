import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAddressAsync, fetchAddressesAsync } from '../../redux/user/address';
import AddressForm from './Addadress';

const AddressManagement = () => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const addresses = useSelector((state) => state.address.addresses);
  const [current, setCurrent] = useState(null);
  const [edit, setEdit] = useState(false);
  const [deleteId, setDeleteId] = useState(null); // State to track the address to be deleted
  const navigate = useNavigate();

  const confirmDelete = (address_id) => {
    setDeleteId(address_id); // Set the address ID for which delete confirmation is required
  };

  const deleteAddress = async () => {
    try {
      if (deleteId) {
        dispatch(deleteAddressAsync(deleteId));
        setDeleteId(null); // Reset the deleteId after deletion
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleEditClick = (address) => {
    setShowForm(true);
    setCurrent(address);
    setEdit(true);
  };

  const handleCloseForm = () => {
    setEdit(false);
    setCurrent(null);
    setShowForm(false); 
  };

  useEffect(() => {
    dispatch(fetchAddressesAsync());
  }, [dispatch]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Manage Addresses</h1>
      <p className="mb-4">Here you can manage the addresses. You can add, edit, or delete the addresses.</p>

      <button
        onClick={() => navigate('/userprofile/addaddress')}
        className="w-full bg-pink-400 text-white py-2 rounded mb-4"
      >
        + Add New Address
      </button>

      {addresses.length === 0 ? (
        <div className="text-center text-gray-600">No addresses added yet.</div>
      ) : (
        addresses.map((addr, index) => (
          <div key={index} className="border rounded p-3 mb-3">
            {addr.default && <div className="font-bold">Default</div>}
            <div>{addr.name}</div>
            <div>{addr.address}</div>
            <div>{addr.city}, {addr.state}</div>
            <div>{addr.pincode}</div>
            <div>Mobile: {addr.mobile}</div>
            <div className="mt-2">
              <button onClick={() => handleEditClick(addr)} className="text-blue-600 mr-3">Edit</button>
              <button onClick={() => confirmDelete(addr._id)} className="text-blue-600">Delete</button>
            </div>
          </div>
        ))
      )}

      {showForm && (
        <AddressForm addressData={current} isEdit={edit} onClose={handleCloseForm} />
      )}

      {/* Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p className="mb-4">Are you sure you want to delete this address?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={deleteAddress}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteId(null)} // Cancel deletion
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressManagement;
