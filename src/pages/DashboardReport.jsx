import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import { AiOutlineClose } from 'react-icons/ai';
import { FaArrowLeft, FaArrowRight, FaSearch } from 'react-icons/fa';
import { FiAward, FiCalendar, FiFilter, FiMoreHorizontal } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { debounce } from 'throttle-debounce';
import { API_URL } from '../assets/constants';

const DashboardReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isReportNull, setIsReportNull] = useState();
  const [keyword, setKeyword] = useState();
  const [report, setReport] = useState();
  const [activePage, setActivePage] = useState(1);
  const [startNumber, setStartNumber] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [statistic, setStatistic] = useState();
  const [mostSold, setMostSold] = useState();
  const adminToken = localStorage.getItem('adminToken');
  const [selectedDates, setSelectedDates] = useState([
    {
      startDate: new Date(new Date().setDate(1)),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const getReport = async (stardDate, endDate, keyword, activePageSearch) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${API_URL}/admin/report/get`,
        {
          startDate: stardDate ? stardDate : selectedDates[0].startDate,
          endDate: endDate ? endDate : selectedDates[0].endDate,
          search: keyword,
          page: activePageSearch ? activePageSearch : activePage,
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if ((response.data.data.length === 0 && isDefaultDate() === false) || (response.data.data.length === 0 && keyword))
        setIsReportNull(true);

      setReport(response.data.data);
      setMostSold(response.data.mostSold);
      setStatistic({
        sales: response.data.sales,
        profit: response.data.profit,
        capital: response.data.capital,
        revenue: response.data.revenue,
      });
      setTotalPage(response.data.totalPage);
      setStartNumber(response.data.startNumber);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    getReport(null, null, keyword);
  }, [activePage, keyword]);

  const isDefaultDate = () => {
    let startDate = selectedDates[0].startDate.toLocaleDateString('id');
    let endDate = selectedDates[0].endDate.toLocaleDateString('id');
    let firstDate = new Date(new Date().setDate(1)).toLocaleDateString('id');
    let today = new Date().toLocaleDateString('id');

    if (startDate === firstDate && endDate === today) {
      return true;
    }
    return false;
  };

  const resetDate = () => {
    let startDate = new Date(new Date().setDate(1));
    let endDate = new Date();
    setSelectedDates([{ ...selectedDates[0], startDate, endDate }]);
    if (activePage > 1) {
      document.getElementById('inputPage').value = 1;
      return setActivePage(1);
    } else if (keyword) {
      return setKeyword('');
    }
    getReport(startDate, endDate);
  };

  const renderAlert = () => {
    Swal.fire({
      text: 'Data Not Found!',
      icon: 'question',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Okay',
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          setIsReportNull(false);
          resetDate();
        } catch (error) {
          toast.error(error);
        }
      }
    });
  };

  const handSearch = useCallback(
    debounce(1000, (e) => {
      setKeyword(e.target.value);
      setActivePage(1);
      document.getElementById('inputPage').value = 1;
    }),
    []
  );

  const handChangePage = useCallback(
    debounce(1000, (e) => {
      if (e.target.value <= totalPage && e.target.value > 0) {
        setActivePage(+e.target.value);
      } else {
        document.getElementById('inputPage').value = +activePage;
      }
    }),
    [totalPage, activePage]
  );

  const handNextPage = () => {
    if (activePage < totalPage && activePage) {
      setActivePage(+activePage + 1);
      document.getElementById('inputPage').value = +activePage + 1;
    }
  };

  const handPrevPage = () => {
    if (activePage > 1) {
      setActivePage(+activePage - 1);
      document.getElementById('inputPage').value = +activePage - 1;
    }
  };

  return (
    <div className="h-full min-w-full w-max bg-gray-100">
      {/* Search Bar */}
      <div className="h-16 bg-white shadow-sm pl-80 pr-8 fixed z-[12] w-10 top-0 left-0 flex items-center">
        <div className="flex justify-center items-center relative">
          <FaSearch className="absolute left-2 text-gray-400 bg-gray-100 active:scale-95 transition" />
          <input
            type="text"
            id="myInput"
            placeholder="Search..."
            onChange={handSearch}
            className="search block w-72 shadow border-none rounded-3x1 focus:outline-none py-2 bg-gray-100 text-base text-gray-600 pl-11 pr-7"
          />
          <AiOutlineClose
            onClick={() => {
              setKeyword('');
              document.getElementById('myInput').value = '';
            }}
            className="hover:brightness-110 cursor-pointer absolute right-2"
          />
        </div>
      </div>

      <div className="flex items-center justify-between py-7 px-10">
        <div>
          <h1 className="text-3xl text-gray-700 font-bold">Report</h1>
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex gap-2 items-center mr-5">
            <FiFilter size={24} />
            {isDefaultDate() ? (
              <span>this month</span>
            ) : selectedDates[0].startDate.toLocaleDateString('id') === selectedDates[0].endDate.toLocaleDateString('id') ? (
              <span>{`${selectedDates[0].startDate.toLocaleDateString('id')}`}</span>
            ) : (
              <span>{`${selectedDates[0].startDate.toLocaleDateString('id')} - ${selectedDates[0].endDate.toLocaleDateString('id')}`}</span>
            )}
          </div>
          <label htmlFor="date-modal" href="#date-modal" className="flex items-center gap-3 btn btn-primary hover:cursor-pointer">
            <FiCalendar size={24} />
            Select date
          </label>
          <div className="ml-5">
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title text-xs">Profit</div>
                <div className="stat-value text-xl text-primary">Rp. {statistic ? statistic.profit.toLocaleString('id') : 0}</div>
              </div>
              <div className="stat">
                <div className="stat-title text-xs">Sales</div>
                <div className="stat-value text-xl">{statistic ? statistic.sales : 0}</div>
              </div>
              <div className="stat">
                <div className="stat-title text-xs">More</div>
                <div className="stat-value text-xl">
                  <label htmlFor="detail-modal" href="#detail-modal">
                    <FiMoreHorizontal size={24} className="hover:cursor-pointer" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-5">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="bg-white border-b border-gray-200">No</th>
                <th className="bg-white border-b border-gray-200">Product Name</th>
                <th className="bg-white border-b border-gray-200">Price</th>
                <th className="bg-white border-b border-gray-200">Total Sales</th>
                <th className="bg-white border-b border-gray-200">Sold Volume</th>
                <th className="bg-white border-b border-gray-200">Capital</th>
                <th className="bg-white border-b border-gray-200">Revenue</th>
                <th className="bg-white border-b border-gray-200">Profit</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8}>
                    <div className="flex h-80 w-full items-center justify-center">
                      <button type="button" className="flex items-center rounded-lg bg-primary px-4 py-2 text-white" disabled>
                        <svg
                          className="mr-3 h-5 w-5 animate-spin text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span className="font-medium"> Processing... </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : isReportNull ? (
                renderAlert()
              ) : (
                report?.map((item, i) => {
                  return (
                    <>
                      <tr key={item.id}>
                        <td>{startNumber + i + 1}</td>
                        <td className="max-w-md whitespace-normal">{item.name}</td>
                        <td>
                          Rp. {parseInt(item.price).toLocaleString('id')}/{item.unit}
                        </td>
                        <td>{item.total_sales} sales</td>
                        <td>
                          {parseInt(item.sold_volume).toLocaleString('id')} {item.unit}
                        </td>
                        <td>Rp. {parseInt(item.capital).toLocaleString('id')}</td>
                        <td>Rp. {parseInt(item.total_bill).toLocaleString('id')}</td>
                        <td>Rp. {(item.total_bill - item.capital).toLocaleString('id')}</td>
                      </tr>
                    </>
                  );
                })
              )}
            </tbody>
          </table>
          <div className="mt-3 mb-2 flex justify-center items-center gap-4 pt-3">
            <button
              className={activePage === 1 ? `hover:cursor-not-allowed` : `hover:cursor-pointer`}
              disabled={activePage === 1}
              onClick={handPrevPage}
            >
              {' '}
              <FaArrowLeft />
            </button>
            <div>
              Page{' '}
              <input
                id="inputPage"
                type="number"
                className="border text-center border-gray-300 rounded-lg bg-white focus:outline-none w-10 hover:border-sky-500 focus:outline-sky-500 transition cursor-pointer"
                defaultValue={activePage}
                onChange={handChangePage}
              />{' '}
              of {totalPage}
            </div>
            <button
              className={activePage === totalPage ? `hover:cursor-not-allowed` : `hover:cursor-pointer`}
              disabled={activePage === totalPage}
              onClick={handNextPage}
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
      {/* date picker modal */}
      <input type="checkbox" id="date-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box w-modal max-w-full bg-gray-100 overflow-auto">
          <div className="modal-action">
            <label htmlFor="date-modal" className="btn btn-sm btn-circle absolute right-2 top-2">
              ✕
            </label>
          </div>
          <div className="flex flex-col items-center gap-3 pt-5 w-full">
            {/* date */}
            <DateRangePicker
              className="rounded-lg overflow-hidden"
              onChange={(item) => setSelectedDates([item.selection])}
              showSelectionPreview={true}
              ranges={selectedDates}
              direction="horizontal"
            />
            <div className="flex gap-3 justify-end modal-action w-full px-5">
              <label htmlFor="date-modal" onClick={resetDate} className="btn btn-warning btn-md">
                Reset
              </label>
              <label
                htmlFor="date-modal"
                onClick={() => {
                  document.getElementById('inputPage').value = 1;
                  setActivePage(1);
                  getReport(null, null, keyword, 1);
                }}
                className="btn btn-primary btn-md"
              >
                Apply
              </label>
            </div>
          </div>
        </div>
      </div>
      {/* detail statistic */}
      <input type="checkbox" id="detail-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box w-max max-w-full bg-gray-100 overflow-auto">
          <div className="modal-action">
            <label htmlFor="detail-modal" className="btn btn-sm btn-circle absolute right-2 top-2">
              ✕
            </label>
          </div>
          <div className="flex flex-col items-center gap-3 w-full">
            {/* data */}
            <div className="stats shadow w-full overflow-x-hidden">
              <div className="stat">
                <div className="stat-title text-xs">Capital</div>
                <div className="stat-value text-xl">Rp. {statistic ? statistic.capital.toLocaleString('id') : 0}</div>
              </div>
              <div className="stat">
                <div className="stat-title text-xs">Profit</div>
                <div className="stat-value text-xl text-primary">Rp. {statistic ? statistic.profit.toLocaleString('id') : 0}</div>
              </div>
            </div>
            <div className="flex gap-3 w-full justify-between">
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-title">Revenue</div>
                  <div className="stat-value">Rp. {statistic ? statistic.revenue.toLocaleString('id') : 0}</div>
                </div>
              </div>
              <div className="stats shadow bg-pink-400 text-primary-content">
                <div className="stat">
                  <div className="stat-title">Sales</div>
                  <div className="stat-value">{statistic ? statistic.sales : 0}</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full gap-3">
              <div className="flex flex-row items-center gap-2 mt-4 pl-2">
                <span className="font-semibold text-lg">Top 3 Most Sold</span>
                <FiAward size={24} className="text-yellow-500" />
              </div>
              <ul className="bg-white py-2 px-2 rounded-2xl shadow">
                {mostSold &&
                  mostSold.map((item, i) => {
                    return (
                      <li key={item.id} className={`py-3 ${i === 2 ? null : 'border-b border-gray-200'} flex justify-between px-2 gap-1`}>
                        <span>{item.name}</span>
                        <span className="font-bold text-lg text-pink-400 w-20 text-right">{item.total_sales} sales</span>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardReport;
