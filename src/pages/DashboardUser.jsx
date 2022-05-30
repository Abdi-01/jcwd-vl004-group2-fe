import {
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
  FaArrowDown,
  FaArrowUp,
} from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../assets/constants";
import UserTable from "../components/UserTable";
import { toast } from "react-toastify";
import { debounce } from "throttle-debounce";
import { useCallback } from "react";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [limit, setLimit] = useState(5);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  const [status, setStatus] = useState();
  const [sort, setSort] = useState("createdAt,DESC");

  const sortName = () => {
    if (sort !== "name,DESC" && sort !== "name,ASC") {
      setSort("name,ASC");
    } else if (sort !== "name,DESC" && sort !== "") {
      setSort("name,DESC");
    } else {
      setSort("createdAt,DESC");
    }
  };

  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedSearch = useDebounce(keyword, 1000);

  const loadingFalse = () => {
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const userList = await axios.post(
        `${API_URL}/user/query?keyword=${debouncedSearch}`,
        {
          offset: page * limit - limit,
          active: status,
          sort,
          limit,
        }
      );
      setUsers(userList.data.users);
      setMaxPage(Math.ceil(userList.data.length / limit));
      setTimeout(loadingFalse, 1000);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchUsers();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [debouncedSearch, status, page, sort]);

  const handleChangePage = useCallback(
    debounce(2000, (e) => {
      if (e.target.value <= maxPage && e.target.value > 0) {
        setPage(+e.target.value);
      } else {
        document.getElementById("inputPage").value = +page;
      }
    }),
    // useCallback feature or requires dependency
    [maxPage, page]
  );

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, sort]);

  const renderUsers = () => {
    const beginningIndex = (page - 1) * limit;
    return users.map((user, i) => {
      return (
        <UserTable
          key={user.id}
          user={user}
          fetchUsers={fetchUsers}
          setKeyword={setKeyword}
          beginningIndex={beginningIndex + i}
        />
      );
    });
  };

  return (
    <div className="h-full w-full bg-gray-100">
      {/* Search Bar */}
      <div className="h-16 bg-white shadow-sm pl-80 pr-8 fixed z-[12] w-10 top-0 left-0 flex items-center">
        <div className="flex justify-center items-center relative">
          <FaSearch className="absolute left-2 text-gray-400 bg-gray-100 active:scale-95 transition" />
          <input
            type="text"
            value={keyword}
            id="myInput"
            placeholder="Search..."
            onChange={(e) => setKeyword(e.target.value)}
            className="search block w-72 shadow border-none rounded-3x1 focus:outline-none py-2 bg-gray-100 text-base text-gray-600 pl-11 pr-7"
          />

          <AiOutlineClose
            onClick={() => {
              setKeyword("");
            }}
            className="hover:brightness-110 cursor-pointer absolute right-2"
          />
        </div>
      </div>
      <div className="flex items-center justify-between py-7 px-10">
        <h1 className="text-3xl text-gray-700 font-bold">User</h1>
        <div className="flex justify-between items-center space-x-4">
          <select
            name=""
            id=""
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="py-2.5 px-6 text-white bg-primary cursor-pointer hover:bg-blue-400 transition rounded-xl"
          >
            <option value="">Filter by Status</option>
            {/*sequelize uses "1" and "0" as boolean value */}
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>
      </div>
      {loading ? (
        <div className="px-5">
          <table className="table w-full">
            <thead>
              <tr className="text-sm font-medium text-gray-700 border-b border-gray-200">
                <th className="bg-white py-4 px-4 text-center shadow-sm">No</th>
                <th className="bg-white py-4 px-4 text-center">
                  Profile Picture
                </th>
                <th className="bg-white py-4 px-4 text-left">Name</th>
                <th className="bg-white py-4 px-4 text-left">Email</th>
                <th className="bg-white py-4 px-4 text-center">Phone</th>
                <th className="bg-white py-4 px-4 text-center">Status</th>
                <th className="bg-white py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>
          </table>
          <div class="flex h-screen w-full items-center justify-center">
            <button
              type="button"
              class="flex items-center rounded-lg bg-primary px-4 py-2 text-white"
              disabled
            >
              <svg
                class="mr-3 h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span class="font-medium"> Processing... </span>
            </button>
          </div>
        </div>
      ) : (
        <div className="px-5">
          <table className="table w-full">
            <thead>
              <tr className="text-sm font-medium text-gray-700 border-b border-gray-200">
                <th className="bg-white py-4 px-4 text-center shadow-sm">No</th>
                <th className="bg-white py-4 px-4 text-center">
                  Profile Picture
                </th>
                {sort === "name,DESC" ? (
                  <th
                    className="bg-white justify-center items-center py-4 px-4 text-left cursor-pointer border-b border-gray-200 hover:bg-slate-100 hover:rounded-lg"
                    onClick={sortName}
                  >
                    <div className="flex">
                      Name
                      <FaArrowDown className="ml-1 fill-red-500" />
                    </div>
                  </th>
                ) : sort === "name,ASC" ? (
                  <th
                    className="bg-white justify-center items-center py-4 px-4 text-left cursor-pointer border-b border-gray-200 hover:bg-slate-100 hover:rounded-lg"
                    onClick={sortName}
                  >
                    <div className="flex">
                      Name
                      <FaArrowUp className="ml-1 fill-primary" />
                    </div>
                  </th>
                ) : (
                  <th
                    className="bg-white py-4 px-4 text-left cursor-pointer hover:bg-slate-100 border-b border-gray-200 hover:rounded-lg"
                    onClick={sortName}
                  >
                    Name
                  </th>
                )}
                {/* <th className="bg-white py-4 px-4 text-left">Name</th> */}
                <th className="bg-white py-4 px-4 text-left">Email</th>
                <th className="bg-white py-4 px-4 text-center">Phone</th>
                <th className="bg-white py-4 px-4 text-center">Status</th>
                <th className="bg-white py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {maxPage === 0 ? (
                <tr className="text-sm font-medium text-gray-700 border-b border-gray-200">
                  <th className="py-4 px-4 text-center"></th>
                  <th className="py-4 px-4 text-center"></th>
                  <th className="py-4 px-4 text-center"></th>
                  <th className="py-4 px-4 text-center"></th>
                  <td>
                    <div class="flex h-screen w-full items-center justify-center">
                      <button
                        type="button"
                        class="flex items-center rounded-lg bg-warning px-4 py-2 text-white"
                        disabled
                      >
                        <span class="font-medium"> User Not Found! </span>
                      </button>
                    </div>
                  </td>
                  <th className="py-4 px-4 text-center"></th>
                  <th className="py-4 px-4 text-center"></th>
                  <th className="py-4 px-4 text-center"></th>
                  <th className="py-4 px-4 text-center"></th>
                  <th className="py-4 px-4 text-center"></th>
                  <th className="py-4 px-4 text-center"></th>
                  <th className="py-4 px-4 text-center"></th>
                  <th className="py-4 px-4 text-center"></th>
                </tr>
              ) : (
                <>{renderUsers()}</>
              )}
            </tbody>
          </table>
          <div className="mt-3 flex justify-center items-center gap-4 pt-3">
            <button
              className={
                page === 1 ? `hover:cursor-not-allowed` : `hover:cursor-pointer`
              }
              disabled={page === 1}
              onClick={() => page > 1 && setPage(page - 1)}
            >
              {" "}
              <FaArrowLeft />
            </button>
            <div>
              Page{" "}
              <input
                id="inputPage"
                type="number"
                className="border text-center border-gray-300 rounded-lg bg-white focus:outline-none w-10 hover:border-sky-500 focus:outline-sky-500 transition cursor-pointer"
                defaultValue={page}
                onChange={handleChangePage}
              />{" "}
              of {maxPage}
            </div>
            <button
              className={
                page === maxPage
                  ? `hover:cursor-not-allowed`
                  : `hover:cursor-pointer`
              }
              disabled={page === maxPage}
              onClick={() => page < maxPage && setPage(page + 1)}
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
