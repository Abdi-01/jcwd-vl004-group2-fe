import { useState, Fragment } from 'react';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import { API_URL } from '../assets/constants';

import { Dialog, Transition } from '@headlessui/react';
import { AiFillStar, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { MdOutlineNoAccounts } from 'react-icons/md';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const DeleteAdminModal = ({ adminId, setOpenMain, setAdmins, setMaxPage, setTotalAdmins, limit, currentPage }) => {
  const adminToken = localStorage.getItem('adminToken');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full h-12 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 disabled:from-red-300 disabled:to-rose-300 flex justify-center items-center gap-1 text-lg font-bold text-white cursor-pointer hover:brightness-125 disabled:hover:brightness-100 active:scale-95 disabled:active:scale-100 transition-all disabled:cursor-default"
      >
        <MdOutlineNoAccounts />
        <span>Deactivate Account</span>
      </button>

      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-[200] overflow-y-auto flex justify-center items-center" onClose={() => setOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-50"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-50"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
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
            <div className="fixed w-[550px] py-6 bg-sky-50 rounded-xl flex flex-col px-10 shadow-md">
              <div className="flex justify-center">
                <span className="text-xl font-bold">Are you sure you want to deactivate this account?</span>
              </div>
              <div className="w-full py-5 flex justify-center">
                <span className="font-semibold">Once you've deactivate this account, you need to manually reactivate it</span>
              </div>
              <div className="w-full flex justify-end items-center gap-3">
                <button
                  onClick={() => setOpen(false)}
                  className="py-3 w-32 rounded-full bg-gradient-to-r from-red-500 to-rose-400 hover:brightness-125 font-bold text-white active:scale-95 transition"
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  onClick={async () => {
                    try {
                      setLoading(true);

                      const response = await Axios.post(
                        `${API_URL}/admin/account/delete/${adminId}`,
                        {
                          limit: limit,
                          currentPage: currentPage,
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${adminToken}`,
                          },
                        }
                      );

                      if (response.data.conflict) {
                        setLoading(false);
                        toast.error(response.data.message, { position: 'bottom-left', theme: 'colored' });
                        setOpen(false);
                      } else {
                        setAdmins(response.data.rows);
                        setMaxPage(response.data.maxPage);
                        setTotalAdmins(response.data.totalAdmins);
                        setLoading(false);

                        toast.info(response.data.message, { position: 'bottom-left', theme: 'colored' });
                        setOpen(false);
                        setOpenMain(false);
                      }
                    } catch (error) {
                      setLoading(false);

                      toast.error('Unable to delete Admin Account', { position: 'bottom-left', theme: 'colored' });
                    }
                  }}
                  className="py-3 w-32 rounded-full bg-gradient-to-r from-emerald-500 disabled:from-emerald-300 to-green-400 disabled:to-green-300 hover:brightness-125 disabled:hover:brightness-100 font-bold text-white active:scale-95 disabled:active:scale-100 transition flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <>
                      <AiOutlineLoading3Quarters className="animate-spin" />
                      Deleting..
                    </>
                  ) : (
                    "Yes, I'm sure"
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

const AdminList = ({ admin, online, setAdmins, setMaxPage, setTotalAdmins, limit, currentPage }) => {
  const [openMain, setOpenMain] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpenMain(true)}
        className="w-full flex items-center border hover:border-sky-300 rounded-xl py-2 bg-gradient-to-r from-white to-gray-50 cursor-pointer transition"
      >
        <div className="w-[7%] flex justify-center items-center">
          <span className="font-bold text-gray-600">{admin.id}</span>
        </div>
        <div className="w-[20%] px-2 flex items-center">
          <span className="font-semibold text-gray-600 truncate">{admin.name}</span>
        </div>
        <div className="w-[29%] px-2 flex items-center">
          <span className="font-semibold text-gray-600 truncate">{admin.email}</span>
        </div>
        <div className="w-[21%] px-2 flex items-center">
          <span className="font-semibold text-gray-600 truncate">{admin.username}</span>
        </div>
        <div className="w-[13%] flex justify-center items-center">
          <div className="h-16 w-16 rounded-full bg-sky-200 flex justify-center items-center">
            <div className="h-[90%] w-[90%] flex justify-center items-center">
              <img src={`${API_URL}/${admin.profile_picture}`} className="h-full object-contain" />
            </div>
          </div>
        </div>
        <div className="w-[10%] flex justify-center items-center">
          <span className={`h-2 w-2 rounded-full ${online ? 'bg-green-400' : 'bg-red-400'}`}></span>
        </div>
      </button>

      <Transition appear show={openMain} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-[100] overflow-y-auto flex justify-center items-center"
          onClose={() => setOpenMain(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-50"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-50"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-90 -translate-y-5"
            enterTo="opacity-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-90 -translate-y-5"
          >
            <div className="w-[430px] rounded-2xl bg-gray-50 z-10 p-6 flex flex-col relative shadow-md">
              <button
                onClick={() => setOpenMain(false)}
                className="h-8 w-8 bg-gray-600 flex justify-center items-center rounded-full text-white absolute right-2 top-2 active:scale-95 hover:bg-sky-400 transition cursor-pointer"
              >
                ✕
              </button>
              <div className="flex items-center justify-between pl-2 pr-5 mb-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 leading-none">
                    <span className={`h-2 w-2 rounded-full ${online ? 'bg-green-400' : 'bg-red-400'}`}></span>
                    {online ? (
                      <span className="font-semibold text-gray-600">Online</span>
                    ) : (
                      <span className="font-semibold text-gray-400">Offline</span>
                    )}
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                    {admin.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-500 text-opacity-80">Admin #{admin.id}</span>
                    {admin.is_super && (
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-gray-500 text-opacity-80">|</span>
                        <span className="font-bold text-gray-500 text-opacity-80">
                          <AiFillStar />
                        </span>
                        <span className="font-bold text-gray-500 text-opacity-80">Super Admin</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full flex justify-center items-center bg-gradient-to-r from-sky-400 to-emerald-400">
                    <div className="w-[90%] h-[90%] rounded-full">
                      <img src={`${API_URL}/${admin.profile_picture}`} className="h-full object-contain" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col gap-3 p-3 rounded-xl bg-gray-200 bg-opacity-80 mb-5">
                <div className="w-full flex flex-col">
                  <span className="text-gray-500 font-thin leading-none">Username:</span>
                  <span className="text-xl leading-7 font-bold text-gray-700">{admin.username}</span>
                </div>
                <div className="w-full flex flex-col">
                  <span className="text-gray-500 font-thin leading-none">Email:</span>
                  <span className="text-xl leading-7 font-bold text-gray-700">{admin.email}</span>
                </div>
                <div className="w-full flex flex-col">
                  <span className="text-gray-500 font-thin leading-none">Phone:</span>
                  <span className="text-xl leading-7 font-bold text-gray-700">{admin.phone_number}</span>
                </div>
                <div className="w-full flex flex-col">
                  <span className="text-gray-500 font-thin leading-none">Address:</span>
                  <span className="text-lg leading-7 font-bold text-gray-700">{admin.address}</span>
                </div>
                <div className="w-full flex flex-col">
                  <span className="text-gray-500 font-thin leading-none">Admin since:</span>
                  <span className="text-xl leading-7 font-bold text-gray-700">{format(new Date(admin.createdAt), 'PPP')}</span>
                </div>
              </div>
              {!admin.is_super ? (
                <DeleteAdminModal
                  adminId={admin.id}
                  setOpenMain={setOpenMain}
                  setAdmins={setAdmins}
                  setMaxPage={setMaxPage}
                  setTotalAdmins={setTotalAdmins}
                  limit={limit}
                  currentPage={currentPage}
                  online={online}
                />
              ) : null}
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

export default AdminList;
