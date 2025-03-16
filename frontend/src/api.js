const API_URL = 'http://localhost:5000';

export async function getCoupons() {
    const response = await fetch(`${API_URL}/`);
    return response.text();
}
