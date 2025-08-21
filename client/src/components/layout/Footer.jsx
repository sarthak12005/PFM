import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">SaveWise</h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Your trusted partner in personal finance management. Take control of your money, 
              achieve your goals, and build a secure financial future.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail size={16} />
                <span className="text-sm">hello@savewise.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone size={16} />
                <span className="text-sm">+91 80 1234 5678</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/transactions" className="text-gray-300 hover:text-white transition-colors">
                  Transactions
                </Link>
              </li>
              <li>
                <Link to="/budget-planner" className="text-gray-300 hover:text-white transition-colors">
                  Budget Planner
                </Link>
              </li>
              <li>
                <Link to="/goals" className="text-gray-300 hover:text-white transition-colors">
                  Goals
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-gray-300 hover:text-white transition-colors">
                  Analytics
                </Link>
              </li>

            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support & Legal</h4>
            <ul className="space-y-2">

              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>

              <li>
                <Link to="/categories" className="text-gray-300 hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-gray-300">© {currentYear} SaveWise Technologies Pvt. Ltd.</span>
              <span className="text-gray-300">Made with</span>
              <Heart size={16} className="text-red-500" />
              <span className="text-gray-300">in India</span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-300">
              <MapPin size={16} />
              <span className="text-sm">Bangalore, Karnataka, India</span>
            </div>
          </div>
          
          <div className="mt-4 text-center text-gray-400 text-sm">
            <p>
              SaveWise is a comprehensive personal finance management platform designed to help you 
              take control of your financial future. All financial data is encrypted and secure.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
