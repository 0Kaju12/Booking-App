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
  const [date, setDate] = useState(null); // Changed to null for better handling
  const [showCourts, setShowCourts] = useState(false);

  const allTimeSlots = [];

  // Helper function to format time
  const formatTime = (hour) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12; // Convert 0 to 12 for midnight
    return hour12 + ":00 " + ampm;
  };

  // Generate all time slots from 12:00 AM to 11:00 PM
  for (let i = 0; i < 24; i++) {
    const startTime = formatTime(i);
    const endTime = formatTime(i + 1);
    allTimeSlots.push(`${startTime} - ${endTime}`);
  }

  console.log("All Time Slots:", allTimeSlots);

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
          console.log("Fetched Centers:", data.centers);
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
            console.log("Fetched Sports for Center:", data.sports);
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
            console.log("Fetched Courts for Sport:", data.courts);
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
    console.log("Selected Date:", date);
  };

  const handleShowCourts = () => {
    console.log("Show Courts clicked. Selected Sport:", selectedSport, "Date:", date);
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
      
      console.log("Booking Info:", { courtId, slot, formattedDate });

      const response = await fetch("http://localhost:5000/api/bookings/book", {
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

        // Update the state to mark the slot as booked
        setCourts((prevCourts) =>
          prevCourts.map((court) =>
            court._id === courtId // Changed 'court.id' to 'court._id' to match fetched data
              ? {
                  ...court,
                  slots: court.slots.map((s) =>
                    s.slot === slot ? { ...s, available: false } : s
                  ),
                }
              : court
          )
        );
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
              onChange={(e) => {
                setSelectedCenter(e.target.value);
                console.log("Selected Center:", e.target.value); // Log selected center
              }}
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
              onChange={(e) => {
                setSelectedSport(e.target.value);
                console.log("Selected Sport:", e.target.value); // Log selected sport
              }}
              className="p-2 border rounded"
              disabled={!selectedCenter}
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
          className="p-2 border rounded"
          dateFormat="dd/MM/yyyy"
          placeholderText="Select a date"
          minDate={new Date()} // Prevent past date selection
        />
      </div>

          <button
            onClick={handleShowCourts}
              className="bg-blue-600 text-white text-sm px-2 py-5 rounded hover:bg-blue-700 transition-colors"
          >
            Show Courts
          </button>
        </div>

        {/* Court availability section */}
        {showCourts && (
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">Available Courts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courts.map((court) => (
                <div key={court.id} className="bg-white p-4 border rounded shadow">
                  <h3 className="font-bold">{court.name}</h3>
                  <div className="mt-2">
                    {court.slots.map((slot) => (
                      <button
                        key={slot.slot}
                        onClick={() => handleBooking(court.id, slot.slot, date)}
                        disabled={!slot.available}
                        className={`mr-2 mb-2 px-2 py-1 rounded ${
                          slot.available
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-gray-400 text-gray-700 cursor-not-allowed"
                        }`}
                      >
                        {slot.slot}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
