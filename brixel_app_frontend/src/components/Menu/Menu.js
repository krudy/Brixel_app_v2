import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Menu.module.css";

function Menu() {
  const { token, logout } = useContext(AuthContext);

  return (
    <div className={`${styles.menuContainer} container`}>
      <ul className={styles.menu}>
        <li className={styles.menuItem}>
          <Link to="/">Home</Link>
        </li>
        {!token ? (
          <>
            <li className={styles.menuItem}>
              <Link to="/login">Login</Link>
            </li>
            <li className={styles.menuItem}>
              <Link to="/register">Register</Link>
            </li>
          </>
        ) : (
          <>
            <li className={styles.menuItem}>
              <Link to="/profile">Profile</Link>
            </li>
            <li className={styles.menuItem}>
              <button onClick={logout}>Logout</button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default Menu;
