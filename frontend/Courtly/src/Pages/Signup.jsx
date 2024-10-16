import React,{useState} from 'react';
import { Link } from 'react-router-dom';

function Signup(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name,setName] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Signup successful:', data);
      } else {
        console.error('Signup failed:', data.message);
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };
    return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 rounded-lg shadow-lg w-full max-w-sm bg-blue-600 bg-opacity-40 shadow-xl backdrop-blur-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Signup</h2>
          <form onClick={handleSubmit}> 
          <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)} 
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="text"
                id="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Sign up
            </button>
          </form>
          <p className="mt-4 text-sm text-center text-gray-600">
            Don't have an account?<Link to="/" className="text-blue-500 hover:underline"> Log in</Link>
          </p>
        </div>
      </div>
      )
}
export default Signup;