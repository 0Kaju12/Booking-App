import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard';
import AdminDashboard from './Pages/AdminDashboard'; // Import the AdminDashboard component
import { Provider } from 'react-redux';
import store from './utils/store';

const App = () => {
  return (
    <Provider store={store}>
      <Router> {/* Single Router instance here */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* Add the admin dashboard route */}
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
