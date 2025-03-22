import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function UpdateUser({ onUserUpdated, buttonClass = "btn btn-warning" }) {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false); // Toggle form visibility

    // Toggle form display
    const toggleForm = () => {
        setIsFormOpen(!isFormOpen);
        setMessage(""); // Clear messages when toggling
        setErrors({});
    };

    // Validate input fields
    const validateFields = () => {
        const fieldErrors = {};
        if (!id.trim()) fieldErrors.id = "User ID is required!";
        if (!name.trim()) fieldErrors.name = "Name is required!";
        if (!email.trim()) {
            fieldErrors.email = "Email is required!";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            fieldErrors.email = "Invalid email format!";
        }
        return fieldErrors;
    };

    // Submit form handler
    const handleUpdate = async (event) => {
        event.preventDefault();
        setMessage("");
        setErrors({});
        setLoading(true); // Start loading

        // Validate inputs
        const fieldErrors = validateFields();
        if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            setLoading(false); // Stop loading
            return;
        }

        try {
            const response = await axios.put(`http://localhost:3000/users/${id}`, { name, email });
            setMessage(`User updated successfully: ${response.data.id}`);
            setId("");
            setName("");
            setEmail("");
            if (onUserUpdated) onUserUpdated(); // Notify parent component
        } catch (error) {
            setMessage(`Error: ${error.response?.data?.error || error.message}`);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-center text-warning">Update User</h2>

            {/* Toggle Button */}
            <button className={`${buttonClass} mb-3`} onClick={toggleForm}>
                {isFormOpen ? "Close Form" : "Open Update Form"}
            </button>

            {/* Form Section */}
            {isFormOpen && (
                <div className="card p-4 shadow-sm bg-white rounded">
                    <form onSubmit={handleUpdate}>
                        {/* User ID Field */}
                        <div className="mb-3">
                            <label htmlFor="id" className="form-label">
                                User ID <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                id="id"
                                className={`form-control ${errors.id ? "is-invalid" : ""}`}
                                placeholder="Enter User ID"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                            />
                            {errors.id && <div className="invalid-feedback">{errors.id}</div>}
                        </div>

                        {/* Name Field */}
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                                Name <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                placeholder="Enter Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>

                        {/* Email Field */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email <span className="text-danger">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={`${buttonClass} w-100 d-flex justify-content-center align-items-center`}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                    Updating...
                                </>
                            ) : (
                                "Update User"
                            )}
                        </button>
                    </form>

                    {/* Success/Error Messages */}
                    {message && (
                        <div
                            className={`alert mt-3 ${
                                message.startsWith("Error") ? "alert-danger" : "alert-success"
                            }`}
                            role="alert"
                        >
                            {message}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
