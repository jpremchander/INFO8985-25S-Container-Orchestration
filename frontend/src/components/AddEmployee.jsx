import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AddEmployee() {
  const [form, setForm] = useState({ name: "", position: "", level: "" });
  const navigate = useNavigate();

  const updateForm = (value) => setForm({ ...form, ...value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:5050/record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    navigate("/records");
  };

  return (
    <motion.div
      className="container mx-auto p-6 max-w-lg bg-white rounded-lg shadow-lg mt-20" // Added mt-20 for space above
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-semibold text-center mb-6 text-gray-700">Add a New Employee</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="text-lg text-gray-600 mb-2">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
            required
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-lg text-gray-600 mb-2">Position</label>
          <input
            type="text"
            value={form.position}
            onChange={(e) => updateForm({ position: e.target.value })}
            required
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-lg text-gray-600 mb-2">Level</label>
          <select
            value={form.level}
            onChange={(e) => updateForm({ level: e.target.value })}
            required
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select level</option>
            <option value="Intern">Intern</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
          </select>
        </div>

        <motion.button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Create Account
        </motion.button>
      </form>
    </motion.div>
  );
}
