import React from "react";
import styles from "./Navbar.module.css";
import { GoogleLogout } from "react-google-login";
import { FcGoogle } from "react-icons/fc";
import { Context } from "../../context";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import Link from "next/link";

const Navbar = () => {
  const { state, dispatch } = useContext(Context);
  const router = useRouter();
  const logout = () => {
    window.sessionStorage.removeItem("prevpage");
    dispatch({
      type: "LOGOUT",
    });
  };
  useEffect(() => {
    window.sessionStorage.setItem("prevpage", router.asPath);
  }, [router.asPath]);
  return (
    <nav className={styles.navbar}>
      <div className={styles.navItems}>
        <Link href="/">
          <a className={router.pathname == "/" ? styles.active : ""}>Home</a>
        </Link>
        <Link href="/favorites">
          <a className={router.pathname == "/favorites" ? styles.active : ""}>
            Favorites
          </a>
        </Link>
        <GoogleLogout
          clientId="867085794944-ejrn5svll7cilh29dv48obs92pkldm8k.apps.googleusercontent.com"
          buttonText="Logout"
          onLogoutSuccess={logout}
          render={(renderProps) => (
            <button
              className={styles.googleButton}
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              <FcGoogle className={styles.icon} />
              Sign out
            </button>
          )}
        ></GoogleLogout>
      </div>
    </nav>
  );
};

export default Navbar;
