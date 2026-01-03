import { FilePath } from "@/lib/ExportFiles";
import { USER_DASHBOARD, WEBSITE_ABOUTUS, WEBSITE_HOME, WEBSITE_LOGIN, WEBSITE_PRIVACYANDPOLICY, WEBSITE_REGISTER, WEBSITE_SHOP, WEBSITE_TERMSANDCONDITIONS } from "@/routes/WebsiteRoute";
import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { CiFacebook, CiInstagram, CiTwitter, CiYoutube } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineLocalPhone, MdOutlineMail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-10 py-10 lg:px-32 px-4">
        
        <div className="lg:col-span-1 md:col-span-2 col-span-1">
          <Image className="lg:w-32 w-24" src={FilePath.logoblack.src} alt="logoblack" width={383} height={146} />
          
          <p className="text-gray-500 text-sm">
            E-store is your trusted destination for quality and convenience. From fashion to essentials,
            we bring everything you need right to your doorstep. Shop smart, live better — only at
            E-store.
          </p>
        </div>

        <div>
          <h4 className="text-xl font-bold uppercase mb-5">Categories</h4>
          <ul>
            <li className="mb-2 text-gray-500">
              <Link href={`${WEBSITE_SHOP}?category=t-shirts`}>T-shirts</Link>
            </li>
            <li className="mb-2 text-gray-500"><Link href={`${WEBSITE_SHOP}?category=hoodies`}>Hoodies</Link></li>
            <li className="mb-2 text-gray-500"><Link href={`${WEBSITE_SHOP}?category=oversized`}>Oversized</Link></li>
            <li className="mb-2 text-gray-500"><Link href={`${WEBSITE_SHOP}?category=full-sleeves`}>Full Sleeves</Link></li>
            <li className="mb-2 text-gray-500"><Link href={`${WEBSITE_SHOP}?category=polo`}>Polo</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-bold uppercase mb-5">Userfull Links</h4>
          <ul>
            <li className="mb-2 text-gray-500"><Link href={WEBSITE_HOME}>Home</Link></li>
            <li className="mb-2 text-gray-500"><Link href={WEBSITE_SHOP}>Shop</Link></li>
            <li className="mb-2 text-gray-500"><Link href={WEBSITE_ABOUTUS}>About</Link></li>
            <li className="mb-2 text-gray-500"><Link href={WEBSITE_REGISTER}>Register</Link></li>
            <li className="mb-2 text-gray-500"><Link href={WEBSITE_LOGIN}>Login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-bold uppercase mb-5">Help Center</h4>
          <ul>
            <li className="mb-2 text-gray-500"><Link href={WEBSITE_REGISTER}>Register</Link></li>
            <li className="mb-2 text-gray-500"><Link href={WEBSITE_LOGIN}>Login</Link></li>
            <li className="mb-2 text-gray-500"><Link href={USER_DASHBOARD}>My Account</Link></li>
            <li className="mb-2 text-gray-500"><Link href={WEBSITE_PRIVACYANDPOLICY}>Privacy Policy</Link></li>
            <li className="mb-2 text-gray-500">
              <Link href={WEBSITE_TERMSANDCONDITIONS}>Terms & Conditions</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-bold uppercase mb-5">Contact Us</h4>
          <ul>
            <li className="mb-2 text-gray-500 flex gap-2">
              <IoLocationOutline size={20} />
              <span className="text-sm">E-store market Lucknow, India 256320</span>
            </li>
            <li className="mb-2 text-gray-500 flex gap-2">
              <MdOutlineLocalPhone size={20} />
              <Link className="hover:text-primary text-sm" href="tel:+91-8569874589">+91-8569874589</Link>
            </li>
            <li className="mb-2 text-gray-500 flex gap-2">
              <MdOutlineMail size={20} />
              <Link className="hover:text-primary text-sm" href="mailto:support@estore.com">support@estore.com</Link>
            </li>
          </ul>
          <div className="flex gap-5 mt-5">
            <Link href={''}><CiYoutube className="text-primary" size={25} /></Link>
            <Link href={''}><CiInstagram className="text-primary" size={25} /></Link>
            <Link href={''}><FaWhatsapp className="text-primary" size={25} /></Link>
            <Link href={''}><CiFacebook className="text-primary" size={25} /></Link>
            <Link href={''}><CiTwitter className="text-primary" size={25} /></Link>
          </div>
        </div>
      </div>
      <div className="py-5 bg-gray-100"><p className="text-center">© 2024 Estore. All Rights Reserved.</p></div>
    </footer>

  );
};

export default Footer;
