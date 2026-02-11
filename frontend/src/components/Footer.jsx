"use client";

import {
  FaFacebook,
  FaInstagram,
  FaGithub,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Top section */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-indigo-600" />
            </div>
            <p className="mt-4 text-sm text-gray-600 max-w-xs">
              Making the world a better place through constructing elegant
              hierarchies.
            </p>

            {/* Social icons */}
            <div className="mt-6 flex gap-4 text-gray-500">
              <FaFacebook className="h-5 w-5 hover:text-gray-900 cursor-pointer" />
              <FaInstagram className="h-5 w-5 hover:text-gray-900 cursor-pointer" />
              <FaXTwitter className="h-5 w-5 hover:text-gray-900 cursor-pointer" />
              <FaGithub className="h-5 w-5 hover:text-gray-900 cursor-pointer" />
              <FaYoutube className="h-5 w-5 hover:text-gray-900 cursor-pointer" />
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Solutions</h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>Marketing</li>
              <li>Analytics</li>
              <li>Automation</li>
              <li>Commerce</li>
              <li>Insights</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Support</h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>Submit ticket</li>
              <li>Documentation</li>
              <li>Guides</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Company</h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>About</li>
              <li>Blog</li>
              <li>Jobs</li>
              <li>Press</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>Terms of service</li>
              <li>Privacy policy</li>
              <li>License</li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-16 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500">
            © 2026 Logistics Company, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}