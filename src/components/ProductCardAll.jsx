import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Axios from 'axios';
import { API_URL } from '../assets/constants';
import { useNavigate } from 'react-router-dom';

import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineShoppingCart,
  AiFillStar,
  AiFillFire,
  AiOutlineLoading3Quarters,
} from 'react-icons/ai';
import { toast } from 'react-toastify';

const ProductCardAll = ({ view, product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cartLoading, setCartLoading] = useState(false);
  const userGlobal = useSelector((state) => state.user);
  const userToken = localStorage.getItem('userToken');
  const adminToken = localStorage.getItem('adminToken');

  const addToCart = async () => {
    try {
      if (!userToken) {
        navigate('/login');
      } else {
        setCartLoading(true);

        const response = await Axios.post(`${API_URL}/cart/add`, {
          userId: userGlobal.id,
          productId: product.id,
          quantity: product.stock ? product.volume : product.stock_in_unit,
        });

        if (response.data.deleted) {
          setCartLoading(false);

          toast.warning(response.data.message, { theme: 'colored', position: 'top-center' });
        } else if (response.data.conflict) {
          setCartLoading(false);

          toast.warning(response.data.message, { theme: 'colored', position: 'bottom-left' });
        } else {
          if (response.data.cartTotal) {
            dispatch({ type: 'CART_TOTAL', payload: response.data.cartTotal });
          }

          setCartLoading(false);

          toast.success(
            `Added ${product.stock ? product.volume?.toLocaleString('id') : product.stock_in_unit?.toLocaleString('id')}${
              product.unit
            } to your cart!`,
            {
              position: 'bottom-left',
              theme: 'colored',
            }
          );
        }
      }
    } catch (error) {
      setCartLoading(false);

      toast.error('Unable to add this item to your cart!', { theme: 'colored', position: 'bottom-left' });
    }
  };

  const renderStars = (score) => {
    let stars = 0;
    const renderedStars = [];

    if (Number.isInteger(score)) {
      stars = score;
    } else {
      stars = Math.floor(score);
    }

    for (let i = 0; i < stars; i++) {
      renderedStars.push(<AiFillStar key={i} />);
    }

    return renderedStars;
  };

  return (
    <>
      {view === 'grid' ? (
        <div className="w-[232px] h-[360px] m-2 border hover:bg-zinc-100 rounded-md flex flex-col cursor-pointer">
          <div onClick={() => navigate(`/product/${product.id}`)} className="w-full h-2/5 flex justify-center items-center">
            <div className="w-32 h-32 flex justify-center items-center rounded-lg border border-slate-300 overflow-hidden bg-white">
              <img src={`${API_URL}/${product.image}`} className="w-full hover:scale-105 object-contain transition" />
            </div>
          </div>
          <div className="w-full h-3/5 flex flex-col pb-3 px-2">
            <div onClick={() => navigate(`/product/${product.id}`)} className="w-full h-[80%] flex flex-col">
              <span className="text-sm font-light text-slate-400">{product.category.name}</span>
              <div className="w-full flex items-center">
                <span className="text-base text-slate-800 font-semibold hover:text-sky-500 transition line-clamp-2">{product.name}</span>
              </div>
              <div className="w-full flex items-center">
                <span className="text-lg font-bold w-max bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
                  Rp. {product.price_sell?.toLocaleString('id')}/{product.unit}
                </span>
              </div>
              {product.totalReviews ? (
                <div className="flex w-full items-center gap-1 lg:gap-2 text-sm">
                  <div className="flex text-amber-300 py-2">{renderStars(product.avgRating)}</div>
                  <span className="font-semibold text-sky-900">{product.totalReviews} review(s)</span>
                </div>
              ) : null}
              <div className="text-sm flex items-center font-semibold text-slate-800 gap-2">
                {product.stock_in_unit ? (
                  product.stock_in_unit <= 5 * product.volume ? (
                    <>
                      <AiFillFire className="text-orange-500" />
                      <span>
                        {!Math.floor(product.stock_in_unit / product.volume)
                          ? `Last item!`
                          : `${Math.floor(product.stock_in_unit / product.volume)} remaining!`}
                      </span>
                    </>
                  ) : (
                    <>
                      <AiOutlineCheckCircle className="text-sky-400" />
                      <span>Currently in stock!</span>
                    </>
                  )
                ) : (
                  <>
                    <AiOutlineCloseCircle className="text-red-400" />
                    <span>Out of stock</span>
                  </>
                )}
              </div>
            </div>
            <div className="w-full h-[20%] px-3">
              {!adminToken && (
                <button
                  onClick={addToCart}
                  disabled={cartLoading}
                  className="w-full h-full rounded-md mt-auto bg-gradient-to-r from-sky-400 to-sky-600 text-white font-bold hover:brightness-110 cursor-pointer transition active:scale-95 text-sm gap-2 flex justify-center items-center shadow disabled:from-sky-300 disabled:to-sky-500 disabled:active:scale-100"
                >
                  {cartLoading ? (
                    <>
                      <AiOutlineLoading3Quarters className="animate-spin" />
                      Adding item..
                    </>
                  ) : (
                    <>
                      <AiOutlineShoppingCart />
                      <span className="font-semibold">Add to Cart</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex border-b mb-1 border-slate-300 cursor-pointer">
          <div onClick={() => navigate(`/product/${product.id}`)} className="w-[30%] h-full flex justify-center items-center p-4">
            <div className="w-32 h-32 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-white border rounded-lg overflow-hidden flex shadow justify-center items-center cursor-pointer">
              <img src={`${API_URL}/${product.image}`} alt={product.name} className="w-full object-contain hover:scale-110 transition" />
            </div>
          </div>
          <div onClick={() => navigate(`/product/${product.id}`)} className="w-[45%] h-full flex flex-col pt-4">
            <div className="w-full flex flex-col lg:gap-1 mb-2">
              <span className="text-lg lg:text-xl font-semibold text-zinc-800 hover:text-sky-500 transition line-clamp-1">
                {product.name}
              </span>
              <span className="font-semibold text-slate-400">{product.category.name}</span>
              {product.totalReviews ? (
                <div className="flex w-full items-center gap-2">
                  <div className="flex text-sm lg:text-md text-amber-300 py-1">{renderStars(product.avgRating)}</div>
                  <span className="text-sm lg:text-md font-semibold text-sky-900">{product.totalReviews} review(s)</span>
                </div>
              ) : null}
            </div>
            <div className="w-full leading-none line-clamp-3">
              <span className="text-xs">{product.description}</span>
            </div>
          </div>
          <div className="w-[25%] h-full pt-4 pl-4 lg:pl-0 lg:pr-4 flex flex-col items-end">
            <div onClick={() => navigate(`/product/${product.id}`)} className="w-full flex flex-col items-end gap-1 lg:gap-2 mb-3">
              <span className="text-lg md:text-xl lg:text-2xl w-max bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent font-bold">
                Rp. {product.price_sell?.toLocaleString('id')}/{product.unit}
              </span>
              <div className="text-xs sm:text-sm md:text-base lg:text-lg flex items-center font-semibold text-slate-800 gap-2">
                {product.stock_in_unit ? (
                  product.stock_in_unit <= 5 * product.volume ? (
                    <>
                      <AiFillFire className="text-orange-500" />
                      <span>
                        {!Math.floor(product.stock_in_unit / product.volume)
                          ? `Last item!`
                          : `${Math.floor(product.stock_in_unit / product.volume)} remaining!`}
                      </span>
                    </>
                  ) : (
                    <>
                      <AiOutlineCheckCircle className="text-sky-400" />
                      <span>In stock!</span>
                    </>
                  )
                ) : (
                  <>
                    <AiOutlineCloseCircle className="text-red-400" />
                    <span>Out of stock</span>
                  </>
                )}
              </div>
            </div>
            <div className="w-full sm:w-[85%] md:w-[75%] xl:w-[70%] flex">
              {!adminToken && (
                <button
                  onClick={addToCart}
                  disabled={cartLoading}
                  className="w-full py-2 rounded-lg bg-gradient-to-r from-sky-400 to-sky-600 text-white font-bold hover:brightness-110 cursor-pointer transition active:scale-95 text-md gap-2 flex justify-center items-center shadow disabled:from-sky-300 disabled:to-sky-500 disabled:active:scale-100 text-xs md:text-base"
                >
                  {cartLoading ? (
                    <>
                      <AiOutlineLoading3Quarters className="animate-spin" />
                      Adding item..
                    </>
                  ) : (
                    <>
                      <AiOutlineShoppingCart />
                      <span className="font-semibold">Add to Cart</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCardAll;
