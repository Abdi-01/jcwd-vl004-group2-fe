import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Axios from "axios";
import { API_URL } from "../assets/constants";

import { FaBars } from "react-icons/fa";
import { toast } from "react-toastify";

const NavbarLink = ({ children, path }) => {
  return (
    <Link to={`${path}`}>
      <div className="relative">
        <span className="font-semibold text-md text-white hover:brightness-110 transition after:h-[2px] after:w-0 after:hover:w-full after:absolute after:top-6 after:left-0 after:bg-emerald-400 after:transition-all cursor-pointer">
          {children}
        </span>
      </div>
    </Link>
  );
};

const Navbar = () => {
  const userGlobal = useSelector((state) => state.user);
  const adminToken = localStorage.getItem("adminToken");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await Axios.get(`${API_URL}/category/all`);

        setCategories(categories.data);
      } catch (err) {
        toast.error("Unable to set categories", {
          position: "bottom-left",
          theme: "colored",
        });
      }
    };
    fetchCategories();
  }, []);

  const renderCategories = () => {
    return categories.map((category) => (
      <Link key={category.id} to={`/products/${category.name}`}>
        <div className="w-full py-3 px-4 flex items-center hover:bg-slate-100 border-b border-opacity-50 transition">
          <span className="text-md text-slate-600 font-semibold hover:text-sky-500 hover:brightness-110 cursor-pointer">
            {category.name}
          </span>
        </div>
      </Link>
    ));
  };

  return (
    <nav className="bg-sky-800">
      <div className="flex px-3 xl:container">
        {/* all category */}
        <div className="px-8 py-4 bg-sky-500 flex items-center cursor-pointer relative group">
          <span className="text-white">
            <FaBars />
          </span>
          <span className="hidden md:block capitalize ml-2 font-semibold text-white">
            All Categories
          </span>
          <div className="absolute z-30 w-max left-0 top-full bg-white rounded-b-lg overflow-hidden shadow-md divide-y opacity-0 group-hover:opacity-100 transition duration-300 invisible group-hover:visible">
            {renderCategories()}
          </div>
        </div>

        <div className="hidden sm:flex items-center pl-2 md:pl-4 lg:pl-12">
          <div className="flex items-center sm:space-x-2 md:space-x-3 lg:space-x-6">
            <NavbarLink path={"/"}>Home</NavbarLink>
            <NavbarLink path={"/products/all"}>Shop</NavbarLink>
            <NavbarLink path={"/blog"}>Blog</NavbarLink>
            <NavbarLink path={"/about"}>About Us</NavbarLink>
            <NavbarLink path={"/contact"}>Contact Us</NavbarLink>
          </div>
        </div>

        {!adminToken &&
          (userGlobal.name ? (
            <div className="flex items-center ml-auto">
              <span className="text-md font-semibold text-white">
                Hello, {userGlobal.name}!
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-4 ml-auto">
              <NavbarLink path={"/login"}>Login</NavbarLink>
              <NavbarLink path={"/register"}>Register</NavbarLink>
            </div>
          ))}
      </div>
    </nav>
  );
};

export default Navbar;
