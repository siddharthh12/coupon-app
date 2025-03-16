import { useState } from "react";
import axios from "axios";

function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/admin/login", {
                username,
                password
            });
            localStorage.setItem("adminToken", response.data.token);
            window.location.href = "/admin";
        } catch (error) {
            setError("Invalid login credentials");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Admin Login</h1>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="input-field" />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" />
                <button className="login-btn" onClick={handleLogin}>Login</button>
                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
}

export default AdminLogin;
