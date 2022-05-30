import { useEffect } from 'react';
import Axios from 'axios';
import { API_URL, SOCKET_URL } from './assets/constants';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AllProducts from './pages/AllProducts';
import ChangePassword from './pages/ChangePassword';
import LoginAdmin from './pages/LoginAdmin';
import Verify from './pages/Verify';
import Dashboard from './pages/Dashboard';
import DashboardProduct from './pages/DashboardProduct';
import DashboardUser from './pages/DashboardUser';
import DashboardTransaction from './pages/DashboardTransaction';
import DashboardReport from './pages/DashboardReport';
import DashboardAdmin from './pages/DashboardAdmin';
import MessagesAdmin from './pages/MessagesAdmin';
import ChangePassAdmin from './pages/ChangePassAdmin';
import HomeAdmin from './pages/HomeAdmin';
import ResetAdmin from './pages/ResetAdmin';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import User from './pages/User';
import Profile from './pages/Profile';
import Address from './pages/Address';
import AwaitingPayment from './pages/AwaitingPayment';
import History from './pages/History';
import Messages from './pages/Messages';
import NotFound from './pages/NotFound';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const dispatch = useDispatch();
  const userGlobal = useSelector((state) => state.user);
  const socket = useSelector((state) => state.socket.instance);

  useEffect(() => {
    const persistentLogin = async () => {
      let response;

      const userToken = localStorage.getItem('userToken');
      const adminToken = localStorage.getItem('adminToken');

      if (adminToken) {
        const adminresponse = await Axios.post(
          `${API_URL}/admin/auth/get`,
          {},
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );

        if (adminresponse.data.conflict) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('dataAdmin');
          dispatch({ type: 'ADMIN_LOGOUT' });

          toast.error(adminresponse.data.message, { position: 'top-center', theme: 'colored' });
        } else {
          dispatch({ type: 'AUTH_ADMIN', payload: adminresponse.data.data });

          dispatch({
            type: 'SET_SOCKET',
            payload: io(SOCKET_URL),
          });

          return;
        }
      } else if (userToken) {
        response = await Axios.get(`${API_URL}/auth/persistent`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
      } else {
        response = await Axios.get(`${API_URL}/auth/login/success`, {
          withCredentials: true,
        });
      }

      if (response.data.ignore) {
        return;
      } else if (response.data.conflict) {
        localStorage.removeItem('userToken');

        toast.warning(response.data.message, { position: 'top-center', theme: 'colored' });
      } else {
        localStorage.setItem('userToken', response.data.token);

        dispatch({
          type: 'USER_LOGIN',
          payload: response.data.user,
        });

        dispatch({
          type: 'SET_SOCKET',
          payload: io(SOCKET_URL),
        });

        dispatch({ type: 'CART_TOTAL', payload: response.data.cartTotal });
      }
    };

    persistentLogin();
  }, []);

  useEffect(() => {
    if (userGlobal.id) {
      socket?.emit('userJoin', userGlobal.id);

      socket?.on('newUserNotif', (totalNotif) => {
        dispatch({ type: 'ALERT_NEW', payload: 'alert' });
        toast.info(`You have ${totalNotif} new notification(s)`, {
          position: 'top-center',
          theme: 'colored',
        });
      });

      socket?.on('newUserPayment', (totalNotif) => {
        dispatch({ type: 'ALERT_NEW', payload: 'alert' });
        dispatch({ type: 'ALERT_NEW', payload: 'history' });
        toast.info(`You have ${totalNotif} new notification(s)`, {
          position: 'top-center',
          theme: 'colored',
        });
      });
    }
  }, [socket]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/changepassword/:token" element={<ChangePassword />} />
        <Route path="/verify/:token" element={<Verify />} />
        <Route path="/products/:val" element={<AllProducts />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/user" element={<User />}>
          <Route index element={<Profile />} />
          <Route path="history" element={<History />} />
          <Route path="address" element={<Address />} />
          <Route path="notification" element={<Messages />} />
          <Route path="payment" element={<AwaitingPayment />} />
        </Route>
        <Route path="/products" element={<AllProducts />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment/:id" element={<Payment />} />
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin/reset" element={<ResetAdmin />} />
        <Route path="/admin/change-password/:token" element={<ChangePassAdmin />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<HomeAdmin />} />
          <Route path="user" element={<DashboardUser />} />
          <Route path="admin" element={<DashboardAdmin />} />
          <Route path="product" element={<DashboardProduct />} />
          <Route path="product/addproduct" element={<AddProduct />} />
          <Route path="product/editproduct/:id" element={<EditProduct />} />
          <Route path="transaction" element={<DashboardTransaction />} />
          <Route path="notification" element={<MessagesAdmin />} />
          <Route path="report" element={<DashboardReport />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
