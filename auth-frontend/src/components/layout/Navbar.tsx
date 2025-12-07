// import { Link } from "react-router-dom";
// import { useContext, useState } from "react";
// import { AuthContext } from "../../context/AuthContext";
// import { Icon } from "@iconify/react";
// import { IMAGES } from "../../assets";
// import { ICONS } from "../../assets/icons";

// export default function Navbar() {
//   const { user, logout } = useContext(AuthContext);
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <nav className="px-5 md:px-10 py-3 shadow-md sticky top-0 z-50 bg-[#f6f2ee]">
//       <div className="max-w-[1440px] mx-auto">
//         <div className="flex justify-between items-center">
//           {/* Logo */}
//           <Link
//             to="/"
//             className="text-2xl md:text-3xl font-extrabold tracking-wide flex items-center gap-2 text-[#c0392b]"
//           >
//             <div className="w-9 h-9 md:w-10 md:h-10">
//               <img
//                 src={IMAGES.flag}
//                 alt="OP Flag"
//                 className="w-full h-full object-contain"
//               />
//             </div>
//             <span>
//               OP Card<span className="text-[#1c1c1c]">X</span>Change
//             </span>
//           </Link>

//           {/* Mobile toggle */}
//           <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
//             <Icon icon={menuOpen ? ICONS.close : ICONS.menu} width="30" />
//           </button>

//           {/* Nav links */}
//           <div
//             className={`absolute md:static left-0 top-16 w-full md:w-auto bg-[#f6f2ee] md:bg-transparent shadow-md md:shadow-none
//               flex flex-col md:flex-row items-start md:items-center text-lg font-medium gap-4 md:gap-6 p-5 md:p-0
//               transition-all duration-300
//               ${
//                 menuOpen
//                   ? "opacity-100 visible"
//                   : "opacity-0 invisible md:visible md:opacity-100"
//               }`}
//           >
//             <Link
//               to="/wishlist"
//               onClick={() => setMenuOpen(false)}
//               className="flex items-center gap-2 hover:text-[#c0392b] transition"
//             >
//               <Icon icon={ICONS.wishlist} width="22" />
//               Wishlist
//             </Link>

//             {user ? (
//               <>
//                 <p className="px-4 py-2 text-[#1c1c1c] font-semibold">
//                   Hello, <span className="text-[#c0392b]">{user.fullName}</span>
//                 </p>
//                 {user.isAdmin === true && (
//                   <Link
//                     to="/admin"
//                     onClick={() => setMenuOpen(false)}
//                     className="bg-linear-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg"
//                   >
//                     Admin Panel
//                   </Link>
//                 )}
//                 <Link
//                   to="/sell"
//                   onClick={() => setMenuOpen(false)}
//                   className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0097a7] text-[#f6f2ee] hover:bg-[#0097a7]/60 transition"
//                 >
//                   <Icon icon={ICONS.sell} width="22" />
//                   Sell
//                 </Link>

//                 <button
//                   onClick={() => {
//                     logout();
//                     setMenuOpen(false);
//                   }}
//                   className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#c0392b] text-[#f6f2ee] hover:bg-[#c0392b]/60 transition"
//                 >
//                   <Icon icon={ICONS.logout} width="22" />
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link
//                   to="/login"
//                   onClick={() => setMenuOpen(false)}
//                   className="flex items-center gap-2 hover:text-[#0097a7]/60 transition"
//                 >
//                   <Icon icon={ICONS.login} width="22" />
//                   Login
//                 </Link>

//                 <Link
//                   to="/register"
//                   onClick={() => setMenuOpen(false)}
//                   className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#c0392b] text-[#f6f2ee] hover:bg-[#c0392b]/60 transition"
//                 >
//                   <Icon icon={ICONS.register} width="22" />
//                   Register
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

import { NavLink, Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Icon } from "@iconify/react";
import { IMAGES } from "../../assets";
import { ICONS } from "../../assets/icons";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ Active Link Style (TypeScript Safe)
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 transition
    ${isActive ? "text-[#c0392b]" : "hover:text-[#c0392b]"}`;

  return (
    <nav className="px-6 md:px-10 py-3 shadow-md sticky top-0 z-50 bg-[#f6f2ee]">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex justify-between items-center gap-4">
          {/* ✅ LOGO */}
          <Link
            to="/"
            className="text-2xl lg:text-3xl font-extrabold tracking-wide flex items-center gap-2 text-[#c0392b] shrink-0"
          >
            <div className="w-9 h-9 md:w-10 md:h-10">
              <img
                src={IMAGES.flag}
                alt="OP Flag"
                className="w-full h-full object-contain"
              />
            </div>
            <span>
              OP Card<span className="text-[#1c1c1c]">X</span>Change
            </span>
          </Link>

          {/* ✅ MOBILE MENU TOGGLE */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden shrink-0"
          >
            <Icon icon={menuOpen ? ICONS.close : ICONS.menu} width="30" />
          </button>

          {/* ✅ NAV LINKS */}
          <div
            className={`absolute md:static left-0 top-14 w-full md:w-auto 
            bg-[#f6f2ee] md:bg-transparent shadow-md md:shadow-none 
            flex flex-col md:flex-row md:items-center 
            text-sm md:text-base font-medium 
            gap-4 md:gap-4 lg:gap-5 
            p-5 md:p-0 
            transition-all duration-300
            ${
              menuOpen
                ? "opacity-100 visible"
                : "opacity-0 invisible md:visible md:opacity-100"
            }`}
          >
            {/* ✅ Wishlist */}
            <NavLink
              to="/cards/one-piece/wishlist"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass}
            >
              <span className="hidden xl:flex">
                <Icon icon={ICONS.wishlist} width="22" />
              </span>
              <span>Wishlist</span>
            </NavLink>

            {/* ✅ Category */}
            <NavLink
              to="/cards/one-piece/category"
              onClick={() => setMenuOpen(false)}
              className={navLinkClass}
            >
              <span className="hidden xl:flex">
                <Icon icon={ICONS.category} width="22" />
              </span>
              <span>Category</span>
            </NavLink>

            {user && (
              <>
                {/* ✅ My Orders */}
                <NavLink
                  to="/orders"
                  onClick={() => setMenuOpen(false)}
                  className={navLinkClass}
                >
                  <span className="hidden xl:flex">
                    <Icon icon={ICONS.orders} width="22" />
                  </span>
                  <span>Orders</span>
                </NavLink>

                {/* ✅ Sell */}
                <NavLink
                  to="/cards/one-piece/sell"
                  onClick={() => setMenuOpen(false)}
                  className={navLinkClass}
                >
                  <span className="hidden xl:flex">
                    <Icon icon={ICONS.sell} width="22" />
                  </span>
                  <span>Sell</span>
                </NavLink>
              </>
            )}

            {/* ✅ ADMIN PANEL */}
            {user?.isAdmin === true && (
              <NavLink
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className={navLinkClass}
              >
                <span className="hidden xl:flex">
                  <Icon icon={ICONS.admin} width="22" />
                </span>
                <span className="whitespace-nowrap">Admin Panel</span>
              </NavLink>
            )}

            {/* ✅ USER SECTION */}
            {user ? (
              <>
                {user.isAdmin === false && (
                  <p className="py-2 text-[#1c1c1c] font-semibold whitespace-nowrap">
                    Hi, <span className="text-[#c0392b]">{user.fullName}</span>
                  </p>
                )}

                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg 
                  bg-[#c0392b] text-[#f6f2ee] hover:bg-[#c0392b]/60 transition whitespace-nowrap"
                >
                  <Icon icon={ICONS.logout} width="22" />
                  <span className="md:hidden">Logout</span>
                </button>
              </>
            ) : (
              <>
                {/* ✅ Login */}
                <NavLink
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className={navLinkClass}
                >
                  <span className="hidden xl:flex">
                    <Icon icon={ICONS.login} width="22" />
                  </span>
                  <span>Login</span>
                </NavLink>

                {/* ✅ Register */}
                <NavLink
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg 
                  bg-[#c0392b] text-[#f6f2ee] hover:bg-[#c0392b]/60 transition"
                >
                  <span className="hidden xl:flex">
                    <Icon icon={ICONS.register} width="22" />
                  </span>
                  <span>Register</span>
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
