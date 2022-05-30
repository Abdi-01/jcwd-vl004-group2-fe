import axios from 'axios';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { API_URL } from '../assets/constants';

const ResetAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // validation
  const formik = useFormik({
    initialValues: {
      email: '',
    },

    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
    }),

    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const response = await axios.post(`${API_URL}/admin/auth/reset`, {
          email: values.email,
        });

        toast.success(response.data.message);
        setIsLoading(false);
        setTimeout(() => navigate('/admin/login'), 4000);
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
          <h2 className="card-title text-2xl">RESET PASSWORD</h2>
          <p className="text-slate-400 italic">
            Please enter your email address below to receive a link.
          </p>
          <div className="flex flex-col  my-5">
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
          </div>
          <div className="card-actions justify-end">
            <button
              type="submit"
              className="btn btn-block btn-primary"
              disabled={isLoading}
            >
              RESET MY PASSWORD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetAdmin;
