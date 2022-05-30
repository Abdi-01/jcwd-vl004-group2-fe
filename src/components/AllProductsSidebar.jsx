import { useState, Fragment, useCallback, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import { AiOutlineClose } from 'react-icons/ai';
import { GoSettings } from 'react-icons/go';

const AllProductsSidebar = ({
  navigate,
  searchParams,
  search,
  val,
  setCurrentPage,
  categoryList,
  appearancesList,
  currentAppearance,
  setCurrentAppearance,
  setMinPrice,
  setMaxPrice,
  setPriceRange,
  minPrice,
  maxPrice,
  setRangeError,
  rangeError,
}) => {
  const [open, setOpen] = useState(false);

  const renderSidebarCategories = () => {
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
          setOpen(false);
        }}
        className={`w-full py-1 text-sm md:text-base rounded-md hover:pl-2 hover:bg-slate-100 transition-all cursor-pointer group ${
          val === category.name ? 'pl-2 bg-slate-100' : ''
        }`}
      >
        <span className={`font-semibold  group-hover:text-sky-400 transition ${val === category.name ? 'text-sky-500' : 'text-slate-700'}`}>
          {category.name}
        </span>
      </div>
    ));
  };

  const renderSidebarAppearances = () => {
    return appearancesList.map((data) => (
      <div key={data.appearance} className="w-full py-1 flex items-center gap-2">
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
          className="h-3 w-3 rounded-lg accent-sky-500 cursor-pointer"
        />
        <label
          htmlFor={data.appearance}
          className={`text-sm md:text-base font-semibold ${
            currentAppearance === data.appearance ? 'text-sky-400 brightness-110' : 'text-slate-700'
          }  hover:text-sky-400 transition cursor-pointer`}
        >
          {data.appearance}
        </label>
      </div>
    ));
  };

  const handleClose = useCallback(() => {
    if (window.innerWidth > 1024) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleClose);

    return () => {
      window.removeEventListener('resize', handleClose);
    };
  }, []);

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
        }}
        className="ml-auto text-lg text-slate-700 hover:text-sky-500 transition cursor-pointer active:scale-95 lg:hidden"
      >
        <GoSettings />
      </button>

      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" onClose={() => setOpen(false)} className="fixed inset-0 z-[300] flex items-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-50"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-50"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-60" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="-translate-x-1/2"
            enterTo="translate-x-0"
            leave="ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-1/2"
          >
            <div className="h-screen w-[38%] sm:w-1/3 z-10 bg-white flex flex-col items-center pt-2">
              <div className="w-4/5 py-1 border-b border-slate-400 flex items-center justify-between">
                <span className="font-bold text-md md:text-base bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">
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
                    setOpen(false);
                  }}
                  className={`px-2 rounded-full flex gap-1 items-center bg-rose-100 text-xs md:text-sm text-red-400 hover:brightness-105 transition cursor-pointer ${
                    val !== 'all' ? 'opacity-100' : 'opacity-0 invisible'
                  }`}
                >
                  <AiOutlineClose />
                  <span>Reset</span>
                </div>
              </div>
              <div className="w-4/5 py-1 px-2 flex flex-col pl-2 border-b border-slate-200 gap-1 mb-1">{renderSidebarCategories()}</div>
              <div className="w-4/5 py-1 border-b border-slate-400 flex items-center justify-between">
                <span className="font-bold text-md md:text-base bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent cursor-pointer">
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
                  className={`px-2 rounded-full flex gap-1 items-center bg-rose-100 text-xs md:text-sm text-red-400 hover:brightness-105 transition cursor-pointer ${
                    minPrice || maxPrice || rangeError ? 'opacity-100' : 'opacity-0 invisible'
                  }`}
                >
                  <AiOutlineClose />
                  <span>Clear</span>
                </div>
              </div>
              <div className="w-4/5 py-1 flex flex-col gap-1 items-center">
                <div className="w-full p-1 flex flex-col">
                  <label className="mb-[2px] text-xs md:text-sm font-bold text-slate-400">From:</label>
                  <input
                    value={minPrice}
                    min={0}
                    onChange={(e) => setMinPrice(parseInt(e.target.value))}
                    type="number"
                    className="p-1 pl-3 border rounded-lg focus:outline-sky-500 cursor-pointer"
                  />
                </div>
                <div className="w-full p-1 flex flex-col">
                  <label className="mb-[2px] text-xs md:text-sm font-bold text-slate-400">To:</label>
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
                      setOpen(false);
                    }}
                    className="h-9 w-full rounded-lg bg-sky-400 text-white font-semibold cursor-pointer hover:brightness-110 transition"
                  >
                    Apply
                  </button>
                </div>
              </div>
              <div className="w-4/5 py-1 border-b border-slate-400 flex items-center justify-between">
                <span className="font-bold text-md md:text-base bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">
                  Appearance
                </span>
                <div
                  onClick={() => {
                    setCurrentAppearance('');
                    setCurrentPage(1);
                    setOpen(false);
                  }}
                  className={`px-2 rounded-full flex gap-1 items-center bg-rose-100 text-xs text-red-400 hover:brightness-105 transition cursor-pointer ${
                    currentAppearance.length ? 'opacity-100' : 'opacity-0 invisible'
                  }`}
                >
                  <AiOutlineClose />
                  <span>Clear</span>
                </div>
              </div>
              <div className="w-4/5 p-2 flex flex-col">{renderSidebarAppearances()}</div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

export default AllProductsSidebar;
