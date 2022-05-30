import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation, useParams } from 'react-router-dom';
import Axios from 'axios';
import { API_URL } from '../assets/constants';

import ProductCardAll from '../components/ProductCardAll';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  AiOutlineUnorderedList,
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineClose,
  AiOutlineInfoCircle,
  AiOutlineLoading3Quarters,
} from 'react-icons/ai';
import { BsFillGridFill, BsChevronRight } from 'react-icons/bs';
import { toast } from 'react-toastify';
import AllProductsSidebar from '../components/AllProductsSidebar';

const AllProducts = () => {
  const navigate = useNavigate();
  const { val } = useParams();
  const { search } = useLocation();
  const [searchParams] = useSearchParams();
  const [view, setView] = useState('list');
  const [productsList, setProductsList] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categoryList, setCategoryList] = useState([]);
  const [appearancesList, setAppearancesList] = useState([]);
  const [currentAppearance, setCurrentAppearance] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [priceRange, setPriceRange] = useState([]);
  const [rangeError, setRangeError] = useState('');
  const [productPerPage, setProductPerPage] = useState(12);
  const [maxPage, setMaxPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('');
  const [itemLoading, setItemLoading] = useState(false);

  useEffect(() => {
    const getAppearences = async () => {
      try {
        const appearance = await Axios.get(`${API_URL}/product/appearance`);
        setAppearancesList(appearance.data);
      } catch (err) {
        toast.error('Unable to get appearance filter', {
          position: 'bottom-left',
          theme: 'colored',
        });
      }
    };
    const getCategories = async () => {
      try {
        const categories = await Axios.get(`${API_URL}/category/all`);
        setCategoryList(categories.data);
      } catch (err) {
        toast.error('Unable to set categories filter', {
          position: 'bottom-left',
          theme: 'colored',
        });
      }
    };
    getAppearences();
    getCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    const getProductQuery = async () => {
      try {
        const query = {
          limit: productPerPage,
          category: val,
          fromAllProducts: true,
        };

        if (searchParams.get('keyword')) {
          query.keyword = searchParams.get('keyword');
        }

        if (currentAppearance.length) {
          query.appearance = currentAppearance;
        }

        if (sort) {
          query.sort = sort;
        }

        if (productPerPage) {
          query.limit = productPerPage;
        }

        if (currentPage) {
          query.offset = productPerPage * currentPage - productPerPage;
        } else if (!currentPage || currentPage < 1) {
          return;
        }

        if (priceRange[0] && priceRange[1]) {
          query.between = priceRange;
        } else if (priceRange[0]) {
          query.gte = priceRange[0];
        } else if (priceRange[1]) {
          query.lte = priceRange[1];
        }

        setItemLoading(true);

        const response = await Axios.post(`${API_URL}/product/query`, query);

        setProductsList(response.data.products);
        setTotalProducts(response.data.length);
        setMaxPage(Math.ceil(response.data.length / productPerPage) || 1);
        setItemLoading(false);

        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        setItemLoading(false);

        toast.error('Unable to fetch products', {
          position: 'bottom-left',
          theme: 'colored',
        });
      }
    };
    getProductQuery();
  }, [val, search, productPerPage, currentPage, currentAppearance, sort, priceRange]);

  const renderProducts = () => {
    return productsList.map((product) => <ProductCardAll key={product.id} product={product} view={view} />);
  };

  const renderCategories = () => {
    return categoryList.map((category) => (
      <div
        key={category.id}
        onClick={() => {
          if (val === category.name) {
            navigate('/products/all');

            if (searchParams.get('keyword')) {
              navigate(`/products/all${search}`);
            }
          } else {
            navigate(`/products/${category.name}`);

            if (searchParams.get('keyword')) {
              navigate(`/products/${category.name}${search}`);
            }
          }
          setCurrentPage(1);
        }}
        className={`w-full py-1 pl-2 rounded-md hover:pl-4 hover:bg-slate-100 transition-all cursor-pointer group ${
          val === category.name ? 'pl-4 bg-slate-100' : ''
        }`}
      >
        <span
          className={`text-md font-semibold  group-hover:text-sky-400 transition ${
            val === category.name ? 'text-sky-500' : 'text-slate-700'
          }`}
        >
          {category.name}
        </span>
      </div>
    ));
  };

  const renderAppearences = () => {
    return appearancesList.map((data) => (
      <div key={data.appearance} className="w-full pl-2 flex items-center gap-2">
        <input
          type="checkbox"
          id={data.appearance}
          checked={currentAppearance.includes(data.appearance)}
          onChange={(e) => {
            if (e.target.checked) {
              setCurrentAppearance([...currentAppearance, data.appearance]);
            } else {
              setCurrentAppearance(currentAppearance.filter((appearance) => appearance !== data.appearance));
            }
            setCurrentPage(1);
          }}
          className="h-4 w-4 rounded-lg accent-sky-500 cursor-pointer"
        />
        <label
          htmlFor={data.appearance}
          className={`text-md font-semibold ${
            currentAppearance === data.appearance ? 'text-sky-400 brightness-110' : 'text-slate-700'
          }  hover:text-sky-400 transition cursor-pointer`}
        >
          {data.appearance}
        </label>
      </div>
    ));
  };

  return (
    <>
      <Header />
      <div className="lg:container mx-auto">
        <div className="flex h-max w-full">
          <div className="hidden lg:flex w-1/5 h-max flex-col items-center pt-2">
            <div className="w-4/5 py-2 border-b border-slate-400 flex items-center justify-between">
              <span className="font-bold text-lg w-max bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">
                Categories
              </span>
              <div
                onClick={() => {
                  setCurrentPage(1);
                  if (searchParams.get('keyword')) {
                    navigate(`/products/all${search}`);
                  } else {
                    navigate(`/products/all`);
                  }
                }}
                className={`px-2 rounded-full flex gap-1 items-center bg-rose-100 text-sm text-red-400 hover:brightness-105 transition cursor-pointer ${
                  val !== 'all' ? 'opacity-100' : 'opacity-0 invisible'
                }`}
              >
                <AiOutlineClose />
                <span>Reset</span>
              </div>
            </div>
            <div className="w-4/5 py-2 px-2 flex flex-col gap-1 pl-2 border-b border-slate-200 mb-2">{renderCategories()}</div>
            <div className="w-4/5 py-2 border-b border-slate-400 flex items-center justify-between">
              <span className="font-bold text-lg w-max bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent cursor-pointer">
                Price
              </span>
              <div
                onClick={() => {
                  setMinPrice('');
                  setMaxPrice('');
                  setPriceRange([]);
                  setCurrentPage(1);
                  if (rangeError) {
                    setRangeError('');
                  }
                }}
                className={`px-2 rounded-full flex gap-1 items-center bg-rose-100 text-sm text-red-400 hover:brightness-105 transition cursor-pointer ${
                  minPrice || maxPrice || rangeError ? 'opacity-100' : 'opacity-0 invisible'
                }`}
              >
                <AiOutlineClose />
                <span>Clear</span>
              </div>
            </div>
            <div className="w-4/5 py-1 flex flex-col gap-1 items-center">
              <div className="w-full p-1 flex flex-col">
                <label className="mb-1 text-sm font-bold text-slate-400">From:</label>
                <input
                  value={minPrice}
                  min={0}
                  onChange={(e) => setMinPrice(parseInt(e.target.value))}
                  type="number"
                  className="p-1 pl-3 border rounded-lg focus:outline-sky-500 cursor-pointer"
                />
              </div>
              <div className="w-full p-1 flex flex-col">
                <label className="mb-1 text-sm font-bold text-slate-400">To:</label>
                <input
                  value={maxPrice}
                  min={0}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  type="number"
                  className="p-1 pl-3 border rounded-lg focus:outline-sky-500 cursor-pointer"
                />
              </div>
              {rangeError && (
                <div className="w-full flex justify-center">
                  <span className="text-xs text-red-400">{rangeError}</span>
                </div>
              )}
              <div className="w-full py-3 px-1 flex items-center border-b border-slate-200">
                <button
                  onClick={() => {
                    setRangeError('');

                    const range = [null, null];

                    if (minPrice && maxPrice) {
                      if (minPrice > maxPrice) {
                        return setRangeError('Please enter a valid range');
                      } else {
                        range[0] = minPrice;
                        range[1] = maxPrice;
                      }
                    } else if (minPrice) {
                      range[0] = minPrice;
                    } else if (maxPrice) {
                      range[1] = maxPrice;
                    } else if (!minPrice && !maxPrice) {
                      return setRangeError('Please enter a range');
                    }

                    setPriceRange(range);
                    setCurrentPage(1);
                  }}
                  className="h-10 w-full rounded-lg bg-sky-400 text-white font-semibold cursor-pointer hover:brightness-110 transition"
                >
                  Apply
                </button>
              </div>
            </div>
            <div className="w-4/5 py-2 border-b border-slate-400 flex items-center justify-between">
              <span className="font-bold text-lg w-max bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">
                Appearance
              </span>
              <div
                onClick={() => {
                  setCurrentAppearance('');
                  setCurrentPage(1);
                }}
                className={`px-2 rounded-full flex gap-1 items-center bg-rose-100 text-sm text-red-400 hover:brightness-105 transition cursor-pointer ${
                  currentAppearance.length ? 'opacity-100' : 'opacity-0 invisible'
                }`}
              >
                <AiOutlineClose />
                <span>Clear</span>
              </div>
            </div>
            <div className="w-4/5 py-2 px-2 flex flex-col gap-2 pl-2 border-b border-slate-200 mb-2">{renderAppearences()}</div>
          </div>
          <div className="w-full lg:w-4/5 px-4 lg:px-2 py-2 flex flex-col">
            <div className="w-full flex items-center gap-2 text-sm py-2">
              <span
                onClick={() => {
                  navigate('/');
                }}
                className="hover:text-sky-500 hover:underline transition-all cursor-pointer"
              >
                Home
              </span>
              <BsChevronRight className="text-xs" />
              <span className="underline underline-offset-1">Shop</span>
              <AllProductsSidebar
                navigate={navigate}
                searchParams={searchParams}
                search={search}
                val={val}
                setCurrentPage={setCurrentPage}
                categoryList={categoryList}
                appearancesList={appearancesList}
                currentAppearance={currentAppearance}
                setCurrentAppearance={setCurrentAppearance}
                setMinPrice={setMinPrice}
                setMaxPrice={setMaxPrice}
                setPriceRange={setPriceRange}
                minPrice={minPrice}
                maxPrice={maxPrice}
                setRangeError={setRangeError}
                rangeError={rangeError}
              />
            </div>
            {searchParams.get('keyword') && productsList.length ? (
              <div className="w-max h-[55px] my-2 pr-6 flex items-center gap-2 shadow-md rounded-lg overflow-hidden">
                <div className="h-full w-2 bg-sky-500" />
                <AiOutlineInfoCircle className="text-slate-600" />
                <span className="font-semibold text-slate-600">
                  Currently showing results for <i>'{searchParams.get('keyword')}'</i>.
                </span>
                <span
                  onClick={() => {
                    setCurrentAppearance([]);
                    setCurrentPage(1);
                    navigate('/products/all');
                  }}
                  className="font-semibold text-sky-600 hover:text-emerald-400 transition cursor-pointer"
                >
                  See All Products?
                </span>
              </div>
            ) : null}
            <div className="w-full p-4 flex items-center border-b-2 border-slate-100">
              <span className="text-3xl font-bold w-max bg-gradient-to-r mr-auto from-sky-500 to-sky-300 bg-clip-text text-transparent">
                {val === 'all' ? 'Products' : val}
              </span>
              <div className="flex items-center justify-center">
                <label htmlFor="showperpage" className="font-semibold text-slate-400 mr-1 cursor-pointer">
                  Show:
                </label>
                <select
                  id="showperpage"
                  onChange={(e) => {
                    setCurrentPage(1);
                    setProductPerPage(parseInt(e.target.value));
                  }}
                  disabled={!currentPage}
                  className="p-1 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-400 transition cursor-pointer"
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={36}>36</option>
                  <option value={totalProducts}>All</option>
                </select>
              </div>
              <div className="flex items-center justify-center mx-2">
                <select
                  onChange={(e) => setSort(e.target.value)}
                  disabled={!currentPage}
                  className="p-1 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-400 font-semibold transition cursor-pointer"
                >
                  <option value={''}>Sort:</option>
                  <optgroup label="Name">
                    <option value="name,asc">A to Z</option>
                    <option value="name,desc">Z to A</option>
                  </optgroup>
                  <optgroup label="Price">
                    <option value="price_sell,asc">Lowest</option>
                    <option value="price_sell,desc">Highest</option>
                  </optgroup>
                </select>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => {
                    setView('list');
                  }}
                  className="w-8 h-8 flex justify-center items-center rounded-l-lg border active:scale-95 transition group"
                >
                  <AiOutlineUnorderedList
                    className={`${view === 'list' ? 'text-sky-500 brightness-110' : 'text-slate-800'} group-hover:text-sky-500 transition`}
                  />
                </button>
                <button
                  onClick={() => {
                    setView('grid');
                  }}
                  className="w-8 h-8 flex justify-center items-center rounded-r-lg border active:scale-95 transition group"
                >
                  <BsFillGridFill
                    className={`${view === 'grid' ? 'text-sky-500 brightness-110' : 'text-slate-800'} group-hover:text-sky-500 transition`}
                  />
                </button>
              </div>
            </div>
            <div
              className={`w-full p-2 flex ${
                view === 'grid' ? 'flex-row justify-center flex-wrap' : 'flex-col gap-3'
              } items-center min-h-[600px] relative`}
            >
              {itemLoading ? (
                <div className="absolute inset-0 m-2 bg-gray-300 bg-opacity-30 backdrop-blur-sm flex justify-center text-3xl gap-2 pt-[25%] ">
                  <AiOutlineLoading3Quarters className="animate-spin text-sky-500" />
                  <span className="font-thin text-gray-600">Loading..</span>
                </div>
              ) : null}
              {productsList.length ? (
                renderProducts()
              ) : (
                <div className="w-full h-[500px] flex flex-col items-center justify-center">
                  <span className="text-3xl font-semibold text-slate-400 mb-10">No results found..</span>
                  {searchParams.get('keyword') && (
                    <span
                      onClick={() => {
                        setCurrentAppearance([]);
                        setCurrentPage(1);
                        navigate('/products/all');
                      }}
                      className="text-lg font-bold text-gray-500 hover:text-sky-500 transition cursor-pointer"
                    >
                      See All Products
                    </span>
                  )}
                </div>
              )}
            </div>
            {productsList.length ? (
              <div className="w-full flex justify-center items-center pt-3 pb-5 gap-2 text-slate-500 font-semibold">
                <button
                  disabled={currentPage === 1 || !currentPage}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className={`h-7 w-7 bg-sky-500 text-white flex items-center justify-center rounded-full font-bold active:scale-95 transition-all disabled:bg-slate-300 disabled:text-slate-400 disabled:active:scale-100`}
                >
                  <AiOutlineLeft />
                </button>
                <input
                  type="number"
                  className="h-7 w-9 rounded-md border text-center text-bold hover:border-sky-500 focus:outline-sky-500 transition cursor-pointer"
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
                  className={`h-7 w-7 bg-sky-500 text-white flex items-center justify-center rounded-full font-bold active:scale-95 transition-all disabled:bg-slate-300 disabled:text-slate-400 disabled:active:scale-100`}
                >
                  <AiOutlineRight />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllProducts;
