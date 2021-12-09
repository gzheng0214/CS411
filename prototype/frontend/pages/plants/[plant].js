import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Navbar from "../../components/navbar";
import styles from "../../styles/Plant.module.css";
import { ImSpinner8 } from "react-icons/im";
import Card from "../../components/card";
import { Context } from "../../context";
import { loadImage } from "../../utility/functions";

const Plant = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [recipes, setRecipes] = useState(null);
  const router = useRouter();
  const { plant } = router.query;

  const { state, dispatch } = useContext(Context);
  const { user } = state;

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  useEffect(async () => {
    if (!plant) return;
    try {
      const response = await fetch("/api/plant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plant,
        }),
      });
      const fruits = await response.json();
      if (fruits.error) {
        throw new Error(fruits.error);
      }
      setData(fruits.results[0]);
      const response2 = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipe: plant,
        }),
      });
      const recipes = await response2.json();
      setRecipes(recipes.hits);
      const images = [
        fruits.results[0].imageurl,
        ...recipes.hits.map((entry) => entry.recipe.image),
      ];
      Promise.all(images.map((image) => loadImage(image)))
        .then(() => setIsLoading(false))
        .catch((err) => console.log("Failed to load images", err));
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  }, [plant]);
  return (
    <>
      <Navbar />
      <div className={styles.plant}>
        <Head>
          <title>{plant}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        {isLoading ? (
          <ImSpinner8 className={styles.spinner} />
        ) : (
          data &&
          !error && (
            <div className={styles.content}>
              <img src={data.imageurl} className={styles.img} />
              <div>
                <span>tfvname:&nbsp;</span>
                {data.tfvname}
              </div>
              <div>
                <span>botname:&nbsp;</span>
                {data.botname}
              </div>
              <div>
                <span>othname:&nbsp;</span>
                {data.othname}
              </div>
              <div>
                <span>climate:&nbsp;</span>
                {data.climate}
              </div>
              <div>
                <span>description:&nbsp;</span>
                {data.description}
              </div>
              <div>
                <span>health:&nbsp;</span>
                {data.health}
              </div>
              <div>
                <span>propagation:&nbsp;</span>
                {data.propagation}
              </div>
              <div>
                <span>soil:&nbsp;</span>
                {data.soil}
              </div>
              <div>
                <span>uses:&nbsp;</span>
                {data.uses}
              </div>
              {recipes.length != 0 ? (
                <>
                  <div>
                    <span>recipes:&nbsp;</span>
                  </div>
                  <div className={styles.recipes}>
                    {recipes.map((entry, index) => {
                      const { recipe } = entry;
                      const { label, image, url } = recipe;
                      return (
                        <Card
                          key={index}
                          name={label}
                          image={image}
                          link={url}
                        />
                      );
                    })}
                  </div>
                </>
              ) : null}
            </div>
          )
        )}
        {error ? <h2 className={styles.error}>{error}</h2> : null}
      </div>
    </>
  );
};

export default Plant;
