import { useNavigate } from 'react-router-dom';

import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa';
import logo from '../assets/images/logos/heizenberg.png';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-slate-900 text-gray-300 mt-10 px-2">
      <div className="w-full flex flex-col md:flex-row border-b-2 border-gray-600 py-8">
        <div className="w-full md:w-1/2 flex flex-col md:flex-row md:gap-7 xl:gap-11 pl-5 xl:pl-8">
          <div className="flex flex-col">
            <h6 className="font-bold uppercase pt-2">Products</h6>
            <div className="w-full flex flex-row md:flex-col gap-4 md:gap-1">
              <span
                onClick={() => navigate('/products/Pharmaceutical%20Intermediate')}
                className="py-1 hover:brightness-110 transition cursor-pointer"
              >
                Pharmaceutical Intermediate
              </span>
              <span
                onClick={() => navigate('/products/Pharmaceutical%20Chemical')}
                className="py-1 hover:brightness-110 transition cursor-pointer"
              >
                Pharmaceutical Chemical
              </span>
              <span onClick={() => navigate('/products/Biochemical')} className="py-1 hover:brightness-110 transition cursor-pointer">
                Biochemical
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <h6 className="font-bold uppercase pt-2">Support</h6>
            <div className="w-full flex flex-row md:flex-col gap-3 md:gap-1">
              <span className="py-1 hover:brightness-110 transition cursor-pointer">Contact Us</span>
              <span className="py-1 hover:brightness-110 transition cursor-pointer">Documentation</span>
              <span className="py-1 hover:brightness-110 transition cursor-pointer">Guides</span>
            </div>
          </div>
          <div className="flex flex-col">
            <h6 className="font-bold uppercase pt-2">Company</h6>
            <div className="w-full flex flex-row md:flex-col gap-3 md:gap-1">
              <span className="py-1 hover:brightness-110 transition cursor-pointer">About</span>
              <span className="py-1 hover:brightness-110 transition cursor-pointer">Blog</span>
              <span className="py-1 hover:brightness-110 transition cursor-pointer">Jobs</span>
              <span className="py-1 hover:brightness-110 transition cursor-pointer">Press</span>
              <span className="py-1 hover:brightness-110 transition cursor-pointer">Partners</span>
            </div>
          </div>
          <div className="flex flex-col">
            <h6 className="font-bold uppercase pt-2">Legal</h6>
            <div className="w-full flex flex-row md:flex-col gap-3 md:gap-1">
              <span className="py-1 hover:brightness-110 transition cursor-pointer">Claims</span>
              <span className="py-1 hover:brightness-110 transition cursor-pointer">Privacy</span>
              <span className="py-1 hover:brightness-110 transition cursor-pointer">Terms</span>
              <span className="py-1 hover:brightness-110 transition cursor-pointer">Policies</span>
              <span className="py-1 hover:brightness-110 transition cursor-pointer">Conditions</span>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center items-center mt-6 md:mt-0">
          <img src={logo} alt="heizenberg logo" className="w-56 md:w-60 lg:w-72" />
        </div>
      </div>

      <div className="flex w-full px-2 xl:px-8 py-3 justify-between text-gray-500">
        <span className="text-md md:text-base">2022 Heizen Berg Co. All rights reserved</span>
        <div className="flex items-center gap-3 md:gap-5 text-xl md:text-2xl">
          <FaFacebook className="hover:brightness-150 transition cursor-pointer" />
          <FaInstagram className="hover:brightness-150 transition cursor-pointer" />
          <FaYoutube className="hover:brightness-150 transition cursor-pointer" />
          <FaTwitter className="hover:brightness-150 transition cursor-pointer" />
          <FaLinkedin className="hover:brightness-150 transition cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Footer;
