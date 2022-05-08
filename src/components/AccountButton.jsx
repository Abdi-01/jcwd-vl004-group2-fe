import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../assets/constants';

import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

import { FaUserAlt, FaShoppingBag, FaBell } from 'react-icons/fa';
import { AiOutlineUser } from 'react-icons/ai';
import { FiLogOut } from 'react-icons/fi';

const AccountButton = ({ children }) => {
  const MenuLink = ({ children, logout, icon, to }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const menuLinkHandler = () => {
      if (logout) {
        window.open(`${API_URL}/auth/logout`, '_self');

        localStorage.removeItem('userToken');

        dispatch({ type: 'REMOVE_SOCKET' });
        dispatch({ type: 'USER_LOGOUT' });
      } else {
        navigate(to);
      }
    };

    return (
      <Menu.Item>
        {({ active }) => (
          <div onClick={menuLinkHandler} className="h-12 w-40 p-1 bg-white flex items-center border-b cursor-pointer transition">
            <div
              className={`w-full h-full rounded-lg ${
                active ? (logout ? 'bg-rose-200 text-red-600' : 'bg-sky-100 text-sky-600') : 'bg-white'
              } transition duration-100 flex items-center text-gray-700 pl-3 gap-2`}
            >
              {icon}
              <span className="text-md font-semibold">{children}</span>
            </div>
          </div>
        )}
      </Menu.Item>
    );
  };

  return (
    <>
      <Menu as="div">
        <Menu.Button as="div" className="flex flex-col items-center text-gray-700 hover:text-sky-500 transition cursor-pointer">
          <div className="relative">
            <FaUserAlt className="md:text-2xl mb-1" />
            <div className="h-1 w-1 md:h-2 md:w-2 rounded-full bg-green-500 absolute -top-[2px] -right-[2px]  md:-top-1 md:-right-1"></div>
          </div>
          <span className="text-xs leading-3">{children}</span>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Menu.Items as="div" className="rounded-lg absolute z-10 top-12 right-5 overflow-hidden focus:outline-none shadow-lg">
            <MenuLink icon={<AiOutlineUser />} to="/user">
              Profile
            </MenuLink>
            <div className="w-full sm:hidden flex flex-col">
              <MenuLink icon={<FaShoppingBag />} to="/cart">
                Cart
              </MenuLink>
              <MenuLink icon={<FaBell />} to="/user/notification">
                Notification
              </MenuLink>
            </div>
            <MenuLink icon={<FiLogOut />} logout>
              Logout
            </MenuLink>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};

export default AccountButton;
