import { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { API_URL } from '../assets/constants';

import { Dialog, Menu, Transition } from '@headlessui/react';
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillCloseCircle, AiOutlineEdit, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { MdVerified, MdAddAPhoto } from 'react-icons/md';
import { BiDiamond } from 'react-icons/bi';
import { BsThreeDots } from 'react-icons/bs';
import { toast } from 'react-toastify';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';

const ProfileMenu = ({ editMode, setEditMode }) => {
  return (
    <Menu as="div" className="relative">
      <Menu.Button
        disabled={editMode}
        onClick={() => setEditMode(true)}
        className="h-7 w-7 flex justify-center items-center rounded-full bg-white hover:bg-gray-200 active:scale-95 transition disabled:bg-gray-200 disabled:cursor-default focus:outline-none"
      >
        <BsThreeDots className="text-sky-500" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-3 z-30 bg-white shadow-md rounded-md focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <div className="w-36 h-10 p-1">
                <button
                  onClick={() => setEditMode(true)}
                  className={`w-full h-full pl-2 ${
                    active ? 'bg-sky-100 text-sky-500 text-opacity-80' : 'text-sky-300'
                  } focus:outline-none rounded-md flex items-center gap-2 transition text-sm font-semibold`}
                >
                  <AiOutlineEdit />
                  Edit Profile
                </button>
              </div>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem('userToken');
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        navigate('/', { replace: true });
      } else {
        const user = await Axios.get(`${API_URL}/user/find-user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(user.data);
      }
    };
    fetchUserData();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: userData.name,
      username: userData.username ? userData.username : '',
      phone_number: userData.phone_number ? userData.phone_number : '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string()
        .matches(/^[a-zA-Z0-9 ]*$/, 'Name cannot contain special characters')
        .required('This field cannot be empty'),
      username: Yup.string()
        .matches(/^[a-zA-Z0-9._]*$/, 'Only alphanumeric characters, contain no spaces, (-), (_), and (.) is allowed')
        .nullable(),
      phone_number: Yup.string()
        .matches(/^(\+62|62)?[\s-]?0?8[1-9]{1}\d{1}[\s-]?\d{4}[\s-]?\d{2,5}$/, 'Please enter a valid phone number')
        .nullable(),
    }),
    onSubmit: async (values) => {
      try {
        setProfileLoading(true);

        const formData = new FormData();

        formData.append('data', JSON.stringify(values));

        if (profileImage) {
          formData.append('profile_picture', profileImage);
        }

        const response = await Axios.post(`${API_URL}/user/update-profile`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfileLoading(false);

        if (response.data.conflict) {
          toast.warning(response.data.message, { position: 'bottom-left', theme: 'colored' });
          return setOpen(false);
        }

        dispatch({ type: 'UPDATE_PHONE', payload: response.data.user.phone_number });

        setUserData(response.data.user);
        document.getElementById('profile-picture').src = `${API_URL}/${response.data.user.profile_picture}`;

        toast.success(response.data.message, { position: 'bottom-left', theme: 'colored' });

        setOpen(false);
        setEditMode(false);
      } catch (err) {
        setProfileLoading(false);

        toast.error('Unable to update profile', { position: 'bottom-left', theme: 'colored' });
      }
    },
  });

  const formikPassword = useFormik({
    initialValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
    validationSchema: Yup.object({
      current_password: Yup.string().required('This field is required'),
      new_password: Yup.string()
        .matches(
          /^(?!.* )(?=.*\d)(?=.*[A-Z]).{6,}$/,
          'Password must consist of min. 6 characters, with 1 uppercase character, 1 number and no spaces'
        )
        .required('This field is required'),
      confirm_password: Yup.string()
        .oneOf([Yup.ref('new_password')], 'Please check your confirmation password')
        .required('This field is required'),
    }),
    onSubmit: async (values) => {
      try {
        setPasswordLoading(true);

        const response = await Axios.post(
          `${API_URL}/user/update-password`,
          {
            password: values.current_password,
            newPass: values.new_password,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPasswordLoading(false);

        if (response.data.conflict) {
          return toast.warning(response.data.message, { position: 'bottom-left', theme: 'colored' });
        }

        toast.success(response.data, { position: 'bottom-left', theme: 'colored' });
        formikPassword.resetForm();
      } catch (err) {
        setPasswordLoading(false);

        toast.error('Unable to change password');
      }
    },
  });

  return (
    <div className="w-full min-h-screen flex flex-col items-center py-5 lg:py-11 relative">
      <div className="w-full h-32 bg-gradient-to-b from-sky-200 to-white absolute top-0 z-0"></div>
      <div className="w-full relative z-1 h-full flex justify-center px-2">
        <div className="w-[60%] sm:w-[55%] lg:w-[50%] xl:w-[40%] h-max px-4 mr-4 bg-white rounded-box border flex flex-col">
          <div className="w-full py-1">
            <div className="w-full flex py-2">
              <span className="text-xl font-bold bg-gradient-to-r from-sky-500 to-sky-400 bg-clip-text text-transparent mr-auto">
                My Profile
              </span>
              <ProfileMenu editMode={editMode} setEditMode={setEditMode} />
            </div>
            <div className="w-full h-px bg-slate-300" />
          </div>
          <div className="w-full mt-4 mb-2 px-3 py-2 rounded-box border border-emerald-200 relative flex flex-col">
            <span className="text-sm font-semibold text-sky-400 bg-white px-1 absolute -top-3 left-4">Email:</span>
            <span type="text" className="text-lg font-light text-emerald-400">
              {userData.email}
            </span>
          </div>
          <div className="w-full my-4 py-2 rounded-box border border-emerald-200 relative">
            <span className="text-sm font-semibold text-sky-400 bg-white px-1 absolute -top-3 left-4">My Bio:</span>
            <form id="update-form" onSubmit={formik.handleSubmit}>
              <div className="w-full py-1 px-3 flex flex-col">
                <label className="text-md font-semibold text-sky-500">Name:</label>
                <div className="w-full flex flex-col relative">
                  {editMode ? (
                    <>
                      <input
                        id="name"
                        type="text"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter your name.."
                        className="text-xl focus:outline-none font-light placeholder:text-emerald-400 text-emerald-400"
                      />
                    </>
                  ) : (
                    <span className="text-xl focus:outline-none font-light text-emerald-400">{userData.name}</span>
                  )}
                  <div
                    className={`${editMode ? 'w-full' : 'w-0'} h-px ${
                      formik.touched.name && formik.errors.name ? 'bg-rose-300' : 'bg-sky-300'
                    }  transition-all duration-200`}
                  />
                  {editMode && formik.touched.name && formik.errors.name ? (
                    <span className="text-xs text-red-400 py-1 pl-1">{formik.errors.name}</span>
                  ) : null}
                </div>
              </div>
              <div className="w-full py-1 px-3 flex flex-col">
                <label className="text-md font-semibold text-sky-500">Username:</label>
                <div className="w-full flex flex-col relative">
                  {editMode ? (
                    <>
                      <input
                        id="username"
                        type="text"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter username.."
                        className="text-xl focus:outline-none font-light placeholder:text-emerald-400 text-emerald-400"
                      />
                    </>
                  ) : (
                    <span className="text-xl focus:outline-none font-light text-emerald-400">
                      {userData.username ? userData.username : `You haven't filled your username`}
                    </span>
                  )}
                  <div
                    className={`${editMode ? 'w-full' : 'w-0'} h-px ${
                      formik.errors.username ? 'bg-rose-300' : 'bg-sky-300'
                    } transition-all duration-200`}
                  />
                  {editMode && formik.errors.username ? (
                    <span className="text-xs text-red-400 py-1 pl-1">{formik.errors.username}</span>
                  ) : null}
                </div>
              </div>
              <div className="w-full py-1 px-3 flex flex-col">
                <label className="text-md font-semibold text-sky-500">Phone:</label>
                <div className="w-full flex flex-col relative">
                  {editMode ? (
                    <>
                      <input
                        id="phone_number"
                        type="tel"
                        value={formik.values.phone_number}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter phone number.."
                        className="text-xl focus:outline-none font-light placeholder:text-emerald-400 text-emerald-400"
                      />
                    </>
                  ) : (
                    <span className="text-xl focus:outline-none font-light text-emerald-400">
                      {userData.phone_number ? userData.phone_number : `You haven't filled your phone number`}
                    </span>
                  )}
                  <div
                    className={`${editMode ? 'w-full' : 'w-0'} h-px ${
                      formik.errors.phone_number ? 'bg-rose-300' : 'bg-sky-300'
                    } transition-all duration-200`}
                  />
                  {editMode && formik.errors.phone_number ? (
                    <span className="text-xs text-rose-400 font-semibold py-1 pl-1">{formik.errors.phone_number}</span>
                  ) : null}
                </div>
              </div>
            </form>
            <div className={`w-full flex justify-center gap-3 ${editMode ? 'mt-3' : 'mt-0'} transition duration-200`}>
              <button
                onClick={() => {
                  setEditMode(false);
                  setProfileImage(null);
                  formik.resetForm();
                }}
                className={`w-28 ${
                  editMode ? 'h-10 opacity-100' : 'h-0 opacity-0'
                } rounded-xl font-semibold hover:brightness-110 active:scale-95 text-white bg-gradient-to-r from-red-500 to-rose-400 transition-all duration-200 flex items-center justify-center`}
              >
                Cancel
              </button>
              <>
                <button
                  onClick={() => setOpen(true)}
                  disabled={
                    (formik.values.name === userData.name &&
                      (formik.values.username === userData.username || formik.values.username === '') &&
                      (formik.values.phone_number === userData.phone_number || formik.values.phone_number === '') &&
                      !profileImage) ||
                    profileLoading
                  }
                  className={`w-28 ${
                    editMode ? 'h-10 opacity-100' : 'h-0 opacity-0'
                  } rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-400 disabled:bg-opacity-70 disabled:from-emerald-200 disabled:to-emerald-200 disabled:active:scale-100 disabled:hover:brightness-100 hover:brightness-125 active:scale-95 transition-all duration-200`}
                >
                  Save
                </button>

                <Transition appear as={Fragment} show={open}>
                  <Dialog as="div" onClose={() => setOpen(false)} className="fixed inset-0 z-[300] flex items-center justify-center">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40" />
                    </Transition.Child>

                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="-translate-y-4 opacity-90"
                      enterTo="translate-y-0 opaciy-100"
                      leave="ease-in duration-200"
                      leaveFrom="translate-y-0 opaciy-100"
                      leaveTo="-translate-y-4 opacity-90"
                    >
                      <div className="w-2/3 md:w-[45%] lg:w-1/3 xl:w-[27.5%] absolute z-10 py-7 flex flex-col rounded-box bg-sky-50 shadow">
                        <div className="flex justify-center pb-7">
                          <span className="text-2xl md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                            Update your profile?
                          </span>
                        </div>
                        <div className="flex justify-center items-center gap-3">
                          <button
                            onClick={() => setOpen(false)}
                            className="w-36 py-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-400 font-bold text-white hover:brightness-110 active:scale-95 transition shadow"
                          >
                            Nevermind
                          </button>
                          <button
                            type="submit"
                            form="update-form"
                            disabled={profileLoading}
                            className="w-36 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-emerald-400 font-bold text-white hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 disabled:from-sky-300 disabled:to-sky-300 disabled:hover:brightness-100 disabled:active:scale-100 shadow"
                          >
                            {profileLoading ? (
                              <>
                                <AiOutlineLoading3Quarters className="animate-spin" />
                                Updating..
                              </>
                            ) : (
                              'Update'
                            )}
                          </button>
                        </div>
                      </div>
                    </Transition.Child>
                  </Dialog>
                </Transition>
              </>
            </div>
          </div>
          <div className="w-full mt-2 mb-4 pt-4 px-3 rounded-box border border-emerald-200 relative flex flex-col items-center">
            <span className="text-sm font-semibold text-sky-400 bg-white px-1 absolute -top-3 left-4">Change Password:</span>
            <form onSubmit={formikPassword.handleSubmit} className="w-full">
              {formikPassword.touched.current_password || formikPassword.touched.new_password || formikPassword.touched.confirm_password ? (
                <button
                  onClick={formikPassword.resetForm}
                  className="font-bold flex flex-col items-center text-red-400 transition hover:brightness-110 active:scale-95 absolute top-2 right-1 sm:right-2"
                >
                  <AiFillCloseCircle className="text-md xl:text-lg" />
                  <span className="text-[11px] lg:text-xs">Cancel</span>
                </button>
              ) : null}
              <div className="w-full flex gap-2">
                <div className="w-[30%] h-7 lg:h-8 flex items-center justify-end">
                  <label
                    htmlFor="current_password"
                    className="text-[11px] sm:text-sm font-semibold text-sky-400 hover:brightness-110 cursor-pointer"
                  >
                    Current Pass:
                  </label>
                </div>
                <div className="w-[55%] lg:w-[57%] flex flex-col">
                  <div className="w-full flex items-center relative">
                    <div
                      onClick={() => {
                        if (document.getElementById('current_password').type === 'password') {
                          document.getElementById('current_password').type = 'text';
                        } else {
                          document.getElementById('current_password').type = 'password';
                        }
                        setShowOld(!showOld);
                      }}
                      className="absolute right-1 text-sky-500 hover:brightness-125 cursor-pointer"
                    >
                      {showOld ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </div>
                    <input
                      id="current_password"
                      type="password"
                      value={formikPassword.values.current_password}
                      onChange={formikPassword.handleChange}
                      onBlur={formikPassword.handleBlur}
                      className={`w-full h-7 lg:h-8 border-b ${
                        formikPassword.touched.current_password && formikPassword.errors.current_password
                          ? 'border-red-300'
                          : 'border-sky-300 focus:border-emerald-300'
                      }  focus:outline-none mb-1`}
                    />
                  </div>
                  {formikPassword.touched.current_password && formikPassword.errors.current_password ? (
                    <span className="text-[11px] lg:text-xs w-full text-rose-400">{formikPassword.errors.current_password}</span>
                  ) : null}
                </div>
              </div>
              <div className="w-full flex gap-2">
                <div className="w-[30%] h-7 lg:h-8 flex items-center justify-end">
                  <label
                    htmlFor="new_password"
                    className="text-[11px] sm:text-sm font-semibold text-sky-400 hover:brightness-110 cursor-pointer"
                  >
                    New Pass:
                  </label>
                </div>
                <div className="w-[55%] lg:w-[57%] flex flex-col">
                  <div className="w-full flex items-center relative">
                    <div
                      onClick={() => {
                        if (document.getElementById('new_password').type === 'password') {
                          document.getElementById('new_password').type = 'text';
                        } else {
                          document.getElementById('new_password').type = 'password';
                        }
                        setShowNew(!showNew);
                      }}
                      className="absolute right-1 text-sky-500 hover:brightness-125 cursor-pointer"
                    >
                      {showNew ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </div>
                    <input
                      id="new_password"
                      type="password"
                      value={formikPassword.values.new_password}
                      onChange={formikPassword.handleChange}
                      onBlur={formikPassword.handleBlur}
                      className={`w-full h-7 lg:h-8 border-b ${
                        formikPassword.touched.new_password && formikPassword.errors.new_password
                          ? 'border-red-300'
                          : 'border-sky-300 focus:border-emerald-300'
                      } mb-1 focus:outline-none`}
                    />
                  </div>
                  {formikPassword.touched.new_password && formikPassword.errors.new_password ? (
                    <span className="text-[11px] lg:text-xs w-full text-rose-400">{formikPassword.errors.new_password}</span>
                  ) : null}
                </div>
              </div>
              <div className="w-full flex gap-2">
                <div className="w-[30%] h-7 lg:h-8 flex justify-end items-center">
                  <label
                    htmlFor="confirm_password"
                    className="text-[11px] sm:text-sm font-semibold text-sky-400 hover:brightness-110 cursor-pointer"
                  >
                    Confirm Pass:
                  </label>
                </div>
                <div className="w-[55%] lg:w-[57%] flex flex-col">
                  <div className="w-full flex items-center relative">
                    <div
                      onClick={() => {
                        if (document.getElementById('confirm_password').type === 'password') {
                          document.getElementById('confirm_password').type = 'text';
                        } else {
                          document.getElementById('confirm_password').type = 'password';
                        }
                        setShowConf(!showConf);
                      }}
                      className="absolute right-1 text-sky-500 hover:brightness-125 cursor-pointer"
                    >
                      {showConf ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </div>
                    <input
                      id="confirm_password"
                      type="password"
                      value={formikPassword.values.confirm_password}
                      onChange={formikPassword.handleChange}
                      onBlur={formikPassword.handleBlur}
                      className={`w-full h-7 lg:h-8 border-b ${
                        formikPassword.touched.confirm_password && formikPassword.errors.confirm_password
                          ? 'border-red-300'
                          : 'border-sky-300 focus:border-emerald-300'
                      } mb-1 focus:outline-none`}
                    />
                  </div>
                  {formikPassword.touched.confirm_password && formikPassword.errors.confirm_password ? (
                    <span className="text-[11px] lg:text-xs text-rose-400 w-full">{formikPassword.errors.confirm_password}</span>
                  ) : null}
                </div>
              </div>
              <div className="w-full flex justify-center py-4">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className={`h-9 sm:h-10 xl:h-11 w-40 lg:w-44 rounded-xl bg-gradient-to-r ${
                    formikPassword.errors.current_password ||
                    formikPassword.errors.new_password ||
                    formikPassword.errors.confirm_password ||
                    passwordLoading
                      ? 'from-sky-300 to-emerald-300 cursor-default'
                      : 'from-sky-500 to-emerald-500 active:scale-95 hover:brightness-110'
                  } font-semibold text-white transition text-sm sm:text-md xl:text-base`}
                >
                  {passwordLoading ? (
                    <>
                      <AiOutlineLoading3Quarters className="animate-spin" />
                      Updating..
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="w-[30%] sm:w-[25%] lg:w-[22%] xl:w-[18%] h-max bg-white rounded-xl border flex flex-col">
          <div className="w-full py-5 flex justify-center items-center">
            <div className="w-32 h-32 md:h-28 md:w-28 lg:w-36 lg:h-36 xl:w-40 xl:h-40 rounded-full flex justify-center items-center shadow bg-blue-100 relative">
              <div className="w-[90%] h-[90%] rounded-full flex justify-center items-center overflow-hidden bg-white">
                <img
                  id="profile-picture"
                  className="h-full object-cover"
                  src={profileImage ? URL.createObjectURL(profileImage) : `${API_URL}/${userData.profile_picture}`}
                />
              </div>
              {editMode && (
                <label
                  htmlFor="profile-input"
                  className={`p-2 rounded-full bg-gray-300 text-gray-700 flex justify-center items-center text-md lg:text-lg absolute bottom-1 right-2 lg:right-3 cursor-pointer hover:brightness-105 active:scale-95 transition-all z-50 ${
                    editMode ? 'opacity-100 visible' : 'opacity-0 invisible'
                  }`}
                >
                  <MdAddAPhoto />
                </label>
              )}
              <input
                onChange={(e) => {
                  setProfileImage(e.target.files[0]);
                }}
                id="profile-input"
                type="file"
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
          <div className="h-[2px] w-[90%] bg-gray-100 rounded-xl mx-auto" />
          <div className="w-full pt-1 pl-1 flex justify-center">
            <span className="text-xl md:text-lg lg:text-xl xl:text-2xl font-bold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent truncate">
              {userData.name}
            </span>
            {userData.is_verified === 'verified' ? (
              <div className="p-1 flex items-center text-sky-400">
                <MdVerified />
              </div>
            ) : null}
          </div>
          <div className="w-full py-1 flex justify-center gap-1 divide-x-2 text-sm text-slate-400">
            <div className="px-1 max-w-36 flex justify-center">
              <span className="font-semibold">#{userData.id}</span>
            </div>
            <div className="px-1 flex items-center gap-1">
              <BiDiamond className="text-sky-300 brightness-110" />
              <span className="font-bold">Diamond</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
