const COLORS = [
    '#7E57C2',
    '#26A69A',
    '#EF5350',
    '#42A5F5',
    '#66BB6A',
    '#FFA726',
    '#AB47BC',
    '#26C6DA',
    '#EC407A',
    '#78909C',
];

const hashColor = (name: string): string => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return COLORS[Math.abs(hash) % COLORS.length];
};

interface CardPlaceholderProps {
    name: string;
    size: number;
    fontSize?: number;
    borderRadius?: string;
}

const CardPlaceholder = ({ name, size, fontSize, borderRadius = '0.25rem' }: CardPlaceholderProps): JSX.Element => {
    const letter = name.trim().charAt(0).toUpperCase();
    const bg = hashColor(name);
    const fs = fontSize ?? Math.round(size * 0.45);

    return (
        <div style={{
            width: size,
            height: size,
            minWidth: size,
            borderRadius,
            background: bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: fs,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            userSelect: 'none',
        }}>
            {letter}
        </div>
    );
};

export default CardPlaceholder;
