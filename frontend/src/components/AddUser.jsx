// frontend/src/components/AddUser.jsx (hoặc file tương đương)
import React, { useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function AddUser({ onAdd }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newUser = { name, email };

        try {
            // Use env-based API URL instead of hardcoding the frontend port
            await axios.post(`${API_BASE}/users`, newUser);

            // Refresh list
            if (typeof onAdd === 'function') onAdd();

            // Clear form
            setName("");
            setEmail("");
        } catch (error) {
            console.error("Lỗi khi thêm user:", error?.response?.status, error?.message || error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Thêm User</h2>
            <div>
                <input
                    type="text"
                    placeholder="Tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <button type="submit">Thêm</button>
        </form>
    );
}