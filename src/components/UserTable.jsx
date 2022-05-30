import { API_URL } from "../assets/constants";
import axios from "axios";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";

const UserTable = ({ user, setKeyword, beginningIndex }) => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setStatus(user.active);
  }, []);

  const handleStatusClick = (id) => {
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
          const response = await axios.patch(`${API_URL}/user/status/${id}`);
          setStatus(response.data);
        } catch (error) {
          console.log(error);
        }
        Swal.fire("Changed!", "Status has been changed!", "success");
      }
      setKeyword("");
    });
  };

  return (
    <tr className="border-b border-gray-200">
      <td className="justify-center items-center text-center p-4">
        {beginningIndex + 1}
      </td>
      <td className="justify-center items-center text-center p-4">
        <img
          src={`${API_URL}/${user.profile_picture}`}
          className="w-12 m-auto h-12 rounded-full border border-gray-200"
        />
      </td>
      <td className="justify-center items-center text-left p-4">
        {user.name}
      </td>
      <td className="justify-center items-center text-left p-4">
        {user.email}
      </td>
      <td className="justify-center items-center text-center p-4">
        {user.phone_number}
      </td>
      {status ? (
        <td className="justify-center items-center text-center p-4">
          <button
            type="button"
            className="py-1 px-4 text-white bg-green-500 rounded-xl items-center"
          >
            Active
          </button>
        </td>
      ) : (
        <td className="justify-center items-center text-center p-4">
          <button
            type="button"
            className="py-1 px-3 text-white bg-red-500 rounded-xl items-center"
          >
            Inactive
          </button>
        </td>
      )}
      <td className="justify-center items-center text-center p-4">
        <button
          type="button"
          className="py-2.5 px-6 text-white bg-primary hover:bg-blue-400 rounded-xl items-center"
          onClick={() => handleStatusClick(user.id)}
        >
          Change Status
        </button>
      </td>
    </tr>
  );
};

export default UserTable;
