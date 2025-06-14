import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="p-4"> 
      <nav className="w-full max-w-[1395px] h-[71px] bg-white rounded-[15px] shadow flex items-center justify-between px-5 mx-auto">

        <NavLink to="/" className="flex items-center">
          <span className="text-blue-600 text-3xl font-black font Lato">E</span>
          <span className="text-bold text-3xl font-black font Lato">biz</span>
        </NavLink>

        <div className="flex space-x-8">
          <NavLink to="/records" className="text-bold text-base font-bold font Lato">
            Employees
          </NavLink>
          <NavLink to="/create" className="text-bold text-base font-bold font Lato">
            Add Employee
          </NavLink>
          <NavLink to="/about" className="text-bold text-base font-bold font Lato">
            About Us
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
