import styles from '../nav-bar.module.css';

interface MenuProps {
	leftText: string,
	rightText?: string,
	rightIsLink?: boolean,
	onLeftclick: () => void,
	onRightclick?: () => void
}

const Menu = ({ leftText, rightText, rightIsLink, onLeftclick, onRightclick}: MenuProps): JSX.Element => {

	return (
		<>
			<div className={styles.links}>
				<a className={styles.link} onClick={onLeftclick}>← {leftText}</a>
				{rightText && (
					<a
						className={rightIsLink ? styles.link : `${styles.link} ${styles.nav_button}`}
						onClick={onRightclick}
					>
						{rightText}{rightIsLink ? ' →' : ''}
					</a>
				)}
			</div>
		</>
	);
}

export default Menu;