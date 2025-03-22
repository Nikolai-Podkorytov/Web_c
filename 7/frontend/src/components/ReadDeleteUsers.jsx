import { useState, useEffect } from "react";
import axios from "axios";

export default function ReadDeleteUsers({ refresh, buttonClass = "btn btn-danger" }) {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false); // Loading state
    const [isListVisible, setIsListVisible] = useState(true); // Toggle list visibility

    // Fetch users from the API
    const fetchUsers = async () => {
        setLoading(true); // Indicate loading
        setError(""); // Clear previous error
        setMessage(""); // Clear previous message
        try {
            const response = await axios.get("http://localhost:3000/users");
            setUsers(response.data);
        } catch (err) {
            setError(`Error fetching users: ${err.response?.data?.error || err.message}`);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [refresh]);

    // Handle user deletion
    const handleDelete = async (id) => {
        setMessage("");
        try {
            await axios.delete(`http://localhost:3000/users/${id}`);
            fetchUsers(); // Refresh the user list
            setMessage(`User with ID ${id} deleted successfully.`);
        } catch (error) {
            setMessage(`Error deleting user: ${error.response?.data?.error || error.message}`);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-center text-primary">Users List</h2>

            {/* Display toggle button */}
            <button
                className="btn btn-secondary mb-3"
                onClick={() => setIsListVisible(!isListVisible)}
            >
                {isListVisible ? "Hide User List" : "Show User List"}
            </button>

            {/* Display messages */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            {message && (
                <div className="alert alert-success" role="alert">
                    {message}
                </div>
            )}

            {/* Loading spinner */}
            {loading && (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {/* User list (conditionally visible) */}
            {isListVisible && !loading && (
                <ul className="list-group shadow-sm">
                    {users.map((user) => (
                        <li
                            key={user.id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            <span>
                                <strong>ID:</strong> {user.id} | <strong>Name:</strong> {user.name} | <strong>Email:</strong> {user.email}
                            </span>
                            <button
                                onClick={() => handleDelete(user.id)}
                                className={buttonClass}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
