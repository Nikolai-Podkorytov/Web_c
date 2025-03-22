import { useState } from "react";
import axios from "axios";

export default function DeleteUser({ buttonClass = "btn btn-danger" }) {
    const [id, setId] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false); // Loading state

    const handleDelete = async (event) => {
        event.preventDefault();
        setMessage("");
        setLoading(true); // Indicate loading

        if (!id.trim()) {
            setMessage("Error: User ID is required!");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:3000/users/${id}`);
            setMessage(`User deleted successfully: ID ${response.data.id}`);
            setId("");
        } catch (error) {
            setMessage(`Error: ${error.response?.data?.error || error.message}`);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Delete User</h2>
            {message && (
                <div
                    className={`alert ${
                        message.startsWith("Error") ? "alert-danger" : "alert-success"
                    }`}
                    role="alert"
                >
                    {message}
                </div>
            )}
            <form onSubmit={handleDelete}>
                <div className="mb-3">
                    <label htmlFor="userId" className="form-label">
                        User ID
                    </label>
                    <input
                        type="text"
                        id="userId"
                        className="form-control"
                        placeholder="Enter User ID"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className={`${buttonClass} ${loading ? "disabled" : ""}`}
                >
                    {loading ? "Deleting..." : "Delete"}
                </button>
            </form>
        </div>
    );
}
