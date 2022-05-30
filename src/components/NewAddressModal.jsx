import { Fragment, useState } from 'react';
import Axios from 'axios';
import { API_URL } from '../assets/constants';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import '../assets/styles/NewAddressModal.css';
import { AiOutlineClose, AiOutlineInfoCircle, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { MdOutlineAddLocationAlt } from 'react-icons/md';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';

const NewAddressModal = ({ setAddresses, setMaxPage, setCurrentPage, currentPage, limit, setTotalAddress, totalAddress }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      address: '',
      city: '',
      province: '',
      country: '',
      postalcode: '',
      is_default: true,
    },
    validationSchema: Yup.object({
      address: Yup.string().required('This field is required'),
      city: Yup.string().required('This field is required'),
      province: Yup.string().required('This field is required'),
      country: Yup.string().required('This field is required'),
      postalcode: Yup.string().length(5, 'Invalid postal code').required('This field is required'),
      is_default: Yup.boolean(),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);

        const response = await Axios.post(
          `${API_URL}/address/add`,
          { data: { ...values, postalcode: parseInt(values.postalcode) }, limit, currentPage },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('userToken')}`,
            },
          }
        );

        if (response.data.conflict) {
          setLoading(false);
          return toast.warning(response.data.conflict, { position: 'bottom-left', theme: 'colored' });
        }

        setAddresses(response.data.rows);
        setMaxPage(response.data.maxPage);
        setTotalAddress(response.data.count);

        if (values.is_default) {
          setCurrentPage(1);
        }

        resetForm();
        setLoading(false);
        setOpen(false);
        toast.success(response.data.message, { position: 'bottom-left', theme: 'colored' });
      } catch (error) {
        toast.error('Unable to add address!', { position: 'bottom-left', theme: 'colored' });
      }
    },
  });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={totalAddress === 10}
        className="h-10 w-32 rounded-lg bg-gradient-to-r from-sky-300 to-emerald-400 font-bold text-white flex justify-center items-center gap-1 focus:outline-none active:scale-95 transition disabled:from-gray-200 disabled:to-gray-300 disabled:scale-100"
      >
        <MdOutlineAddLocationAlt />
        {totalAddress === 10 ? 'Max' : 'Address'}
      </button>

      <Transition appear show={open} as={Fragment}>
        <Dialog onClose={() => setOpen(false)} className="fixed inset-0 min-h-screen flex items-center justify-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="scale-90 opacity-90"
            enterTo="scale-100 opaciy-100"
            leave="ease-in duration-200"
            leaveFrom="scale-100 opaciy-100"
            leaveTo="scale-90 opacity-90"
          >
            <div className="w-[450px] bg-white rounded-xl z-20 ring-2 ring-offset-2 ring-sky-300 ring-inset flex flex-col addressModalBody">
              <div className="py-8 flex justify-center relative">
                <span className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-sky-400 bg-clip-text text-transparent">
                  Add New Address
                </span>
                <button
                  onClick={() => {
                    setOpen(false);
                    formik.resetForm();
                  }}
                  className="text-2xl top-4 right-4 text-sky-400 absolute active:scale-75 transiton focus:outline-none"
                >
                  <AiOutlineClose />
                </button>
              </div>
              <form onSubmit={formik.handleSubmit} className="mb-7">
                <div className="w-full px-12 flex flex-col">
                  <div className="w-full h-[90px]">
                    <div className="w-full border border-sky-500 border-opacity-30 rounded-xl p-2 flex flex-col relative">
                      <label className="font-bold text-sky-500 absolute -top-4 px-1 bg-white">Address:</label>
                      <div className="w-full relative">
                        <input
                          type="text"
                          id="address"
                          value={formik.values.address}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="eg: Jl. Metro Alam IV No.10 PL-14;"
                          className={`w-full h-9 rounded-lg px-3 focus:outline-none border ${
                            formik.touched.address && formik.errors.address
                              ? 'border-rose-300 pr-7'
                              : 'border-slate-300 focus:border-sky-300'
                          }  placeholder:text-slate-300 transition`}
                        />
                        {formik.touched.address && formik.errors.address ? (
                          <AiOutlineInfoCircle className="absolute top-[10px] right-3 text-rose-300" />
                        ) : null}
                      </div>
                    </div>
                    {formik.touched.address && formik.errors.address ? (
                      <span className="pl-4 text-xs text-rose-400">{formik.errors.address}</span>
                    ) : null}
                  </div>
                  <div className="w-full flex justify-between">
                    <div className="w-[60%] h-[90px]">
                      <div className="w-full border border-sky-500 border-opacity-30 rounded-xl p-2 flex flex-col relative">
                        <label className="font-bold text-sky-500 absolute -top-4 px-1 bg-white">City:</label>
                        <div className="w-full relative">
                          <input
                            type="text"
                            id="city"
                            value={formik.values.city}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Jakarta Selatan;"
                            className={`w-full h-9 rounded-lg px-3 focus:outline-none border ${
                              formik.touched.city && formik.errors.city ? 'border-rose-300 pr-7' : 'border-slate-300 focus:border-sky-300'
                            }  placeholder:text-slate-300 transition`}
                          />
                          {formik.touched.city && formik.errors.city ? (
                            <AiOutlineInfoCircle className="absolute top-[10px] right-3 text-rose-300" />
                          ) : null}
                        </div>
                      </div>
                      {formik.touched.city && formik.errors.city ? (
                        <span className="pl-4 text-xs text-rose-400">This field is required</span>
                      ) : null}
                    </div>
                    <div className="w-[36%] h-[90px]">
                      <div className="w-full border border-sky-500 border-opacity-30 rounded-xl p-2 flex flex-col relative">
                        <label className="font-bold text-sky-500 absolute -top-4 px-1 bg-white">Postal Code:</label>
                        <div className="w-full relative">
                          <input
                            type="number"
                            id="postalcode"
                            value={formik.values.postalcode}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="eg: 16969;"
                            className={`w-full h-9 rounded-lg px-2 focus:outline-none border ${
                              formik.touched.postalcode && formik.errors.postalcode
                                ? 'border-rose-300 pr-7'
                                : 'border-slate-300 focus:border-sky-300'
                            }  placeholder:text-slate-300 transition`}
                          />
                          {formik.touched.postalcode && formik.errors.postalcode ? (
                            <AiOutlineInfoCircle className="absolute top-[10px] right-2 text-rose-300" />
                          ) : null}
                        </div>
                      </div>
                      {formik.touched.postalcode && formik.errors.postalcode ? (
                        <span className="pl-2 text-xs text-rose-400">{formik.errors.postalcode}</span>
                      ) : null}
                    </div>
                  </div>
                  <div className="w-full h-[90px]">
                    <div className="w-full border border-sky-500 border-opacity-30 rounded-xl p-2 flex flex-col relative">
                      <label className="font-bold text-sky-500 absolute -top-4 px-1 bg-white">Province:</label>
                      <div className="w-full relative">
                        <input
                          placeholder="DKI Jakarta;"
                          type="text"
                          id="province"
                          value={formik.values.province}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`w-full h-9 rounded-lg px-3 focus:outline-none border ${
                            formik.touched.province && formik.errors.province
                              ? 'border-rose-300 pr-7'
                              : 'border-slate-300 focus:border-sky-300'
                          }  placeholder:text-slate-300 transition`}
                        />
                        {formik.touched.province && formik.errors.province ? (
                          <AiOutlineInfoCircle className="absolute top-[10px] right-3 text-rose-300" />
                        ) : null}
                      </div>
                    </div>
                    {formik.touched.province && formik.errors.province ? (
                      <span className="pl-4 text-xs text-rose-400">{formik.errors.province}</span>
                    ) : null}
                  </div>
                  <div className="w-full h-[80px]">
                    <div className="w-full border border-sky-500 border-opacity-30 rounded-xl p-2 flex flex-col relative">
                      <label className="font-bold text-sky-500 absolute -top-4 px-1 bg-white">Country:</label>
                      <div className="w-full relative">
                        <input
                          type="text"
                          placeholder="Indonesia;"
                          id="country"
                          value={formik.values.country}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`w-full h-9 rounded-lg px-3 focus:outline-none border ${
                            formik.touched.country && formik.errors.country
                              ? 'border-rose-300 pr-7'
                              : 'border-slate-300 focus:border-sky-300'
                          }  placeholder:text-slate-300 transition`}
                        />
                        {formik.touched.country && formik.errors.country ? (
                          <AiOutlineInfoCircle className="absolute top-[10px] right-3 text-rose-300" />
                        ) : null}
                      </div>
                    </div>
                    {formik.touched.country && formik.errors.country ? (
                      <span className="pl-4 text-xs text-rose-400">{formik.errors.country}</span>
                    ) : null}
                  </div>
                  <div className="w-full pt-1 pb-5 flex justify-center items-center gap-2">
                    <input
                      id="is_default"
                      type="checkbox"
                      disabled={totalAddress < 1}
                      checked={formik.values.is_default}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="accent-emerald-400 rounded-lg"
                    />
                    <label htmlFor="is_default" className="text-sky-500 font-bold cursor-pointer">
                      Set as Default
                    </label>
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`py-3 px-5 rounded-xl font-bold text-white bg-gradient-to-r from-sky-400 to-emerald-400 active:scale-95 transition hover:brightness-110 disabled:from-sky-300 disabled:to-emerald-300 disabled:active:scale-100 disabled:hover:brightnes-100 flex items-center justify-center gap-2`}
                    >
                      {loading ? (
                        <>
                          <AiOutlineLoading3Quarters className="animate-spin" />
                          Creating..
                        </>
                      ) : (
                        'Add Address'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

export default NewAddressModal;
