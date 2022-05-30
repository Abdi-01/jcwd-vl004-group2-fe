import { useState, Fragment } from 'react';
import Axios from 'axios';
import { API_URL } from '../assets/constants';

import { Dialog, Transition } from '@headlessui/react';
import { AiOutlineUserAdd, AiOutlineInfoCircle, AiOutlineLoading3Quarters, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { MdAdminPanelSettings } from 'react-icons/md';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const NewAdminModal = ({ setAdmins, setMaxPage, setTotalAdmins, limit, currentPage }) => {
  const adminToken = localStorage.getItem('adminToken');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      phone_number: '',
      address: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .matches(/^[a-zA-Z. ]*$/, 'Name cannot contain special characters or numbers')
        .required('This field is required'),
      username: Yup.string()
        .matches(/^[a-zA-Z0-9._]*$/, 'Only alphanumeric characters, (-), (_), (.) is allowed and no spaces')
        .required('This field is required'),
      email: Yup.string().email('Please enter a valid email address').required('This field is required'),
      password: Yup.string()
        .matches(
          /^(?!.* )(?=.*\d)(?=.*[A-Z]).{6,}$/,
          'Password must consist of min. 6 characters, with 1 uppercase character, 1 number and no spaces'
        )
        .required('This field is required'),
      phone_number: Yup.string()
        .matches(/^(\+62|62)?[\s-]?0?8[1-9]{1}\d{1}[\s-]?\d{4}[\s-]?\d{2,5}$/, 'Please enter a valid phone number')
        .required('This field is required'),
      address: Yup.string().required('This field is required'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const response = await Axios.post(
          `${API_URL}/admin/account/create`,
          { data: values, limit: limit, currentPage: currentPage },
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );

        if (response.data.conflict) {
          setLoading(false);
          toast.error(response.data.conflict, { theme: 'colored', position: 'bottom-left' });
        } else {
          formik.resetForm();
          setAdmins(response.data.rows);
          setMaxPage(response.data.maxPage);
          setTotalAdmins(response.data.totalAdmins);
          setShowPass(false);
          toast.success(response.data.message, { theme: 'colored', position: 'bottom-left' });
          setLoading(false);
          setOpen(false);
        }
      } catch (err) {
        setLoading(false);

        toast.error('Unable to create new Admin!', { theme: 'colored', position: 'bottom-left' });
      }
    },
  });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full h-12 rounded-lg bg-gradient-to-r from-emerald-400 to-green-300 font-bold text-white flex justify-center items-center gap-2 hover:brightness-110 cursor-pointer active:scale-95 transition"
      >
        <AiOutlineUserAdd />
        Add Admin
      </button>

      <Transition appear show={open} as={Fragment}>
        <Dialog onClose={() => setOpen(false)} className="fixed inset-0 z-50 overflow-y-auto flex justify-center items-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-50"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-50"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-80 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-80 scale-100 -translate-y-5"
          >
            <div className="w-[790px] bg-gray-50 rounded-2xl fixed z-10 flex flex-col">
              <div className="w-full py-4 px-7 text-2xl flex items-center gap-2">
                <MdAdminPanelSettings className="text-sky-400" />
                <span className="font-bold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                  Create New Admin
                </span>
              </div>
              <form id="create-admin" onSubmit={formik.handleSubmit} className="px-7">
                <div className="w-full flex flex-col p-4 bg-white ring ring-emerald-200 rounded-xl">
                  <div className="flex h-[98px] gap-5">
                    <div className="w-full flex flex-col">
                      <label htmlFor="name" className="text-xl font-thin text-sky-500 mb-1 cursor-pointer leading-tight">
                        Name:
                      </label>
                      <div className="w-full relative flex items-center">
                        <input
                          id="name"
                          type="text"
                          placeholder="Insert name.."
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`h-10 w-full px-3 rounded-lg focus:outline-none ${
                            formik.touched.name && formik.errors.name ? 'border-red-300' : 'border-sky-200 focus:border-sky-300'
                          } border transition cursor-pointer placeholder:font-semibold placeholder:text-gray-300`}
                        />
                        {formik.touched.name && formik.errors.name ? (
                          <AiOutlineInfoCircle className={`absolute right-2 text-red-400`} />
                        ) : null}
                      </div>
                      {formik.touched.name && formik.errors.name ? (
                        <span className="pl-1 text-xs text-red-400 mt-[2px] max-w-full">{formik.errors.name}</span>
                      ) : null}
                    </div>
                    <div className="w-full flex flex-col">
                      <label htmlFor="username" className="text-xl font-thin text-sky-400 mb-1 cursor-pointer leading-tight">
                        Username:
                      </label>
                      <div className="w-full relative flex items-center">
                        <input
                          id="username"
                          type="text"
                          placeholder="Insert username.."
                          value={formik.values.username}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`h-10 w-full px-3 rounded-lg focus:outline-none ${
                            formik.touched.username && formik.errors.username ? 'border-red-300' : 'border-sky-200 focus:border-sky-300'
                          } border transition cursor-pointer placeholder:font-semibold placeholder:text-gray-300`}
                        />
                        {formik.touched.username && formik.errors.username ? (
                          <AiOutlineInfoCircle className={`absolute right-2 text-red-400`} />
                        ) : null}
                      </div>
                      {formik.touched.username && formik.errors.username ? (
                        <span className="pl-1 text-[11px] leading-tight text-red-400 mt-1 max-w-full">{formik.errors.username}</span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex h-[98px] gap-5">
                    <div className="w-full flex flex-col">
                      <label htmlFor="email" className="text-xl font-thin text-sky-500 mb-[2px] cursor-pointer leading-tight">
                        Email:
                      </label>
                      <div className="w-full relative flex items-center">
                        <input
                          id="email"
                          type="text"
                          placeholder="eg: tes@mail.com"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`h-10 w-full px-3 rounded-lg focus:outline-none ${
                            formik.touched.email && formik.errors.email ? 'border-red-300' : 'border-sky-200 focus:border-sky-300'
                          } border transition cursor-pointer placeholder:font-semibold placeholder:text-gray-300`}
                        />
                        {formik.touched.email && formik.errors.email ? (
                          <AiOutlineInfoCircle className={`absolute right-2 text-red-400`} />
                        ) : null}
                      </div>
                      {formik.touched.email && formik.errors.email ? (
                        <span className="pl-1 text-xs text-red-400 mt-1 max-w-full">{formik.errors.email}</span>
                      ) : null}
                    </div>
                    <div className="w-full h-[87px] flex flex-col">
                      <label htmlFor="phone_number" className="text-xl font-thin text-sky-400 mb-[2px] leading-tight cursor-pointer">
                        Phone:
                      </label>
                      <div className="w-full relative flex items-center">
                        <input
                          id="phone_number"
                          type="tel"
                          placeholder="eg: 081188889999"
                          value={formik.values.phone_number}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`h-10 w-full px-3 rounded-lg focus:outline-none ${
                            formik.touched.phone_number && formik.errors.phone_number
                              ? 'border-red-300'
                              : 'border-sky-200 focus:border-sky-300'
                          } border transition cursor-pointer placeholder:font-semibold placeholder:text-gray-300`}
                        />
                        {formik.touched.phone_number && formik.errors.phone_number ? (
                          <AiOutlineInfoCircle className={`absolute right-2 text-red-400`} />
                        ) : null}
                      </div>
                      {formik.touched.phone_number && formik.errors.phone_number ? (
                        <span className="pl-1 text-xs text-red-400 mt-1 max-w-full">{formik.errors.phone_number}</span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <div className="w-full flex flex-col">
                      <label htmlFor="password" className="text-xl font-thin text-sky-400 mb-[2px] leading-tight cursor-pointer">
                        Password:
                      </label>
                      <div className="w-full relative flex items-center">
                        <span
                          onClick={() => {
                            if (document.getElementById('password').type === 'password') {
                              document.getElementById('password').type = 'text';
                            } else {
                              document.getElementById('password').type = 'password';
                            }
                            setShowPass(!showPass);
                          }}
                          className="absolute left-3 text-sky-300 cursor-pointer hover:brightness-110 transition"
                        >
                          {showPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </span>
                        <input
                          id="password"
                          type="password"
                          placeholder="Insert password.."
                          value={formik.values.password}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`h-10 w-full px-9 rounded-lg focus:outline-none ${
                            formik.touched.password && formik.errors.password ? 'border-red-300' : 'border-sky-200 focus:border-sky-300'
                          } border transition cursor-pointer placeholder:font-semibold placeholder:text-gray-300`}
                        />
                        {formik.touched.password && formik.errors.password ? (
                          <AiOutlineInfoCircle className={`absolute right-2 text-red-400`} />
                        ) : null}
                      </div>
                      {formik.touched.password && formik.errors.password ? (
                        <span className="pl-1 text-xs text-red-400 mt-1 max-w-full">{formik.errors.password}</span>
                      ) : null}
                    </div>
                    <div className="w-full h-[150px] flex flex-col">
                      <label htmlFor="address" className="text-xl font-thin text-sky-400 mb-[2px] cursor-pointer leading-tight">
                        Address:
                      </label>
                      <div className="w-full relative flex">
                        <textarea
                          id="address"
                          value={formik.values.address}
                          placeholder="eg: Jl. Metro Alam IV No.10 PL-14"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`h-24 w-full px-3 py-1 rounded-lg focus:outline-none ${
                            formik.touched.address && formik.errors.address ? 'border-red-300' : 'border-sky-200 focus:border-sky-300'
                          } border transition cursor-pointer placeholder:font-semibold placeholder:text-gray-300`}
                        />
                        {formik.touched.address && formik.errors.address ? (
                          <AiOutlineInfoCircle className={`absolute top-2 right-2 text-red-400`} />
                        ) : null}
                      </div>
                      {formik.touched.address && formik.errors.address ? (
                        <span className="pl-1 text-xs text-red-400 mt-[2px] max-w-full">{formik.errors.address}</span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </form>
              <div className="flex justify-center gap-3 py-5">
                <button
                  onClick={() => {
                    setShowPass(false);
                    setOpen(false);
                    formik.resetForm();
                  }}
                  className="h-10 w-32 rounded-lg bg-red-400 hover:brightness-110 font-bold text-white active:scale-95 transition"
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  type="submit"
                  form="create-admin"
                  className="h-10 w-32 rounded-lg bg-green-400 disabled:bg-green-300 hover:brightness-110 disabled:hover:brightness-100 font-bold text-white active:scale-95 disabled:active:scale-100 transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <AiOutlineLoading3Quarters className="animate-spin" />
                      Creating..
                    </>
                  ) : (
                    'Create'
                  )}
                </button>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

export default NewAdminModal;
