import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("http://localhost:5000/api/patients");
      if (!res.ok) {
        throw new Error("Failed to fetch patients");
      }
      const data = await res.json();
      setPatients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("http://localhost:5000/api/patients/sync", {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("Failed to sync patients");
      }
      await fetchPatients();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="container">
      <div className="header">
        <h2>Patient List</h2>
        <button onClick={handleSync} disabled={loading} className="sync-btn">
          {loading ? "Syncing..." : "Sync Patients"}
        </button>
      </div>

      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      <table className="patient-table">
        <thead>
          <tr>
            <th>Reg. ID</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Mobile</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {patients.length === 0 && !loading ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No patients found. Click "Sync Patients" to load data.
              </td>
            </tr>
          ) : (
            patients.map((patient) => (
              <tr key={patient.externalId || patient._id}>
                <td>{patient.registrationId || "-"}</td>
                <td>{patient.name || "-"}</td>
                <td>{patient.gender || "-"}</td>
                <td>{patient.age || "-"}</td>
                <td>{patient.mobile || "-"}</td>
                <td>{patient.address || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
