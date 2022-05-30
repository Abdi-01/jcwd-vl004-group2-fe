import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { API_URL, SOCKET_URL } from '../assets/constants';
import { io } from 'socket.io-client';

import '../assets/styles/Register.css';
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineInfoCircle, AiOutlineLoading3Quarters, AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import logo from '../assets/images/logos/hb-white.png';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    const adminToken = localStorage.getItem('adminToken');

    if (userToken) {
      navigate(-1, { replace: true });
    } else if (adminToken) {
      navigate('/dashboard', { replace: true });
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .matches(/^[a-zA-Z. ]*$/, 'Name cannot contain number or special characters')
        .required('This field is required'),
      email: Yup.string().email('Please enter a valid email address').required('This field is required'),
      password: Yup.string()
        .matches(
          /^(?!.* )(?=.*\d)(?=.*[A-Z]).{6,}$/,
          'Password must consist of min. 6 characters, with 1 uppercase character, 1 number and no spaces'
        )
        .required('This field is required'),
      confirm_password: Yup.string()
        .oneOf([Yup.ref('password')], 'Please check your confirmation password')
        .required('This field is required'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      const response = await Axios.post(`${API_URL}/auth/register`, {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      if (response.data.errMsg) {
        setIsLoading(false);

        toast.warning(response.data.errMsg, { position: 'bottom-left', theme: 'colored' });
      } else {
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

        navigate('/', { replace: true });
      }
    },
  });

  return (
    <div className="flex justify-center items-center relative overflow-y-hidden registerBody">
      <div className="absolute top-3 left-3 md:top-5 md:left-8">
        <img src={logo} className="w-16 md:w-24 font-bold hover:brightness-110 cursor-pointer transition" onClick={() => navigate('/')} />
      </div>
      <div className="w-[330px] h-[560px] rounded-xl md:rounded-none md:h-full md:w-1/2 lg:w-1/3 lg:pt-1 flex-col items-center shadow-md registerWrapper">
        <div className="w-full flex justify-center py-3 md:py-4">
          <span className="text-lg md:text-[27px] w-max bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent font-bold">
            Create Account
          </span>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="w-full h-max flex flex-col items-center">
            <div className="w-[80%] md:w-3/4 h-20 md:h-[90px] flex flex-col">
              <label htmlFor="name" className="text-sm md:text-md font-bold text-sky-400 mb-[3px] cursor-pointer">
                Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  placeholder="Insert your name.."
                  className={`h-9 md:h-11 pl-3 rounded-lg border-2 w-full ${
                    formik.touched.name && formik.errors.name ? 'border-red-400' : 'border-gray-300 '
                  } focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-300 transition placeholder:text-sky-300 placeholder:text-sm md:placeholder:text-lg placeholder:font-semibold mb-[3px] cursor-pointer`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                />
                {formik.touched.name && formik.errors.name ? (
                  <AiOutlineInfoCircle className="text-red-400 text-md md:text-lg absolute top-[11px] md:top-[14px] right-3" />
                ) : null}
              </div>
              {formik.touched.name && formik.errors.name ? <span className="text-xs text-red-400 pl-2">{formik.errors.name}</span> : null}
            </div>
            <div className="w-[80%] md:w-3/4 h-20 md:h-[90px] flex flex-col">
              <label htmlFor="email" className="text-sm md:text-md font-bold text-sky-400 mb-[3px] cursor-pointer">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  placeholder="Insert your email.."
                  className={`h-9 md:h-11 w-full pl-3 rounded-lg border-2 ${
                    formik.touched.email && formik.errors.email ? 'border-red-400' : 'border-gray-300 '
                  } focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-300 transition placeholder:text-sky-300 placeholder:text-sm md:placeholder:text-lg placeholder:font-semibold mb-[3px] cursor-pointer`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email ? (
                  <AiOutlineInfoCircle className="text-red-400 text-md md:text-lg absolute top-[11px] md:top-[14px] right-3" />
                ) : null}
              </div>
              {formik.touched.email && formik.errors.email ? (
                <span className="text-xs text-red-400 pl-2">{formik.errors.email}</span>
              ) : null}
            </div>
            <div className="w-[80%] md:w-3/4 h-[90px] md:h-[105px] flex flex-col">
              <label htmlFor="password" className="text-sm md:text-md font-bold text-sky-400 mb-[3px] cursor-pointer">
                Password
              </label>
              <div className="relative">
                <span
                  className="absolute h-fit top-[10px] md:top-[14px] left-3 cursos-pointer text-lg text-sky-300 hover:text-sky-200 transition cursor-pointer"
                  onClick={() => {
                    if (document.getElementById('password').type === 'password') {
                      document.getElementById('password').type = 'text';
                    } else {
                      document.getElementById('password').type = 'password';
                    }
                    setShow(!show);
                  }}
                >
                  {show ? <AiFillEyeInvisible /> : <AiFillEye />}
                </span>
                <input
                  type="password"
                  id="password"
                  placeholder="Insert your password.."
                  className={`h-9 md:h-11 w-full pl-9 rounded-lg ${
                    formik.touched.password && formik.errors.password ? 'border-red-400' : 'border-gray-300 '
                  } border-2 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-300 transition placeholder:text-sky-300 placeholder:text-sm md:placeholder:text-lg placeholder:font-semibold mb-[3px] cursor-pointer`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password ? (
                  <AiOutlineInfoCircle className="text-red-400 text-md md:text-lg absolute top-[11px] md:top-[14px] right-3" />
                ) : null}
              </div>
              {formik.touched.password && formik.errors.password ? (
                <span className="text-[10px] md:text-xs text-red-400 pl-2">{formik.errors.password}</span>
              ) : null}
            </div>
            <div className="w-[80%] md:w-3/4 h-20 md:h-[90px] flex flex-col">
              <label htmlFor="password" className="text-sm md:text-md font-bold text-sky-400 mb-[3px] cursor-pointer">
                Confirm Password
              </label>
              <div className="relative">
                <span
                  className="absolute h-fit top-[10px] md:top-[14px] left-3 cursos-pointer text-lg text-sky-300 hover:text-sky-200 transition cursor-pointer"
                  onClick={() => {
                    if (document.getElementById('confirm_password').type === 'password') {
                      document.getElementById('confirm_password').type = 'text';
                    } else {
                      document.getElementById('confirm_password').type = 'password';
                    }
                    setShowConfirmation(!showConfirmation);
                  }}
                >
                  {showConfirmation ? <AiFillEyeInvisible /> : <AiFillEye />}
                </span>
                <input
                  type="password"
                  id="confirm_password"
                  placeholder="Retype your password.."
                  className={`h-9 md:h-11 w-full pl-9 rounded-lg ${
                    formik.touched.confirm_password && formik.errors.confirm_password ? 'border-red-400' : 'border-gray-300 '
                  } border-2 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-300 transition placeholder:text-sm md:placeholder:text-lg placeholder:text-sky-300 placeholder:font-semibold mb-[3px] cursor-pointer`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirm_password}
                />
                {formik.touched.confirm_password && formik.errors.confirm_password ? (
                  <AiOutlineInfoCircle className="text-red-400 text-md md:text-lg absolute top-[11px] md:top-[14px] right-3" />
                ) : null}
              </div>
              {formik.touched.confirm_password && formik.errors.confirm_password ? (
                <span className="text-xs text-red-400 pl-2">{formik.errors.confirm_password}</span>
              ) : null}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-[80%] md:w-9/12 h-9 md:h-11 mt-2 rounded-lg text-white font-semibold flex justify-center items-center gap-2 ${
                isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-sky-400 cursor-pointer active:scale-95 hover:brightness-110'
              } transition shadow-sm`}
            >
              {isLoading ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin" />
                  <span>Signing you up..</span>
                </>
              ) : (
                'Sign-up'
              )}
            </button>
            <div className="w-full md:w-9/12 flex gap-1 text-xs justify-center mt-2">
              <span>By signing-up I agrees to our</span>
              <span className="font-semibold text-sky-400 hover:brightness-125 transition cursor-pointer">Terms and Condition</span>
            </div>
          </div>
        </form>
        <div className="w-full py-2 md:py-0 md:h-8 relative flex items-center justify-center my-2">
          <div className="h-[2px] w-9/12 bg-slate-300 mx-auto" />
          <span className="w-8 bg-white font-semibold text-sky-400 text-center absolute">Or</span>
        </div>
        <div className="w-full h-24 flex flex-col items-center">
          <button
            className="w-[75%] h-10 md:h-12 rounded-lg flex items-center justify-center gap-2 border-2 bg-white border-slate-300 hover:bg-amber-200 hover:border-amber-200 transition text-sm md:text-md font-semibold active:scale-95 mb-1 md:mb-3"
            onClick={() => {
              window.open(`${API_URL}/auth/google`, '_self');
            }}
          >
            {' '}
            <FcGoogle />
            Sign-up with Google
          </button>
          <span
            onClick={() => navigate('/login')}
            className="text-xs md:text-sm text-transparent w-[200px] bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text font-semibold text-center hover:brightness-110 cursor-pointer transition active:scale-95"
          >
            I already have an account
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
