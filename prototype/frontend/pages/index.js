import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState, useRef, useContext } from "react";
import Card from "../components/card";
import { ImSpinner8 } from "react-icons/im";
import { Context } from "../context";
import { useRouter } from "next/router";
import { GoogleLogout } from "react-google-login";
import { FcGoogle } from "react-icons/fc";

export default function Home() {
  const [text, setText] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchbar = useRef(null);
  const { state, dispatch } = useContext(Context);
  const { user } = state;
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const fetchData = async () => {
    if (text == "") {
      setData(null);
      setError(null);
      setIsLoading(false);
      return;
    }
    try {
      setData(null);
      setError(null);
      setIsLoading(true);
      const response = await fetch("/api/plants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plant: text,
        }),
      });
      const fruits = await response.json();
      setIsLoading(false);
      if (fruits.error) {
        throw new Error(fruits.error);
      }
      setData(fruits.results);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      searchbar.current.focus();
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchData, 800);
    return () => clearTimeout(timer);
  }, [text]);

  const logout = () => {
    dispatch({
      type: "LOGOUT",
    });
  };
  if (user) {
    return (
      <div className={styles.container}>
        <Head>
          <title>Welcome, {user.profileObj.givenName}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <input
          type="text"
          value={text}
          onChange={handleChange}
          className={styles.searchbar}
          ref={searchbar}
          placeholder="Enter plant name..."
        />
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
        <div className={styles.content}>
          {isLoading ? (
            <ImSpinner8 className={styles.spinner} />
          ) : (
            data &&
            !error &&
            data.map((plant, index) => {
              return (
                <Card key={index} name={plant.tfvname} image={plant.imageurl} />
              );
            })
          )}
          {error && <h2 className={styles.error}>{error}</h2>}
        </div>
      </div>
    );
  } else {
    return (
      <>
        {" "}
        <Head>
          <title>Welcome</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
      </>
    );
  }
}
