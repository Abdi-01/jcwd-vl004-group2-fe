import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { API_URL } from '../assets/constants';
import { debounce } from 'throttle-debounce';

import AdminList from '../components/AdminList';
import { BsArrowDownUp } from 'react-icons/bs';
import { GoChevronLeft, GoChevronRight } from 'react-icons/go';
import { RiAdminFill, RiAdminLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import NewAdminModal from '../components/NewAdminModal';
import { AiOutlineLoading3Quarters, AiOutlineClose } from 'react-icons/ai';
import { FaSearch } from 'react-icons/fa';

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const dataAdmin = JSON.parse(localStorage.getItem('dataAdmin'));
  const adminToken = localStorage.getItem('adminToken');
  const socket = useSelector((state) => state.socket.instance);
  const [loading, setLoading] = useState(false);
  const [onlineAdmins, setOnlineAdmins] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  const [sort, setSort] = useState('');
  const [search, setSearch] = useState('');
  const [keyword, setKeyword] = useState('');
  const limit = 5;

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
    const fetchAdmins = async () => {
      try {
        const query = {
          limit,
        };

        if (currentPage) {
          query.currentPage = currentPage;
        } else if (!currentPage || currentPage > maxPage) {
          return;
        }

        if (sort) {
          query.sort = sort;
        }

        setLoading(true);

        const response = await Axios.post(`${API_URL}/admin/account/all?keyword=${keyword}`, query, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        setAdmins(response.data.rows);
        setMaxPage(response.data.maxPage);
        if (!keyword) {
          setTotalAdmins(response.data.totalAdmins);
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);

        toast.error('Unable to fetch Admins!', {
          position: 'bottom-left',
          theme: 'colored',
        });
      }
    };

    if (!dataAdmin.is_super) {
      navigate('/dashboard', { replace: true });
    } else {
      fetchAdmins();
    }
  }, [currentPage, sort, keyword]);

  useEffect(() => {
    if (currentPage === 1) {
      return;
    } else if (totalAdmins <= currentPage * limit - limit) {
      setCurrentPage(currentPage - 1);
    }
  }, [totalAdmins]);

  useEffect(() => {
    socket?.emit('getOnlineAdmin');

    socket?.on('onlineAdminData', ({ data }) => {
      setOnlineAdmins(data);
    });

    socket?.on('newOnlineAdmin', ({ data }) => {
      setOnlineAdmins(data);
    });

    socket?.on('offlineAdmin', ({ data }) => {
      setOnlineAdmins(data);
    });
  }, [socket]);

  const renderAdmins = () => {
    return admins.map((admin) => (
      <AdminList
        key={admin.id}
        admin={admin}
        online={onlineAdmins.some((onlineAdmin) => onlineAdmin.id === admin.id)}
        setAdmins={setAdmins}
        setMaxPage={setMaxPage}
        setTotalAdmins={setTotalAdmins}
        limit={limit}
        currentPage={currentPage}
      />
    ));
  };

  return (
    <div className="h-full flex flex-col px-10">
      <div className="h-16 bg-white shadow-sm pl-80 pr-8 fixed z-[12] w-10 top-0 left-0 flex items-center">
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
      <div className="flex flex-col justify-center py-4">
        <span className="text-3xl font-bold leading-10 bg-gradient-to-r from-sky-400 to-emerald-300 bg-clip-text text-transparent mb-1">
          Admins
        </span>
        <div className="w-full h-[2px] bg-gradient-to-r from-sky-400 to-sky-200" />
      </div>
      <div className="flex h-full">
        <div className="w-[70%] h-full flex flex-col">
          <div className="w-full flex flex-col">
            <div className="w-full flex py-1 divide-x">
              <div className="w-[7%] flex justify-center items-center gap-1 text-gray-600 ">
                <span className="text-sm font-semibold">ID</span>
                <BsArrowDownUp
                  onClick={() => {
                    if (sort === 'id,asc') {
                      setSort('id,desc');
                    } else {
                      setSort('id,asc');
                    }
                  }}
                  className="text-xs hover:text-sky-300 transition cursor-pointer active:scale-95"
                />
              </div>
              <div className="w-[20%] pl-2 flex items-center gap-1 text-gray-600 ">
                <span className="text-sm font-semibold">Name</span>
                <BsArrowDownUp
                  onClick={() => {
                    if (sort === 'name,asc') {
                      setSort('name,desc');
                    } else {
                      setSort('name,asc');
                    }
                  }}
                  className="text-xs hover:text-sky-300 transition cursor-pointer active:scale-95"
                />
              </div>
              <div className="w-[29%] pl-2 flex items-center gap-1 text-gray-600">
                <span className="text-sm font-semibold">Email</span>
                <BsArrowDownUp
                  onClick={() => {
                    if (sort === 'email,asc') {
                      setSort('email,desc');
                    } else {
                      setSort('email,asc');
                    }
                  }}
                  className="text-xs hover:text-sky-300 transition cursor-pointer active:scale-95"
                />
              </div>
              <div className="w-[21%] pl-2 flex items-center gap-1 text-gray-600">
                <span className="text-sm font-semibold">Username</span>
                <BsArrowDownUp
                  onClick={() => {
                    if (sort === 'username,asc') {
                      setSort('username,desc');
                    } else {
                      setSort('username,asc');
                    }
                  }}
                  className="text-xs hover:text-sky-300 transition cursor-pointer active:scale-95"
                />
              </div>
              <div className="w-[13%] pl-2 flex items-center justify-center text-gray-600">
                <span className="text-sm font-semibold">Profile Pic</span>
              </div>
              <div className="w-[10%] flex justify-center items-center text-gray-600">
                <span className="text-sm font-semibold">Status</span>
              </div>
            </div>
            <div className="h-[1px] w-full bg-gray-200" />
          </div>
          <div className="w-full py-3 flex flex-col gap-3 mb-auto relative">
            {loading && (
              <div className="absolute inset-0 z-20 rounded-lg bg-gray-200 bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
                <div className="text-2xl flex items-center gap-2">
                  <AiOutlineLoading3Quarters className="animate-spin" />
                  <span className="font-thin">Loading..</span>
                </div>
              </div>
            )}
            {admins.length ? (
              renderAdmins()
            ) : (
              <div className="h-96 flex justify-center items-center">
                <span className="text-2xl font-thin text-slate-800">
                  {keyword ? `No admin found..` : `You currently don't have any admin`}
                </span>
              </div>
            )}
          </div>
          <div className="w-full py-2 flex justify-center items-center border-t gap-2 text-gray-600 font-semibold">
            <button
              disabled={currentPage === 1 || !currentPage}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="hover:text-sky-400 disabled:text-gray-300 active:scale-95 disabled:active:scale-100 transition"
            >
              <GoChevronLeft />
            </button>
            <input
              type="number"
              className="w-7 rounded-lg border text-center focus:outline-none focus:border-sky-300 cursor-pointer transition"
              value={currentPage}
              onChange={(e) => {
                if (e.target.value > maxPage) {
                  setCurrentPage(parseInt(maxPage));
                } else {
                  setCurrentPage(parseInt(e.target.value));
                }
              }}
            />
            <span>of</span>
            <span>{maxPage}</span>
            <button
              disabled={currentPage === maxPage || !currentPage}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="hover:text-sky-400 disabled:text-gray-300 active:scale-95 disabled:active:scale-100 transition"
            >
              <GoChevronRight />
            </button>
          </div>
        </div>
        <div className="w-[27%] px-6">
          <div className="w-full px-5 rounded-xl bg-white shadow ring-1 ring-emerald-200 ring-offset-2 ring-inset flex flex-col">
            <div className="pt-3 pb-1 border-b">
              <span className="text-lg font-bold bg-gradient-to-r from-sky-400 to-sky-300 bg-clip-text text-transparent">
                Admin Summary
              </span>
            </div>
            <div className="w-full py-3">
              <div className="w-full h-full p-2 rounded-xl bg-gradient-to-b from-sky-50 to-sky-100 flex flex-col gap-2">
                <div className="w-full flex items-center text-gray-600">
                  <div className="relative mr-1">
                    <RiAdminFill />
                  </div>
                  <span className="font-semibold mr-auto">Total Admins:</span>
                  <span className="font-bold">{totalAdmins}</span>
                </div>
                <div className="w-full flex items-center text-gray-600">
                  <div className="relative mr-1">
                    <RiAdminLine />
                    <span className="h-1 w-1 rounded-full bg-green-400 absolute top-0 right-0"></span>
                  </div>
                  <span className="font-semibold mr-auto">Online Admins:</span>
                  <span className="font-bold">{onlineAdmins.length}</span>
                </div>
              </div>
            </div>
            <div className="w-full pb-4">
              <NewAdminModal
                setAdmins={setAdmins}
                setMaxPage={setMaxPage}
                setTotalAdmins={setTotalAdmins}
                limit={limit}
                currentPage={currentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
