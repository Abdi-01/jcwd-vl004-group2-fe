import { useNavigate } from 'react-router-dom';

import '../assets/styles/Banner.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';

const Banner = () => {
  const navigate = useNavigate();

  return (
    <>
      <Swiper
        modules={[Pagination]}
        pagination={{
          clickable: true,
        }}
        slidesPerView={1}
        spaceBetween={20}
        className="w-full h-[85vh]"
        loop={true}
      >
        <SwiperSlide>
          <div className="w-full h-full bg-center bg-cover bg-no-repeat slide1">
            <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-center">
              <div className="w-72 lg:w-96 font-bold text-5xl leading-[50px] lg:text-6xl lg:leading-[60px] text-white mb-3">
                <span>Best materials for the best medicines</span>
              </div>
              <div className="w-72 lg:w-96 text-lg font-semibold text-gray-50 mb-7">
                <span>We offer only the best products for the best price. What are you waiting for?</span>
              </div>
              <div className="w-96 h-14 px-10">
                <button
                  onClick={() => navigate('/products/all')}
                  className="h-full w-full border-2 rounded-lg border-white font-bold text-2xl text-white hover:bg-white hover:text-sky-500 transition duration-200 active:scale-95"
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="w-full h-full bg-center bg-cover bg-no-repeat relative slide2">
            <div className="absolute inset-0 bg-black bg-opacity-30" />
            <div className="w-full lg:w-1/2 h-full absolute z-2 flex flex-col justify-center items-center">
              <div className="w-full font-bold flex justify-center gap-2 text-4xl md:text-5xl brightness-125 mb-4">
                <span className="text-gray-50">Medicine.</span>
                <span className="text-sky-700">Reinvented.</span>
              </div>
              <div className="w-[400px] text-center text-gray-50 text-base md:text-lg font-semibold mb-8">
                <span>We're revolutionizing the pharmaceutical industry and we would like you to be a part of it</span>
              </div>
              <div className="w-96 h-14 px-10">
                <button
                  onClick={() => navigate('/features')}
                  className="h-full w-full border-2 rounded-lg border-white font-bold text-2xl text-white hover:bg-white hover:text-sky-500 transition duration-200 active:scale-95"
                >
                  Discover
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="w-full h-full relative bg-center bg-cover bg-no-repeat slide3">
            <div className="absolute inset-0 bg-black bg-opacity-50" />
            <div className="w-full h-full absolute z-2 flex flex-col justify-center items-center gap-12 ">
              <div className="w-full flex justify-center text-3xl md:text-4xl lg:text-5xl font-bold text-gray-50">
                <span>The 6 type of vaccines technologies</span>
              </div>
              <div className="w-2/3 flex justify-center text-justify text-md xl:text-lg font-semibold text-white">
                <span>
                  Ever since the first vaccine was developed in 1796 to treat smallpox, several different methods have been created to
                  develop successful vaccines. Today, those methods, known as vaccine technologies, are more advanced and use the latest
                  technology to help protect the world from preventable diseases. Do you know all of them?
                </span>
              </div>
              <div className="w-96 h-14 px-10">
                <button
                  onClick={() => navigate('/blog')}
                  className="h-full w-full border-2 rounded-lg border-white font-bold text-2xl text-white hover:bg-white hover:text-sky-500 transition duration-200 active:scale-95"
                >
                  Read More
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
};

export default Banner;
