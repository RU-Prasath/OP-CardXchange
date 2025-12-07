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

import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Icon } from "@iconify/react";
import { IMAGES } from "../../assets";
import { ICONS } from "../../assets/icons";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="px-5 md:px-10 py-3 shadow-md sticky top-0 z-50 bg-[#f6f2ee]">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex justify-between items-center">
          {/* LOGO */}
          <Link
            to="/"
            className="text-2xl md:text-3xl font-extrabold tracking-wide flex items-center gap-2 text-[#c0392b]"
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

          {/* MOBILE MENU TOGGLE */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
            <Icon icon={menuOpen ? ICONS.close : ICONS.menu} width="30" />
          </button>

          {/* NAV LINKS */}
          <div
            className={`absolute md:static left-0 top-16 w-full md:w-auto bg-[#f6f2ee] md:bg-transparent shadow-md md:shadow-none 
              flex flex-col md:flex-row items-start md:items-center text-lg font-medium gap-4 md:gap-6 p-5 md:p-0 
              transition-all duration-300
              ${
                menuOpen
                  ? "opacity-100 visible"
                  : "opacity-0 invisible md:visible md:opacity-100"
              }`}
          >
            {/* Wishlist */}
            <Link
              to="/wishlist"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 hover:text-[#c0392b] transition"
            >
              <Icon icon={ICONS.wishlist} width="22" />
              Wishlist
            </Link>

            {/* Category */}
            <Link
              to="/cards/one-piece/category"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 hover:text-[#c0392b] transition"
            >
              <Icon icon={ICONS.category} width="22" />
              Category
            </Link>

            {user && (
              <>
                {/* My Orders */}
                <Link
                  to="/orders"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 hover:text-[#c0392b] transition"
                >
                  <Icon icon={ICONS.orders} width="22" />
                  My Orders
                </Link>

                {/* Sell */}
                <Link
                  to="/sell"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-1 hover:text-[#c0392b] transition"
                >
                  <Icon icon={ICONS.sell} width="22" />
                  Sell
                </Link>
              </>
            )}

            {/* ADMIN PANEL */}
            {user?.isAdmin === true && (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="bg-linear-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Admin Panel
              </Link>
            )}

            {/* USER SECTION */}
            {user ? (
              <>
                <p className="px-4 py-2 text-[#1c1c1c] font-semibold">
                  Hello, <span className="text-[#c0392b]">{user.fullName}</span>
                </p>

                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#c0392b] text-[#f6f2ee] hover:bg-[#c0392b]/60 transition"
                >
                  <Icon icon={ICONS.logout} width="22" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 hover:text-[#0097a7]/60 transition"
                >
                  <Icon icon={ICONS.login} width="22" />
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#c0392b] text-[#f6f2ee] hover:bg-[#c0392b]/60 transition"
                >
                  <Icon icon={ICONS.register} width="22" />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
