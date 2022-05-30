import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import NavbarDashboard from '../components/NavbarDashboard';
import SidebarDashboard from '../components/SidebarDashboard';
import { Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const adminGlobal = useSelector((state) => state.adminReducer);
  const socket = useSelector((state) => state.socket.instance);
  const adminToken = localStorage.getItem('adminToken');
  const userToken = localStorage.getItem('userToken');

  useEffect(() => {
    if (userToken) {
      navigate('/', { replace: true });
    } else if (!adminToken) {
      navigate('/admin/login', { replace: true });
    } else if (!adminGlobal.id) {
      navigate('/admin/login', { replace: true });
    }
  }, [adminGlobal]);

  useEffect(() => {
    if (adminGlobal.id) {
      socket?.emit('adminJoin', adminGlobal.id);

      socket?.on('newAdminNotif', (totalNotif) => {
        dispatch({ type: 'ALERT_NEW', payload: 'alert' });
        toast.info(`You have ${totalNotif} new notification(s)`, { position: 'top-center', theme: 'colored' });
      });

      socket?.on('newTransactionNotif', () => {
        dispatch({ type: 'ALERT_NEW', payload: 'history' });
        toast.info(`You have new transaction!`, { position: 'top-center', theme: 'colored' });
      });

      socket?.on('newPaymentNotif', (totalNotif) => {
        dispatch({ type: 'ALERT_NEW', payload: 'alert' });
        dispatch({ type: 'ALERT_NEW', payload: 'history' });
        toast.info(`You have ${totalNotif} new notification(s)`, { position: 'top-center', theme: 'colored' });
      });
    }
  }, [socket]);

  return (
    <div className="h-screen flex flex-col">
      <NavbarDashboard />
      <SidebarDashboard />
      <div className="h-full pl-40 pt-16">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
