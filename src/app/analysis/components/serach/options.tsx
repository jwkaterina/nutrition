import styles from './search.module.css';

interface OptionsProps {
	queryOptions: string[] | null;
	onclick: (e: any) => Promise<void>;
}

const Options = ({queryOptions, onclick }: OptionsProps): JSX.Element => {
    
	return (
		<div className={`${styles.options}`}>
			<ul>
				<li onClick={onclick}>{queryOptions ? queryOptions[0] : 'apple'}</li>
				<li onClick={onclick}>{queryOptions ? queryOptions[1] : 'rice'}</li>
				<li onClick={onclick}>{queryOptions ? queryOptions[2] : 'broccoli'}</li>
			</ul>
		</div>
	);
}

export default Options;