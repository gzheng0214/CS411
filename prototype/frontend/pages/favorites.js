import Head from "next/head";
import styles from "../styles/Favorites.module.css";
import { useEffect, useState, useRef, useContext } from "react";
import Card from "../components/card";
import { ImSpinner8 } from "react-icons/im";
import { Context } from "../context";
import { useRouter } from "next/router";
import Navbar from "../components/navbar";
import { loadImage } from "../utility/functions";

const Favorites = () => {
  const { state, dispatch } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { user } = state;
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  useEffect(async () => {
    try {
      setIsLoading(true);
      const email = user.profileObj.email;
      const response = await fetch("/api/getallfavorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
      const fruits = await response.json();
      setIsLoading(false);
      if (fruits.error) {
        throw new Error(fruits.error);
      }
      if (fruits.count == 0) {
        setError("You have no favorites");
        return;
      }
      Promise.all(fruits.result.map((plant) => loadImage(plant.imageurl)))
        .then(() => setIsLoading(false))
        .catch((err) => console.log("Failed to load images", err));
      setData(fruits);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  }, []);
  if (user) {
    return (
      <>
        <Navbar />
        <div className={styles.container}>
          <Head>
            <title>Favorites</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          {data && !error && (
            <h2 className={styles.error}>Number of favorites: {data.count}</h2>
          )}
          <div className={styles.content}>
            {isLoading ? (
              <ImSpinner8 className={styles.spinner} />
            ) : (
              <>
                {data &&
                  !error &&
                  data.result.map((plant, index) => {
                    return (
                      <Card
                        key={index}
                        name={plant.tfvname}
                        image={plant.imageurl}
                      />
                    );
                  })}
              </>
            )}
            {error && <h2 className={styles.error}>{error}</h2>}
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        {" "}
        <Head>
          <title>Favorites</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
      </>
    );
  }
};

export default Favorites;
