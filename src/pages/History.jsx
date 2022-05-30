import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Axios from 'axios';
import { API_URL } from '../assets/constants';

import HistoryCard from '../components/HistoryCard';
import { BiCalendar } from 'react-icons/bi';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { DateRangePicker } from 'react-date-range';
import { startOfDay, endOfDay } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { toast } from 'react-toastify';

const History = () => {
  const dispatch = useDispatch();
  const userGlobal = useSelector((state) => state.user);
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  const [totalData, setTotalData] = useState(0);
  const [view, setView] = useState('all');
  const [ranges, setRanges] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  const [selectedDates, setSelectedDates] = useState({});
  const limit = 7;

  const socket = useCallback(useSelector((state) => state.socket.instance));

  useEffect(() => {
    dispatch({
      type: 'ALERT_CLEAR',
      payload: 'history',
    });

    const fetchInvoices = async () => {
      try {
        if (!currentPage) {
          return;
        }

        const query = {
          limit,
          currentPage,
        };

        if (view !== 'all') {
          query.status = view;
        }

        if (selectedDates.gte && selectedDates.lte) {
          query.dates = selectedDates;
        }

        const response = await Axios.post(`${API_URL}/history/user`, query, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        });

        setInvoices(response.data.invoices);
        setMaxPage(response.data.maxPage);
        setTotalData(response.data.count);

        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        toast.error('Unable to fetch Invoices!');
      }
    };
    fetchInvoices();

    socket?.on('newUserPayment', () => {
      fetchInvoices();
      return;
    });

    return () => {
      dispatch({ type: 'ALERT_CLEAR', payload: 'history' });
    };
  }, [view, currentPage, selectedDates]);

  const renderInvoices = () => {
    return invoices.map((invoice) => <HistoryCard key={invoice.id} invoice={invoice} userId={userGlobal.id} />);
  };

  return (
    <div className="w-full h-full flex flex-col items-center pt-5 px-6 md:px-0">
      <div className="w-full md:w-[70vw] xl:w-5/6 rounded-xl overflow-hidden border mb-7">
        <div className="w-full h-32 rounded-b-lg border-b bg-gradient-to-r from-white to-emerald-400 flex items-end pl-6 pb-2 text-4xl font-thin text-emerald-700">
          <span>Transaction History</span>
        </div>
        <div className="h-10 bg-gradient-to-r bg-gray-50 flex justify-end items-center gap-4 px-8">
          <div className="relative">
            <div
              onClick={() => {
                setCurrentPage(1);
                setView('all');
              }}
              className={`font-semibold before:absolute before:top-[24px] before:left-[50%] before:h-[2px] before:bg-emerald-500  before:transition-all after:absolute after:top-[24px] after:right-[50%] after:h-[2px] after:bg-emerald-500 after:transition-all cursor-pointer ${
                view === 'all' ? 'before:w-[50%] after:w-[50%] text-sky-500' : 'before:w-0 after:w-0 text-emerald-600'
              }`}
            >
              All
            </div>
          </div>
          <div className="relative">
            <div
              onClick={() => {
                setCurrentPage(1);
                setView('approved');
              }}
              className={`font-semibold  before:absolute before:top-[24px] before:left-[50%] before:h-[2px] before:bg-emerald-500  before:transition-all after:absolute after:top-[24px] after:right-[50%] after:h-[2px] after:bg-emerald-500 after:transition-all cursor-pointer ${
                view === 'approved' ? 'before:w-[50%] after:w-[50%] text-sky-500' : 'before:w-0 after:w-0 text-emerald-600'
              }`}
            >
              Approved
            </div>
          </div>
          <div className="relative">
            <div
              onClick={() => {
                setView('pending');
                setCurrentPage(1);
              }}
              className={`font-semibold  before:absolute before:top-[24px] before:left-[50%] before:h-[2px] before:bg-emerald-500  before:transition-all after:absolute after:top-[24px] after:right-[50%] after:h-[2px] after:bg-emerald-500 after:transition-all cursor-pointer ${
                view === 'pending' ? 'before:w-[50%] after:w-[50%] text-sky-500' : 'before:w-0 after:w-0 text-emerald-600'
              }`}
            >
              Pending
            </div>
          </div>
          <div className="relative">
            <div
              onClick={() => {
                setCurrentPage(1);
                setView('rejected');
              }}
              className={`font-semibold  before:absolute before:top-[24px] before:left-[50%] before:h-[2px] before:bg-emerald-500  before:transition-all after:absolute after:top-[24px] after:right-[50%] after:h-[2px] after:bg-emerald-500 after:transition-all cursor-pointer ${
                view === 'rejected' ? 'before:w-[50%] after:w-[50%] text-sky-500' : 'before:w-0 after:w-0 text-emerald-600'
              }`}
            >
              Rejected
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-[70vw] xl:w-5/6 py-2">
        <div className="w-full flex flex-col md:px-2">
          <div className="w-full flex items-center pr-2">
            {view === 'all' && (
              <span className="font-thin text-3xl bg-gradient-to-r from-sky-500 to-sky-300 bg-clip-text text-transparent py-1 pl-1">
                All Transactions
              </span>
            )}
            {view === 'approved' && (
              <span className="font-thin text-3xl bg-gradient-to-r from-sky-500 to-sky-300 bg-clip-text text-transparent py-1 pl-1">
                Approved Transactions
              </span>
            )}
            {view === 'pending' && (
              <span className="font-thin text-3xl bg-gradient-to-r from-sky-500 to-sky-300 bg-clip-text text-transparent py-1 pl-1">
                Pending Transactions
              </span>
            )}
            {view === 'rejected' && (
              <span className="font-thin text-3xl bg-gradient-to-r from-sky-500 to-sky-300 bg-clip-text text-transparent py-1 pl-1">
                Rejected Transactions
              </span>
            )}
            <div className="relative ml-auto group">
              <div className="p-2 rounded-lg bg-gray-100  flex items-center cursor-pointer group">
                <span
                  className={`font-semibold flex items-center gap-2 text-sm ${
                    selectedDates.gte && selectedDates.lte ? 'text-sky-500' : 'text-slate-700 group-hover:hover:text-sky-600'
                  } transition`}
                >
                  <BiCalendar className="text-slate-600" />
                  {selectedDates.gte && selectedDates.lte
                    ? `${selectedDates.gte.toLocaleDateString('id')} - ${selectedDates.lte.toLocaleDateString('id')}`
                    : 'Select Date'}
                </span>
              </div>
              <div className="w-max p-3 flex flex-col rounded-lg bg-gray-300 bg-opacity-60 backdrop-blur-sm absolute z-[40] right-3 md:right-11 top-8 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all shadow-lg">
                <DateRangePicker
                  className="rounded-lg overflow-hidden"
                  onChange={(date) => setRanges([date.selection])}
                  showSelectionPreview={true}
                  ranges={ranges}
                />
                <div className="w-full mt-2 flex justify-center gap-3">
                  <button
                    className="w-24 py-2 rounded-2xl text-white font-bold bg-rose-400 hover:brightness-110 active:scale-95 transition"
                    onClick={() => {
                      setRanges([{ ...ranges[0], startDate: new Date(), endDate: new Date() }]);
                      setSelectedDates({});
                    }}
                  >
                    Reset
                  </button>
                  <button
                    className="w-24 py-2 rounded-2xl text-white font-bold bg-emerald-400 hover:brightness-110 active:scale-95 transition"
                    onClick={() => setSelectedDates({ gte: startOfDay(ranges[0].startDate), lte: endOfDay(ranges[0].endDate) })}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[1px] w-full bg-gray-200 rounded-full" />
        </div>
        <div className="w-full flex flex-col gap-10 pt-6 pb-20 xl:px-8">
          {invoices.length ? (
            renderInvoices()
          ) : (
            <div className="w-full h-[45vh] flex justify-center items-center">
              <span className="text-3xl font-thin text-emerald-700">
                {view === 'all' && !selectedDates.gte && !selectedDates.lte ? `You don't have any history` : 'No transactions found..'}
              </span>
            </div>
          )}
          {totalData > limit ? (
            <div className="h-10 w-full px-3 flex items-center justify-end">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1 || !currentPage}
                  className="h-7 w-7 rounded-xl bg-emerald-400 disabled:bg-gray-300 disabled:opacity-75 flex justify-center items-center text-white hover:brightness-110 active:scale-95 disabled:text-gray-400 disabled:active:scale-100 disabled:hover:brightness-100 transition"
                >
                  {<FaChevronLeft />}
                </button>
                <input
                  onChange={(e) => {
                    if (e.target.value > maxPage) {
                      setCurrentPage(parseInt(maxPage));
                    } else {
                      setCurrentPage(parseInt(e.target.value));
                    }
                  }}
                  value={currentPage}
                  max={maxPage}
                  type="number"
                  className="w-8 h-7 rounded-md bg-white border focus:border-sky-500 focus:outline-none text-center"
                />
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === maxPage || !currentPage}
                  className="h-7 w-7 rounded-xl bg-emerald-400 disabled:bg-gray-300 disabled:opacity-75 flex justify-center items-center text-white hover:brightness-110 active:scale-95 disabled:text-gray-400 disabled:active:scale-100 disabled:hover:brightness-100 transition"
                >
                  {<FaChevronRight />}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default History;
