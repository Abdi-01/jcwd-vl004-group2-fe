import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../assets/constants";
import { FaPhotoVideo } from "react-icons/fa";

const EditProduct = () => {
  const Swal = require("sweetalert2");
  // useState([]) is different from useState({}) findAll is array findbyPK is an object
  const [products, setProducts] = useState({});
  const [categories, setCategories] = useState([]);
  const [images, setImage] = useState(null);
  const [category, setCategory] = useState();
  const navigate = useNavigate();
  const [priceBuy, setPriceBuy] = useState("");
  const [unit, setUnit] = useState("");
  const [newAppearance, setNewAppearance] = useState("");

  const { id } = useParams();

  const fetchProductsId = async () => {
    const res = await axios.post(`${API_URL}/product/find/${id}`);
    setImage(res.data.product.image);
    setProducts(res.data.product);
    setCategory(res.data.product.categoryId);
    setUnit(res.data.product.unit);
    setNewAppearance(res.data.product.appearance);
  };

  const fetchCategories = async () => {
    const res = await axios.get(`${API_URL}/category/all`);
    setCategories(res.data);
  };

  const fetchImagePreview = async () => {
    let preview = document.getElementById("imgpreview");
    preview.src = `${API_URL}/${images}`;
  };

  // useEffect with empty dependencies
  useEffect(() => {
    fetchImagePreview();
    fetchProductsId();
    fetchCategories();
  }, []);

  const name = useRef();
  const price_buy = useRef();
  const price_sell = useRef();
  const stock = useRef();
  const volume = useRef();
  const description = useRef();
  const appearance = useRef();
  const categoryId = useRef();

  const handleEditFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    const newProduct = {
      name: name.current.value,
      price_buy: parseInt(price_buy.current.value),
      price_sell: parseInt(price_sell.current.value),
      stock: parseInt(stock.current.value),
      unit: unit,
      volume: parseInt(volume.current.value),
      description: description.current.value,
      appearance: newAppearance,
      categoryId: parseInt(categoryId.current.value),
    };

    formData.append("productData", JSON.stringify(newProduct));

    if (images) {
      formData.append("image", images);
    }

    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, i want to edit it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.patch(`${API_URL}/product/edit/${id}`, formData);
            navigate("/dashboard/product");
            Swal.fire("Edited!", "Your file has been edited.", "success");
          } catch (error) {
            console.log(error);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onBtAddFile = (e) => {
    setImage(e.target.files[0]);
    let preview = document.getElementById("imgpreview");
    preview.src = URL.createObjectURL(e.target.files[0]);
  };

  return (
    <div className="h-full w-full bg-gray-100">
      <div className="flex items-center justify-between py-7 px-10">
        <h1 className="text-3xl text-gray-700 font-bold">Edit Product</h1>
      </div>
      <div className="bg-white shadow-sm p-8 px-10">
        <form onSubmit={handleEditFormSubmit}>
          <div className="grid grid-cols-6 gap-4 justify-items-star">
            <div>
              <label className="mr-3">Name:</label>
            </div>
            <div className="col-start-2 col-span-3">
              <textarea
                type="text"
                name="name"
                className="h-16 input input-bordered w-full max-w-xs pr-10 focus:outline-none focus:bg-white"
                maxLength={350}
                required
                defaultValue={products.name}
                ref={name}
              />
            </div>
            <div className="col-start-1">
              <label className="">Description:</label>
            </div>
            <div className="col-start-2 col-span-4">
              <textarea
                type="text"
                name="description"
                className="h-32 w-full input input-bordered max-w-xs pr-10 focus:outline-none focus:bg-white"
                required
                defaultValue={products.description}
                ref={description}
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
                    <div>Change Photo</div>
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
              {/* profileImage ? URL.createObjectURL(profileImage) : ${API_URL}/${userData.profile_picture} */}
              <img id="imgpreview" src={`${API_URL}/${products.image}`} />
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
                  required
                  defaultValue={products.price_buy}
                  ref={price_buy}
                  onChange={(e) => setPriceBuy(e.target.value)}
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
                  defaultValue={products.price_sell}
                  ref={price_sell}
                />
              </div>
            </div>
            <div className="col-start-1">
              <label className="">Unit:</label>
            </div>
            <div className="flex justify-between">
              <div>
                <input
                  type="radio"
                  name="unit"
                  id="ml"
                  className="mr-3"
                  value="ml"
                  checked={unit === "ml" ? "checked" : ""}
                  onChange={(e) => setUnit(e.target.value)}
                  onClick={() => setUnit("ml")}
                  required
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
                  checked={unit === "g" ? "checked" : ""}
                  onChange={(e) => setUnit(e.target.value)}
                  onClick={() => setUnit("g")}
                  required
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
                required
                defaultValue={products.volume}
                ref={volume}
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
                required
                defaultValue={products.stock}
                ref={stock}
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
                  checked={newAppearance === "Crystal" ? "checked" : ""}
                  onChange={(e) => setNewAppearance(e.target.value)}
                  onClick={() => setNewAppearance("Crystal")}
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
                  checked={newAppearance === "Powder" ? "checked" : ""}
                  onChange={(e) => setNewAppearance(e.target.value)}
                  onClick={() => setNewAppearance("Powder")}
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
                  checked={newAppearance === "Liquid" ? "checked" : ""}
                  onChange={(e) => setNewAppearance(e.target.value)}
                  onClick={() => setNewAppearance("Liquid")}
                  required
                />
                <label for="Liquid">Liquid</label>
              </div>
            </div>
            <div className="col-start-1">
              <label className="">Category:</label>
            </div>
            {/* <DropdownCategories /> */}
            <select
              name="categoryId"
              required
              ref={categoryId}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
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
              Save
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

export default EditProduct;
