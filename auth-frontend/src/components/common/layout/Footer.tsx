import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    collections: [
      { name: "One Piece Cards", path: "/cards/one-piece" },
      { name: "Latest Cards", path: "/cards/one-piece/cards" },
      { name: "Premium Collection", path: "/cards/one-piece/all-cards" },
      { name: "Wishlist", path: "/cards/one-piece/wishlist" },
    ],
    categories: [
      { name: "OP01 Foil", path: "/cards/one-piece/all-cards?category=OP01" },
      { name: "OP02 Foil", path: "/cards/one-piece/all-cards?category=OP02" },
      { name: "OP03 Foil", path: "/cards/one-piece/all-cards?category=OP03" },
      { name: "OP04 Foil", path: "/cards/one-piece/all-cards?category=OP04" },
      { name: "Secret Rares", path: "/cards/one-piece/all-cards?category=SEC" },
    ],
    sell: [
      { name: "Sell Your Cards", path: "/cards/one-piece/sell" },
      { name: "Card Valuation", path: "/valuation" },
      { name: "Seller Guidelines", path: "/seller-guidelines" },
      { name: "Authentication", path: "/authentication" },
    ],
    support: [
      { name: "Help Center", path: "/help" },
      { name: "Shipping Policy", path: "/shipping" },
      { name: "Returns & Refunds", path: "/returns" },
      { name: "Contact Us", path: "/contact" },
      { name: "FAQ", path: "/faq" },
    ],
  };

  const socialLinks = [
    {
      name: "Instagram",
      icon: "mdi:instagram",
      url: "https://instagram.com",
      color: "hover:text-[#E4405F]",
      bg: "hover:bg-[#E4405F]/10",
    },
    {
      name: "Twitter",
      icon: "mdi:twitter",
      url: "https://twitter.com",
      color: "hover:text-[#1DA1F2]",
      bg: "hover:bg-[#1DA1F2]/10",
    },
    {
      name: "Facebook",
      icon: "mdi:facebook",
      url: "https://facebook.com",
      color: "hover:text-[#1877F2]",
      bg: "hover:bg-[#1877F2]/10",
    },
    {
      name: "Discord",
      icon: "ic:baseline-discord",
      url: "https://discord.com",
      color: "hover:text-[#5865F2]",
      bg: "hover:bg-[#5865F2]/10",
    },
    {
      name: "YouTube",
      icon: "mdi:youtube",
      url: "https://youtube.com",
      color: "hover:text-[#FF0000]",
      bg: "hover:bg-[#FF0000]/10",
    },
  ];

  const paymentMethods = [
    { name: "Visa", icon: "logos:visa" },
    { name: "Mastercard", icon: "logos:mastercard" },
    { name: "PayPal", icon: "logos:paypal" },
    { name: "UPI", icon: "simple-icons:googlepay" },
    { name: "Razorpay", icon: "simple-icons:razorpay" },
  ];

  return (
    <footer className="bg-linear-to-b from-[#1c1c1c] to-[#0a0a0a] text-white">
      {/* Top Section */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-linear-to-r from-[#c0392b] to-[#fdd18e] flex items-center justify-center">
                  <Icon
                    icon="mdi:cards"
                    className="text-white text-2xl"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#0097a7] flex items-center justify-center">
                  <Icon
                    icon="mdi:star"
                    className="text-white text-xs"
                  />
                </div>
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold bg-linear-to-r from-[#fdd18e] via-white to-[#0097a7] bg-clip-text text-transparent">
                  One Piece Collectibles
                </h2>
                <p className="text-sm text-gray-400">Premium Card Marketplace</p>
              </div>
            </div>
            
            <p className="text-gray-400 mb-6 max-w-md">
              Your trusted marketplace for authentic One Piece trading cards. 
              Discover rare collectibles, verified sellers, and premium cards 
              for every collector.
            </p>
            
            {/* Newsletter Subscription */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-white">
                Stay Updated
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-[#2d2d2d] border border-[#3d3d3d] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0097a7] focus:border-transparent text-white placeholder-gray-500"
                />
                <button className="px-6 py-3 bg-linear-to-r from-[#c0392b] to-[#1c1c1c] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity duration-200 whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Get notified about new cards and exclusive deals
              </p>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([key, links]) => (
            <div key={key}>
              <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-[#3d3d3d] capitalize">
                {key}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-[#fdd18e] transition-colors duration-200 flex items-center group"
                    >
                      <Icon
                        icon="mdi:chevron-right"
                        className="mr-2 text-[#0097a7] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        width="16"
                      />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-12 border-t border-[#3d3d3d]"></div>

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          {/* Social Links */}
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-400 mb-4">
              Connect With Us
            </h4>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group w-10 h-10 rounded-full bg-[#2d2d2d] flex items-center justify-center transition-all duration-300 ${social.bg} hover:scale-110`}
                  aria-label={social.name}
                >
                  <Icon
                    icon={social.icon}
                    className={`text-gray-400 text-xl transition-colors duration-300 ${social.color}`}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-400 mb-4">
              Secure Payments
            </h4>
            <div className="flex flex-wrap gap-4 items-center">
              {paymentMethods.map((method) => (
                <div
                  key={method.name}
                  className="group relative"
                  title={method.name}
                >
                  <div className="w-12 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center p-1 hover:bg-white/20 transition-colors duration-200">
                    <Icon
                      icon={method.icon}
                      className="text-2xl text-gray-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile App Links */}
          <div className="flex-1 text-center lg:text-right">
            <h4 className="text-sm font-semibold text-gray-400 mb-4">
              Download Our App
            </h4>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-end">
              <button className="px-6 py-3 bg-black rounded-lg hover:bg-[#1c1c1c] transition-colors duration-200 flex items-center justify-center gap-2">
                <Icon icon="mdi:apple" className="text-2xl" />
                <div className="text-left">
                  <div className="text-xs text-gray-400">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </button>
              <button className="px-6 py-3 bg-black rounded-lg hover:bg-[#1c1c1c] transition-colors duration-200 flex items-center justify-center gap-2">
                <Icon icon="mdi:google-play" className="text-2xl" />
                <div className="text-left">
                  <div className="text-xs text-gray-400">Get it on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-12 pt-8 border-t border-[#3d3d3d]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-500 text-sm">
                © {currentYear} One Piece Collectibles. All rights reserved.
              </p>
              <p className="text-gray-600 text-xs mt-1">
                This website is not affiliated with Eiichiro Oda, Shueisha, or Toei Animation.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <Link to="/privacy" className="hover:text-[#fdd18e] transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-[#fdd18e] transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:text-[#fdd18e] transition-colors duration-200">
                Cookie Policy
              </Link>
              <Link to="/sitemap" className="hover:text-[#fdd18e] transition-colors duration-200">
                Sitemap
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-8">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Icon icon="mdi:shield-check" className="text-[#0097a7] text-xl" />
            <span>100% Authentic Cards</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Icon icon="mdi:truck-fast" className="text-[#fdd18e] text-xl" />
            <span>Secure Worldwide Shipping</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Icon icon="mdi:account-check" className="text-[#c0392b] text-xl" />
            <span>Verified Sellers</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Icon icon="mdi:headset" className="text-white text-xl" />
            <span>24/7 Customer Support</span>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Border */}
      <div className="h-1 bg-linear-to-r from-[#c0392b] via-[#fdd18e] to-[#0097a7]"></div>
    </footer>
  );
};

export default Footer;