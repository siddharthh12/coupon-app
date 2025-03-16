import { useEffect, useState } from 'react';
import axios from 'axios';

function AdminPanel() {
    const [coupons, setCoupons] = useState([]);
    const [newCoupon, setNewCoupon] = useState('');
    const [editCoupon, setEditCoupon] = useState(null);
    const [message, setMessage] = useState('');
    const token = localStorage.getItem("adminToken");

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/coupons', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCoupons(response.data);
        } catch (error) {
            setMessage("Unauthorized! Please log in again.");
        }
    };

    const addCoupon = async () => {
        try {
            await axios.post('http://localhost:5000/api/admin/add-coupon', 
                { code: newCoupon }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage("Coupon added successfully!");
            setNewCoupon('');
            fetchCoupons();
        } catch (error) {
            setMessage("Error adding coupon.");
        }
    };

    const startEditing = (coupon) => {
        setEditCoupon({ ...coupon });
    };

    const updateCoupon = async () => {
        try {
            await axios.put(`http://localhost:5000/api/admin/update-coupon/${editCoupon._id}`, 
                { code: editCoupon.code, status: editCoupon.status }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage("Coupon updated successfully!");
            setEditCoupon(null);
            fetchCoupons();
        } catch (error) {
            setMessage("Error updating coupon.");
        }
    };

    const deleteCoupon = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/admin/delete-coupon/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage("Coupon deleted successfully!");
            fetchCoupons();
        } catch (error) {
            setMessage("Error deleting coupon.");
        }
    };

    return (
        <div className="admin-container">
            <h1>Admin Panel</h1>

            <div className="card">
                <h2>Add New Coupon</h2>
                <input
                    type="text"
                    value={newCoupon}
                    onChange={(e) => setNewCoupon(e.target.value)}
                    placeholder="Enter Coupon Code"
                    className="input-field"
                />
                <button className="add-btn" onClick={addCoupon}>Add Coupon</button>
                <p className="message">{message}</p>
            </div>

            <div className="card">
                <h2>All Coupons</h2>
                <ul className="coupon-list">
                    {coupons.map((coupon) => (
                        <li key={coupon._id} className="coupon-item">
                            {editCoupon && editCoupon._id === coupon._id ? (
                                <div className="edit-container">
                                    <input 
                                        type="text"
                                        value={editCoupon.code}
                                        onChange={(e) => setEditCoupon({ ...editCoupon, code: e.target.value })}
                                        className="edit-input"
                                    />
                                    <select 
                                        value={editCoupon.status}
                                        onChange={(e) => setEditCoupon({ ...editCoupon, status: e.target.value })}
                                        className="edit-select"
                                    >
                                        <option value="available">Available</option>
                                        <option value="claimed">Claimed</option>
                                    </select>
                                    <div className="button-group">
                                        <button className="save-btn" onClick={updateCoupon}>Save</button>
                                        <button className="cancel-btn" onClick={() => setEditCoupon(null)}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="coupon-info">
                                    <span>{coupon.code} - {coupon.status}</span>
                                    <div className="button-group">
                                        <button className="edit-btn" onClick={() => startEditing(coupon)}>Edit</button>
                                        <button className="delete-btn" onClick={() => deleteCoupon(coupon._id)}>Delete</button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AdminPanel;
