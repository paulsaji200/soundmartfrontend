

import React from 'react';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Linkedin,
  Mail,
  Phone,
  MapPin,
  CreditCard,
 
  Gift,
  HelpCircle,
  FileText,
  ShieldCheck,
  Info,
  Send
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
              <Info size={20} />
              About Us
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white flex items-center gap-2">
                  <FileText size={16} />
                  About Our Company
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white flex items-center gap-2">
                  <MapPin size={16} />
                  Store Locations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white flex items-center gap-2">
                  <Phone size={16} />
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white flex items-center gap-2">
                  <Mail size={16} />
                  Corporate Information
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white flex items-center gap-2">
                  <Gift size={16} />
                  Gift Cards
                </a>
              </li>
            </ul>
          </div>

          {/* Help Section */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
              <HelpCircle size={20} />
              Help Center
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white flex items-center gap-2">
                  <FileText size={16} />
                  Your Account
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white flex items-center gap-2">
                  <CreditCard size={16} />
                  Payment Options
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white flex items-center gap-2">
                  <Send size={16} />
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white flex items-center gap-2">
                  <FileText size={16} />
                  Returns & Replacements
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white flex items-center gap-2">
                  <HelpCircle size={16} />
                  Customer Service
                </a>
              </li>
            </ul>
          </div>

          {/* Policy Section */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
              <ShieldCheck size={20} />
              Policy
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white flex items-center gap-2">
                  <FileText size={16} />
                  Return Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white flex items-center gap-2">
                  <FileText size={16} />
                  Terms Of Use
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white flex items-center gap-2">
                  <ShieldCheck size={16} />
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white flex items-center gap-2">
                  <ShieldCheck size={16} />
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white flex items-center gap-2">
                  <FileText size={16} />
                  Sitemap
                </a>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Connect With Us</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white flex items-center gap-2">
                  <Facebook size={16} className="text-blue-500" />
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white flex items-center gap-2">
                  <Twitter size={16} className="text-blue-400" />
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white flex items-center gap-2">
                  <Instagram size={16} className="text-pink-500" />
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white flex items-center gap-2">
                  <Youtube size={16} className="text-red-500" />
                  YouTube
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white flex items-center gap-2">
                  <Linkedin size={16} className="text-blue-600" />
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-8 border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h4 className="text-white text-lg font-semibold mb-2 flex items-center gap-2">
                <Mail size={20} />
                Subscribe to our newsletter
              </h4>
              <p>Get the latest updates on new products and upcoming sales</p>
            </div>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
                <Send size={16} />
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm mb-4 md:mb-0">
              © 2024 Your Company Name. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <CreditCard size={32} className="text-gray-400" />
              
              <CreditCard size={32} className="text-gray-400" />
              <CreditCard size={32} className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;