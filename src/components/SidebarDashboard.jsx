import { useSelector } from 'react-redux';

import { FaHome, FaShoppingBag, FaUserAlt, FaShoppingCart, FaFileAlt } from 'react-icons/fa';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { HiOutlineMail } from 'react-icons/hi';
import { Link, NavLink } from 'react-router-dom';

const SidebarDashboard = () => {
  const dataAdmin = JSON.parse(localStorage.getItem('dataAdmin'));
  const notification = useSelector((state) => state.notification.alert);
  const history = useSelector((state) => state.notification.history);

  const DashboardLink = ({ children, icon, to, end, notification }) => {
    return (
      <NavLink to={to} end={end}>
        {({ isActive }) => (
          <div
            className={`flex items-center gap-3 my-1 px-4 py-3 text-white border-1-4 border-transparent hover:bg-primary transition ${
              isActive ? 'bg-primary' : 'bg-transparent'
            }`}
          >
            <div className="relative">
              {notification && <span className="h-2 w-2 rounded-full bg-red-500 absolute top-0 -right-[2px]"></span>}
              {icon}
            </div>
            {children}
          </div>
        )}
      </NavLink>
    );
  };

  return (
    <div className="fixed left-0 top-0 w-40 h-full bg-gray-800 shadow-md z-[14]">
      <Link to="/">
        <div className="text-white font-bold text-base p-5 bg-gray-900 flex flex-col items-center gap-3">
          <img src="/IlLogoWhite.png" alt="Il Logo Heizenberg" className="w-16 2xl:w-[80px]" />
          Heizen Berg Co.
        </div>
      </Link>
      <div className="py-5">
        <DashboardLink icon={<FaHome />} to={'/dashboard'} end>
          Dashboard
        </DashboardLink>

        <DashboardLink icon={<FaShoppingBag />} to={'product'}>
          Product
        </DashboardLink>

        <DashboardLink icon={<FaShoppingCart />} to={'transaction'} notification={history}>
          Transaction
        </DashboardLink>

        <DashboardLink icon={<FaUserAlt />} to={'user'}>
          User
        </DashboardLink>

        {dataAdmin?.is_super ? (
          <DashboardLink icon={<MdOutlineAdminPanelSettings />} to={'admin'}>
            Admin
          </DashboardLink>
        ) : null}

        <DashboardLink icon={<HiOutlineMail />} to={'notification'} notification={notification}>
          Notification
        </DashboardLink>

        <DashboardLink icon={<FaFileAlt />} to={'report'}>
          Report
        </DashboardLink>
      </div>
    </div>
  );
};

export default SidebarDashboard;
