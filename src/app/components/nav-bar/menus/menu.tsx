'use client'

import styles from '../nav-bar.module.css'

interface OpenCardMenuProps {
	leftText: string,
	rightText: string,
	onLeftclick: () => void,
	onRightclick: () => void
}

const Menu = ({ leftText, rightText, onLeftclick, onRightclick}: OpenCardMenuProps): JSX.Element => {

	return <>
		<div className={styles.links}>
				<a className={styles.link} onClick={onLeftclick}>{leftText}</a>
				<a className={styles.link} onClick={onRightclick} >{rightText}</a>
		</div>
	</>
}

export default Menu