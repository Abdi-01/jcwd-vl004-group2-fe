import { Fragment, useEffect, useState } from 'react';
import Axios from 'axios';
import { API_URL } from '../assets/constants';

import '../assets/styles/AddressCard.css';
import { BsThreeDotsVertical, BsBookmarkCheck } from 'react-icons/bs';
import { MdDelete, MdOutlineEditLocation } from 'react-icons/md';
import { Menu, Transition } from '@headlessui/react';
import { Dialog } from '@headlessui/react';
import { toast } from 'react-toastify';
import EditAddressModal from './EditAddressModal';

const AddressMenuButton = ({
  id,
  setOpenDelete,
  setOpenEdit,
  setAddresses,
  currentPage,
  setCurrentPage,
  setMaxPage,
  limit,
  is_default,
  setTotalAddress,
}) => {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="h-6 w-6 rounded-full focus:outline-none hover:bg-gray-200 flex justify-center items-center text-sky-400 transition">
        <BsThreeDotsVertical />
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
        <Menu.Items className="rounded-md bg-white absolute -left-[150px] border focus:outline-none cursor-pointer">
          <Menu.Item>
            {({ active }) => (
              <div className="w-40 h-11 p-1">
                <button
                  disabled={is_default}
                  onClick={async () => {
                    try {
                      const response = await Axios.patch(
                        `${API_URL}/address/default/${id}`,
                        {
                          limit,
                          currentPage,
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
                          },
                        }
                      );

                      setAddresses(response.data.rows);
                      setMaxPage(response.data.maxPage);
                      setTotalAddress(response.data.count);
                      setCurrentPage(1);

                      toast.success(response.data.message, { position: 'bottom-left', theme: 'colored' });
                    } catch (err) {
                      toast.error('Unable to update default address!', { position: 'bottom-left', theme: 'colored' });
                    }
                  }}
                  className={`w-full h-full pl-2 rounded-md ${
                    active
                      ? 'bg-sky-100 bg-opacity-70 disabled:bg-slate-100 disabled:text-slate-500'
                      : 'text-opacity-70 disabled:text-slate-400'
                  } text-opacity-75 font-semibold transition flex items-center gap-2 text-sm text-sky-500`}
                >
                  <BsBookmarkCheck />
                  <span>Set as Default</span>
                </button>
              </div>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <div className="w-40 h-11 p-1">
                <button
                  onClick={() => setOpenEdit(true)}
                  className={`w-full h-full pl-2 rounded-md ${
                    active ? 'bg-sky-100 bg-opacity-70' : 'text-opacity-70'
                  } text-opacity-75 font-semibold transition flex items-center gap-2 text-sm text-sky-500`}
                >
                  <MdOutlineEditLocation />
                  <span>Edit Address</span>
                </button>
              </div>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <div className="w-40 h-11 p-1">
                <button
                  disabled={is_default}
                  onClick={() => setOpenDelete(true)}
                  className={`w-full h-full pl-2 rounded-md ${
                    active
                      ? 'bg-rose-200 bg-opacity-50 text-rose-500 disabled:bg-slate-100 disabled:text-slate-500'
                      : 'text-rose-400 disabled:text-slate-400'
                  } text-opacity-75 font-semibold transition flex items-center gap-2 text-sm`}
                >
                  <MdDelete />
                  <span>Delete Address</span>
                </button>
              </div>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

const DeleteAddressModal = ({ id, setAddresses, openDelete, setOpenDelete, currentPage, setMaxPage, limit, setTotalAddress }) => {
  return (
    <>
      <Transition appear show={openDelete}>
        <Dialog onClose={() => setOpenDelete(false)} className="fixed inset-0 min-h-screen flex items-center justify-center z-10">
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
            enterFrom="opacity-80 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-80 -translate-y-2"
          >
            <div className="px-10 py-1 z-20 rounded-box addressCardBody flex flex-col items-center shadow">
              <div className="w-full py-8 text-xl font-bold bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent flex justify-center">
                <span>Are you sure you want to delete this address?</span>
              </div>
              <div className="w-full pt-2 pb-6 flex items-center justify-center gap-4">
                <button
                  onClick={() => setOpenDelete(false)}
                  className="px-5 h-10 rounded-xl bg-gradient-to-r from-red-500 to-rose-400 text-white font-bold transition active:scale-95 hover:brightness-110"
                >
                  Nevermind
                </button>
                <button
                  onClick={async () => {
                    try {
                      const response = await Axios.post(
                        `${API_URL}/address/delete/${id}`,
                        {
                          limit,
                          currentPage,
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
                          },
                        }
                      );

                      setAddresses(response.data.rows);
                      setMaxPage(response.data.maxPage);
                      setTotalAddress(response.data.count);

                      toast.success(response.data.message, { theme: 'colored', position: 'bottom-left' });
                      setOpenDelete(false);
                    } catch (error) {
                      toast.error('Unable to delete address!', { theme: 'colored', position: 'bottom-left' });
                    }
                  }}
                  className="px-5 h-10 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 text-white font-bold transition active:scale-95 hover:brightness-110"
                >
                  Yes, I don't use it anymore
                </button>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

const AddressCard = ({ addressData, setAddresses, currentPage, setCurrentPage, setMaxPage, limit, setTotalAddress, totalAddress }) => {
  const [address, setAddress] = useState(addressData);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    setAddress(addressData);
  }, [addressData]);

  return (
    <div
      className={`w-full xl:w-5/6 py-4 px-6 h-40 rounded-lg flex shadow ring addressCardBody transition ${
        address.is_default ? 'ring-sky-300' : 'ring-gray-200'
      }`}
    >
      <div className="h-full w-[75%] mr-3 flex flex-col gap-2 relative">
        {address.is_default && (
          <div className="h-full absolute -top-1 -left-6 transition">
            <div className="h-2 w-[5px] rounded-tr-full bg-sky-300" />
            <div className="h-10 w-[5px] bg-sky-300" />
            <div className="h-2 w-[5px] rounded-br-full bg-sky-300" />
          </div>
        )}
        <div className="w-full flex flex-col">
          <span className="text-sm font-bold text-sky-500 text-opacity-60">Address:</span>
          <span className="text-slate-700 font-semibold max-w-full truncate">{address.address}</span>
        </div>
        <div className="w-full flex flex-col">
          <span className="text-sm font-bold text-sky-500 text-opacity-60">City:</span>
          <span className="text-slate-700 font-semibold line-clamp-1">{address.city}</span>
        </div>
        <div>
          {address.is_default && (
            <span className="px-3 py-1 rounded-lg bg-sky-300 font-semibold text-sm text-white transition">Default Address</span>
          )}
        </div>
      </div>
      <div className="h-full w-[25%] flex flex-col border-l pl-5 justify-center relative">
        <div className="w-full flex flex-col">
          <span className="text-sm font-bold text-sky-500 text-opacity-60">Province:</span>
          <span className="text-slate-700 font-semibold line-clamp-1">{address.province}</span>
        </div>
        <div className="w-full flex flex-col">
          <span className="text-sm font-bold text-sky-500 text-opacity-60">Country:</span>
          <span className="text-slate-700 font-semibold">{address.country}</span>
        </div>
        <div className="w-full flex flex-col">
          <span className="text-sm font-bold text-sky-500 text-opacity-60">Postal Code:</span>
          <span className="text-slate-700 font-semibold">{address.postalcode}</span>
        </div>
        <div className="absolute top-0 -right-3">
          <AddressMenuButton
            id={address.id}
            setOpenDelete={setOpenDelete}
            setOpenEdit={setOpenEdit}
            setAddresses={setAddresses}
            is_default={address.is_default}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setMaxPage={setMaxPage}
            limit={limit}
            setTotalAddress={setTotalAddress}
            totalAddress={totalAddress}
          />
        </div>
        <div className="hidden">
          <DeleteAddressModal
            id={address.id}
            openDelete={openDelete}
            setOpenDelete={setOpenDelete}
            setAddresses={setAddresses}
            currentPage={currentPage}
            setMaxPage={setMaxPage}
            limit={limit}
            setTotalAddress={setTotalAddress}
            totalAddress={totalAddress}
          />
          <EditAddressModal openEdit={openEdit} setOpenEdit={setOpenEdit} address={address} setAddress={setAddress} />
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
