import React, { useState, useEffect, useCallback } from "react";
import { AiOutlineHome, AiOutlineUserAdd, AiOutlineLogin } from "react-icons/ai";
import { MdOutlineLocalMovies } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/users";
import { logout } from "../../redux/features/auth/authSlice";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [timeoutId, setTimeoutId] = useState(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const handleMouseMove = useCallback((event) => {
    const navBar = document.getElementById("navigation-bar");
    const rect = navBar.getBoundingClientRect();
    const isMouseNear = event.clientY >= rect.top - 50 && event.clientY <= rect.bottom + 50;

    if (isMouseNear) {
      if (!isVisible) {
        setIsVisible(true);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      const id = setTimeout(() => {
        setIsVisible(false);
      }, 1000);
      setTimeoutId(id);
    }
  }, [isVisible, timeoutId]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [handleMouseMove, timeoutId]);

  return (
    <div
      id="navigation-bar"
      className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 bg-[#1c1c1c] border w-[30%] px-[4rem] py-[1rem] mb-[2rem] rounded transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <section className="flex justify-between items-center">
        {/*section 1 */}
        <div className="flex justify-center items-center mb-[1rem]">
          <Link to="/" className="flex items-center transition-transform transform">
            <AiOutlineHome className="mr-2 mt-[1rem] text-white transition-transform transform hover:scale-150" size={26} />
            <span className="hidden nav-item-name mt-[1rem]">Home</span>
          </Link>

          <Link to="/movies" className="flex items-center transition-transform transform ml-[1rem]">
            <MdOutlineLocalMovies className="mr-2 mt-[1rem] text-white transition-transform transform hover:scale-150" size={26} />
            <span className="hidden nav-item-name mt-[1rem]">SHOP</span>
          </Link>
        </div>

        {/*section 2 */}
        <div className="flex items-center">
          <button onClick={toggleDropdown} className="text-gray-800 focus:outline-none">
            {userInfo ? <span className="text-white">{userInfo.username}</span> : <></>}

            {userInfo && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ml-1 ${dropdownOpen ? "transform rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
              </svg>
            )}
          </button>
          {dropdownOpen && userInfo && (
            <ul
              className={`absolute right-0 mt-2 mr-14 w-[10rem] space-y-2 bg-white text-gray-600 ${
                !userInfo.isAdmin ? "-top-20" : "-top-24"
              }`}
            >
              {userInfo.isAdmin && (
                <>
                  <li>
                    <Link to="/admin/movies/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                      Dashboard
                    </Link>
                  </li>
                </>
              )}

              <li>
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                  Profile
                </Link>
              </li>

              <li>
                <button onClick={logoutHandler} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                  Logout
                </button>
              </li>
            </ul>
          )}

          {!userInfo && (
            <ul className="flex">
              <li>
                <Link to="/login" className="flex items-center mt-5 transition-transform transform hover:scale-150 mb-[1rem]">
                  <AiOutlineLogin className="mr-2 mt-[4px] text-white" size={26} />
                  <span className="hidden nav-item-name">LOGIN</span>
                </Link>
              </li>

              <li>
                <Link to="/register" className="flex items-center mt-5 transition-transform transform hover:scale-150 ml-[1rem]">
                  <AiOutlineUserAdd className="text-white" size={26} />
                  <span className="hidden nav-item-name">REGISTER</span>
                </Link>
              </li>
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default Navigation;