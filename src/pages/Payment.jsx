import axios from 'axios';
import { addDays, format } from 'date-fns';
import { useEffect, useState } from 'react';
import { FiCopy, FiCreditCard } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_URL } from '../assets/constants';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

function Payment() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [addFile, setAddFile] = useState();
  const [paymentData, setPaymentData] = useState();
  const [isExpired, seIsExpired] = useState(false);
  const [isNotAvailable, seIsNotAvailable] = useState(false);
  const socket = useSelector((state) => state.socket.instance);
  const params = useParams();
  const userToken = localStorage.getItem('userToken');

  const navigate = useNavigate();

  const cancleInvoice = async (id) => {
    try {
      await axios.post(`${API_URL}/checkout/cancel/${id}`, null, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const getAwaiting = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/checkout/awaiting/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (response.data.data) {
        setPaymentData(response.data.data);
        // expired date
        let expired = new Date(response.data.data.createdAt);
        expired.setHours(expired.getHours() + 24);

        if (new Date() > expired) {
          cancleInvoice(response.data.data.id);
          seIsExpired(true);
        } else if (response.data.notAvailable) {
          cancleInvoice(response.data.data.id);
          seIsNotAvailable(true);
        }
      } else {
        navigate('/', { replace: true });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    getAwaiting();
  }, []);

  const handCopy = () => {
    let textCopy = document.getElementById('no-account').textContent;
    navigator.clipboard.writeText(textCopy);
    toast.success('Account number copied');
  };

  const handAddFile = (e) => {
    if (e.target.files[0]) {
      setAddFile(e.target.files[0]);
    }
  };

  const handUpload = async () => {
    try {
      setIsLoading(true);
      const userToken = localStorage.getItem('userToken');

      if (addFile) {
        let formData = new FormData();

        formData.append(
          'data',
          JSON.stringify({ invoiceheaderId: paymentData.id })
        );
        formData.append('file', addFile);

        await axios.post(`${API_URL}/checkout/proof`, formData, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        setIsLoading(false);
        localStorage.removeItem('payment-data');
        socket?.emit('newPayment');
        dispatch({ type: 'ALERT_CLEAR', payload: 'awaiting' });
        dispatch({ type: 'ALERT_NEW', payload: 'history' });

        navigate('/', { replace: true });
        toast.success('Thank you for shopping at Heizen Berg Co.!', {
          position: 'top-center',
          theme: 'colored',
        });
      } else {
        setIsLoading(false);
        toast.error('Please input file');
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <Header />
      <Navbar />
      <div className="flex flex-col items-center m-auto mt-20 pb-7 w-11/12">
        <div className="flex flex-col items-center justify-center w-full">
          <h2 className="text-3xl font-semibold mb-3">
            {isExpired || isNotAvailable
              ? 'Your transaction cannot continue'
              : 'Please pay your bill'}
          </h2>
          <span className="text-md">
            {isNotAvailable
              ? 'there are product not available!'
              : isExpired
              ? 'this bill expired at'
              : 'this bill will be expire at'}
          </span>
          <span
            className={`${
              isExpired ? 'text-red-400' : null
            } font-semibold text-xl`}
          >
            {paymentData?.createdAt && isNotAvailable === false
              ? format(addDays(new Date(paymentData?.createdAt), 1), 'PPPpp')
              : null}
          </span>
        </div>
        <div className="border-gray-300 border rounded-md mt-10 mb-7 py-4 px-3 min-h-48 w-4/6">
          <div className="flex justify-between px-5">
            <h3 className="text-xl">Payment Method</h3>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold">
                {paymentData?.paymentmethod.type} -{' '}
                {paymentData?.paymentmethod.bankname}
              </h3>
              <FiCreditCard size={24} />
            </div>
          </div>
          <div className="divider" />
          <div className="flex flex-col gap-6 px-5">
            <div className="flex flex-col">
              <span className="text-lg text-gray-500">Account Name</span>
              <span className="text-xl font-semibold">
                {paymentData?.paymentmethod.name}
              </span>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-lg text-gray-500">Account Number</span>
                <span id="no-account" className="text-xl font-semibold">
                  {paymentData?.paymentmethod.number}
                </span>
              </div>
              <FiCopy
                size={28}
                color="#0EA5E9"
                className="hover:cursor-pointer"
                onClick={handCopy}
              />
            </div>
          </div>
          <div className="divider" />
          <div className="flex justify-start px-5">
            <div className="flex flex-col">
              <span className="text-lg text-gray-500">Total Bill</span>
              <span className="text-xl font-semibold">
                Rp.{' '}
                {(
                  parseInt(paymentData?.total) +
                  paymentData?.deliveryoption.cost
                ).toLocaleString('id')}
              </span>
            </div>
          </div>
          <div className="divider" />
          <div className="flex justify-between px-5 pb-3">
            {isExpired || isNotAvailable ? (
              <span className="font-bold">
                you can't upload your payment proof
              </span>
            ) : (
              <div className="flex flex-col gap-2">
                <span className="text-lg text-gray-500">
                  Upload proof of payment here
                </span>
                <label className="block">
                  <span className="sr-only">Choose profile photo</span>
                  <input
                    type="file"
                    className="block w-full text-sm text-slate-500 bg-gray-50 border rounded-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                    onChange={handAddFile}
                  />
                </label>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end w-4/6">
          <button
            disabled={isLoading || isExpired || isNotAvailable || !addFile}
            className="btn btn-primary"
            onClick={handUpload}
          >
            Confirm Payment
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Payment;
