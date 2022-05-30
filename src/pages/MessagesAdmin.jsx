import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import { API_URL } from '../assets/constants';
import { debounce } from 'throttle-debounce';

import MessagesModal from '../components/MessagesModal';
import { AiOutlineLoading3Quarters, AiOutlineClose } from 'react-icons/ai';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

const MessagesAdmin = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  const [totalMsg, setTotalMsg] = useState(0);
  const [search, setSearch] = useState('');
  const [keyword, setKeyword] = useState('');
  const limit = 7;

  const socket = useSelector((state) => state.socket.instance);

  useEffect(() => {
    dispatch({
      type: 'ALERT_CLEAR',
      payload: 'alert',
    });

    const fetchAdminMsg = async () => {
      try {
        setLoading(true);

        const response = await Axios.post(`${API_URL}/message/admin`, {
          limit,
          currentPage,
          keyword,
        });

        setMessages(response.data.rows);
        setMaxPage(response.data.maxPage);
        setTotalMsg(response.data.count);

        setLoading(false);

        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        setLoading(false);

        toast.error('Unable to fetch Admin Messages', { position: 'bottom-left', theme: 'colored' });
      }
    };
    fetchAdminMsg();

    socket?.on('newAdminNotif', () => {
      fetchAdminMsg();
      return;
    });

    socket?.on('newPaymentNotif', () => {
      fetchAdminMsg();
      return;
    });

    return async () => {
      try {
        dispatch({
          type: 'ALERT_CLEAR',
          payload: 'alert',
        });
        await Axios.patch(`${API_URL}/message/unnew-admin`);
      } catch (err) {
        toast.error('Unable to update messages status!', { position: 'bottom-left', theme: 'colored' });
      }
    };
  }, [currentPage, keyword, socket]);

  const debouncedKeyword = useCallback(
    debounce(1000, (val) => {
      setKeyword(val);
      setCurrentPage(1);
    }),
    []
  );

  useEffect(() => {
    debouncedKeyword(search);
  }, [search]);

  useEffect(() => {
    if (currentPage === 1) {
      return;
    } else if (totalMsg <= currentPage * limit - limit) {
      setCurrentPage(currentPage - 1);
    }
  }, [totalMsg]);

  const renderMessages = () => {
    return messages?.map((message) => (
      <MessagesModal
        key={message.id}
        message={message}
        limit={limit}
        currentPage={currentPage}
        setMessages={setMessages}
        setMaxPage={setMaxPage}
        setTotalMsg={setTotalMsg}
      />
    ));
  };

  return (
    <>
      <div className="h-16 shadow-sm pl-80 pr-8 fixed z-[15] w-10 top-0 left-0 flex items-center">
        <div className="flex justify-center items-center relative">
          <FaSearch className="absolute left-2 text-gray-400 bg-gray-100 cursor-pointer active:scale-95 transition" />
          <input
            type="text"
            id="myInput"
            value={search}
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
            className="search block w-72 shadow border-none rounded-3x1 focus:outline-none py-2 bg-gray-100 text-base text-gray-600 pl-11 pr-7"
          />
          <AiOutlineClose
            onClick={() => {
              setSearch('');
            }}
            className="hover:brightness-110 cursor-pointer absolute right-2"
          />
        </div>
      </div>
      <div className="h-full w-5/6 flex flex-col px-10">
        <div className="w-full pt-4">
          <span className="text-3xl font-thin">Notifications</span>
          <div className="w-full h-[1px] my-1 bg-gray-300"></div>
        </div>
        <div className="w-full py-5 flex flex-col gap-6 pl-10 mb-auto relative">
          {loading && (
            <div className="absolute inset-0 rounded-lg bg-gray-200 bg-opacity-30 backdrop-blur-md flex justify-center items-center gap-2 z-20 text-3xl font-thin text-gray-700">
              <AiOutlineLoading3Quarters className="animate-spin" />
              <span>Loading..</span>
            </div>
          )}
          {messages.length ? (
            renderMessages()
          ) : (
            <div className="w-full h-96 flex items-center justify-center">
              {keyword ? (
                <span className="text-3xl font-thin">Message not found..</span>
              ) : (
                <span className="text-3xl font-thin">You don't have any notifications</span>
              )}
            </div>
          )}
        </div>
        <div className="w-full flex justify-end items-center gap-2 border-t py-2 px-5">
          {messages.length ? (
            <>
              <span className="text-sm text-gray-400 italic">
                Showing {currentPage * limit - limit + 1} to {currentPage * limit - limit + messages.length} from {totalMsg}
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1 || loading}
                  onClick={() => {
                    setCurrentPage(currentPage - 1);
                  }}
                  className="hover:text-sky-500 disabled:text-gray-300 active:scale-95 disabled:active:scale-100 transition"
                >
                  <FiChevronLeft />
                </button>
                <button
                  disabled={currentPage === maxPage || loading}
                  onClick={() => {
                    setCurrentPage(currentPage + 1);
                  }}
                  className="hover:text-sky-500 disabled:text-gray-300 active:scale-95 disabled:active:scale-100 transition"
                >
                  <FiChevronRight />
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default MessagesAdmin;
