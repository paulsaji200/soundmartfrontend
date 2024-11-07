import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addAddressAsync, updateAddressAsync } from "../../redux/user/address";

const AddressForm = ({ addressData, isEdit, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    state: "",
    address: "",
    pincode: "",
    addressType: "",
    landmark: "",
    mobile: "",
    email: "",
    alternate: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isEdit && addressData) {
      setFormData(addressData);
    }
  }, [isEdit, addressData]);

  const handleChange = (e) => {
    const { id, value, type } = e.target;
    if (type === "radio") {
      setFormData((prevData) => ({
        ...prevData,
        [e.target.name]: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await dispatch(updateAddressAsync({ addressId: addressData._id, updatedData: formData }));
        setSuccessMessage("Address updated successfully!");
      } else {
        await dispatch(addAddressAsync({ formData }));
        setSuccessMessage("Address added successfully!");
      }

      setTimeout(() => {
        setSuccessMessage("");
        navigate("/userprofile/address"); 
      }, 1000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSuccessMessage("An error occurred. Please try again.");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  return (
    <div className="mt-20 fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="max-w-lg w-full p-6 bg-white rounded-lg shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={() => {
            if (isEdit) {
              onClose(); // Close the form if editing
            } else {
              navigate("/userprofile/address"); // Navigate if adding
            }
          }}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          {isEdit ? "X" : "X"}
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">
          {isEdit ? "Edit Address" : "Add New Address"}
        </h2>

        {successMessage && (
          <div className="mb-4 text-center text-green-600">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
<div className="mb-4">
  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
    Name
  </label>
  <input
    type="text"
    id="name"
    value={formData.name}
    onChange={handleChange}
    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
    required
  />
</div>
<div className="grid grid-cols-2 gap-4 mb-4">
  <div>
    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
      City / District / Town
    </label>
    <input
      type="text"
      id="city"
      value={formData.city}
      onChange={handleChange}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      required
    />
  </div>
  <div>
    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
      State
    </label>
    <input
      type="text"
      id="state"
      value={formData.state}
      onChange={handleChange}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      required
    />
  </div>
</div>
<div className="mb-4">
  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
    Address
  </label>
  <textarea
    id="address"
    rows={3}
    value={formData.address}
    onChange={handleChange}
    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
    required
  />
</div>
<div className="grid grid-cols-2 gap-4 mb-4">
  <div>
    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
      Pin Code
    </label>
    <input
      type="text"
      id="pincode"
      value={formData.pincode}
      onChange={handleChange}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      required
    />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">Address Type</label>
    <div className="mt-2 space-x-4">
      <label className="inline-flex items-center">
        <input
          type="radio"
          name="addressType"
          value="home"
          checked={formData.addressType === "home"}
          onChange={handleChange}
          className="form-radio"
        />
        <span className="ml-2">Home</span>
      </label>
      <label className="inline-flex items-center">
        <input
          type="radio"
          name="addressType"
          value="work"
          checked={formData.addressType === "work"}
          onChange={handleChange}
          className="form-radio"
        />
        <span className="ml-2">Work</span>
      </label>
    </div>
  </div>
</div>
<div className="mb-4">
  <label htmlFor="landmark" className="block text-sm font-medium text-gray-700">
    Landmark
  </label>
  <input
    type="text"
    id="landmark"
    value={formData.landmark}
    onChange={handleChange}
    placeholder="Optional"
    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
  />
</div>
<h3 className="text-lg font-semibold mb-4">Contact Information</h3>
<div className="grid grid-cols-2 gap-4 mb-4">
  <div>
    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
      Mobile Number
    </label>
    <input
      type="tel"
      id="mobile"
      value={formData.mobile}
      onChange={handleChange}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      required
    />
  </div>
  <div>
    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
      E-mail
    </label>
    <input
      type="email"
      id="email"
      value={formData.email}
      onChange={handleChange}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      required
    />
  </div>
</div>
<div className="mb-4">
  <label htmlFor="alternate" className="block text-sm font-medium text-gray-700">
    Alternate Number
  </label>
  <input
    type="tel"
    id="alternate"
    value={formData.alternate}
    onChange={handleChange}
    placeholder="Optional"
    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
  />
</div>
<button
  type="submit"
  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
>
  {isEdit ? "Update Address" : "Save Address"}
</button>
</form>
      </div>
    </div>
  );
};

export default AddressForm;
