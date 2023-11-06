import styles from './search.module.css'

interface SearchProps {
    children: React.ReactNode
}

const Search = ({ children }: SearchProps): JSX.Element => {
    
    return (
        <div className={styles.container}>
            {children}
        </div>
    )
}

export default Search