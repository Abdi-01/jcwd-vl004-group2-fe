import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { FaBell, FaUserAlt } from 'react-icons/fa';

const NavbarDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSelector((state) => state.socket.instance);
  const notification = useSelector((state) => state.notification.alert);
  const dataAdmin = JSON.parse(localStorage.getItem('dataAdmin'));

  return (
    <div className="h-16 bg-white shadow-sm pl-80 pr-8 fixed z-[12] w-full top-0 left-0 flex items-center">
      <div className="ml-auto flex items-center">
        {dataAdmin && <span className="mr-3">Halo, {dataAdmin.name}</span>}

        <Link to="/dashboard/notification">
          <div className="relative">
            <FaBell className="w-6 cursor-pointer hover:text-primary" />
            {notification && <span className="h-2 w-2 top-0 right-[3px] rounded-full bg-red-500 absolute"></span>}
          </div>
        </Link>

        <div className="ml-4 relative dropdown dropdown-end">
          <label tabIndex={0}>
            <FaUserAlt className="h-4 w-4 cursor-pointer object-cover hover:text-primary" />
          </label>

          <ul tabIndex={0} className="dropdown-content menu bg-gray-50 shadow-md px-1 rounded-lg w-32 divide-y">
            {/* link to admin profile here */}
            <Link to="/dashboard/admin">
              <li className="py-1 font-semibold text-gray-600 group">
                <div className="w-full h-8 rounded-lg group-hover:bg-sky-100 group-hover:text-sky-400 transition font-semibold">
                  Profile
                </div>
              </li>
            </Link>
            <li
              onClick={() => {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('dataAdmin');
                dispatch({ type: 'ADMIN_LOGOUT' });
                socket?.disconnect();

                navigate('/admin/login', { replace: true });
              }}
              className="py-1 font-semibold text-rose-600 group"
            >
              <div className="w-full h-8 rounded-lg group-hover:bg-red-50 group-hover:text-rose-400 transition font-semibold">Logout</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavbarDashboard;
