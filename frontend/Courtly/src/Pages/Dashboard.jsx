import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../utils/authSlice";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [centers, setCenters] = useState([]);
  const [sports, setSports] = useState([]);
  const [courts, setCourts] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [date, setDate] = useState("");
  const [showCourts, setShowCourts] = useState(false);

  // Fetch all centers on component mount
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/manager/centers", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCenters(data.centers);
        } else {
          console.error("Failed to fetch centers:", response.status);
        }
      } catch (error) {
        console.error("Error fetching centers:", error);
      }
    };

    fetchCenters();
  }, []);

  // Fetch sports for the selected center
  useEffect(() => {
    const fetchSports = async () => {
      if (selectedCenter) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/manager/centers/${selectedCenter}/sports`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setSports(data.sports);
            setSelectedSport(""); // Reset sport selection
            setCourts([]); // Reset courts on center change
            setShowCourts(false); // Hide courts on center change
          } else {
            console.error("Failed to fetch sports:", response.status);
          }
        } catch (error) {
          console.error("Error fetching sports:", error);
        }
      }
    };

    fetchSports();
  }, [selectedCenter]);

  // Fetch courts for the selected sport
  useEffect(() => {
    const fetchCourts = async () => {
      if (selectedSport) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/manager/sports/${selectedSport}/courts`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setCourts(data.courts);
          } else {
            console.error("Failed to fetch courts:", response.status);
          }
        } catch (error) {
          console.error("Error fetching courts:", error);
        }
      }
    };

    fetchCourts();
  }, [selectedSport]);

  const handleDateChange = (date) => {
    setDate(date);
  };

  // const handleBooking = (courtId, slot, date) => {
  //   console.log(`Booking court ${courtId} for slot ${slot} on date ${date}`);
  // };

  const handleShowCourts = () => {
    if (selectedSport && date) {
      setShowCourts(true);
    } else {
      alert("Please select a sport and a date to see available courts.");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("username");
    navigate("/");
  };
  const handleBooking = async (courtId, slot, date) => {
    try {
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getFullYear()}`;
      
      const response = await fetch("http://localhost:5000/api/manager/book", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          court_id: courtId,
          slot: slot,
          date: formattedDate, // Format date to 'DD-MM-YYYY'
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        alert(data.message || "Booking successful!");
        setShowCourts(false);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to book the slot.");
      }
    } catch (error) {
      console.error("Error booking the slot:", error);
      alert("An error occurred while booking. Please try again.");
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

      <div className="flex-1 ml-64 p-8">
        <h1 className="text-2xl font-bold mb-4">Schedule</h1>

        {/* Dropdowns for selecting center, sport, and date */}
        <div className="flex space-x-4 mb-4">
          <div>
            <label className="block mb-2">Select Center:</label>
            <select
              value={selectedCenter}
              onChange={(e) => setSelectedCenter(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">Select a center</option>
              {centers.map((center) => (
                <option key={center._id} value={center._id}>
                  {center.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">Select Sport:</label>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="p-2 border rounded"
              disabled={!selectedCenter} // Disable until a center is selected
            >
              <option value="">Select a sport</option>
              {sports.map((sport) => (
                <option key={sport._id} value={sport._id}>
                  {sport.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">Select Date:</label>
            <DatePicker
              selected={date}
              onChange={handleDateChange}
              minDate={new Date()}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded cursor-pointer"
              dateFormat="dd/MM/yyyy"
              disabled={!selectedSport} // Disable until a sport is selected
            />
          </div>
        </div>

        {/* Submit button to show courts */}
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition duration-300 mb-4"
          onClick={handleShowCourts}
          disabled={!selectedSport || !date} // Disable until a sport and date are selected
        >
          Show Available Courts
        </button>

        {showCourts && selectedSport && date && (
          <div className="overflow-x-auto">
            <h2 className="text-xl font-semibold mb-2">Available Courts</h2>
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr>
                  <th className="border-b p-2 text-center font-bold">Time Slot</th>
                  {courts.map((court) => (
                    <th key={court._id} className="border-b p-2 text-center font-bold">{court.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {courts.length > 0 && courts[0].slots.map((slot, index) => (
                  <tr key={index}>
                    <td className="border-b p-2 text-center">{slot.slot}</td>
                    {courts.map((court) => (
                      <td key={court._id} className="border-b p-2 text-center">
                        {slot.available ? (
                          <button
                            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition duration-300"
                            onClick={() => handleBooking(court._id, slot.slot, date)}
                          >
                            Book
                          </button>
                        ) : (
                          <span className="text-red-500">Booked</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))} 
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
