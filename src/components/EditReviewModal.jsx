import { Fragment, useState } from 'react';
import Axios from 'axios';
import { API_URL } from '../assets/constants';

import { Dialog, Transition } from '@headlessui/react';
import { AiOutlineInfoCircle, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const EditReviewModal = ({ review, setReview, setAvgRating }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: review.title,
      content: review.content,
      rating: review.rating.toString(),
      is_anonymus: review.is_anonymus,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().required('Title cannot be empty'),
      content: Yup.string().max(255, 'Maximum characters reached').required('Content cannot be empty'),
      rating: Yup.string(),
      is_anonymus: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const response = await Axios.patch(`${API_URL}/review/edit/${review.id}`, {
          data: { ...values, rating: parseInt(values.rating) },
          productId: review.productId,
        });

        setReview(response.data.review);
        setAvgRating(response.data.avgRating);
        formik.resetForm();
        setLoading(false);

        setOpen(false);
        toast.success(response.data.message, { position: 'top-center', theme: 'colored' });
      } catch (error) {
        setLoading(false);

        toast.error('Unable to post review!', { position: 'top-center', theme: 'colored' });
      }
    },
  });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-32 h-8 sm:h-9 rounded-lg font-semibold text-white bg-sky-400 active:scale-95 transition hover:brightness-110 text-sm lg:text-md"
      >
        Edit Review
      </button>

      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" onClose={() => setOpen(false)} className="fixed inset-0 z-[200] flex justify-center items-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40 overflow-y-auto" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="-translate-y-5 opacity-90"
            enterTo="translate-y-0 opaciy-100"
            leave="ease-in duration-200"
            leaveFrom="translate-y-0 opaciy-100"
            leaveTo="-translate-y-5 opacity-90"
          >
            <div className="w-[480px] lg:w-[550px] rounded-xl fixed z-10 bg-gray-50 flex flex-col shadow ring ring-sky-300 ring-offset-2 ring-inset">
              <div className="p-5">
                <span className="text-2xl font-bold text-sky-400">Edit reviews</span>
              </div>
              <form onSubmit={formik.handleSubmit}>
                <div className="w-full flex flex-col px-5">
                  <div className="flex">
                    <div className="w-[70%] relative">
                      <input
                        type="text"
                        id="title"
                        value={formik.values.title}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        placeholder="Review title.."
                        className={`w-full h-10 px-4 rounded-lg ring-1  focus:outline-none focus:ring ${
                          formik.errors.title && formik.touched.title
                            ? 'focus:ring-red-300 ring-red-300'
                            : 'focus:ring-sky-300 ring-emerald-200'
                        }  transition placeholder:font-semibold font-bold`}
                      />
                      {formik.errors.title && formik.touched.title ? (
                        <AiOutlineInfoCircle className="absolute text-lg text-red-400 top-3 right-2" />
                      ) : null}
                    </div>
                    <div className="w-[30%] flex items-center justify-end rating lg:pr-2">
                      <input
                        type="radio"
                        id="rating"
                        name="rating"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={'1'}
                        checked={formik.values.rating === '1'}
                        className="mask mask-star bg-amber-300"
                      />
                      <input
                        type="radio"
                        id="rating"
                        name="rating"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={'2'}
                        checked={formik.values.rating === '2'}
                        className="mask mask-star bg-amber-300"
                      />
                      <input
                        type="radio"
                        id="rating"
                        name="rating"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={'3'}
                        checked={formik.values.rating === '3'}
                        className="mask mask-star bg-amber-300"
                      />
                      <input
                        type="radio"
                        id="rating"
                        name="rating"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={'4'}
                        checked={formik.values.rating === '4'}
                        className="mask mask-star bg-amber-300"
                      />
                      <input
                        type="radio"
                        id="rating"
                        name="rating"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={'5'}
                        checked={formik.values.rating === '5'}
                        className="mask mask-star bg-amber-300"
                      />
                    </div>
                  </div>
                </div>
                <div className="h-7 pl-6 flex items-center">
                  {formik.touched.title && formik.errors.title ? <span className="text-xs text-red-400">{formik.errors.title}</span> : null}
                </div>
                <div className="w-full flex px-5">
                  <div className="w-[70%] flex flex-col relative">
                    <textarea
                      id="content"
                      value={formik.values.content}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Write your reviews.."
                      className={`w-full h-32 p-3 rounded-lg focus:outline-none ring-1 focus:ring ${
                        formik.touched.content && formik.errors.content ? 'ring-red-300 focus:ring-red-300' : 'ring-sky-300'
                      } transition cursor-pointer`}
                    />
                    {formik.touched.content && formik.errors.content ? (
                      <AiOutlineInfoCircle className="absolute text-lg text-red-400 top-2 right-2" />
                    ) : null}
                    <div className="w-full flex justify-between">
                      <div className="pl-1">
                        {formik.errors.content && formik.touched.content ? (
                          <span className="text-xs text-red-400">{formik.errors.content}</span>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2 pt-2 pb-3">
                        <input
                          id="is_anonymus"
                          checked={formik.values.is_anonymus}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          type="checkbox"
                          className="checkbox checkbox-accent h-5 w-5"
                        />
                        <label htmlFor="is_anonymus" className="font-semibold text-gray-600 hover:text-sky-400 transition cursor-pointer">
                          Post as anonymus
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="w-[30%] pl-3 flex flex-col gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-32 lg:w-36 py-2 font-bold text-white bg-gradient-to-r from-emerald-400 to-green-400 disabled:from-emerald-200 disabled:to-green-200 rounded-lg transition active:scale-95 hover:brightness-110 disabled:active:scale-100 disabled:hover:brightness-100 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <AiOutlineLoading3Quarters className="animate-spin" />
                          Updating..
                        </>
                      ) : (
                        'Update Review'
                      )}
                    </button>
                  </div>
                </div>
              </form>
              <button
                onClick={() => {
                  formik.resetForm();
                  setOpen(false);
                }}
                className="absolute w-32 lg:w-36 bottom-[83px] right-3 lg:right-4 py-2 font-bold text-white bg-gradient-to-r from-red-400 to-rose-400 rounded-lg transition active:scale-95 hover:brightness-110"
              >
                Cancel
              </button>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

export default EditReviewModal;
