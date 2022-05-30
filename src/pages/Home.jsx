import { useEffect, useState } from 'react';
import Axios from 'axios';
import { API_URL } from '../assets/constants';

import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import Logos from '../components/Logos';
import Features from '../components/Features';
import Categories from '../components/Categories';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';

function Home() {
  const [best, setBest] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await Axios.post(`${API_URL}/product/query`, {
          limit: 10,
          fromHome: true,
          sort: 'total_sales,DESC',
        });

        setBest(response.data.products);
      } catch (err) {
        toast.error(`Unable to fetch New Arrivals!`, { position: 'bottom-left', theme: 'colored' });
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <Header />
      <Navbar />
      <Banner />
      <Logos />
      <Features />
      <Categories />
      <ProductGrid header={'Best Seller'} productList={best} bestsellerBadge navigateTo={'/products/all'} />
      <Footer />
    </>
  );
}

export default Home;
