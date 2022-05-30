import Axios from 'axios';
import { API_URL } from '../assets/constants';
import { format } from 'date-fns';

import UploadPaymentModal from './UploadPaymentModal';
import { toast } from 'react-toastify';
import { addDays } from 'date-fns/esm';

const InvoiceItem = ({ item }) => {
  return (
    <div className="w-full h-12 md:h-14 lg:h-16 flex rounded-lg py-1">
      <div className="h-full w-[20%] flex items-center justify-center">
        <div className="h-11 w-11 sm:h-12 sm:w-12 lg:h-14 lg:w-14 bg-white border rounded-lg overflow-hidden flex justify-center items-center">
          <img src={`${API_URL}/${item.product?.image}`} className="h-full object-contain" />
        </div>
      </div>
      <div className="h-full w-[55%] flex flex-col justify-center">
        <span className="text-sm sm:text-md lg:text-base font-semibold line-clamp-1">{item.product?.name}</span>
        <span className="text-xs sm:text-sm font-semibold text-opacity-60">
          Rp. {item.price.toLocaleString('id')}/{item.product?.unit}
        </span>
      </div>
      <div className="h-full w-[25%] flex flex-col items-center justify-center">
        <span className="text-[10px] sm:text-xs font-bold lg:font-extrabold text-slate-700 mb-1">Qty:</span>
        <span className="text-xs sm:text-sm lg:text-md xl:text-base font-semibold text-slate-700">
          {item.quantity.toLocaleString('id')} {item.product?.unit}
        </span>
      </div>
    </div>
  );
};

const AwaitingPaymentCard = ({ invoice, setInvoices, setTotalData, currentPage, limit, setMaxPage, socket }) => {
  const userToken = localStorage.getItem('userToken');

  const cancelHandler = async () => {
    try {
      const response = await Axios.post(
        `${API_URL}/checkout/cancel/${invoice.id}`,
        {
          limit,
          currentPage,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      setInvoices(response.data.rows);
      setMaxPage(response.data.maxPage);
      setTotalData(response.data.count);

      toast.success(response.data.message, { position: 'top-center', theme: 'colored' });
    } catch (err) {
      toast.error('Unable to cancel Invoice!', { position: 'bottom-left', theme: 'colored' });
    }
  };

  return (
    <>
      <div className="w-full xl:w-[85%] flex flex-col ring-1 ring-slate-200 rounded-lg">
        <div className="w-full p-1 lg:p-2 ">
          <div className="w-full flex items-center justify-between text-xs sm:text-sm lg:text-md font-semibold p-2 lg:px-3 rounded-lg bg-sky-50">
            <span>#{invoice.id}</span>
            <span>{format(new Date(invoice.createdAt), 'PPP')}</span>
          </div>
        </div>
        <div className="w-full h-full flex mb-1">
          <div className="w-[70%] flex flex-col items-center">
            <div className="w-[95%] flex items-center py-px">
              <span className="w-full text-sm lg:text-md font-bold">Items:</span>
            </div>
            <div className="w-[95%] p-1 gap-2 flex flex-col ring-1 ring-gray-200 rounded-lg">
              {invoice.invoiceitems?.map((item) => (
                <InvoiceItem key={item.id} item={item} />
              ))}
            </div>
          </div>
          <div className="w-[30%] flex flex-col py-1 pr-1">
            <div className="w-full flex items-center justify-end py-px px-1">
              <span className="text-sm lg:text-md font-bold">Summary:</span>
            </div>
            <div className="w-full h-full bg-gray-100 rounded-lg flex flex-col py-1 gap-1">
              <div className="w-full flex flex-col items-end px-2">
                <span className="text-xs lg:text-sm font-bold">Subtotal (2 items):</span>
                <span className="text-sm lg:text-base font-semibold">Rp. {parseInt(invoice.total)?.toLocaleString('id')}</span>
              </div>
              <div className="w-full flex flex-col items-end px-2">
                <div className="flex items-center gap-1 text-xs lg:text-sm font-bold">
                  <span>Delivery:</span>
                  <span className="line-clamp-1">({invoice.deliveryoption?.name})</span>
                </div>
                <span className="text-sm md:text-base font-semibold">Rp. {invoice.deliveryoption?.cost.toLocaleString('id')}</span>
              </div>
              <div className="w-full flex flex-col items-end px-2">
                <span className="text-xs lg:text-sm font-bold">Grand Total:</span>
                <span className="text-sm lg:text-base font-semibold">
                  Rp. {(parseInt(invoice.total) + invoice.deliveryoption?.cost).toLocaleString('id')}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[97%] mx-auto flex justify-between items-center py-2 border-t">
          <label
            htmlFor={`cancel-invoice-${invoice.id}`}
            className="font-semibold text-red-400 active:scale-95 hover:brightness-110 cursor-pointer transition text-sm lg:text-base"
          >
            Cancel Transaction
          </label>
          <UploadPaymentModal
            invoiceId={invoice.id}
            setInvoices={setInvoices}
            setMaxPage={setMaxPage}
            setTotalData={setTotalData}
            currentPage={currentPage}
            limit={limit}
            socket={socket}
          />
          <div className="h-full flex flex-col justify-center bg-amber-100 px-3 py-1 rounded-lg">
            <span className="text-[11px] lg:text-xs font-bold leading-tight">Expired At:</span>
            <span className="text-xs lg:text-sm font-semibold">{format(addDays(new Date(invoice.createdAt), 1), 'PPPpp')}</span>
          </div>
        </div>
      </div>

      <input type="checkbox" id={`cancel-invoice-${invoice.id}`} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box p-0">
          <div className="pt-8 pb-3 flex justify-center">
            <span className="font-bold text-xl">Are sure you want to cancel this transaction?</span>
          </div>
          <div className="py-6 flex justify-center gap-3">
            <label
              htmlFor={`cancel-invoice-${invoice.id}`}
              className="w-36 py-2 font-bold text-white bg-red-400 rounded-full flex justify-center items-center hover:brightness-110 cursor-pointer active:scale-95 transition text-lg"
            >
              Cancel
            </label>
            <button
              onClick={cancelHandler}
              className="w-36 py-2 font-bold text-white bg-green-400 rounded-full flex justify-center items-center hover:brightness-110 cursor-pointer active:scale-95 transition text-lg"
            >
              Yes I'm sure
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AwaitingPaymentCard;
