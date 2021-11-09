import styles from "./Card.module.css";

const Card = ({ name, image }) => {
  return (
    <div className={styles.card}>
      <img className={styles.image} src={image} alt={name} />
      <p className={styles.info}>
        <span className={styles.name}>{name}</span>
      </p>
    </div>
  );
};

export default Card;
