import styles from './loading.module.css';
import Overlay from '../overlay';

const LoadingSpinner = (): JSX.Element => {
  return (
    <Overlay>
      <div className={styles.spinner}></div>
    </Overlay>
  );
};

export default LoadingSpinner;