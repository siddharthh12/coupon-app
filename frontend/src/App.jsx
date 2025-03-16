import { useState } from 'react';
import axios from 'axios';

function App() {
    const [message, setMessage] = useState('');
    const [coupon, setCoupon] = useState(null);

    const claimCoupon = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/coupons/claim');
            setCoupon(response.data.coupon);
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="home-container">
            <h1>🎉 Claim Your Coupon 🎉</h1>
            {coupon ? (
                <div>
                    <h2 style={{ color: "green" }}>{coupon.code}</h2>
                    <p>{message}</p>
                </div>
            ) : (
                <button onClick={claimCoupon}>Claim Coupon</button>
            )}
        </div>
    );
}

export default App;
