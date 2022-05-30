import {
  FaSearch,
  FaBell,
  FaUserAlt,
  FaHome,
  FaBars,
  FaShoppingBag,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../assets/constants";
import { FaPhotoVideo } from "react-icons/fa";
import "../assets/styles/Currency.css";

const AddProduct = () => {
  // useState([]) is different from useState({})
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  // upload image use string or null
  const [images, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);

  const navigate = useNavigate();
  const Swal = require("sweetalert2");

  const fetchCategories = async () => {
    const res = await axios.get(`http://localhost:5000/category/all`);
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  console.log(categories);

  const categoryId = useRef();
  const image = useRef();

  const [addFormData, setAddFormData] = useState({
    name: "",
    price_buy: "",
    price_sell: "",
    stock: "",
    unit: "",
    volume: "",
    description: "",
    // image: "",
    appearance: "",
    // categoryId: "",
  });

  const handleAddFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    setAddFormData(newFormData);
  };

  const handleAddFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    const newProduct = {
      name: addFormData.name,
      price_buy: addFormData.price_buy,
      price_sell: addFormData.price_sell,
      stock: addFormData.stock,
      unit: addFormData.unit,
      volume: addFormData.volume,
      description: addFormData.description,
      appearance: addFormData.appearance,
      categoryId: parseInt(categoryId.current.value),
    };
    formData.append("productData", JSON.stringify(newProduct));
    formData.append("image", images);

    console.log(newProduct);

    try {
      await axios.post(`${API_URL}/product/add`, formData);
      navigate("/dashboard/product");
      Swal.fire({
        icon: "success",
        // title: "Oops...",
        text: "Product has been added!",
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        // title: "Oops...",
        text: error,
      });
    }
  };

  const onBtAddFile = (e) => {
    setImage(e.target.files[0]);
    let preview = document.getElementById("imgpreview");
    preview.src = URL.createObjectURL(e.target.files[0]);
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="flex items-center justify-between py-7 px-10">
        <div>
          <h1 className="text-3xl text-gray-700 font-bold">Add a Product</h1>
        </div>
      </div>
      <div className="bg-white shadow-sm p-8 px-10">
        <form onSubmit={handleAddFormSubmit}>
          <div className="grid grid-cols-6 gap-4 justify-items-star">
            <div>
              <label className="mr-3">Name:</label>
            </div>
            <div className="col-start-2 col-span-3">
              <textarea
                type="text"
                name="name"
                className="h-16 input input-bordered w-full max-w-xs pr-10 focus:outline-none focus:bg-white"
                required
                placeholder="Product Name"
                onChange={handleAddFormChange}
              />
            </div>
            <div className="col-start-1">
              <label className="">Description:</label>
            </div>
            <div className="col-start-2 col-span-3">
              <textarea
                type="text"
                name="description"
                className="h-32 w-5/6 input input-bordered max-w-xs pr-10 focus:outline-none focus:bg-white"
                required
                placeholder="What makes this product valuable?"
                onChange={handleAddFormChange}
              />
            </div>
            <div className="col-start-1">
              <label className="">Image:</label>
            </div>
            <div className="col-start-2">
              <label htmlFor="file">
                <div className="py-1 px-6 text-white bg-primary cursor-pointer hover:bg-blue-400 transition rounded-xl items-center">
                  <div className="flex justify-center items-center">
                    <FaPhotoVideo
                      htmlColor="tomato"
                      className="shareIcon mr-1"
                    />
                    <div>Add Photo</div>
                  </div>
                </div>
                <input
                  type="file"
                  id="file"
                  name="image"
                  onChange={onBtAddFile}
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </label>
            </div>
            <div className="col-start-2">
              <img id="imgpreview" />
            </div>
            <div className="col-start-1">
              <label className="mr-3">Price Buy:</label>
            </div>
            <div className="col-start-2 col-span-3">
              <div className="flex">
                <span class="currencyinput">Rp</span>
                <input
                  type="number"
                  name="price_buy"
                  className="input input-bordered w-full h-8 max-w-xs pr-10 focus:outline-none focus:bg-white"
                  placeholder="000"
                  required
                  onChange={handleAddFormChange}
                />
              </div>
            </div>
            <div className="col-start-1">
              <label className="">Price Sell:</label>
            </div>
            <div className="col-start-2 col-span-3">
              <div className="flex">
                <span class="currencyinput">Rp</span>
                <input
                  type="number"
                  name="price_sell"
                  className="input input-bordered w-full h-8 max-w-xs pr-10 focus:outline-none focus:bg-white"
                  required
                  placeholder="000"
                  onChange={handleAddFormChange}
                />
              </div>
            </div>
            <div className="col-start-1">
              <label className="">Unit:</label>
            </div>
            <div className="flex justify-around">
              <div>
                <input
                  type="radio"
                  name="unit"
                  id="ml"
                  className="mr-3"
                  value="ml"
                  required
                  onChange={handleAddFormChange}
                />
                <label for="ml">ml</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="unit"
                  id="g"
                  className="mr-3"
                  value="g"
                  required
                  onChange={handleAddFormChange}
                />
                <label for="g">g</label>
              </div>
            </div>
            <div className="col-start-1">
              <label className="">Volume:</label>
            </div>
            <div>
              <input
                type="number"
                name="volume"
                className="input input-bordered w-full h-8 max-w-xs pr-10 focus:outline-none focus:bg-white"
                placeholder="000"
                required
                onChange={handleAddFormChange}
              />
            </div>
            <div className="col-start-1">
              <label className="">Stock:</label>
            </div>
            <div>
              <input
                type="number"
                name="stock"
                className="input input-bordered w-full h-8 max-w-xs pr-10 focus:outline-none focus:bg-white"
                placeholder="000"
                required
                onChange={handleAddFormChange}
              />
            </div>
            <div className="col-start-1">
              <label className="">Appearance:</label>
            </div>
            <div className="flex justify-between">
              <div>
                <input
                  type="radio"
                  name="appearance"
                  id="Crystal"
                  className="mr-3"
                  value="Crystal"
                  onChange={handleAddFormChange}
                  required
                />
                <label for="Crystal">Crystal</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="appearance"
                  id="Powder"
                  className="mr-3"
                  value="Powder"
                  onChange={handleAddFormChange}
                  required
                />
                <label for="Powder">Powder</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="appearance"
                  id="Liquid"
                  className="mr-3"
                  value="Liquid"
                  onChange={handleAddFormChange}
                  required
                />
                <label for="Liquid">Liquid</label>
              </div>
            </div>
            <div className="col-start-1">
              <label className="">Category:</label>
            </div>
            {/* <DropdownCategories /> */}
            <select name="categoryId" id="" required ref={categoryId}>
              <option value="">Choose a category</option>
              {categories.map((item, index) => (
                <option value={item.id} key={index}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex">
            <button className="mt-8 py-2.5 px-6 text-white bg-primary hover:bg-blue-400 transition rounded-xl items-center mr-3">
              Add Product
            </button>
            <div
              className="mt-8 py-2.5 px-6 text-white bg-red-500 cursor-pointer hover:bg-red-400 transition rounded-xl items-center"
              onClick={() => navigate(-1)}
            >
              Cancel
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
