import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // Add this for transitions

const Record = (props) => (
  <motion.tr
    className="border-b hover:bg-blue-50 transition-colors duration-300"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
  >
    <td className="p-4 align-middle text-gray-700 ">{props.record.name}</td>
    <td className="p-4 align-middle text-gray-700">{props.record.position}</td>
    <td className="p-4 align-middle text-gray-700">{props.record.level}</td>
    <td className="p-4 align-middle">
      <div className="flex gap-2">
        <Link
          to={`/edit/${props.record._id}`}
          className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium text-blue-600 border border-blue-300 rounded-md transition-all duration-300 hover:bg-blue-100 focus:ring-2 focus:ring-blue-500"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={() => props.deleteRecord(props.record._id)}
          className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium text-red-600 border border-red-300 rounded-md transition-all duration-300 hover:bg-red-100 hover:text-red-700 focus:ring-2 focus:ring-red-500"
        >
          Delete
        </button>
      </div>
    </td>
  </motion.tr>
);

export default function RecordList() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    async function getRecords() {
      const response = await fetch(`http://localhost:5050/record/`);
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
      } else {
        console.error(`An error occurred: ${response.statusText}`);
      }
    }
    getRecords();
  }, []);

  async function deleteRecord(id) {
    await fetch(`http://localhost:5050/record/${id}`, { method: "DELETE" });
    setRecords(records.filter((record) => record._id !== id));
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h3 className="text-2xl font-semibold mb-6 text-gray-900">Employee Records</h3>
      <div className="overflow-hidden rounded-lg shadow-lg bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700 font-bold">Name</th>
              <th className="px-4 py-2 text-left text-gray-700 font-bold">Position</th>
              <th className="px-4 py-2 text-left text-gray-700 font-bold">Level</th>
              <th className="px-4 py-2 text-left text-gray-700 font-bold">Actions</th>
            </tr>
          </thead>
          <motion.tbody
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {records.map((record) => (
              <Record key={record._id} record={record} deleteRecord={deleteRecord} />
            ))}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
}
