import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { debounce } from 'throttle-debounce';
import { API_URL } from '../assets/constants';
import { Link } from 'react-router-dom';

function CartCard({ item, setCart, page, setPage, handCheck, isLoading, setIsLoading, checkout }) {
  const dispatch = useDispatch();
  const userToken = localStorage.getItem('userToken');
  const [quantity, setQuantity] = useState(item.quantity);

  const changeQty = useCallback(
    debounce(1000, async (quantity) => {
      try {
        setIsLoading(true);

        // check is number? / quantity < 1
        if (isNaN(quantity)) {
          setQuantity(item.product.volume);
          setIsLoading(false);
          return;
        }

        // Compare quantity with stock
        if (item.product.stock_in_unit < quantity) {
          setQuantity(item.product.stock_in_unit);
          setIsLoading(false);
          return;
        } else if (quantity < 1) {
          setQuantity(1);
          setIsLoading(false);
          return;
        }

        // Update quantity cart
        const response = await axios.patch(
          `${API_URL}/cart/update`,
          {
            id: item.id,
            quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
            params: {
              page,
            },
          }
        );

        // Get new cart data
        setCart(response.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error(error.response.data.message);
      }
    }),
    []
  );

  useEffect(() => {
    if (!checkout) {
      changeQty(quantity);
    }
  }, [quantity]);

  const deleteItem = async () => {
    try {
      setIsLoading(true);
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      });

      if (result.isConfirmed) {
        const response = await axios.delete(`${API_URL}/cart/delete/${item.id}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          params: {
            page,
          },
        });

        dispatch({
          type: 'CART_TOTAL',
          payload: response.data.cartTotal,
        });
        setIsLoading(false);
        Swal.fire(response.data.message);
        setCart(response.data);
        if (response.data?.active_page > response.data?.total_page) {
          setPage(response.data?.total_page);
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div
      className={`grid grid-cols-12 grid-flow-col ${
        checkout ? 'items-center border-b border-b-gray-300 py-5' : 'border-gray-300 border rounded-md py-2'
      }   px-3`}
    >
      <div className={`${checkout ? 'col-span-10' : 'col-span-7'}`}>
        {!checkout && <input type="checkbox" onChange={handCheck} checked={item.isChecked} className="checkbox" />}
        <div className="flex p-1">
          <img
            src={`${API_URL}/${item.product.image}`}
            className={`${checkout ? 'h-28 w-28' : 'h-36 w-36'} object-cover`}
            alt="cart product"
          />
          <div className="flex flex-col justify-center pl-4">
            <Link to={`/product/${item.product.id}`}>
              <span className="font-bold text-lg pb-2 hover:text-primary">{item.product.name}</span>
            </Link>
            <div>
              <span>price : </span>
              <span className="text-red-400 font-bold">Rp. {item.product.price_sell.toLocaleString('id')}</span>
              <span> / {item.product.unit}</span>
            </div>
            <div>
              <span>appearence : </span>
              <span className="text-gray-500">{item.product.appearance}</span>
            </div>
          </div>
        </div>
      </div>
      {checkout ? (
        <div className="col-span-2 flex flex-col gap-4 items-center">
          <div>
            <span className="font-bold text-lg">Total : </span>
            <span className="text-red-400 font-bold text-lg">Rp. {item.price.toLocaleString('id')}</span>
          </div>
          <div>
            <span>Qty : </span>
            <span className="text-gray-500">
              {item.quantity} {item.product.unit}
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="col-span-3 flex flex-col justify-center items-center">
            <span className="italic pb-3 text-sm">unit : {item.product.unit}</span>
            <div className="flex justify-center items-center">
              <button
                className={`border border-primary w-10 h-10 flex justify-center items-center  ${
                  item.quantity <= 1 ? 'text-gray-500 bg-gray-200 hover:cursor-not-allowed' : 'text-primary bg-sky-50 hover:bg-sky-100'
                }`}
                onClick={() => (quantity >= 1 ? setQuantity(quantity - item.product.volume) : null)}
                disabled={item.quantity <= 1 || isLoading}
              >
                <FiMinus />
              </button>
              <input
                value={quantity}
                type="text"
                className="w-20 h-10 m-0 focus:outline-none border-y border-primary text-center"
                onChange={(e) => (!e.target.value ? setQuantity(null) : setQuantity(parseInt(e.target.value)))}
                disabled={isLoading}
              />
              <button
                className={`border border-primary w-10 h-10 flex justify-center items-center  ${
                  item.quantity === item.product.stock_in_unit
                    ? 'text-gray-500 bg-gray-200 hover:cursor-not-allowed'
                    : 'text-primary bg-sky-50 hover:bg-sky-100'
                }`}
                onClick={() => setQuantity(quantity === 1 ? item.product.volume : quantity + item.product.volume)}
                disabled={item.quantity === item.product.stock_in_unit || isLoading}
              >
                <FiPlus />
              </button>
            </div>
          </div>
          <div className="col-span-2 flex justify-around items-center">
            <div className="flex flex-col justify-center flex-wrap items-center">
              <span>Total Price</span>
              <span className="text-red-400 font-bold text-lg">Rp. {(item.quantity * item.product.price_sell).toLocaleString('id')}</span>
            </div>
            <FiTrash2 size={24} className="hover:cursor-pointer" onClick={deleteItem} disabled={isLoading} />
          </div>
        </>
      )}
    </div>
  );
}

export default CartCard;
