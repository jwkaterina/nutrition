'use client'

import styles from '../nav-bar.module.css'
import Link from 'next/link'

interface AnalysisMenuProps {
    title: string
}

const AnalysisMenu = ({ title }: AnalysisMenuProps): JSX.Element => {

	return <>
		<div className={styles.links}>
				<a className={styles.link}>{`${title} Analysis`}</a>
				<Link className={styles.link} href={'/'} >{`Back To Favorites`}</Link>
		</div>
	</>
}

export default AnalysisMenu