import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        async function fetchEmployees() {
            const response = await fetch("http://localhost:5050/record/");
            if (response.ok) {
                const data = await response.json();
                setEmployees(data);
            }
        }
        fetchEmployees();
    }, []);

    const seniorEmployees = employees.filter(employee => employee.level === "Senior");

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8"
        >
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="flex flex-col md:flex-row items-center md:items-start mt-10 md:mt-20"
            >
                <div className="md:w-1/2">
                    <h1 className="text-black text-4xl md:text-5xl lg:text-6xl font-bold font Lato">
                        Welcome<br />to Ebiz Employee Portal
                    </h1>
                    <p className="text-black text-base font-normal font Lato mt-4">
                        Efficiently manage employee information, streamline processes, and access important
                        company updates in one convenient place. Our Employee Portal is designed to help our
                        team thrive with seamless access to resources and tools.
                    </p>
                    <Link to="/create">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            className="inline-block mt-6 bg-blue-600 rounded-lg px-4 py-2 text-white text-base font-semibold font Lato"
                        >
                            Add Employee
                        </motion.button>
                    </Link>
                </div>
                <motion.img
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="w-64 h-64 md:w-96 md:h-96 rounded-lg mt-8 md:mt-0 md:ml-auto"
                    src="img\landing.jpg"
                    alt="Welcome graphic"
                />
            </motion.div>

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="bg-blue-600 rounded-lg flex flex-col items-start justify-center px-6 py-12 mt-10 md:mt-20 text-white"
            >
                <p className="text-sm font-normal font Lato uppercase tracking-wide">Testimonial</p>
                <blockquote className="text-xl md:text-2xl lg:text-3xl font-bold font Lato leading-tight mt-4">
                    "The Ebiz Employee Portal has transformed the way we manage our team. With easy access to essential information and streamlined processes, our employees stay connected, informed, and motivated every day."
                </blockquote>
                <p className="text-lg md:text-2xl font-bold font Lato leading-tight mt-4">- John R. - CEO</p>
            </motion.div>

            {/* Employee Display Section
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 md:mt-20"
            >
                {employees.slice(0, 6).map((employee) => (
                    <motion.div
                        key={employee._id}
                        className="p-4 border rounded-lg shadow-lg hover:bg-slate-100"
                        whileHover={{ scale: 1.05 }}
                    >
                        <h3 className="text-xl font-semibold">{employee.name}</h3>
                        <p>Position: {employee.position}</p>
                        <p>Level: {employee.level}</p>
                        <Link to={`/edit/${employee._id}`} className="text-blue-500">Edit</Link>
                    </motion.div>
                ))}
            </motion.div> */}


            {seniorEmployees.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="mt-16 px-4 pb-8"  
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600 text-center mb-8">
                        Meet Our Senior Team
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {seniorEmployees.map((employee) => (
                            <motion.div
                                key={employee._id}
                                className="p-6 border rounded-lg shadow-lg bg-gray-100 hover:bg-blue-100"
                                whileHover={{ scale: 1.05 }}
                            >
                                <h3 className="text-2xl font-semibold text-blue-600">{employee.name}</h3>
                                <p className="text-lg text-gray-700">Position: {employee.position}</p>
                                <p className="text-lg text-gray-700">Level: {employee.level}</p>
                                {/* <Link to={`/edit/${employee._id}`} className="text-blue-500 mt-2 inline-block">Edit Profile</Link> */}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
