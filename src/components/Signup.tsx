import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import name from "../assets/user.png";
import number from "../assets/phone.png";
import email from "../assets/email.png";
import pass from "../assets/padlock.png";
import client from "../utils/axiosClient";
import { toast } from "sonner";
import LoginandSignupHeader from './LoginandSignupHeader';


const Signup = () => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const toastLoader = toast.loading("Signing up...")
    setLoading(true)
    e.preventDefault();

    const { name, phone, email, password, confirmPassword } = formData;

    // Validate inputs
    if (!name || !phone || !email || !password || !confirmPassword) {
      alert("All fields are required.");
      return;
    }

    if (phone.length !== 10) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      // Call signup API
      const response = await client.post("/api/login/user-signup", {
        fullname: name,
        mobile: phone,
        email: email,
        password: password,
        role: 'User',
      });
      toast.success("Signup successful!")
      console.log(response, 'res')
      // Handle success response
      if (response.status === 201) {
        alert("Signup successful!");
        navigate("/"); // Navigate to the login page
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error: any) {
      // Handle API errors
      if (error.response && error.response.data) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("An error occurred. Please try again.");
      }
    } finally {
      toast.dismiss(toastLoader)
      setLoading(false)
    }
  };

  return (
    <>
      <LoginandSignupHeader />
    <div className="flex items-center justify-center min-h-[90vh] bg-gradient-to-b from-cyan-200 to-white">
      <div className="w-96 p-6 mx-5 lg:mx-0 bg-white rounded-lg shadow-lg">
        <h3 className="text-center text-lg font-semibold mb-4">Sign Up</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex justify-center items-center gap-3">
            <img src={name} alt="Name icon" className="w-7 h-7" />
            <input
              type="text"
              id="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div className="flex justify-center items-center gap-3">
            <img src={number} alt="Phone icon" className="w-7 h-7" />
            <input
              type="text"
              id="phone"
              placeholder="Enter Mobile Number"
              value={formData.phone}
              onChange={handleChange}
              maxLength={10}
              pattern="\d{10}"
              title="Please enter a valid 10-digit mobile number."
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div className="flex justify-center items-center gap-3">
            <img src={email} alt="Email icon" className="w-7 h-7" />
            <input
              type="email"
              id="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div className="flex justify-center items-center gap-3">
            <img src={pass} alt="Password icon" className="w-7 h-7" />
            <input
              type="password"
              id="password"
              placeholder="Create Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <div className="flex justify-center items-center gap-3">
            <img src={pass} alt="Confirm Password icon" className="w-7 h-7" />
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Already a member?{" "}
          <Link to="/" className="text-blue-500 font-semibold">
            Log In Now
          </Link>
        </p>
      </div>
    </div>
    </>
  );
};

export default Signup;
