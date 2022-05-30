import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import { API_URL } from '../assets/constants';

import { Dialog, Transition } from '@headlessui/react';
import { AiOutlineClose, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { RiImageAddLine } from 'react-icons/ri';
import { toast } from 'react-toastify';

const UploadPaymentModal = ({ invoiceId, setInvoices, setMaxPage, setTotalData, currentPage, limit, socket }) => {
  const userToken = localStorage.getItem('userToken');
  const dispatch = useDispatch();
  const awaitingNotif = useSelector((state) => state.notification.awaiting);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentImage, setPaymentImage] = useState(null);

  const uploadHandler = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append('data', JSON.stringify({ invoiceheaderId: invoiceId, currentPage, limit }));
      formData.append('file', paymentImage);

      const response = await Axios.post(`${API_URL}/checkout/proof`, formData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      setInvoices(response.data.rows);
      setMaxPage(response.data.maxPage);
      setTotalData(response.data.count);
      if (awaitingNotif) {
        dispatch({ type: 'ALERT_CLEAR', payload: 'awaiting' });
      }
      dispatch({ type: 'ALERT_NEW', payload: 'history' });
      socket.emit('newPayment');
      setLoading(false);

      setOpen(false);
      toast.success('Thank you for shopping at Heizen Berg Co.', { position: 'top-center', theme: 'colored' });
    } catch (error) {
      setLoading(false);

      toast.error('Unable to upload Payment Proof!', { position: 'bottom-left', theme: 'colored' });
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="h-9 w-36 sm:h-10 md:w-40 rounded-lg bg-gradient-to-r from-sky-500 to-sky-400 text-white font-semibold text-sm md:text-md lg:text-base active:scale-95 hover:brightness-110 transition flex items-center justify-center"
      >
        Upload Payment
      </button>

      <Transition appear show={open} as={Fragment}>
        <Dialog onClose={() => setOpen(false)} className="fixed inset-0 z-[300] flex items-center justify-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-50"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-50"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-400 bg-opacity-40 backdrop-blur-sm" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-80 scale-90"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-80 scale-90"
          >
            <div className="w-[370px] lg:w-[430px] z-10 flex flex-col items-center bg-gray-50 rounded-2xl shadow-md">
              <div className="w-full flex justify-center pt-8">
                <span className="text-[18px] lg:text-xl font-bold">Upload Payment Proof for Invoice #7</span>
              </div>
              <div className="h-9 w-[80%] flex justify-end items-center">
                <div
                  onClick={() => setPaymentImage(null)}
                  className={`flex items-center gap-2 px-2 text-sm rounded-full bg-red-200 text-red-400 active:scale-95 transition cursor-pointer ${
                    paymentImage ? 'opacity-100' : 'opacity-0 invisible'
                  }`}
                >
                  <AiOutlineClose />
                  <span>Remove</span>
                </div>
              </div>
              <div className="w-full h-[45vh] lg:h-[50vh] flex justify-center">
                <input
                  onChange={(e) => setPaymentImage(e.target.files[0])}
                  id="proof-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const image = e.dataTransfer.files[0];
                    const fileType = /jpeg|jpg|png|webp|JPEG|JPG|PNG/;

                    const allowed = fileType.test(image.type);

                    if (allowed) {
                      setPaymentImage(image);
                    } else {
                      toast.error('File type not allowed!', { position: 'top-center', theme: 'colored' });
                    }
                  }}
                  className="w-[80%] h-full border-2 bg-white border-gray-400 border-dotted rounded-xl flex justify-center"
                >
                  {paymentImage ? (
                    <div className="w-full h-full flex justify-center items-center">
                      <img src={URL.createObjectURL(paymentImage)} className="h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-full flex flex-col items-center justify-center gap-2">
                      <div className="flex items-center gap-2">
                        <RiImageAddLine />
                        <span className="font-bold text-lg">Drag Image to Upload</span>
                      </div>
                      <span className="font-semibold">or</span>
                      <label
                        htmlFor="proof-upload"
                        className="py-1 px-3 rounded-lg bg-gray-300 text-slate-700 hover:brightness-110 transition cursor-pointer active:scale-95 font-bold"
                      >
                        Choose Image
                      </label>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full flex flex-col items-center gap-2 py-5">
                <button
                  disabled={loading || !paymentImage}
                  onClick={uploadHandler}
                  className="px-4 py-2 lg:py-3 lg:px-5 rounded-full bg-gradient-to-r from-sky-400 to-violet-500 font-bold text-white hover:brightness-110 active:scale-95 transition cursor-pointer disabled:from-sky-300 disabled:to-violet-300 disabled:active:scale-100 disabled:hover:brightness-100 disabled:cursor-default flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <>
                      <AiOutlineLoading3Quarters className="animate-spin" />
                      Uploading..
                    </>
                  ) : (
                    'Upload Payment'
                  )}
                </button>
                <button
                  disabled={loading}
                  onClick={() => {
                    setOpen(false);
                    setPaymentImage(null);
                  }}
                  className="font-semibold text-rose-400 hover:brightness-110 active:scale-95 transition cursor-pointer disabled:hover:brightness-100 disabled:text-gray-400 disabled:active:scale-100 disabled:cursor-default text-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

export default UploadPaymentModal;
