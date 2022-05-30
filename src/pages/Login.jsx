import { useEffect, useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Axios from 'axios';
import { API_URL, SOCKET_URL } from '../assets/constants';
import { io } from 'socket.io-client';

import '../assets/styles/Login.css';
import { AiOutlineInfoCircle, AiFillEye, AiFillEyeInvisible, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FiAlertTriangle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import ForgetPasswordModal from '../components/ForgetPasswordModal';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invalid, setInvalid] = useState('');

  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    const adminToken = localStorage.getItem('adminToken');

    if (userToken) {
      navigate('/', { replace: true });
    } else if (adminToken) {
      navigate('/dashboard', { replace: true });
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Please enter a valid email address').required('This field cannot be empty'),
      password: Yup.string().required('This field cannot be empty'),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);

        const response = await Axios.post(`${API_URL}/auth/login`, {
          email: values.email,
          password: values.password,
        });

        if (response.data.invalid) {
          setIsLoading(false);

          return setInvalid('Please check your email or password!');
        }

        if (response.data.conflict) {
          setIsLoading(false);

          return toast.warning(response.data.message, { position: 'top-center', theme: 'colored' });
        }

        if (response.data.user) {
          setIsLoading(false);

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

          navigate(-1, { replace: true });
        }
      } catch (err) {
        toast.error('Unable to logged in!', { position: 'bottom-left', theme: 'colored' });
      }
    },
  });

  return (
    <div className="flex justify-center sm:justify-end items-center relative loginBody">
      <span
        className="text-2xl lg:text-3xl 2xl:text-4xl font-bold text-sky-500 hover:brightness-110 cursor-pointer transition absolute top-[1%] lg:top-[2%] left-[3%] hover:drop-shadow-[0_0px_8px_rgba(232,231,233,1)]"
        onClick={() => navigate('/')}
      >
        <img src="logo.png" width="300px" alt="logo heizen berg" />
      </span>
      <div className="w-5/6 py-2 rounded-xl lg:w-4/6 sm:rounded-r-none shadow-md bg-slate-50 flex flex-col justify-center loginWrapper">
        <div className="w-full py-2 flex justify-center sm:justify-start sm:pl-8 xl:px-10">
          <span className="text-3xl leading-10 bg-gradient-to-r from-sky-500 to-emerald-400 flex bg-clip-text font-bold text-transparent">
            Login
          </span>
        </div>
        <div className="w-full flex">
          <div className="w-full flex flex-col sm:w-2/3 lg:w-1/2 px-10 sm:px-8 lg:px-0 lg:pl-8 xl:px-10">
            {invalid && (
              <div className="w-full pt-2 pb-4 lg:hidden">
                <div className="h-14 w-full rounded-lg bg-rose-500 bg-opacity-80 flex justify-center items-center gap-2 font-semibold text-white">
                  <AiOutlineInfoCircle />
                  <span>Please check your email or password!</span>
                </div>
              </div>
            )}
            <form onSubmit={formik.handleSubmit} className="w-full pt-2">
              <div className="h-20 w-full flex flex-col">
                <div className="w-full flex items-center relative">
                  <input
                    id="email"
                    type="email"
                    className={`h-11 w-full border-2 ${
                      formik.touched.email && formik.errors.email ? 'border-red-400' : 'border-slate-400'
                    } rounded-md pl-4 hover:shadow hover:shadow-sky-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-500 transition cursor-pointer placeholder-transparent mb-1 peer`}
                    placeholder="Email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                  />
                  <label
                    htmlFor="email"
                    className="absolute text-sm text-sky-400 font-bold -top-[10px] left-3 bg-slate-50 w-10 text-center peer-placeholder-shown:text-slate-300 peer-placeholder-shown:font-semibold peer-placeholder-shown:text-lg peer-placeholder-shown:bg-transparent peer-placeholder-shown:-top-[-7px] peer-placeholder-shown:left-[19px] transition-all"
                  >
                    Email
                  </label>
                  {formik.touched.email && formik.errors.email ? (
                    <FiAlertTriangle className="absolute -right-6 text-md text-rose-400" />
                  ) : null}
                </div>
                {formik.touched.email && formik.errors.email ? (
                  <span className="text-xs pl-2 text-rose-400">{formik.errors.email}</span>
                ) : null}
              </div>
              <div className="h-20 w-full flex flex-col">
                <div className="w-full flex items-center relative">
                  <input
                    id="password"
                    type="password"
                    className={`h-11 w-full border-2 ${
                      formik.touched.password && formik.errors.password ? 'border-red-400' : 'border-slate-400'
                    }  rounded-md pl-4 pr-10 hover:shadow hover:shadow-sky-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-500 transition cursor-pointer placeholder-transparent mb-1 peer`}
                    placeholder="Password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                  <label
                    htmlFor="password"
                    className="absolute text-sm text-sky-400 font-bold -top-[10px] left-3 bg-slate-50 w-[66px] text-center peer-placeholder-shown:text-slate-300 peer-placeholder-shown:font-semibold peer-placeholder-shown:text-lg peer-placeholder-shown:bg-transparent peer-placeholder-shown:-top-[-7px] peer-placeholder-shown:left-[19px] transition-all"
                  >
                    Password
                  </label>
                  {formik.touched.password && formik.errors.password ? (
                    <FiAlertTriangle className="absolute -right-6 text-md text-rose-400" />
                  ) : null}
                  <span
                    className="absolute text-xl font-semibold text-sky-300 right-4 hover:brightness-110 transition cursor-pointer"
                    onClick={() => {
                      setShow(!show);
                      if (document.getElementById('password').type === 'password') {
                        document.getElementById('password').type = 'text';
                      } else {
                        document.getElementById('password').type = 'password';
                      }
                    }}
                  >
                    {show ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </span>
                </div>
                {formik.touched.password && formik.errors.password ? (
                  <span className="text-xs pl-2 text-rose-400">{formik.errors.password}</span>
                ) : null}
              </div>
              <div className="w-full">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full h-11 rounded-lg flex items-center justify-center gap-2 text-lg text-white font-bold ${
                    isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-sky-400 cursor-pointer hover:brightness-110 active:scale-95'
                  } transition shadow`}
                >
                  {isLoading ? (
                    <>
                      <AiOutlineLoading3Quarters className="animate-spin" />
                      <span>Logging in..</span>
                    </>
                  ) : (
                    <span>Login</span>
                  )}
                </button>
              </div>
            </form>
            <div className="w-full flex justify-center items-center py-1">
              <ForgetPasswordModal />
            </div>
            <div className="w-full py-2 flex items-center justify-center relative">
              <div className="h-[2px] w-full bg-slate-300 rounded-full" />
              <span className="absolute font-semibold text-sky-400 w-8 text-center bg-slate-50">Or</span>
            </div>
            <div className="w-full py-3 flex flex-col items-center gap-3">
              <button
                onClick={() => window.open(`${API_URL}/auth/google`, '_self')}
                className="w-full h-12 rounded-lg bg-white flex items-center justify-center font-semibold gap-2 border-2 border-slate-300 hover:bg-amber-200 hover:border-amber-200 transition"
              >
                <FcGoogle />
                Login with Google
              </button>
              <span
                onClick={() => navigate('/register')}
                className="text-sm text-transparent bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text font-semibold text-center hover:brightness-110 cursor-pointer transition active:scale-95"
              >
                I don't have an account
              </span>
            </div>
          </div>
          <div className="hidden sm:flex sm:w-1/3 lg:w-1/2 lg:pl-5 lg:pr-5 xl:pr-20">
            {invalid && (
              <div className="hidden lg:flex h-24 w-full rounded-xl justify-center items-center gap-2 bg-rose-500 bg-opacity-80 text-white">
                <AiOutlineInfoCircle />
                <span className="font-medium">{invalid}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
