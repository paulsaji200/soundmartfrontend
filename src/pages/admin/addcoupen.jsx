import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';

const CouponManagement = () => {
    const [coupons, setCoupons] = useState([]);
    const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', expiryDate: '', minPurchase: '', maxPurchase: '', maxDiscount: '' });
    
    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const response = await api.get('/admin/getcoupon');
                setCoupons(response.data);
            } catch (error) {
                console.error('Error fetching coupons:', error);
            }
        };
        
        fetchCoupons();
    }, []);
    
    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/admin/createcoupon', newCoupon);
            setCoupons([...coupons, response.data.coupon]);
            setNewCoupon({ code: '', discount: '', expiryDate: '', minPurchase: '', maxPurchase: '', maxDiscount: '' });
        } catch (error) {
            console.error('Error creating coupon:', error);
        }
    };
    
    const handleDeleteCoupon = async (id) => {
        try {
            await api.delete(`/admin/deletecoupon/${id}`);
            setCoupons(coupons.filter(coupon => coupon._id !== id));
        } catch (error) {
            console.error('Error deleting coupon:', error);
        }
    };
    
    return (
        <div className="container mx-auto mt-8 px-4">
            <h1 className="text-3xl font-bold mb-6">Coupon Management</h1>
            <form onSubmit={handleCreateCoupon} className="mb-8">
                {/* Coupon Code */}
                <div className="mb-4">
                    <label htmlFor="couponCode" className="block text-sm font-medium text-gray-700 mb-1">Coupon Code:</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        id="couponCode"
                        value={newCoupon.code}
                        onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                        required
                    />
                </div>
                
                {/* Discount Percentage */}
                <div className="mb-4">
                    <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage:</label>
                    <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        id="discount"
                        value={newCoupon.discount}
                        onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                        required
                    />
                </div>
                
                {/* Expiry Date */}
                <div className="mb-4">
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date:</label>
                    <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        id="expiryDate"
                        value={newCoupon.expiryDate}
                        onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                        required
                    />
                </div>
                
                {/* Minimum Purchase */}
                <div className="mb-4">
                    <label htmlFor="minPurchase" className="block text-sm font-medium text-gray-700 mb-1">Minimum Purchase Amount:</label>
                    <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        id="minPurchase"
                        value={newCoupon.minPurchase}
                        onChange={(e) => setNewCoupon({ ...newCoupon, minPurchase: e.target.value })}
                    />
                </div>
                
                {/* Maximum Purchase */}
                <div className="mb-4">
                    <label htmlFor="maxPurchase" className="block text-sm font-medium text-gray-700 mb-1">Maximum Purchase Amount (optional):</label>
                    <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        id="maxPurchase"
                        value={newCoupon.maxPurchase}
                        onChange={(e) => setNewCoupon({ ...newCoupon, maxPurchase: e.target.value })}
                    />
                </div>

                {/* Maximum Discount */}
                <div className="mb-4">
                    <label htmlFor="maxDiscount" className="block text-sm font-medium text-gray-700 mb-1">Maximum Discount (optional):</label>
                    <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        id="maxDiscount"
                        value={newCoupon.maxDiscount}
                        onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: e.target.value })}
                    />
                </div>
                
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Create Coupon
                </button>
            </form>
            
            {/* Display Existing Coupons */}
            <h2 className="text-2xl font-semibold mb-4">Existing Coupons</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Purchase</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Purchase</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Discount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {coupons.map(coupon => (
                            <tr key={coupon._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{coupon.code}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{coupon.discount}%</td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">${coupon.minPurchase || 0}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{coupon.maxPurchase ? `$${coupon.maxPurchase}` : 'No Limit'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{coupon.maxDiscount ? `$${coupon.maxDiscount}` : 'No Limit'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button 
                                        className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        onClick={() => handleDeleteCoupon(coupon._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CouponManagement;
