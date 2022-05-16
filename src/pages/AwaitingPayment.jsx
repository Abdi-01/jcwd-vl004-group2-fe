import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import { API_URL } from '../assets/constants';

import AwaitingPaymentCard from '../components/AwaitingPaymentCard';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-toastify';

const AwaitingPayment = () => {
  const dispatch = useDispatch();
  const userToken = localStorage.getItem('userToken');
  const socket = useCallback(
    useSelector((state) => state.socket.instance),
    []
  );
  const [invoices, setInvoices] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    dispatch({ type: 'ALERT_CLEAR', payload: 'awaiting' });

    const fetchAwaiting = async () => {
      try {
        const response = await Axios.post(
          `${API_URL}/history/user/awaiting`,
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

        setInvoices(response.data.rows);
        setMaxPage(response.data.maxPage);
        setTotalData(response.data.count);
      } catch (err) {
        toast.error('Unable to fetch invoices!', { position: 'bottom-left', theme: 'colored' });
      }
    };
    fetchAwaiting();
  }, []);

  useEffect(() => {
    if (currentPage === 1) {
      return;
    } else if (totalData < currentPage * limit - limit) {
      setCurrentPage(currentPage - 1);
    }
  }, [totalData]);

  const renderInvoices = () => {
    return invoices?.map((invoice) => (
      <AwaitingPaymentCard
        key={invoice.id}
        invoice={invoice}
        setInvoices={setInvoices}
        setMaxPage={setMaxPage}
        setTotalData={setTotalData}
        currentPage={currentPage}
        limit={limit}
        socket={socket}
      />
    ));
  };

  return (
    <div className="h-full flex justify-center py-3 lg:py-5">
      <div className="h-full w-[90%] sm:w-[85%] md:w-[90%] lg:w-[80%] flex flex-col items-center">
        <div className="w-full flex items-center py-2">
          <span className="text-3xl font-semibold leading-10 bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
            Awaiting Payment
          </span>
        </div>
        <div className="h-px w-full bg-gray-100" />
        <div className="w-full flex flex-col items-center py-4 gap-6">
          {invoices.length ? (
            renderInvoices()
          ) : (
            <div className="w-full h-60 lg:h-80 flex items-center justify-center">
              <span className="text-2xl lg:text-3xl font-thin text-slate-700">You don't have any unpaid invoices</span>
            </div>
          )}
        </div>
        {invoices.length ? (
          <div className="w-full lg:w-[80%] mt-auto flex items-center justify-end py-1 border-t">
            <div className="flex items-center gap-1 text-xs lg:text-sm">
              <span className="font-semibold">{currentPage}</span>
              <span>to</span>
              <span className="font-semibold">{maxPage}</span>
              <span>from</span>
              <span className="font-semibold">{totalData}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="active:scale-95 hover:brightness-110 transition disabled:text-gray-400 disabled:active:scale-100"
              >
                <FiChevronLeft />
              </button>
              <button
                disabled={currentPage === maxPage}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="active:scale-95 hover:brightness-110 transition disabled:text-gray-400 disabled:active:scale-100"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AwaitingPayment;