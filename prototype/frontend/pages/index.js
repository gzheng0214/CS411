import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState, useRef } from "react";
import Card from "../components/card";
import { ImSpinner8 } from "react-icons/im";

export default function Home() {
  const [text, setText] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchbar = useRef(null);

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
    searchbar.current.focus();
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchData, 800);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Home</title>
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
}
