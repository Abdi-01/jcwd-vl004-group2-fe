import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Axios from 'axios';
import { API_URL } from '../assets/constants';

import MessagesModal from '../components/MessagesModal';
import { HiMail } from 'react-icons/hi';
import { FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';

const Messages = () => {
  const dispatch = useDispatch();
  const userGlobal = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  const [totalMsg, setTotalMsg] = useState(0);
  const limit = 7;

  const socket = useSelector((state) => state.socket.instance);

  useEffect(() => {
    dispatch({
      type: 'ALERT_CLEAR',
      payload: 'alert',
    });

    const fetchMessages = async () => {
      try {
        const response = await Axios.post(`${API_URL}/message/user/${userGlobal.id}`, {
          limit,
          currentPage,
          keyword,
        });

        setMessages(response.data.rows);
        setMaxPage(response.data.maxPage);
        setTotalMsg(response.data.count);

        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        toast.error('Unable to fetch Messages!', { position: 'bottom-left', theme: 'colored' });
      }
    };
    fetchMessages();

    socket?.on('newUserNotif', () => {
      fetchMessages();
      return;
    });

    socket?.on('newUserPayment', () => {
      fetchMessages();
      return;
    });

    return async () => {
      try {
        dispatch({
          type: 'ALERT_CLEAR',
          payload: 'alert',
        });
        await Axios.patch(`${API_URL}/message/unnew/${userGlobal.id}`);
      } catch (err) {
        toast.error('Unable to update messages status!', { position: 'bottom-left', theme: 'colored' });
      }
    };
  }, [userGlobal, currentPage, keyword, socket]);

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

  const SearchBar = () => {
    const [searchMode, setSearchMode] = useState(false);
    const [string, setString] = useState(keyword ? keyword : '');

    return (
      <div className="relative">
        <input
          type="text"
          disabled={!searchMode && !keyword}
          value={string}
          onChange={(e) => setString(e.target.value)}
          placeholder="Search notifications.."
          className={`h-10 text-md text-gray-700 pl-4 ${
            searchMode || keyword
              ? 'w-56 placeholder:text-gray-600 placeholder:text-sm flex items-center pr-10'
              : 'w-10 placeholder:text-transparent'
          } bg-gray-100 rounded-full focus:outline-none focus:ring-1 focus:ring-sky-300 transition-all`}
        />
        <button
          onClick={() => {
            setSearchMode(true);

            if (string) {
              setKeyword(string);
            }
          }}
          className="h-8 w-8 rounded-full flex items-center justify-center text-lg bg-gray-400 text-white active:scale-95 hover:brightness-110 transition absolute z-[3] top-1 right-1"
        >
          <FiSearch />
        </button>
        <button
          disabled={!searchMode && !keyword}
          onClick={() => {
            setSearchMode(false);
            setString('');
            setKeyword('');
          }}
          className={`h-8 w-8 flex items-center justify-center text-lg text-red-500 hover:rotate-180 active:scale-95 transition-all absolute top-1 right-1 ${
            searchMode || keyword ? 'translate-x-[34px]' : 'translate-x-0'
          }`}
        >
          <IoMdClose />
        </button>
      </div>
    );
  };

  return (
    <div className="w-full h-full">
      <div className="w-11/12 xl:w-9/12 h-full mx-auto pt-5 flex flex-col">
        <div className="w-full flex flex-col">
          <div className="flex items-center gap-2 pl-2 py-1 border-b">
            <HiMail className="text-emerald-400 text-3xl" />
            <span className="text-3xl bg-gradient-to-r from-emerald-400 to-sky-500 bg-clip-text text-transparent font-semibold mr-auto">
              My Notifications
            </span>
            <SearchBar />
          </div>
        </div>
        <div className="w-full flex flex-col items-center py-7 gap-6 mb-auto">
          {messages.length ? (
            renderMessages()
          ) : (
            <div className="w-full h-[400px] flex justify-center items-center">
              <span className="text-2xl md:text-3xl lg:text-3xl font-thin text-sky-400">You don't have any notifications</span>
            </div>
          )}
        </div>
        {messages.length ? (
          <div className="w-full h-10 flex justify-end items-center gap-2 border-t px-5">
            <span className="text-sm text-gray-400 italic">
              Showing {currentPage * limit - limit + 1} to {currentPage * limit - limit + messages.length} from {totalMsg}
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage(currentPage - 1);
                }}
                className="hover:text-sky-500 disabled:text-gray-300 active:scale-95 disabled:active:scale-100 transition"
              >
                <FiChevronLeft />
              </button>
              <button
                disabled={currentPage === maxPage}
                onClick={() => {
                  setCurrentPage(currentPage + 1);
                }}
                className="hover:text-sky-500 disabled:text-gray-300 active:scale-95 disabled:active:scale-100 transition"
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

export default Messages;
