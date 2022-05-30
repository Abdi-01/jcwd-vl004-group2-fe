import { useSelector } from 'react-redux';
import { API_URL } from '../assets/constants';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaRegUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import money from '../assets/images/money-back.svg';
import truck from '../assets/images/delivery-van.svg';
import { GiMedicines } from 'react-icons/gi';

const HomeAdmin = () => {
  const adminGlobal = useSelector((state) => state.adminReducer);
  const socket = useSelector((state) => state.socket.instance);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  let fullDate = new Date();
  let date = `${fullDate.getDate()}`;
  let month = months[fullDate.getMonth()];
  let year = fullDate.getFullYear();
  let day = days[fullDate.getDay()];

  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(1);
  const [products, setProducts] = useState([]);
  const [productsLength, setProductLength] = useState(0);
  const [users, setUsers] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [statistic, setStatistic] = useState();
  const adminToken = localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchReports = async () => {
      const report = await axios.post(`${API_URL}/admin/report/get`, null, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      setStatistic({
        sales: report.data.sales,
        profit: report.data.profit,
        capital: report.data.capital,
        revenue: report.data.revenue,
      });
    };
    fetchReports();
    const fetchUsers = async () => {
      const userList = await axios.post(`${API_URL}/user/query`);
      setUsers(userList.data.length);
    };
    fetchUsers();
    const fetchTransactions = async () => {
      const transactionList = await axios.post(
        // bug fixed add {} between url and header
        `${API_URL}/admin/transaction/get`,
        {
          page: activePage,
          limit: 5,
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      setTransactions(transactionList.data.data);
      console.log(transactionList.data.data);
    };
    fetchTransactions();

    const fetchProducts = async () => {
      const productList = await axios.post(`${API_URL}/product/query`, {
        limit: 5,
        fromHomeAdmin: true,
      });
      setProducts(productList.data.products);
      setProductLength(productList.data.length);
    };
    fetchProducts();

    socket?.on('newTransactionNotif', () => {
      fetchTransactions();
      return;
    });

    socket?.on('newPaymentNotif', () => {
      fetchTransactions();
      return;
    });
  }, [socket]);

  const toIDR = (number) => {
    number = parseInt(number);
    return number.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    });
  };

  const dateLocal = (dateInvoice) => {
    let dateFull = new Date(dateInvoice);
    let date = dateFull.getDate();
    let month = dateFull.getMonth() + 1;
    let year = dateFull.getFullYear();
    return `${month}/${date}/${year}`;
  };

  return (
    <div className="h-full w-full bg-gray-100">
      <div className="flex items-center justify-between py-7 px-10">
        <div>
          <span className="text-3xl font-bold text-gray-700">Dashboard</span>
          <span className="font-thin text-gray-500">
            <h1>Welcome, {adminGlobal?.name}!</h1>
          </span>
        </div>
        <div className="text-lg font-bold text-gray-700">
          <h1>
            {day}, {date} {month} {year}
          </h1>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 justify-between px-10 ">
        <div className="w-full justify-between items-center flex flex-col-1 shadow-md bg-white rounded-md">
          <div className="flex-col">
            <div className="font-bold text-3xl mt-3 ml-8">{users}</div>
            <div className="mb-3 ml-8">Users</div>
          </div>
          <div className="m-8">
            <FaRegUser size={40} fill="#F87171" />
          </div>
        </div>
        <div className="w-full justify-between items-center flex flex-col-2 shadow-md bg-white rounded-md">
          <div className="flex-col">
            <div className="font-bold text-3xl mt-3 ml-8">{productsLength}</div>
            <div className="mb-3 ml-8">Products</div>
          </div>
          <div className="m-8">
            <GiMedicines size={40} fill="#F87171" />
          </div>
        </div>
        <div className="w-full justify-between items-center flex flex-col-3 shadow-md bg-white rounded-md">
          <div className="flex-col">
            <div className="font-bold text-3xl mt-3 ml-8">{statistic ? statistic.sales : 0}</div>
            <div className="mb-3 ml-8">Sales</div>
          </div>
          <div className="m-8">
            <img src={truck} />
          </div>
        </div>
        <div className="w-full justify-between items-center flex flex-col-4 shadow-md bg-white rounded-md">
          <div className="flex-col">
            <div className="font-bold text-3xl mt-3 ml-8">Rp. {statistic?.profit.toLocaleString('id')}</div>
            <div className="mb-3 ml-8">Profits</div>
          </div>
          <div className="m-8">
            <img src={money} />
          </div>
        </div>
      </div>
      {/* new row */}
      <div className="grid grid-cols-4 gap-4 justify-between py-7 px-10 ">
        <div className="w-full justify-between flex flex-col col-span-3 shadow-md bg-white rounded-md">
          <div className="flex-col">
            <div className="flex justify-between items-center my-3">
              <div className="text-xl mt-3 ml-8">Recent Transactions</div>
              <div className="mt-6 mr-8">
                <button className="hover:bg-gray-100 transition rounded-xl items-center" onClick={() => navigate('/dashboard/transaction')}>
                  See All
                </button>
              </div>
            </div>
            <div className="m-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 rounded-lg">
                    <th className="bg-gray-100 rounded-lg font-normal">No</th>
                    <th className="bg-gray-100 rounded-lg font-normal">Name</th>
                    <th className="bg-gray-100 rounded-lg font-normal">Address</th>
                    <th className="bg-gray-100 rounded-lg font-normal">Delivery</th>
                    <th className="bg-gray-100 rounded-lg font-normal">Invoice Date</th>
                    <th className="bg-gray-100 rounded-lg font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions?.map((item, i) => {
                    return (
                      <tr key={item.id}>
                        <th className="justify-center items-center text-center p-4">{i + 1}</th>
                        <td className="justify-center items-center text-center p-4">{item.user.name}</td>
                        <td className="justify-center items-center text-center p-4">
                          {item.address.address}, {item.address.city}, {item.address.province}
                        </td>
                        <td className="justify-center items-center text-center p-4">{item.deliveryoption.name}</td>

                        <td className="justify-center items-center text-center p-4">{dateLocal(item.createdAt)}</td>
                        <td className="justify-center items-center text-center p-4">
                          <div
                            className={`badge ${item.status === 'pending' && 'badge-warning'} ${
                              item.status === 'approved' && 'badge-success'
                            } ${item.status === 'rejected' && 'badge-error'} gap-2 `}
                          >
                            {item.status}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="w-full flex-col-4 shadow-md bg-white rounded-md">
          <div className="flex-col">
            <div className="flex justify-between items-center">
              <div className="mt-8 text-xl ml-8">Latest Products</div>
              <div className="mt-9 mr-8">
                <button className="hover:bg-gray-100 transition rounded-xl items-center" onClick={() => navigate('/dashboard/product')}>
                  See All
                </button>
              </div>
            </div>
            <div className="mb-3 ml-3">
              <table className="w-full">
                <thead></thead>
                <tbody>
                  {products?.map((item, i) => {
                    return (
                      <tr key={item.id}>
                        <th className="text-sm">{i + 1}</th>
                        <td className="p-4 text-sm">{item.name}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;
