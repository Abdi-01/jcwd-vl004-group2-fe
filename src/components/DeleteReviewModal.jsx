import { Fragment, useState } from 'react';
import Axios from 'axios';
import { API_URL } from '../assets/constants';

import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';

const DeleteReviewModal = ({ productId, reviewId, setTotalReviews, setAvgRating, setReviews, setMaxPage, currentPage, limit }) => {
  const [show, setShow] = useState(false);

  const deleteHandler = async () => {
    try {
      const response = await Axios.post(`${API_URL}/review/delete/${reviewId}`, { productId, limit, currentPage });

      setTotalReviews(response.data.totalReviews);
      setAvgRating(response.data.avgRating);
      setReviews(response.data.rows);
      setMaxPage(response.data.maxPage);

      setShow(false);
      document.getElementById('product-review').scrollIntoView({ behavior: 'smooth' });
      toast.success(response.data.message, { position: 'top-center', theme: 'colored' });
    } catch (err) {
      toast.error('Unable to delete Review!', { position: 'bottom-left', theme: 'colored' });
    }
  };

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="w-32 h-8 sm:h-9 rounded-lg font-semibold text-white bg-red-400 active:scale-95 transition hover:brightness-110 text-sm lg:text-md"
      >
        Delete Review
      </button>

      <Transition appear show={show} as={Fragment}>
        <Dialog as="div" onClose={() => setShow(false)} className="fixed inset-0 overflow-y-auto flex justify-center items-center z-[300]">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-90 scale-90"
            enterTo="opaciy-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-90 scale-90"
          >
            <div className="w-2/3 md:w-[45%] lg:w-1/3 xl:w-[27.5%] flex flex-col bg-sky-50 shadow fixed z-10 rounded-box">
              <div className="w-full flex justify-center items-center py-8 px-6">
                <span className="text-2xl font-bold text-gray-700">Delete your review?</span>
              </div>
              <div className="w-full pb-5 flex justify-center gap-3">
                <button
                  onClick={() => setShow(false)}
                  className="py-3 w-28 bg-red-400 rounded-xl font-semibold text-white active:scale-95 transition hover:brightness-110"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteHandler}
                  className="py-3 w-28 bg-green-400 rounded-xl font-semibold text-white active:scale-95 transition hover:brightness-110"
                >
                  Delete It
                </button>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

export default DeleteReviewModal;
