import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../assets/constants";
import { format } from "date-fns";

import Swal from "sweetalert2";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaSearchPlus } from "react-icons/fa";
import { toast } from "react-toastify";

const TransactionTable = ({ item, startNumber, i, socket }) => {
  const adminToken = localStorage.getItem("adminToken");
  const [status, setStatus] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [loadingApp, setLoadingApp] = useState(false);
  const [loadingRej, setLoadingRej] = useState(false);

  useEffect(() => {
    setStatus(item.status);
    setEnabled(item.status === "pending");
  }, [item]);

  const handleApprovedClick = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Change it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoadingApp(true);
          const response = await axios.patch(
            `${API_URL}/admin/transaction/approved/${id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${adminToken}`,
              },
            }
          );

          if (response.data.conflict) {
            setEnabled(false);
            setStatus(response.data.status);
            toast.error(response.data.message, {
              position: "top-center",
              theme: "colored",
            });
            setLoadingApp(false);
          } else {
            setEnabled(false);
            setStatus("approved");
            socket.emit("userPayment", response.data.userId);
            Swal.fire("Updated!", response.data.message, "success");
            setLoadingApp(false);
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const handleRejectedClick = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Change it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoadingRej(true);
          const response = await axios.patch(
            `${API_URL}/admin/transaction/rejected/${id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${adminToken}`,
              },
            }
          );

          if (response.data.conflict) {
            setEnabled(false);
            setStatus(response.data.status);
            toast.error(response.data.message, {
              position: "top-center",
              theme: "colored",
            });
            setLoadingRej(false);
          } else {
            Swal.fire("Updated!", response.data.message, "success");
            setLoadingRej(false);
            setEnabled(false);
            setStatus("rejected");
            socket.emit("userPayment", response.data.userId);
            Swal.fire("Updated!", response.data.message, "success");
            setLoadingRej(false);
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const rendDetail = () => {
    return item.invoiceitems.map((item) => {
      return (
        <div key={item.id} className="flex gap-3 border-b mb-2 py-2">
          <img
            src={`${API_URL}/${item.product.image}`}
            className="h-24"
            alt="cart product"
          />
          <div className="flex flex-col py-1">
            <h2 className="text-sm font-semibold mb-2">{item.product.name}</h2>
            <div className="flex gap-4">
              <span>Price : Rp. {item.price?.toLocaleString()}</span>
              <span>Qty: {item.quantity?.toLocaleString()}</span>
            </div>
            <span>
              Subtotal : Rp. {(item.quantity * item.price).toLocaleString()}
            </span>
          </div>
        </div>
      );
    });
  };

  const rendTotal = () => {
    let total = 0;

    item.invoiceitems.forEach((item) => {
      total += (item.quantity * item.price);
    });

    total += item.deliveryoption?.cost

    return total.toLocaleString();
  };

  return (
    <>
      <tr className="text-sm border-b border-gray-200" key={item.id}>
        <td className="justify-center items-center text-center p-4">
          {startNumber + i + 1}
        </td>
        <td className="justify-center items-center text-left p-4">
          {item.user.name}
        </td>
        <td className="justify-center items-center text-left p-4">
          {item.address.address}, {item.address.city}, {item.address.province}
        </td>
        <td className="justify-center items-center text-center p-4">
          {item.deliveryoption.name}
        </td>
        <td className="justify-center items-center text-center p-4">
          {item.notes}
        </td>
        <td className="justify-center items-center text-center p-4">
          {format(new Date(item.createdAt), "dd/MM/yyyy")}
        </td>
        <td className="justify-center items-center text-center p-4">
          <label
            htmlFor={`detail-modal-${item.id}`}
            className="flex gap-3 items-center hover:cursor-pointer border-b pb-1 px-1 m-auto border-primary text-primary w-20"
          >
            <span>Detail</span>
            <FaSearchPlus size={20} />
          </label>
        </td>
        <td className="justify-center items-center text-center p-4">
          <span
            className={`badge p-3 ${status === "pending" && "badge-warning"} ${
              status === "approved" && "badge-success"
            } ${status === "rejected" && "badge-error"} gap-2 `}
          >
            {status}
          </span>
        </td>
        {item.status === "awaiting" ? (
          <td className="flex items-center justify-center p-4">
            <span className="font-semibold text-xl">Awaiting Payment..</span>
          </td>
        ) : (
          <td className="flex gap-3 justify-center items-center text-center p-4">
            <button
              disabled={!enabled || loadingApp || loadingRej}
              type="button"
              className="py-3 w-36 text-white disabled:bg-gray-400 bg-primary hover:bg-blue-400' rounded-xl flex justify-center items-center gap-2"
              onClick={() => handleApprovedClick(item.id)}
            >
              {loadingApp ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin" />
                  Updating..
                </>
              ) : (
                "Approve"
              )}
              {/* Approve */}
            </button>
            <button
              disabled={!enabled || loadingRej || loadingApp}
              type="button"
              className={`py-3 w-36 text-white disabled:bg-gray-400 bg-red-500 hover:bg-red-400 rounded-xl flex justify-center items-center gap-2`}
              onClick={() => handleRejectedClick(item.id)}
            >
              {loadingRej ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin" />
                  Updating..
                </>
              ) : (
                "Reject"
              )}
            </button>
          </td>
        )}
      </tr>

      <input
        type="checkbox"
        id={`detail-modal-${item.id}`}
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box min-w-9/12 overflow-auto">
          <div className="modal-action">
            <label
              htmlFor={`detail-modal-${item.id}`}
              className="btn btn-sm btn-circle absolute right-2 top-2"
            >
              ✕
            </label>
          </div>
          <div className="flex justify-between my-3 items-center">
            <h3 className="text-lg font-bold mb-3">Detail Transaction</h3>
            <div className="font-semibold text-lg text-red-400 flex justify-end bg-red-50 py-2 px-3 rounded-md">
              Rp. {rendTotal()}
            </div>
          </div>
          {item.paymentproof?.path ? (
            <div className="flex flex-col justify-center py-4">
              <span className="font-semibold mb-4 w-28 border-b-2 border-primary">
                Payment Proof
              </span>
              <img
                src={`${API_URL}/public/${item.paymentproof?.path}`}
                alt="proof of payment"
              />
            </div>
          ) : (
            <div className="font-semibold mb-4 text-center bg-gray-100 p-6 roundedn-md">
              Payment proof not available
            </div>
          )}
          <span className="font-semibold mb-4 pt-9 w-28 border-b-2 border-primary">
            Order Items
          </span>
          {rendDetail()}
        </div>
      </div>
    </>
  );
};

export default TransactionTable;
