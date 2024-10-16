import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { useSelector, useDispatch } from "react-redux";
import { logout } from '../utils/authSlice';
import { useNavigate } from 'react-router-dom'; 
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; // Make sure you import the CSS

function Dashboard() {
  const courts = ['Court 1', 'Court 2', 'Court 3', 'Court 4', 'Court 5', 'Court 6'];
  const hours = ['4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM'];
  const user = useSelector((state) => state.auth.user);
  const [username, setUsername] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('username'); 
    navigate('/'); 
  };
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const centers = ['Center 1', 'Center 2', 'Center 3']; // List of centers
  const [selectedCenter, setSelectedCenter] = useState(centers[0]); // Set default value to the first center

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6 h-full fixed flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Courtly</h1>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              {username.charAt(0)} 
            </div>
            <span>{username}</span>
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
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 ml-64 p-8">
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-bold">Schedule</h2>
          <div className="flex items-center space-x-4 ml-4">
            <div className="relative">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)} 
                minDate={new Date()} 
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded cursor-pointer"
                dateFormat="dd/MM/yyyy" 
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2 ml-10">
              <select
                value={selectedCenter}
                onChange={(e) => setSelectedCenter(e.target.value)} // Update selected center
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded cursor-pointer ml-20 mr-8"
              >
                {centers.map((center, index) => (
                  <option key={index} value={center}>{center}</option>
                ))}
              </select>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">Swimming</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">Badminton</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-4">
            <div className="col-span-1"></div>
            {courts.map((court, index) => (
              <div key={index} className="text-center font-semibold">{court}</div>
            ))}

            {hours.map((hour, hourIndex) => (
              <React.Fragment key={hourIndex}>
                <div className="text-right pr-4">{hour}</div>
                {courts.map((_, courtIndex) => (
                  <div key={`${hourIndex}-${courtIndex}`} className="border border-gray-200 h-16 relative">
                    {hourIndex === 0 && courtIndex === 0 && (
                      <div className="absolute inset-0 bg-blue-100 text-blue-800 flex items-center justify-center">
                        Abbas
                      </div>
                    )}
                    {hourIndex === 0 && courtIndex === 1 && (
                      <div className="absolute inset-0 bg-blue-100 text-blue-800 flex items-center justify-center">
                        Vinay Hasya...
                      </div>
                    )}
                    {hourIndex === 1 && courtIndex === 0 && (
                      <div className="absolute inset-0 bg-green-100 text-green-800 flex items-center justify-center">
                        Shantanu
                      </div>
                    )}
                    {hourIndex === 1 && courtIndex === 1 && (
                      <div className="absolute inset-0 bg-red-100 text-red-800 flex flex-col items-center justify-center">
                        <span>Kailash</span>
                        <span className="text-xs">6 items</span>
                        <span className="absolute top-1 right-1 text-xs bg-red-200 px-1 rounded">₹300</span>
                      </div>
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))} 
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
