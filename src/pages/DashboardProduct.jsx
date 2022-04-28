import {
  FaSearch,
  FaBell,
  FaUserAlt,
  FaHome,
  FaShoppingBag,
  FaArrowLeft,
  FaArrowRight,
} from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import ProductTable from '../components/ProductTable';
import Pagination from '../components/Pagination';
import Swal from 'sweetalert2';
import CategoryList from '../components/CategoryList';
import { API_URL } from '../assets/constants';
import NavbarDashboard from '../components/NavbarDashboard';
import SidebarDashboard from '../components/SidebarDashboard';

const Dashboard = () => {
  const Swal = require('sweetalert2');
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('');
  const [currentSortPrice, setCurrentSortPrice] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(0);

  const fetchProducts = async () => {
    const res = await axios.get(`${API_URL}/product/all`);
    setProducts(res.data);
  };

  useEffect(() => {
    const fetchData = async () => {
      const productList = await axios.post(`${API_URL}/product/query`, {
        category: currentCategory,
        sort: currentSortPrice,
        name: search,
      });
      console.log(productList.data.length);
      const categoryList = await axios.get(`${API_URL}/category/all`);
      setCategories(categoryList.data);
      // nested objects
      setProducts(productList.data.products);
      setItemsPerPage(productList.data.products.length);
      setMaxPage(Math.ceil(productList.data.length / 5));
      setPage(1);
    };
    fetchData();
    // dependency uses state outside useEffect
  }, [currentCategory, currentSortPrice, search]);

  const renderProducts = () => {
    const beginningIndex = (page - 1) * 5;
    const currentData = products.slice(beginningIndex, beginningIndex + 5);
    return currentData.map((value) => {
      return (
        <ProductTable
          key={value.id}
          product={value}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
        />
      );
    });
  };

  const handleEditClick = async (event, value) => {
    const id = value.id;
    navigate(`editproduct/?${id}`);
  };

  const handleAddProduct = async (event, value) => {
    navigate(`addproduct`);
  };

  const handleDeleteClick = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios.delete(`${API_URL}/product/delete/${id}`);
        } catch (error) {
          console.log(error);
        }
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
        fetchProducts();
      }
    });
  };

  const nextPageHandler = () => {
    if (page < maxPage) setPage(page + 1);
  };

  const prevPageHandler = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleReset = () => {
    setSearch('');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarDashboard
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        onClick={() => setSearch('')}
      />
      <SidebarDashboard />

      <div className="pt-16 pr-8 pl-48">
        <div className="flex items-center justify-between py-7 px-10">
          <div>
            <h1 className="text-3xl text-gray-700 font-bold">Products</h1>
          </div>
          <div className="flex justify-between items-center space-x-4">
            <div>
              <select
                name=""
                id=""
                onChange={(e) => setCurrentCategory(+e.target.value)}
                className="py-2.5 px-6 text-white bg-primary hover:bg-blue-400 transition rounded-xl "
              >
                <option value="">Sort Category</option>
                {categories.map((value) => (
                  <CategoryList key={value.id} category={value} />
                ))}
              </select>
            </div>
            <div>
              <select
                name=""
                id=""
                onChange={(e) => setCurrentSortPrice(e.target.value)}
                className="py-2.5 px-6 text-white bg-primary hover:bg-blue-400 transition rounded-xl"
              >
                <option value="">Sort by price</option>
                <option value="price_sell,ASC">Lowest Price</option>
                <option value="price_sell,DESC">Highest Price</option>
              </select>
            </div>
            <button
              className="py-2.5 px-6 text-white bg-primary hover:bg-blue-400 transition rounded-xl"
              onClick={handleAddProduct}
            >
              Add a Product
            </button>
          </div>
        </div>

        <div className="bg-white shadow-sm mt-5 p-5">
          {/* <form action=""></form> */}
          <table className="w-full">
            <thead>
              <tr className="text-sm font-medium text-gray-700 border-b border-gray-200">
                <th className="py-4 px-4 text-center">ID</th>
                <th className="py-4 px-4 text-center">Image</th>
                <th className="py-4 px-4 text-center">Name</th>
                <th className="py-4 px-4 text-center">Price Buy</th>
                <th className="py-4 px-4 text-center">Price Sell</th>
                <th className="py-4 px-4 text-center">Stock</th>
                <th className="py-4 px-4 text-center">Unit</th>
                <th className="py-4 px-4 text-center">Volume</th>
                <th className="py-4 px-4 text-center">Stock in unit</th>
                <th className="py-4 px-4 text-center">Appearance</th>
                <th className="py-4 px-4 text-center">Category</th>
                <th className="py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>{renderProducts()}</tbody>
          </table>
          <div className="mt-3 flex justify-center items-center">
            <button onClick={prevPageHandler}>
              {' '}
              <FaArrowLeft />
            </button>
            <div>
              Page {page} of {maxPage}
            </div>
            <button onClick={nextPageHandler}>
              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
