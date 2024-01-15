import styles from '../slider.module.css'
import PageGrid from "../page-grid"

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
    )
}

export default Slide

