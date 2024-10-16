import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";

// Helper function for API requests
const makeRequest = async (url, method = "GET", data = null) => {
  const token = localStorage.getItem("token");

  try {
    const options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    };
    if (data) options.body = JSON.stringify(data);

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error:", errorData);
      throw new Error(`Error ${response.status}: ${errorData.message}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again.");
  }
};

// Main Admin Component
function AdminDashboard() {
  const navigate = useNavigate();
  const [centers, setCenters] = useState([]);
  const [sports, setSports] = useState([]);
  const [activeForm, setActiveForm] = useState("center");
  const [slots, setSlots] = useState("");
  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedCourt, setSelectedCourt] = useState("");
  const [courts, setCourts] = useState([]);
  const [user, setUser] = useState({ name: "" });

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user")) || { name: "Guest" };
      setUser(storedUser);
    };

    fetchUserData();

    const fetchCenters = async () => {
      const result = await makeRequest("http://localhost:5000/api/manager/centers");
      setCenters(result.centers || []);
    };

    fetchCenters();
  }, []);

  useEffect(() => {
    const fetchSports = async () => {
      if (!selectedCenter) return;
      const result = await makeRequest(`http://localhost:5000/api/manager/centers/${selectedCenter}/sports`);
      setSports(result.sports || []);
    };

    fetchSports();
  }, [selectedCenter]);

  useEffect(() => {
    const fetchCourts = async () => {
      if (!selectedSport) return;
      const result = await makeRequest(`http://localhost:5000/api/manager/sports/${selectedSport}/courts`);
      setCourts(result.courts || []);
    };

    fetchCourts();
  }, [selectedSport]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeForm === "slots") {
      if (!selectedCourt) {
        alert("Please select a court.");
        return;
      }
      const slotArray = slots.split(",").map((slot) => slot.trim());
      const result = await makeRequest(`http://localhost:5000/api/manager/court/${selectedCourt}/slots`, "POST", { slots: slotArray });
      alert(result.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6 h-full fixed flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Courtly</h1>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              {user.name ? user.name.charAt(0) : "U"}
            </div>
            <span>{user.name || "Guest"}</span>
          </div>
        </div>
        <nav>
          <ul className="space-y-4">
            <li className="flex items-center space-x-2">
              <Calendar size={20} />
              <span>Dashboard</span>
            </li>
          </ul>
        </nav>

        <div className="mt-10 left-6">
          <button
            onClick={handleLogout}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow p-10 bg-gray-50 ml-64">
        <h1 className="mb-8 text-4xl font-bold text-center text-gray-800">Admin Dashboard</h1>

        {/* Button Section */}
        <div className="flex justify-center mb-8 space-x-4">
          {["center", "sport", "court"].map((formType) => (
            <button
              key={formType}
              onClick={() => setActiveForm(formType)}
              className={`px-6 py-3 rounded-lg text-white transition-colors duration-300 ${
                activeForm === formType ? "bg-blue-700 shadow-lg" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {`Add ${formType.charAt(0).toUpperCase() + formType.slice(1)}`}
            </button>
          ))}
        </div>

        {/* Forms Section */}
        <div className="flex justify-center">
          {activeForm === "center" && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const centerName = e.target.centerName.value;
                const location = e.target.location.value;
                const result = await makeRequest("http://localhost:5000/api/manager/center", "POST", { name: centerName, location });
                alert(result.message);
                setCenters((prev) => [...prev, result.center]);
                e.target.reset();
              }}
              className="p-6 space-y-4 bg-white rounded-lg shadow-md"
            >
              <h2 className="text-2xl font-semibold text-gray-700">Add Center</h2>
              <input
                name="centerName"
                type="text"
                placeholder="Center Name"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                required
              />
              <input
                name="location"
                type="text"
                placeholder="Location"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                required
              />
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-all"
              >
                Add Center
              </button>
            </form>
          )}
          <div className="flex justify-center ">

          {activeForm === "sport" && (
              <form
              onSubmit={async (e) => {
                  e.preventDefault();
                  const sportName = e.target.sportName.value;
                  const result = await makeRequest("http://localhost:5000/api/manager/sport", "POST", { name: sportName, center_id: selectedCenter });
                  alert(result.message);
                  setSports((prev) => [...prev, result.sport]);
                  e.target.reset();
                }}
                className="p-6 space-y-4 bg-white rounded-lg shadow-md"
                >
              <h2 className="text-2xl font-semibold text-gray-700">Add Sport</h2>
              <select
                value={selectedCenter}
                onChange={(e) => setSelectedCenter(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                required
                >
                <option value="">Select Center</option>
                {centers.map((center) => (
                    <option key={center._id} value={center._id}>
                    {center.name}
                  </option>
                ))}
              </select>
              <input
                name="sportName"
                type="text"
                placeholder="Sport Name"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                required
                />
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-all"
                >
                Add Sport
              </button>
            </form>
          )}
          </div>

          {activeForm === "court" && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const courtName = e.target.courtName.value;
                const slotInput = e.target.slotInput.value;
                const slotArray = slotInput.split(",").map((slot) => slot.trim());

                const result = await makeRequest("http://localhost:5000/api/manager/court", "POST", {
                  name: courtName,
                  sport_id: selectedSport,
                  slots: slotArray,
                });

                alert(result.message);
                setCourts((prev) => [...prev, result.court]);
                e.target.reset();
              }}
              className="p-6 space-y-4 bg-white rounded-lg shadow-md"
            >
              <h2 className="text-2xl font-semibold text-gray-700">Add Court</h2>
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                required
              >
                <option value="">Select Sport</option>
                {sports.map((sport) => (
                  <option key={sport._id} value={sport._id}>
                    {sport.name}
                  </option>
                ))}
              </select>
              <input
                name="courtName"
                type="text"
                placeholder="Court Name"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                required
              />
              <input
                name="slotInput"
                type="text"
                placeholder="Enter Slots (comma separated)"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-all"
              >
                Add Court
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
