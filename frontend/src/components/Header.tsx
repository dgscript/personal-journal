import { useEffect, useState } from "react";
import "../styles/header.css";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function Header() {
  const { user, setUser, loading } = useAuth();
  const [dropdown, setDropdown] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* disables the dropdown if the window width is smaller than 768px */
  useEffect(() => {
    if (windowWidth > 768) setDropdown(false);
  }, [windowWidth]);

  async function logoff() {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/logoff`,
        {},
        { withCredentials: true },
      );
      window.location.href = "/";
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <header>
        <Link to={{ pathname: "/" }}>
          <h1>Personal Journal</h1>
        </Link>

        <nav>
          <Link
            to={{ pathname: "/" }}
            style={{
              color: `${useLocation().pathname === "/" ? "var(--accent)" : ""}`,
            }}
          >
            HOME
          </Link>
          <Link
            to={{ pathname: "/write" }}
            style={{
              color: `${useLocation().pathname === "/write" ? "var(--accent)" : ""}`,
            }}
          >
            WRITE
          </Link>
        </nav>

        <div className="header-buttons">
          {loading ? (
            <>
              <button className="skeleton-btn">
                <span>??????</span>
              </button>
              <button className="skeleton-btn">
                <span>??????</span>
              </button>
            </>
          ) : !user ? (
            <>
              <Link to={{ pathname: "/login" }}>LOG IN</Link>
              <Link to={{ pathname: "/signin" }}>SIGN IN</Link>
            </>
          ) : (
            <>
              <Link
                className="profile-btn"
                to={{ pathname: "/me" }}
                style={{
                  color: `${useLocation().pathname === "/me" ? "var(--accent)" : ""}`,
                }}
              >
                {user.username}
              </Link>
              <button className="log-off-btn" onClick={() => logoff()}>
                LOG OFF
              </button>
            </>
          )}
        </div>

        <button className="dropdown-btn" onClick={() => setDropdown(!dropdown)}>
          {dropdown ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e3e3e3"
            >
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e3e3e3"
            >
              <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
            </svg>
          )}
        </button>
      </header>
      {windowWidth < 768 && (
        <div className={`dropdown-nav ${dropdown ? "dropdown-active" : ""}`}>
          <div className="dropdown-links">
            <Link
              to={{ pathname: "/" }}
              style={{
                color: `${useLocation().pathname === "/" ? "var(--accent)" : ""}`,
              }}
            >
              HOME
            </Link>
            <Link
              to={{ pathname: "/write" }}
              style={{
                color: `${useLocation().pathname === "/write" ? "var(--accent)" : ""}`,
              }}
            >
              WRITE
            </Link>

            {loading ? null : !user ? (
              <>
                <Link to={{ pathname: "/login" }} className="login-btn">
                  LOG IN
                </Link>
                <Link to={{ pathname: "/signin" }} className="signin-btn">
                  SIGN IN
                </Link>
              </>
            ) : (
              <>
                <Link
                  className="profile-btn"
                  to={{ pathname: "/me" }}
                  style={{
                    color: `${useLocation().pathname === "/me" ? "var(--accent)" : ""}`,
                  }}
                >
                  {user.username}
                </Link>
                <button className="log-off-btn" onClick={() => logoff()}>
                  LOG OFF
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
