import styles from './loading.module.css';

const LoadingSpinner = (): JSX.Element => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default LoadingSpinner;