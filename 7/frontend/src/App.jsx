import CreateUser from "./components/CreateUser.jsx";
import UpdateUser from "./components/UpdateUser.jsx";
import ReadDeleteUsers from "./components/ReadDeleteUsers.jsx";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [refresh, setRefresh] = useState(0);

  const cardStyles = {
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    borderRadius: "0.5rem",
  };

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: "#f8f9fa" }}>
      {/* Application Header */}
      <header className="w-100 text-center mb-5">
        <h1 className="text-dark fw-bold">User Management</h1>
      </header>

      {/* Main Content */}
      <main className="w-75">
        {/* Create User Card */}
        <div className="card p-4 mb-4 bg-white" style={{ ...cardStyles, borderLeft: "5px solid #007bff" }}>
          <h2 className="text-center text-primary">Create User</h2>
          <CreateUser
            onUserAdded={() => setRefresh((prev) => prev + 1)}
            buttonClass="btn btn-primary w-100 mt-3"
          />
        </div>

        {/* Read/Delete Users Card */}
        <div className="card p-4 mb-4 bg-white" style={{ ...cardStyles, borderLeft: "5px solid #dc3545" }}>
          <h2 className="text-center text-danger">Users List</h2>
          <ReadDeleteUsers
            refresh={refresh}
            buttonClass="btn btn-danger w-100 mt-2"
          />
        </div>

        {/* Update User Card */}
        <div className="card p-4 mb-4 bg-white" style={{ ...cardStyles, borderLeft: "5px solid #ffc107" }}>
          <h2 className="text-center text-warning">Update User</h2>
          <UpdateUser
            onUserUpdated={() => setRefresh((prev) => prev + 1)}
            buttonClass="btn btn-warning w-100 mt-3"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-muted text-center mt-auto">
        <p>&copy; 2025 User Management App</p>
      </footer>
    </div>
  );
}

export default App;
