import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Axios from 'axios';
import { API_URL } from '../assets/constants';

import '../assets/styles/Verify.css';
import { BsFillPatchCheckFill } from 'react-icons/bs';
import { BiErrorCircle } from 'react-icons/bi';
import { AiOutlineHome } from 'react-icons/ai';

const Verify = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
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
      <div className="h-1/2 w-1/2 rounded-lg shadow flex flex-col pt-6 border border-sky-500 ring ring-offset-2 ring-sky-500 verifyWrapper">
        <div className="w-full h-max flex justify-center mb-[74px]">
          <span className="text-3xl font-bold text-sky-500">Logo</span>
        </div>
        {done ? (
          error ? (
            <>
              <div className="w-full flex flex-col items-center">
                <div className="w-full h-16 flex justify-center items-center text-xl gap-2 mb-20">
                  <BiErrorCircle className="text-red-400" />
                  <span className="font-semibold text-sky-600">Whoops.. it seems we cannot verify your account right now..</span>
                </div>
                <div
                  onClick={() => {
                    navigate('/', { replace: true });
                  }}
                  className="flex justify-center items-center space-x-2 text-zinc-500 hover:brightness-120 text-md font-bold transition cursor-pointer active:scale-95"
                >
                  <AiOutlineHome />
                  <span className="">Back to Home</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-full h-max flex justify-center space-x-2 items-center">
                <span className="text-2xl font-bold text-blue-400 mb-1">This account has been verified!</span>
                <BsFillPatchCheckFill className="text-sky-500" />
              </div>
              <div className="w-full flex justify-center mb-20">
                <span className="text-[15px] font-medium text-zinc-500">Thankyou for completing your verification process</span>
              </div>
              <div className="w-full flex justify-center">
                <span className="text-sm font-semibold text-zinc-400">Redirecting you to home..</span>
              </div>
            </>
          )
        ) : (
          <div className="w-full flex flex-col items-center pt-3">
            <span className="text-2xl font-bold text-sky-500">Please wait while we verify your account..</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;