import { useState } from "react";
import axios from "axios";

export default function CreateUser({ onUserAdded, buttonClass = "btn btn-primary" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [errors, setErrors] = useState({}); // Validation errors
  const [isFormVisible, setIsFormVisible] = useState(false); // Toggle form visibility

  // Form submission handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);
    setErrors({}); // Reset errors

    // Validate input fields
    const fieldErrors = {};
    if (!name.trim()) fieldErrors.name = "Name is required!";
    if (!email.trim()) {
      fieldErrors.email = "Email is required!";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      fieldErrors.email = "Invalid email format!";
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/users", { name, email });
      setMessage(`User created successfully: ${response.data.name}`);
      setName("");
      setEmail("");
      if (onUserAdded) onUserAdded(); // Notify parent
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center text-primary">Create New User</h2>

      {/* Toggle Button */}
      <button
        className={`${buttonClass} mb-3`}
        onClick={() => setIsFormVisible(!isFormVisible)}
      >
        {isFormVisible ? "Hide Create Form" : "Show Create Form"}
      </button>

      {/* Collapsible Form */}
      {isFormVisible && (
        <div className="card p-4 shadow-sm bg-white rounded">
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
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="name"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-describedby="nameFeedback"
              />
              {errors.name && <div id="nameFeedback" className="invalid-feedback">{errors.name}</div>}
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
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-describedby="emailFeedback"
              />
              {errors.email && <div id="emailFeedback" className="invalid-feedback">{errors.email}</div>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`${buttonClass} d-flex justify-content-center align-items-center`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
