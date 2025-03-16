const API_URL = 'https://coupon-app-qumv.onrender.com';

export async function getCoupons() {
    const response = await fetch(`${API_URL}/`);
    return response.text();
}
