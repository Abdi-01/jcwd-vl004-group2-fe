import axios from 'axios';
import { useEffect, useState } from 'react';
import { FiAlertCircle, FiTrash2 } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { API_URL } from '../assets/constants';
import CartCard from '../components/CartCard';
import CartPagination from '../components/CartPagination';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

const Cart = () => {
  const [cart, setCart] = useState();
  const [page, setPage] = useState(1);
  const userGlobal = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const userToken = localStorage.getItem('userToken');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (userToken) {
      getCart();
    } else {
      navigate('/login', { replace: true });
    }
  }, [page]);

  const getCart = async () => {
    try {
      if (page > cart?.total_page || page < 1) {
        return;
      }
      setIsLoading(true);

      const cartData = await axios.get(`${API_URL}/cart/get?page=${page}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      setCart(cartData.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const deleteItem = async (itemId) => {
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
        const response = await axios.delete(
          `${API_URL}/cart/delete/${itemId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
            params: {
              page,
            },
          }
        );

        setCart(response.data);
        dispatch({
          type: 'CART_TOTAL',
          payload: response.data.cartTotal,
        });
        setIsLoading(false);
        Swal.fire(response.data.message);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const rendSubtotal = () => {
    let subtotal = 0;
    cart?.checkoutItems?.forEach((item) => {
      subtotal += item.subtotal;
    });

    return subtotal;
  };

  const handCheckout = () => {
    let checkoutData = {
      data: cart.checkoutItems,
      subtotal: rendSubtotal(),
    };

    cart?.checkoutItems?.forEach((item, i) => {
      checkoutData.data[i].price = item.product.price_sell;
    });

    if (checkoutData.data.length) {
      localStorage.setItem('checkout-data', JSON.stringify(checkoutData));
      navigate('/checkout');
    } else {
      toast.error('none item selected');
    }
  };

  const handCheck = async (item) => {
    try {
      setIsLoading(true);
      const { id, isChecked } = item;

      const response = await axios.patch(
        `${API_URL}/cart/checked`,
        {
          id,
          isChecked: !isChecked,
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

      setCart(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const handCheckAll = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `${API_URL}/cart/checkedall`,
        {
          userId: userGlobal.id,
          isCheckedAll: cart.isCheckedAll,
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

      setCart(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const rendDetail = () => {
    return cart?.notAvailable.map((item) => {
      return (
        <div key={item.id} className="flex gap-3 border-b mb-2 py-2">
          <img
            src={`${API_URL}/${item.product.image}`}
            className="h-24 w-24 object-cover"
            alt="cart product"
          />
          <div className="flex w-full flex-col py-1">
            <h2 className="text-sm font-semibold mb-2">{item.product.name}</h2>
            <div className="flex gap-4">
              <span>
                Price : Rp. {item.product.price_sell.toLocaleString('id')}
              </span>
            </div>
            <div className="flex justify-end pr-5">
              <span>
                <FiTrash2
                  size={24}
                  className="hover:cursor-pointer"
                  onClick={() => deleteItem(item.id)}
                  disabled={isLoading}
                />
              </span>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <Header />
      <Navbar />
      <div className="flex flex-col m-auto justify-center my-20 gap-8 w-11/12">
        {cart?.notAvailable.length !== 0 && (
          <div className="alert shadow-lg w-max gap-20">
            <div className="text-warning">
              <FiAlertCircle size={24} />
              <span>
                There are {cart?.notAvailable.length} items that cannot be
                processed
              </span>
            </div>
            <div className="flex-none">
              <label
                htmlFor="detail-modal"
                href="#detail-modal"
                className="btn btn-sm btn-ghost"
              >
                See Detail
              </label>
            </div>
          </div>
        )}
        {cart?.cartList.length ? (
          <div className="flex justify-start w-44 px-7 form-control">
            <label className="label cursor-pointer">
              <input
                id="checkeall"
                type="checkbox"
                checked={cart?.isCheckedAll}
                className="checkbox"
                onChange={handCheckAll}
                disabled={isLoading}
              />
              <span className="label-text text-lg">Select All</span>
            </label>
          </div>
        ) : null}
        <div className="flex m-auto justify-center gap-8 w-full">
          <div className="w-9/12 flex flex-col gap-8">
            {/* List items */}
            {cart?.cartList.length ? (
              cart?.cartList.map((item) => {
                return (
                  <CartCard
                    key={item.id}
                    item={item}
                    page={page}
                    setPage={setPage}
                    isLoading={isLoading}
                    setCart={setCart}
                    setIsLoading={setIsLoading}
                    handCheck={() => handCheck(item)}
                  />
                );
              })
            ) : (
              <div className="bg-gray-100 rounded-md h-40 flex items-center justify-center">
                <h2 className="text-3xl">Your cart is empty</h2>
              </div>
            )}
            <CartPagination
              cart={cart}
              switchPage={(e) => setPage(e.target.textContent)}
              switchPageInput={(e) => setPage(e.target.value)}
              prevPage={() => setPage(cart?.active_page - 1)}
              nextPage={() => setPage(cart?.active_page + 1)}
            />
          </div>
          <div className="w-1/5 flex flex-col justify-between border-gray-300 border rounded-md h-72 p-5">
            <h2 className="font-bold text-xl">ORDER SUMMARY</h2>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span>
                  Subtotal (
                  {cart?.checkoutItems ? cart?.checkoutItems.length : 0}{' '}
                  {cart?.checkoutItems?.length > 1 ? 'items' : 'item'})
                </span>
                <span>Rp. {rendSubtotal().toLocaleString('id')}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>Rp. {0}</span>
              </div>
              <div className="border-gray-300 border-t"></div>
              <div className="flex justify-between">
                <span className="font-bold text-lg">TOTAL</span>
                <span className="font-bold text-lg">
                  Rp. {rendSubtotal().toLocaleString('id')}
                </span>
              </div>
            </div>
            <button
              disabled={!cart?.checkoutItems.length}
              className="btn btn-block btn-primary"
              onClick={handCheckout}
            >
              PROCESS TO CHECKOUT
            </button>
          </div>
        </div>
        {/* not available */}
        <input type="checkbox" id="detail-modal" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box min-w-9/12 overflow-auto">
            <div className="modal-action">
              <label
                htmlFor="detail-modal"
                className="btn btn-sm btn-circle absolute right-2 top-2"
              >
                ✕
              </label>
            </div>
            <div className="flex my-3 items-center">
              <h3 className="text-lg font-bold mb-3">Not available item</h3>
            </div>
            {rendDetail()}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
