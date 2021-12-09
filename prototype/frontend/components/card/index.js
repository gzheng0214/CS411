import styles from "./Card.module.css";
import Link from "next/link";

const Card = ({ name, image, link }) => {
  return (
    <div className={styles.card}>
      {link ? (
        <a href={link} target="_blank">
          <img className={styles.image} src={image} alt={name} />
        </a>
      ) : (
        <Link href={`/plants/${name}`}>
          <img className={styles.image} src={image} alt={name} />
        </Link>
      )}
      <p className={styles.info}>
        <span className={styles.name}>{name}</span>
      </p>
    </div>
  );
};

export default Card;
