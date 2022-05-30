import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import '../assets/styles/ChangePassword.css';
import logo from '../assets/images/logos/heizenberg.png';
import { BsCheckAll, BsFillUnlockFill } from 'react-icons/bs';
import { AiOutlineInfoCircle, AiOutlineLoading3Quarters, AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { toast } from 'react-toastify';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import Axios from 'axios';
import { API_URL } from '../assets/constants';

const ChangePassword = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [show, setShow] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/.test(params.token)) {
      return navigate('/', { replace: true });
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      password: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .matches(
          /^(?!.* )(?=.*\d)(?=.*[A-Z]).{6,}$/,
          'Password must consist of min. 6 characters, with 1 uppercase character, 1 number and no spaces'
        )
        .required('This field is required'),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        await Axios.post(
          `${API_URL}/auth/updatepassword`,
          {
            password: values.password,
          },
          {
            headers: {
              Authorization: `Bearer ${params.token}`,
            },
          }
        );
        setIsLoading(false);
        setSuccess(true);
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 3000);
      } catch (err) {
        toast.error('Server Error', { position: 'bottom-left', theme: 'colored' });
      }
    },
  });

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-white to-sky-500">
      <div className="w-5/6 md:w-[55%] lg:w-[40%] h-[45%] lg:h-1/2 rounded-xl shadow flex flex-col pt-4 border-2 border-sky-500 ring ring-offset-2 ring-sky-500 changePasswordWrapper">
        <div className="w-full h-max flex justify-center mb-3">
          <img
            src={logo}
            className="text-2xl font-bold text-sky-600 hover:brightness-125 transition cursor-pointer active:scale-95 w-48"
            onClick={() => navigate('/', { replace: true })}
          />
        </div>
        {success ? (
          <div className="w-full h-max mt-16 flex flex-col items-center">
            <div className="flex h-[50px] justify-center items-center text-2xl lg:text-3xl font-bold gap-2">
              <span className="text-sky-600">Password changed!</span>
              <BsCheckAll className="text-emerald-400" />
            </div>
            <span className="font-semibold text-md text-slate-500 mt-2">Successfully updated your password!</span>
          </div>
        ) : (
          <>
            <div className="w-full h-16 flex items-center justify-center gap-2 text-xl lg:text-2xl font-bold text-sky-600 mb-1">
              <BsFillUnlockFill />
              <span>Change Your Password</span>
            </div>
            <form onSubmit={formik.handleSubmit}>
              <div className="w-1/2 h-[80px] mx-auto flex flex-col my-2 items-center">
                <div className="relative w-full flex items-center mb-1">
                  <span
                    className="absolute top-3 left-3 text-lg text-slate-400 hover:text-sky-400 cursor-pointer transition"
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
                  <input
                    id="password"
                    type="password"
                    className={`h-10 w-full px-8 rounded-lg border-2 ${
                      formik.touched.password && formik.errors.password ? 'border-red-400 bg-red-50' : 'border-slate-500 '
                    } focus:outline-none focus:border-sky-500 transition placeholder:text-center placeholder:text-semibold placeholder:text-slate-400 text-center`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    placeholder="Your new password.."
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <AiOutlineInfoCircle className="absolute top-3 right-3 text-lg text-red-500" />
                  ) : null}
                </div>
                {formik.touched.password && formik.errors.password ? (
                  <span className="text-[10px] lg:text-xs text-rose-400">{formik.errors.password}</span>
                ) : null}
              </div>
              <div className="w-full h-max flex justify-center items-center mb-4">
                <button
                  disabled={isLoading}
                  type="submit"
                  className={`py-2 lg:py-3 px-8 lg:px-10 rounded-full flex justify-center items-center gap-2 ${
                    isLoading
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-sky-500 to-emerald-500 hover:brightness-110 active:scale-95'
                  } font-bold text-sky-50 transition-all`}
                >
                  {isLoading ? (
                    <>
                      <AiOutlineLoading3Quarters className="animate-spin" />
                      <span>Changing your password..</span>
                    </>
                  ) : (
                    <span>Submit</span>
                  )}
                </button>
              </div>
              <div className="text-center">
                <span className="text-xs lg:text-sm font-thin text-slate-400 italic">
                  *Please note it might take a while until we fully updated your new password
                </span>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;
