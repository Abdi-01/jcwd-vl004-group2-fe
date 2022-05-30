import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { FaSearch, FaUserAlt, FaShoppingBag, FaBell } from 'react-icons/fa';
import { MdOutlineDashboard } from 'react-icons/md';
import AccountButton from './AccountButton';
import UserSidebar from './UserSidebar';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userGlobal = useSelector((state) => state.user);
  const cartTotal = useSelector((state) => state.cartTotal);
  const notification = useSelector((state) => state.notification.alert);
  const adminToken = localStorage.getItem('adminToken');
  const [keyword, setKeyword] = useState('');

  return (
    // header
    <header className="py-2 lg:py-4 shadow-sm bg-gray-50">
      <div className="px-3 lg:px-1 xl:container flex items-center justify-around xl:justify-between">
        <div
          onClick={() => navigate('/')}
          className="hidden md:block text-lg font-bold text-slate-600 hover:brightness-110 transition cursor-pointer"
        >
          <img src="/logo.png" alt="logo heizenberg" className="w-36 lg:w-40 xl:w-44 2xl:w-[250px]" />
        </div>
        <UserSidebar />
        {/* Searchbar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();

            navigate(`/products/all?keyword=${keyword}`);
            setKeyword('');
          }}
        >
          <div className="w-[350px] md:w-[400px] lg:w-[500px] relative flex">
            <span className="absolute left-4 top-3 text-lg text-gray-400">
              <FaSearch className="lg:mt-1" />
            </span>
            <input
              type="text"
              onChange={(e) => {
                setKeyword(e.target.value);
              }}
              value={keyword}
              className="w-full border border-primary border-r-0 pl-12 py-2 lg:py-3 pr-3 rounded-l-md focus:outline-none"
              placeholder="Search"
            />
            <button
              type="submit"
              className="bg-primary border border-primary text-white px-3 lg:px-8 rounded-r-md hover:bg-transparent hover:text-primary transition"
            >
              Search
            </button>
          </div>
        </form>
        <div className="flex items-center space-x-1 lg:space-x-4 p-1">
          {!adminToken ? (
            <>
              <div
                onClick={() => {
                  if (!userGlobal.name) {
                    navigate('/login');
                  } else {
                    navigate('/user/notification');
                    dispatch({ type: 'ALERT_CLEAR', payload: 'alert' });
                  }
                }}
                className="hidden sm:flex flex-col items-center text-gray-700 hover:text-primary transition cursor-pointer"
              >
                <div className="md:text-2xl mb-1 relative">
                  <FaBell />
                  {notification && (
                    <span className="absolute -right-1 -top-[2px] w-1 h-1 md:w-2 md:h-2 rounded-full flex items-center justify-center bg-red-500 text-white text-xs"></span>
                  )}
                </div>
                <div className="text-xs leading-3">Notifications</div>
              </div>
              <div className="hidden sm:flex flex-col items-center text-center text-gray-700 hover:text-primary transition relative">
                <Link to="/cart">
                  <div className="md:text-2xl mb-1">
                    <FaShoppingBag />
                  </div>
                  <div className="text-xs leading-3">Cart</div>
                  <span className="absolute -right-2 -top-1 w-5 h-5 rounded-full flex items-center justify-center bg-red-500 text-white text-xs">
                    {cartTotal.cartTotal}
                  </span>
                </Link>
              </div>
              {userGlobal.name ? (
                <AccountButton>{userGlobal.name}</AccountButton>
              ) : (
                <Link to="/login">
                  <div className="text-center text-gray-700 hover:text-primary transition relative flex flex-col items-center">
                    <div className="md:text-2xl mb-1">
                      <FaUserAlt />
                    </div>
                    <div className="text-xs leading-3">Account</div>
                  </div>
                </Link>
              )}
            </>
          ) : (
            <Link to="/dashboard">
              <div className="text-center text-gray-700 hover:text-primary transition flex flex-col items-center">
                <div className="md:text-2xl mb-1">
                  <MdOutlineDashboard />
                </div>
                <div className="text-xs leading-3">Dashboard</div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
