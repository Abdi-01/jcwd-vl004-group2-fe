import {
  FaArrowLeft,
  FaArrowRight,
  FaSearch,
  FaArrowDown,
  FaArrowUp,
} from "react-icons/fa";
import { IoAddOutline } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import CategoryList from "../components/CategoryList";
import { API_URL } from "../assets/constants";
import { toast } from "react-toastify";
import { debounce } from "throttle-debounce";
import { useCallback } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const adminToken = localStorage.getItem("adminToken");
  const [limit, setLimit] = useState(4);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt,DESC");

  const sortSales = () => {
    if (sort !== "total_sales,DESC" && sort !== "total_sales,ASC") {
      setSort("total_sales,ASC");
    } else if (sort !== "total_sales,DESC" && sort !== "") {
      setSort("total_sales,DESC");
    } else {
      setSort("createdAt,DESC");
    }
  };

  const sortHandler = () => {
    if (sort !== "stock_in_unit,DESC" && sort !== "stock_in_unit,ASC") {
      setSort("stock_in_unit,ASC");
    } else if (sort !== "stock_in_unit,DESC" && sort !== "") {
      setSort("stock_in_unit,DESC");
    } else {
      setSort("createdAt,DESC");
    }
  };

  const sortPriceSellHandler = () => {
    if (sort !== "price_sell,DESC" && sort !== "price_sell,ASC") {
      setSort("price_sell,ASC");
    } else if (sort !== "price_sell,DESC" && sort !== "") {
      setSort("price_sell,DESC");
    } else {
      setSort("createdAt,DESC");
    }
  };

  const sortPriceBuyHandler = () => {
    if (sort !== "price_buy,DESC" && sort !== "price_buy,ASC") {
      setSort("price_buy,ASC");
    } else if (sort !== "price_buy,DESC" && sort !== "") {
      setSort("price_buy,DESC");
    } else {
      setSort("createdAt,DESC");
    }
  };

  const sortStockHandler = () => {
    if (sort !== "stock,DESC" && sort !== "stock,ASC") {
      setSort("stock,ASC");
    } else if (sort !== "stock,DESC" && sort !== "") {
      setSort("stock,DESC");
    } else {
      setSort("createdAt,DESC");
    }
  };

  const sortVolumeHandler = () => {
    if (sort !== "volume,DESC" && sort !== "volume,ASC") {
      setSort("volume,ASC");
    } else if (sort !== "volume,DESC" && sort !== "") {
      setSort("volume,DESC");
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

  const debouncedSearch = useDebounce(search, 1000);
  const debouncedCategory = useDebounce(currentCategory, 0);

  const loadingFalse = () => {
    setLoading(false);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productList = await axios.post(
        `${API_URL}/product/query?search=${debouncedSearch}`,
        {
          offset: page * limit - limit,
          category: debouncedCategory,
          sort,
          limit,
          fromDashboardAdmin: true,
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      const categoryList = await axios.get(`${API_URL}/category/all`);
      setCategories(categoryList.data);
      // nested objects
      setProducts(productList.data.products);
      setMaxPage(Math.ceil(productList.data.length / limit));
      // i need to use a function to use setTimeout
      setTimeout(loadingFalse, 1000);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  console.log(sort);

  useEffect(() => {
    fetchProducts();
    // dependency uses state outside useEffect otherwise infinite loop will occur
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [debouncedSearch, debouncedCategory, sort, page]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, debouncedCategory, sort]);

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

  const renderProducts = () => {
    const beginningIndex = (page - 1) * limit;
    return products.map((product, i) => {
      return (
        <tr className="text-sm border-b border-gray-200" key={product.id}>
          <td className="justify-center items-center text-center p-4">
            {beginningIndex + i + 1}
          </td>
          <td className="justify-center items-center text-center p-4">
            <img
              src={`${API_URL}/${product.image}`}
              // m-auto makes img fit its container
              className="w-40 aspect-[3/2] rounded-lg border object-cover border-gray-200 m-auto"
            />
          </td>
          <td className="justify-center items-center text-left p-4">
            {product.name}
          </td>
          <td className="justify-center items-center text-left p-4">
            Rp. {product.price_buy?.toLocaleString("id")}
          </td>
          <td className="justify-center items-center text-left p-4">
            Rp. {product?.price_sell.toLocaleString("id")}
          </td>
          <td className="justify-center items-center text-left p-4">
            {product.volume?.toLocaleString("id")}
          </td>
          <td className="justify-center items-center text-left p-4">
            {product.stock?.toLocaleString("id")}
          </td>
          <td className="justify-center items-center text-left p-4">
            {product.stock_in_unit?.toLocaleString("id")}
          </td>
          <td className="justify-center items-center text-center p-4">
            {product.unit}
          </td>
          <td className="justify-center items-center text-center p-4">
            {product.appearance}
          </td>
          <td className="justify-center items-center text-left p-4">
            {product.category?.name}
          </td>
          <td className="justify-center items-center text-left p-4">
            {product.total_sales}
          </td>
          <td className="justify-center items-center text-center p-4">
            <button
              type="button"
              className="py-2.5 px-6 text-white bg-primary hover:bg-blue-400 transition rounded-xl items-center mr-3"
              onClick={() => handleEditClick(product.id)}
            >
              Edit
            </button>
            <button
              type="button"
              className="py-2.5 px-6 text-white bg-red-500 hover:bg-red-400 rounded-xl items-center"
              onClick={() => handleDeleteClick(product.id)}
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });
  };

  const handleEditClick = (id) => {
    navigate(`editproduct/${id}`);
  };

  const handleAddProduct = async (event, value) => {
    navigate(`addproduct`);
  };

  const handleDeleteClick = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/product/delete/${id}`);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          fetchProducts();
        } catch (error) {
          console.log(error);
        }
      }
      fetchProducts();
      setSearch("");
    });
  };

  return (
    <div className="h-full min-w-full w-max bg-gray-100">
      {/* Search Bar */}
      <div className="h-16 bg-white shadow-sm pl-80 pr-8 fixed z-[12] w-10 top-0 left-0 flex items-center">
        <div className="flex justify-center items-center relative">
          <FaSearch className="absolute left-2 text-gray-400 bg-gray-100 active:scale-95 transition" />
          <input
            type="text"
            value={search}
            id="myInput"
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
            className="search block w-72 shadow border-none rounded-3x1 focus:outline-none py-2 bg-gray-100 text-base text-gray-600 pl-11 pr-7"
          />
          <AiOutlineClose
            onClick={() => {
              setSearch("");
            }}
            className="hover:brightness-110 cursor-pointer absolute right-2"
          />
        </div>
      </div>
      <div className="flex items-center justify-between py-7 px-10">
        <div>
          <h1 className="text-3xl text-gray-700 font-bold">Products</h1>
        </div>
        <div className="flex justify-between items-center space-x-4">
          <div>
            <select
              name=""
              id=""
              onChange={(e) => setCurrentCategory(e.target.value)}
              className="py-2.5 px-6 text-white bg-primary hover:bg-blue-400 cursor-pointer transition rounded-xl "
            >
              <option value="">Sort Category</option>
              {categories.map((value) => (
                <CategoryList key={value.id} category={value} />
              ))}
            </select>
          </div>
          <div>
            <select
              name=""
              id=""
              onChange={(e) => setSort(e.target.value)}
              className="py-2.5 px-6 text-white bg-primary hover:bg-blue-400 cursor-pointer transition rounded-xl"
            >
              <option value="createdAt,DESC">Sort by Price</option>
              <option value="price_sell,ASC">Lowest Price</option>
              <option value="price_sell,DESC">Highest Price</option>
            </select>
          </div>
          <button
            className="flex justify-center items-center py-2.5 px-6 text-white bg-green-500 hover:bg-green-400 transition rounded-xl"
            onClick={handleAddProduct}
          >
            <IoAddOutline size={16} className="fill-white mr-1" /> Add Product
          </button>
        </div>
      </div>
      {loading ? (
        <div className="px-5">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="bg-white border-b py-4 px-4 text-center border-gray-200 shadow-sm">
                  No
                </th>
                <th className="bg-white border-b py-4 px-4 text-center border-gray-200 shadow-sm">
                  Image
                </th>
                <th className="bg-white border-b py-4 px-4 text-center border-gray-200">
                  Name
                </th>
                <th className="bg-white border-b py-4 px-4 text-center border-gray-200">
                  Price Buy
                </th>
                <th className="bg-white border-b py-4 px-4 text-center border-gray-200">
                  Price Sell
                </th>
                <th className="bg-white border-b py-4 px-4 text-center border-gray-200">
                  Volume
                </th>
                <th className="bg-white border-b py-4 px-4 text-center border-gray-200">
                  Stock
                </th>
                <th className="bg-white border-b py-4 px-4 text-center border-gray-200">
                  Stock in Unit
                </th>
                <th className="bg-white border-b py-4 px-4 text-center border-gray-200">
                  Unit
                </th>
                <th className="bg-white border-b py-4 px-4 text-center border-gray-200">
                  Appearance
                </th>
                <th className="bg-white border-b py-4 px-4 text-center border-gray-200">
                  Category
                </th>
                <th className="bg-white border-b py-4 px-4 text-center border-gray-200">
                  Sales
                </th>
                <th className="bg-white border-b py-4 px-4 text-center border-gray-200">
                  Actions
                </th>
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
              <tr>
                <th className="bg-white border-b py-4 px-4 text-center border-gray-200 shadow-sm">
                  No
                </th>
                <th className="bg-white border-b py-4 px-4 text-center border-gray-200 shadow-sm">
                  Image
                </th>
                <th className="bg-white border-b py-4 px-4 text-left border-gray-200 shadow-sm">
                  Name
                </th>
                {sort === "price_buy,DESC" ? (
                  <th
                    className="bg-white justify-center items-center py-4 px-4 text-left cursor-pointer border-b border-gray-200 hover:bg-slate-100 hover:rounded-lg"
                    onClick={sortPriceBuyHandler}
                  >
                    <div className="flex">
                      Price Buy
                      <FaArrowDown className="ml-1 fill-red-500" />
                    </div>
                  </th>
                ) : sort === "price_buy,ASC" ? (
                  <th
                    className="bg-white justify-center items-center py-4 px-4 text-left cursor-pointer border-b border-gray-200 hover:bg-slate-100 hover:rounded-lg"
                    onClick={sortPriceBuyHandler}
                  >
                    <div className="flex">
                      Price Buy
                      <FaArrowUp className="ml-1 fill-primary" />
                    </div>
                  </th>
                ) : (
                  <th
                    className="bg-white py-4 px-4 text-left cursor-pointer hover:bg-slate-100 border-b border-gray-200 hover:rounded-lg"
                    onClick={sortPriceBuyHandler}
                  >
                    Price Buy
                  </th>
                )}
                {sort === "price_sell,DESC" ? (
                  <th
                    className="bg-white justify-center items-center py-4 px-4 text-left cursor-pointer border-b border-gray-200 hover:bg-slate-100 hover:rounded-lg"
                    onClick={sortPriceSellHandler}
                  >
                    <div className="flex">
                      Price Sell
                      <FaArrowDown className="ml-1 fill-red-500" />
                    </div>
                  </th>
                ) : sort === "price_sell,ASC" ? (
                  <th
                    className="bg-white flex justify-center items-center py-4 px-4 text-left cursor-pointer border-b border-gray-200 hover:bg-slate-100 hover:rounded-lg"
                    onClick={sortPriceSellHandler}
                  >
                    <div className="flex">
                      Price Sell
                      <FaArrowUp className="ml-1 fill-primary" />
                    </div>
                  </th>
                ) : (
                  <th
                    className="bg-white py-4 px-4 text-left cursor-pointer hover:bg-slate-100 border-b border-gray-200 hover:rounded-lg"
                    onClick={sortPriceSellHandler}
                  >
                    Price Sell
                  </th>
                )}
                {sort === "volume,DESC" ? (
                  <>
                    <th
                      className="bg-white justify-center items-center py-4 px-4 text-left cursor-pointer border-b border-gray-200 hover:bg-slate-100 hover:rounded-lg"
                      onClick={sortVolumeHandler}
                    >
                      <div className="flex">
                        Volume
                        <FaArrowDown className="ml-1 fill-red-500" />
                      </div>
                    </th>
                  </>
                ) : sort === "volume,ASC" ? (
                  <>
                    <th
                      className="bg-white justify-center items-center py-4 px-4 text-left cursor-pointer border-b border-gray-200 hover:bg-slate-100 hover:rounded-lg"
                      onClick={sortVolumeHandler}
                    >
                      <div className="flex">
                        Volume
                        <FaArrowUp className="ml-1 fill-primary" />
                      </div>
                    </th>
                  </>
                ) : (
                  <th
                    className="bg-white py-4 px-4 text-left cursor-pointer hover:bg-slate-100 border-b border-gray-200 hover:rounded-lg"
                    onClick={sortVolumeHandler}
                  >
                    Volume
                  </th>
                )}
                {sort === "stock,DESC" ? (
                  <>
                    <th
                      className="bg-white justify-center items-center py-4 px-4 text-left cursor-pointer border-b border-gray-200 hover:bg-slate-100 hover:rounded-lg"
                      onClick={sortStockHandler}
                    >
                      <div className="flex">
                        Stock
                        <FaArrowDown className="ml-1 fill-red-500" />
                      </div>
                    </th>
                  </>
                ) : sort === "stock,ASC" ? (
                  <>
                    <th
                      className="bg-white justify-center items-center py-4 px-4 text-left cursor-pointer border-b border-gray-200 hover:bg-slate-100 hover:rounded-lg"
                      onClick={sortStockHandler}
                    >
                      <div className="flex">
                        Stock
                        <FaArrowUp className="ml-1 fill-primary" />
                      </div>
                    </th>
                  </>
                ) : (
                  <th
                    className="bg-white py-4 px-4 text-left cursor-pointer hover:bg-slate-100 border-b border-gray-200 hover:rounded-lg"
                    onClick={sortStockHandler}
                  >
                    Stock
                  </th>
                )}
                {sort === "stock_in_unit,DESC" ? (
                  <>
                    <th
                      className="bg-white justify-center items-center py-4 px-4 text-left cursor-pointer border-b border-gray-200 hover:bg-slate-100 hover:rounded-lg"
                      onClick={sortHandler}
                    >
                      <div className="flex">
                        Stock in Unit
                        <FaArrowDown className="ml-1 fill-red-500" />
                      </div>
                    </th>
                  </>
                ) : sort === "stock_in_unit,ASC" ? (
                  <>
                    <th
                      className="bg-white justify-center items-center py-4 px-4 text-left cursor-pointer border-b border-gray-200 hover:bg-slate-100 hover:rounded-lg"
                      onClick={sortHandler}
                    >
                      <div className="flex">
                        Stock in Unit
                        <FaArrowUp className="ml-1 fill-primary" />
                      </div>
                    </th>
                  </>
                ) : (
                  <th
                    className="bg-white py-4 px-4 text-left cursor-pointer hover:bg-slate-100 border-b border-gray-200 hover:rounded-lg"
                    onClick={sortHandler}
                  >
                    Stock in Unit
                  </th>
                )}
                <th className="bg-white py-4 px-4 text-center border-b border-gray-200">
                  Unit
                </th>
                <th className="bg-white border-b py-4 px-4 text-center border-gray-200">
                  Appearance
                </th>
                <th className="bg-white border-b py-4 px-4 text-left border-gray-200">
                  Category
                </th>
                {sort === "total_sales,DESC" ? (
                  <>
                    <th
                      className="bg-white justify-center items-center py-4 px-4 text-left cursor-pointer border-b border-gray-200 hover:bg-slate-100 hover:rounded-lg"
                      onClick={sortSales}
                    >
                      <div className="flex">
                        Sales
                        <FaArrowDown className="ml-1 fill-red-500" />
                      </div>
                    </th>
                  </>
                ) : sort === "total_sales,ASC" ? (
                  <>
                    <th
                      className="bg-white justify-center items-center py-4 px-4 text-left cursor-pointer border-b border-gray-200 hover:bg-slate-100 hover:rounded-lg"
                      onClick={sortSales}
                    >
                      <div className="flex">
                        Sales
                        <FaArrowUp className="ml-1 fill-primary" />
                      </div>
                    </th>
                  </>
                ) : (
                  <th
                    className="bg-white py-4 px-4 text-left cursor-pointer hover:bg-slate-100 border-b border-gray-200 hover:rounded-lg"
                    onClick={sortSales}
                  >
                    Sales
                  </th>
                )}
                <th className="bg-white border-b py-4 px-4 text-center border-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {maxPage === 0 ? (
                <tr className="text-sm font-medium text-gray-700 border-b border-gray-200">
                  <th className="py-4 px-4 text-center"></th>
                  <th className="py-4 px-4 text-center"></th>
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
                        <span class="font-medium"> Product Not Found! </span>
                      </button>
                    </div>
                  </td>
                  <th className="py-4 px-4 text-center"></th>
                  <th className="py-4 px-4 text-center"></th>
                  <th className="py-4 px-4 text-center"></th>
                  <th className="py-4 px-4 text-center"></th>
                  <th className="py-4 px-4 text-center"></th>
                  <th className="py-4 px-4 text-center"></th>
                </tr>
              ) : (
                <>{renderProducts()}</>
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
