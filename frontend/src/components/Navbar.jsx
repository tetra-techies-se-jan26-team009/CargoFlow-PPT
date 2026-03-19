import { PopoverGroup } from "@headlessui/react";
import { LoginPopOver } from "./NavComponents";
import { LOGIN_OPTIONS } from "../utils/navigation";
import { useState } from 'react';
import { Menu, X, ChevronDown, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';

const services = [
  { name: 'Express Shipping', href: '/services/express', desc: 'Fast delivery within 24 hours' },
  { name: 'Freight Services', href: '/services/freight', desc: 'Large shipment handling' },
  { name: 'Warehousing', href: '/services/warehouse', desc: 'Secure storage solutions' },
  { name: 'Last Mile', href: '/services/lastmile', desc: 'Final delivery to doorstep' },
];

const solutions = [
  { name: 'E-commerce', href: '/solutions/ecommerce', desc: 'Perfect for online stores' },
  { name: 'Enterprise', href: '/solutions/enterprise', desc: 'Scalable logistics' },
  { name: 'Healthcare', href: '/solutions/healthcare', desc: 'Medical supply chain' },
  { name: 'Retail', href: '/solutions/retail', desc: 'Store distribution' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  return (
    <header className="fixed w-full top-0 z-50 bg-background backdrop-blur-md border-b border-gray-200 shadow-sm">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 text-accent" />
              </div>
              <span className="text-xl font-bold text-text">CargoFlow</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Services Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium text-text-700 hover:text-blue-600 transition-colors">
                Services
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 space-y-2">
                  {services.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block p-3 rounded-lg hover:bg-blue-50 transition-colors group/item"
                    >
                      <div className="font-medium text-gray-900 group-hover/item:text-blue-600">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-600">{item.desc}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Solutions Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium text-text-700 hover:text-blue-600 transition-colors">
                Solutions
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 space-y-2">
                  {solutions.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block p-3 rounded-lg hover:bg-blue-50 transition-colors group/item"
                    >
                      <div className="font-medium text-text-900 group-hover/item:text-blue-600">
                        {item.name}
                      </div>
                      <div className="text-sm text-text-600">{item.desc}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              to="/tracking"
              className="text-sm font-medium text-text-700 hover:text-blue-600 transition-colors"
            >
              Track Shipment
            </Link>
            <Link
              to="/partners/login"
              className="text-sm font-medium text-text-700 hover:text-blue-600 transition-colors"
            >
              Partners
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-text-700 hover:text-blue-600 transition-colors"
            >
              About
            </Link>
          </div>


          <PopoverGroup className="hidden lg:flex items-center gap-x-10">
            <LoginPopOver items={LOGIN_OPTIONS} />
          </PopoverGroup>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 py-4"
            >
              <div className="space-y-4">
                {/* Services */}
                <div>
                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className="flex items-center justify-between w-full text-left font-medium text-gray-900 py-2"
                  >
                    Services
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${servicesOpen ? 'rotate-180' : ''
                        }`}
                    />
                  </button>
                  {servicesOpen && (
                    <div className="pl-4 space-y-2 mt-2">
                      {services.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="block py-2 text-sm text-gray-600 hover:text-blue-600"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Solutions */}
                <div>
                  <button
                    onClick={() => setSolutionsOpen(!solutionsOpen)}
                    className="flex items-center justify-between w-full text-left font-medium text-gray-900 py-2"
                  >
                    Solutions
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${solutionsOpen ? 'rotate-180' : ''
                        }`}
                    />
                  </button>
                  {solutionsOpen && (
                    <div className="pl-4 space-y-2 mt-2">
                      {solutions.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="block py-2 text-sm text-gray-600 hover:text-blue-600"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  to="/tracking"
                  className="block py-2 font-medium text-gray-900 hover:text-blue-600"
                >
                  Track Shipment
                </Link>
                <Link
                  to="/pricing"
                  className="block py-2 font-medium text-gray-900 hover:text-blue-600"
                >
                  Pricing
                </Link>
                <Link
                  to="/about"
                  className="block py-2 font-medium text-gray-900 hover:text-blue-600"
                >
                  About
                </Link>

                <div className="pt-4 space-y-3 border-t border-gray-200">
                  <Link
                    to="/login"
                    className="block w-full text-center py-2.5 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full text-center py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
