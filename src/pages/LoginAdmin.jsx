import axios from 'axios';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { API_URL } from '../assets/constants';

const LoginAdmin = () => {
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('tokenAdmin');
    if (token) navigate('/admin', { replace: true });
  }, []);

  // validation
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },

    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().required('Required'),
    }),

    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const response = await axios.post(`${API_URL}/admin/auth/login`, {
          email: values.email,
          password: values.password,
        });

        localStorage.setItem('tokenAdmin', response.data.token);
        localStorage.setItem('dataAdmin', response.data.data);
        toast.success(response.data.message);
        dispatch({ type: 'AUTH_ADMIN', payload: response.data.data });
        setIsLoading(false);
        navigate('/admin');
      } catch (error) {
        setIsLoading(false);
        toast.error(error.response.data.message);
      }
    },
  });

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="card w-96 bg-base-100 shadow-xl">
        <form onSubmit={formik.handleSubmit} className="card-body">
          <h2 className="card-title text-2xl">LOGIN ADMIN</h2>
          <p className="text-slate-400 italic">
            Login here if you are admin of heizen berg co.
          </p>
          <div className="flex flex-col gap-y-3 my-5">
            <div>
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="mail"
                placeholder="example@mail.com"
                className={`input input-bordered w-full max-w-xs mt-2 ${
                  formik.touched.email && formik.errors.email
                    ? 'border-red-400 bg-red-50'
                    : null
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-400 text-sm italic mt-2">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="type password"
                  className={`input input-bordered w-full max-w-xs mt-2 pr-10 ${
                    formik.touched.email && formik.errors.email
                      ? 'border-red-400 bg-red-50'
                      : null
                  }`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                {showPass ? (
                  <FiEyeOff
                    size={24}
                    className="absolute right-3 top-5 hover:cursor-pointer"
                    onClick={() => setShowPass(false)}
                  />
                ) : (
                  <FiEye
                    size={24}
                    className="absolute right-3 top-5 hover:cursor-pointer"
                    onClick={() => setShowPass(true)}
                  />
                )}
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-red-400 text-sm italic mt-2">
                    {formik.errors.password}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div class="form-control">
                  <label class="label cursor-pointer">
                    <span class="label-text mr-2">Remember me</span>
                    <input type="checkbox" class="checkbox checkbox-primary" />
                  </label>
                </div>
              </div>
              <div>
                <Link to="/admin/reset" className="text-primary">
                  Forgot password?
                </Link>
              </div>
            </div>
          </div>
          <div className="card-actions justify-end">
            <button
              type="submit"
              className="btn btn-block btn-primary"
              disabled={isLoading}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;