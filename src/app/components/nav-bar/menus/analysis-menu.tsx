'use client'

import styles from '../nav-bar.module.css'
import Link from 'next/link'

interface AnalysisMenuProps {
    title: string,
	onHeaderClick: () => void,
}

const AnalysisMenu = ({ title, onHeaderClick }: AnalysisMenuProps): JSX.Element => {

	return <>
		<div className={styles.links}>
				<a className={styles.link} onClick={onHeaderClick}>{`${title} Analysis`}</a>
				<Link className={styles.link} href={'/'} >{`Back To Favorites`}</Link>
		</div>
	</>
}

export default AnalysisMenu