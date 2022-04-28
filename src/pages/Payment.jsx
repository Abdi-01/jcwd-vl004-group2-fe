import axios from 'axios';
import { useEffect, useState } from 'react';
import { FiCreditCard, FiCopy } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_URL } from '../assets/constants';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

function Payment() {
  const [isLoading, setIsLoading] = useState(false);
  const [addFile, setAddFile] = useState();
  const [paymentData, setPaymentData] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('payment-data');
    if (data) {
      setPaymentData(JSON.parse(data));
    } else {
      navigate('/', { replace: true });
    }
  }, [navigate]);

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
          JSON.stringify({ invoiceheaderId: paymentData.invoice })
        );
        formData.append('file', addFile);

        const response = await axios.post(
          `${API_URL}/checkout/proof`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        setIsLoading(false);
        toast.success(response.data.message);
        localStorage.removeItem('payment-data');
        return setTimeout(() => navigate('/', { replace: true }), 3000);
      }
      setIsLoading(false);
      toast.error('Please input file');
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <Header />
      <Navbar />
      <div className="flex flex-col items-center m-auto mt-32 pb-7 w-11/12">
        <div className="flex flex-col items-center justify-center w-full">
          <h2 className="text-3xl font-semibold mb-3">Please pay your bill</h2>
          <span className="text-md">this bill will be expire at</span>
          <span className="font-semibold text-lg">
            Monday, 18 April 2021, 10:17 AM
          </span>
        </div>
        <div className="border-gray-300 border rounded-md mt-10 mb-7 py-4 px-3 min-h-48 w-4/6">
          <div className="flex justify-between px-5">
            <h3 className="text-xl">Payment Method</h3>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold">
                {paymentData.type} - {paymentData.bankName}
              </h3>
              <FiCreditCard size={24} />
            </div>
          </div>
          <div className="divider" />
          <div className="flex flex-col gap-6 px-5">
            <div className="flex flex-col">
              <span className="text-lg text-gray-500">Account Name</span>
              <span className="text-xl font-semibold">{paymentData.name}</span>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-lg text-gray-500">Account Number</span>
                <span id="no-account" className="text-xl font-semibold">
                  {paymentData.noAccount}
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
              <span className="text-xl font-semibold">${paymentData.bill}</span>
            </div>
          </div>
          <div className="divider" />
          <div className="flex justify-between px-5 pb-3">
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
          </div>
        </div>
        <div className="flex justify-end w-4/6">
          <button
            disabled={isLoading}
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