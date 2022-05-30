import { useState, Fragment, useEffect, useCallback } from 'react';
import { useNavigate, Link, NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Dialog, Transition } from '@headlessui/react';
import { AiOutlineUser, AiOutlineHistory, AiOutlineMenu } from 'react-icons/ai';
import { FiMail } from 'react-icons/fi';
import { IoLocationOutline } from 'react-icons/io5';
import { MdPayment } from 'react-icons/md';
import logo from '../assets/images/logos/heizenberg.png';

const SidebarNavigation = ({ children, to, setOpen }) => {
  return (
    <Link to={to}>
      <div onClick={() => setOpen(false)} className="w-full px-3 py-1">
        <span className="text-xl font-thin text-slate-700 hover:text-sky-400 hover:pl-4 transition-all cursor-pointer mb-1">
          {children}
        </span>
      </div>
    </Link>
  );
};

const ProfileNavigation = ({ children, icon, to, end, setOpen, badge }) => {
  return (
    <NavLink to={to} end={end}>
      {({ isActive }) => (
        <div
          onClick={() => {
            setOpen(false);
          }}
          className={`w-full px-4 py-1 group`}
        >
          <div
            className={`w-full px-3 py-2 text-lg font-bold rounded-lg ${
              isActive ? 'text-white bg-sky-400 bg-opacity-90' : 'bg-gray-50 text-sky-400 group-hover:bg-sky-400 group-hover:text-white'
            }  transition flex items-center gap-2 hover:brightness-110 relative`}
          >
            <span className={`h-2 w-2 rounded-full bg-green-300 ${isActive ? 'translate-x-0 block' : '-translate-x-5 hidden'}`}></span>
            <div className="relative flex justify-center items-center">
              {icon}
              {badge ? (
                <span className="h-2 w-2 rounded-full bg-red-400 text-white font-bold absolute -top-[1px] -right-[2px]"></span>
              ) : null}
            </div>
            <span>{children}</span>
          </div>
        </div>
      )}
    </NavLink>
  );
};

const UserSidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const userToken = localStorage.getItem('userToken');
  const [open, setOpen] = useState(false);

  const notification = useSelector((state) => state.notification.alert);
  const history = useSelector((state) => state.notification.history);
  const awaiting = useSelector((state) => state.notification.awaiting);

  const handleClose = useCallback(() => {
    if (window.innerWidth > 768) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleClose);

    return () => {
      window.removeEventListener('resize', handleClose);
    };
  }, []);

  return (
    <>
      <div className="md:hidden h-full flex items-center">
        <button onClick={() => setOpen(true)} className="text-xl text-gray-700 hover:text-primary transition">
          <AiOutlineMenu />
        </button>
      </div>

      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 overflow-y-auto flex z-[100]" onClose={() => setOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-50"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-50"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="-translate-x-1/2"
            enterTo="translate-x-0"
            leave="ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-1/2"
          >
            <div className="min-h-screen w-60 absolute z-10 bg-gray-50 flex flex-col transl">
              <div className="w-full flex flex-col py-4">
                <SidebarNavigation to={'/products/all'} setOpen={setOpen}>
                  Shop
                </SidebarNavigation>
                <SidebarNavigation to={'/products/all'} setOpen={setOpen}>
                  Blog
                </SidebarNavigation>
                <SidebarNavigation to={'/products'} setOpen={setOpen}>
                  About Us
                </SidebarNavigation>
                <SidebarNavigation to={'/products'} setOpen={setOpen}>
                  Contact Us
                </SidebarNavigation>
              </div>
              {userToken && pathname.includes('/user') && (
                <>
                  <div className="w-full px-3 py-1">
                    <span className="text-lg font-thin text-slate-700">User Menu</span>
                  </div>
                  <div className="w-full flex flex-col">
                    <ProfileNavigation to={'/user'} icon={<AiOutlineUser />} end={true} setOpen={setOpen}>
                      Profile
                    </ProfileNavigation>
                    <ProfileNavigation to={'address'} icon={<IoLocationOutline />} setOpen={setOpen}>
                      Address
                    </ProfileNavigation>
                    <ProfileNavigation to={'payment'} icon={<MdPayment />} setOpen={setOpen} badge={awaiting}>
                      Payment
                    </ProfileNavigation>
                    <ProfileNavigation to={'history'} icon={<AiOutlineHistory />} setOpen={setOpen} badge={history}>
                      History
                    </ProfileNavigation>
                    <ProfileNavigation to={'notification'} icon={<FiMail />} setOpen={setOpen} badge={notification}>
                      Notifications
                    </ProfileNavigation>
                  </div>
                </>
              )}
              <div className="flex justify-center py-8 mt-auto">
                <div
                  onClick={() => {
                    navigate('/');
                    setOpen(false);
                  }}
                  className="text-lg font-bold text-white hover:text-sky-200 transition cursor-pointer w-40"
                >
                  <img src={logo} alt="heizenberg logo" className="w-full object-contain" />
                </div>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

export default UserSidebar;
