// frontend/src/components/AddUser.jsx (hoặc file tương đương)
import React, { useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export default function AddUser({ onAdd }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation: Check if name is not empty
        if (!name.trim()) {
            alert("Name không được để trống");
            return;
        }

        // Validation: Check if email has valid format
        if (!/\S+@\S+\.\S+/.test(email)) {
            alert("Email không hợp lệ");
            return;
        }

        const newUser = { name, email };

        try {
            // Use env-based API URL instead of hardcoding the frontend port
            await axios.post(`${API_BASE}/users`, newUser);

            // Refresh list
            if (typeof onAdd === 'function') onAdd();

            // Clear form
            setName("");
            setEmail("");

            alert("User đã được thêm thành công!");
        } catch (error) {
            console.error("Lỗi khi thêm user:", error?.response?.status, error?.message || error);
            alert("Có lỗi xảy ra khi thêm user. Vui lòng thử lại.");
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