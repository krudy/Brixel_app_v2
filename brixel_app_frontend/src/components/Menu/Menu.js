import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import styles from './Menu.module.css'
import logo from "../../assets/img/Brixel_logo.png"

function Menu() {
  const { token, logout } = useContext(AuthContext);

  return (
    <nav className={`${styles.navbar} navbar navbar-expand-lg mt-1`}>
      <div className="container">
        <Link className={`${styles.navbarBrand} d-flex align-items-center`} to="/">
          <img className={styles.img} src={logo} alt="BrixelApp Logo" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">

            <li className="nav-item">
              <Link className={`${styles.navLink} nav-link`} to="/">
                Home
              </Link>
            </li>

            {!token ? (
              <>
                <li className="nav-item">
                  <Link className={`${styles.navLink} nav-link`} to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`${styles.navLink} nav-link`} to="/register">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className={`${styles.navLink} nav-link`} to="/workbench">
                    Workbench
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`${styles.navLink} nav-link`} to="/profile">
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <button className={`${styles.navLink} btn btn-link nav-link`} onClick={logout}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Menu;
