import React from 'react';
import { Calendar, Clock, Users } from 'lucide-react';

function Dashboard () {
  const courts = ['Court 1', 'Court 2', 'Court 3', 'Court 4', 'Court 5', 'Court 6'];
  const hours = ['4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM'];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">NEXUS</h1>
        <nav>
          <ul className="space-y-4">
            <li className="flex items-center space-x-2">
              <Calendar size={20} />
              <span>Dashboard</span>
            </li>
            <li className="flex items-center space-x-2 bg-blue-600 p-2 rounded">
              <Calendar size={20} />
              <span>Schedule</span>
            </li>
            <li className="flex items-center space-x-2">
              <Users size={20} />
              <span>Customers</span>
            </li>
            <li className="flex items-center space-x-2">
              <Users size={20} />
              <span>Coachings</span>
            </li>
            <li className="flex items-center space-x-2">
              <Clock size={20} />
              <span>Attendance</span>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-6 left-6 flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            TN
          </div>
          <span>Tarikul</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Schedule</h2>
          <div className="flex space-x-4">
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">Rent & Sell</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">+ New Customer</button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <span className="bg-gray-200 px-3 py-1 rounded">27th Feb 2024</span>
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
