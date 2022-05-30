import { useState, useEffect } from 'react';
import Axios from 'axios';
import { API_URL } from '../assets/constants';

import AddressCard from '../components/AddressCard';
import NewAddressModal from '../components/NewAddressModal';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [totalAddress, setTotalAddress] = useState(0);
  const limit = 5;

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const userToken = localStorage.getItem('userToken');

        const response = await Axios.post(
          `${API_URL}/address/find`,
          {
            limit,
            currentPage,
          },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        setAddresses(response.data.rows);
        setMaxPage(response.data.maxPage);
        setTotalAddress(response.data.count);

        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        toast.error('Unable to fetch addresses!');
      }
    };
    fetchAddresses();
  }, [currentPage]);

  useEffect(() => {
    if (currentPage === 1) {
      return;
    } else if (totalAddress <= limit * currentPage - limit) {
      setCurrentPage(currentPage - 1);
    }
  }, [totalAddress]);

  const renderAddresses = () => {
    return addresses.map((address) => (
      <AddressCard
        key={address.id}
        addressData={address}
        setAddresses={setAddresses}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setMaxPage={setMaxPage}
        limit={limit}
        totalAddress={totalAddress}
        setTotalAddress={setTotalAddress}
      />
    ));
  };

  return (
    <div className="w-full h-full px-3 lg:px-0 flex justify-center">
      <div className="w-full lg:w-[80%] h-full py-8">
        <div className="w-full flex flex-col justify-center p-1">
          <div className="w-full py-1 flex justify-between items-center">
            <div className="flex gap-2 items-center text-3xl">
              <FaMapMarkerAlt className="text-emerald-300" />
              <span className="font-semibold bg-gradient-to-r from-emerald-300 to-sky-400 bg-clip-text text-transparent">My Addresses</span>
            </div>
            <NewAddressModal
              setAddresses={setAddresses}
              setMaxPage={setMaxPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              limit={limit}
              totalAddress={totalAddress}
              setTotalAddress={setTotalAddress}
            />
          </div>
          <div className="w-full h-[1px] my-2 bg-gray-200" />
        </div>
        <div className="w-full p-5 flex flex-col gap-8 items-center">
          {addresses.length ? (
            renderAddresses()
          ) : (
            <div className="w-full h-[60vh] flex items-center justify-center">
              <span className="text-3xl font-thin text-sky-300">You haven't filled out your address</span>
            </div>
          )}
        </div>
        {totalAddress > limit ? (
          <div className="flex items-center justify-center gap-3 mt-5">
            <button
              onClick={() => {
                setCurrentPage(currentPage - 1);
              }}
              disabled={currentPage === 1}
              className="h-7 w-7 rounded-xl bg-emerald-400 flex justify-center items-center text-white text-lg active:scale-95 hover:brightness-110 transition disabled:bg-gray-300 disabled:text-gray-400 disabled:hover:brightness-100 disabled:active:scale-100"
            >
              <FiChevronLeft />
            </button>
            <span className="text-lg font-semibold text-gray-700">{currentPage}</span>
            <button
              onClick={() => {
                setCurrentPage(currentPage + 1);
              }}
              disabled={currentPage === maxPage}
              className="h-7 w-7 rounded-xl bg-emerald-400 flex justify-center items-center text-white text-lg active:scale-95 hover:brightness-110 transition disabled:bg-gray-300 disabled:text-gray-400 disabled:hover:brightness-100 disabled:active:scale-100"
            >
              <FiChevronRight />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Address;
