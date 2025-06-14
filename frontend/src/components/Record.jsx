import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Record() {
  const [form, setForm] = useState({
    name: "",
    position: "",
    level: "",
  });
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if (!id) return;
      setIsNew(false);
      const response = await fetch(`http://localhost:5050/record/${id}`);
      if (response.ok) {
        const record = await response.json();
        setForm(record);
      } else {
        navigate("/");
      }
    }
    fetchData();
  }, [params.id, navigate]);

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const person = { ...form };
    const url = isNew ? "http://localhost:5050/record" : `http://localhost:5050/record/${params.id}`;
    const method = isNew ? "POST" : "PATCH";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(person),
    });

    if (response.ok) {
      setForm({ name: "", position: "", level: "" });
      navigate("/");
    } else {
      console.error("Error saving record.");
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Employee Record</h2>
      <form onSubmit={onSubmit} className="bg-white p-8 rounded-lg shadow-md">
        <div className="space-y-6">

          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter name"
              value={form.name}
              onChange={(e) => updateForm({ name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Position</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter position"
              value={form.position}
              onChange={(e) => updateForm({ position: e.target.value })}
            />
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-gray-700">Employee Level</legend>
            <div className="mt-4 flex space-x-4">
              {["Intern", "Junior", "Senior"].map((level) => (
                <label key={level} className="flex items-center">
                  <input
                    type="radio"
                    name="level"
                    value={level}
                    checked={form.level === level}
                    onChange={(e) => updateForm({ level: e.target.value })}
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-gray-700">{level}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <button
          type="submit"
          className="mt-6 w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          {isNew ? "Add Employee" : "Update Employee"}
        </button>
      </form>
    </div>
  );
}
