import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-white rounded-t-lg shadow-md">

      <div className="border-t border-gray-200 w-full" />

      <div className="pt-6 pb-4 md:py-6 px-6 md:px-16 lg:px-24 flex flex-col md:flex-row items-center justify-between">
        
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p className="text-gray-700 font-medium text-base font Lato">
            © 2024 Employee Management System
          </p>
        </div>

        <div className="flex space-x-4 mt-4 md:mt-0 text-gray-500">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
            <FaFacebookF size={20} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
            <FaTwitter size={20} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
            <FaLinkedinIn size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
