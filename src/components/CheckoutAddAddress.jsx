import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../assets/constants';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function CheckoutAddAddress({ setAddress, setAddressList, setIsLoading, isLoading }) {
  const userToken = localStorage.getItem('userToken');

  const formik = useFormik({
    initialValues: {
      address: '',
      city: '',
      province: '',
      country: '',
      postalcode: '',
    },

    validationSchema: Yup.object({
      address: Yup.string().required('Required'),
      city: Yup.string().required('Required'),
      province: Yup.string().required('Required'),
      country: Yup.string().required('Required'),
      postalcode: Yup.number().required('Required'),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        setIsLoading(true);

        const response = await axios.post(
          `${API_URL}/checkout/add-address`,
          {
            address: values.address,
            city: values.city,
            province: values.province,
            country: values.country,
            postalcode: values.postalcode,
          },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (response.data.conflict) {
          setIsLoading(false);
          return toast.warning(response.data.conflict, { position: 'bottom-left', theme: 'colored' });
        }

        resetForm();
        setIsLoading(false);
        setAddressList(response.data.data);
        setAddress(
          response.data.data.find((item) => {
            return item.is_default === true;
          })
        );
        document.getElementById('close-btn').click();
        toast.success(response.data.message);
      } catch (error) {
        setIsLoading(false);
        toast.error(error.response.data.message);
      }
    },
  });

  return (
    <>
      <input type="checkbox" id="modal-add-address" className="modal-toggle" />
      <div className="modal" id="modal-add-address">
        <div className="modal-box">
          <div className="modal-action">
            <label id="close-btn" htmlFor="modal-add-address" className="btn btn-sm btn-circle absolute right-2 top-2">
              ✕
            </label>
          </div>
          <h3 className="text-lg font-bold mb-3">Input Your New Address</h3>
          <form onSubmit={formik.handleSubmit} className="flex flex-col w-full gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                placeholder="Type address here"
                className={`input input-bordered w-full ${
                  formik.touched.address && formik.errors.address ? 'border-red-400 bg-red-50' : null
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.address}
              />
              {formik.touched.address && formik.errors.address ? (
                <div className="text-red-400 text-sm italic mt-2">{formik.errors.address}</div>
              ) : null}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                type="text"
                placeholder="Type city here"
                className={`input input-bordered w-full ${formik.touched.city && formik.errors.city ? 'border-red-400 bg-red-50' : null}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.city}
              />
              {formik.touched.city && formik.errors.city ? (
                <div className="text-red-400 text-sm italic mt-2">{formik.errors.city}</div>
              ) : null}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="province">Province</label>
              <input
                id="province"
                name="province"
                type="text"
                placeholder="Type province here"
                className={`input input-bordered w-full ${
                  formik.touched.province && formik.errors.province ? 'border-red-400 bg-red-50' : null
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.province}
              />
              {formik.touched.province && formik.errors.province ? (
                <div className="text-red-400 text-sm italic mt-2">{formik.errors.province}</div>
              ) : null}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="country">Country</label>
              <input
                id="country"
                name="country"
                type="text"
                placeholder="Type country here"
                className={`input input-bordered w-full ${
                  formik.touched.country && formik.errors.country ? 'border-red-400 bg-red-50' : null
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.country}
              />
              {formik.touched.country && formik.errors.country ? (
                <div className="text-red-400 text-sm italic mt-2">{formik.errors.country}</div>
              ) : null}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="postalcode">Postal Code</label>
              <input
                id="postalcode"
                name="postalcode"
                type="text"
                placeholder="Type postal code here"
                className={`input input-bordered w-full ${
                  formik.touched.postalcode && formik.errors.postalcode ? 'border-red-400 bg-red-50' : null
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.postalcode}
              />
              {formik.touched.postalcode && formik.errors.postalcode ? (
                <div className="text-red-400 text-sm italic mt-2">{formik.errors.postalcode}</div>
              ) : null}
            </div>
            <div className="modal-action">
              <button disabled={isLoading} htmlFor="modal-add-address" type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CheckoutAddAddress;
