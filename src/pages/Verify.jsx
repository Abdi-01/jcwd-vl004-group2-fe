import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Axios from 'axios';
import { API_URL } from '../assets/constants';

import '../assets/styles/Verify.css';
import logo from '../assets/images/logos/heizenberg.png';
import { BsFillPatchCheckFill } from 'react-icons/bs';
import { BiErrorCircle } from 'react-icons/bi';
import { AiOutlineHome, AiOutlineLoading3Quarters } from 'react-icons/ai';

const Verify = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [done, setDone] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        if (!/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/.test(params.token)) {
          return navigate('/', { replace: true });
        }
        const response = await Axios.post(
          `${API_URL}/auth/verify`,
          {},
          {
            headers: {
              Authorization: `Bearer ${params.token}`,
            },
          }
        );
        if (response.data.success) {
          setDone(true);
          localStorage.setItem('userToken', response.data.token);
          dispatch({
            type: 'USER_LOGIN',
            payload: response.data.user,
          });
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 2500);
        }
      } catch (err) {
        setError(true);
        setDone(true);
      }
    };
    verifyAccount();
  });

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-t from-white to-sky-400">
      <div className="h-1/3 md:h-1/2 w-5/6 sm:w-2/3 lg:w-1/2 rounded-lg shadow flex flex-col border border-sky-500 ring ring-offset-2 ring-sky-500 verifyWrapper">
        <div className="w-full flex justify-center my-5">
          <img src={logo} className="w-36 md:w-48 lg:w-56" />
        </div>
        {done ? (
          error ? (
            <>
              <div className="w-full flex flex-col items-center">
                <div className="w-full flex justify-center items-center text-sm md:text-lg xl:text-xl gap-2 my-9 md:my-16">
                  <BiErrorCircle className="text-red-400" />
                  <span className="font-semibold text-sky-600">Whoops.. it seems we cannot verify your account right now..</span>
                </div>
                <div
                  onClick={() => {
                    navigate('/', { replace: true });
                  }}
                  className="flex justify-center items-center gap-2 text-zinc-500 hover:brightness-120 font-bold transition cursor-pointer active:scale-95 text-sm md:text-base xl:text-lg my-4"
                >
                  <AiOutlineHome />
                  <span>Back to Home</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-full flex flex-col justify-center items-center my-4 md:my-12">
                <div className="flex items-center gap-2">
                  <span className="text-xl md:text-2xl font-bold text-blue-400 mb-1">This account has been verified!</span>
                  <BsFillPatchCheckFill className="text-sky-500" />
                </div>
                <span className="text-xs md:text-sm font-medium text-zinc-500">Thank you for completing your verification process</span>
              </div>
              <div className="w-full flex justify-center my-2">
                <span className="text-sm lg:text-base font-semibold text-emerald-400">Redirecting you to home..</span>
              </div>
            </>
          )
        ) : (
          <div className="w-full flex justify-center items-center gap-3 text-lg sm:text-xl md:text-2xl my-9 sm:my-7 md:my-16">
            <AiOutlineLoading3Quarters className="animate-spin text-emerald-500" />
            <span className="font-bold text-sky-500">Verifying your account..</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;
