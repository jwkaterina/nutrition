import PageGrid from "../page-grid";
import styles from '../slider.module.css';

interface SlideProps {
    children: React.ReactNode
}

const Slide = ({ children }: SlideProps): JSX.Element => {

    return (
        <div className={styles.slide}>
            <PageGrid>
                {children}
            </PageGrid>
        </div>
    );
}

export default Slide;

