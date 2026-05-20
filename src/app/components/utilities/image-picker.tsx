'use client';
import { useRef, useState } from 'react';
import styles from './image-picker.module.css';

interface ImagePickerProps {
    availableImages: string[];
    onFile: (file: File) => void;
    onUrl: (url: string) => void;
    onClose?: () => void;
    emptyHint?: string;
    selectedUrl?: string | null;
}

const ImagePicker = ({ availableImages, onFile, onUrl, onClose, emptyHint = 'Or add ingredients to pick from their images.', selectedUrl }: ImagePickerProps): JSX.Element => {
    const fileRef = useRef<HTMLInputElement | null>(null);
    const cameraRef = useRef<HTMLInputElement | null>(null);
    const [dragOver, setDragOver] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length === 1) {
            onFile(e.target.files[0]);
            e.target.value = '';
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) onFile(file);
    };

    const filtered = availableImages.filter(Boolean);

    return (
        <div className={styles.picker}>
            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />

            <div className={styles.upload_row}>
                <div
                    className={dragOver ? `${styles.drop_zone} ${styles.drop_zone_over}` : styles.drop_zone}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 16 12 12 8 16" />
                        <line x1="12" y1="12" x2="12" y2="21" />
                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                    </svg>
                    <span className={styles.drop_label}>
                        {dragOver ? 'Drop to upload' : 'Choose file'}
                    </span>
                </div>

                <button
                    type="button"
                    className={styles.camera_btn}
                    onClick={() => cameraRef.current?.click()}
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                    </svg>
                    <span className={styles.drop_label}>Take photo</span>
                </button>
            </div>

            {filtered.length > 0 ? (
                <>
                    <p className={styles.or_label}>Or choose from ingredients:</p>
                    <div className={styles.grid}>
                        {filtered.map((url, i) => {
                            const isSelected = url === selectedUrl;
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    className={isSelected ? `${styles.thumb} ${styles.thumb_selected}` : styles.thumb}
                                    onClick={() => onUrl(url)}
                                >
                                    <img src={url} alt="" />
                                    {isSelected && <span className={styles.thumb_check}>✓</span>}
                                </button>
                            );
                        })}
                    </div>
                </>
            ) : (
                <p className={styles.or_label}>{emptyHint}</p>
            )}
            {onClose && <button type="button" className={styles.cancel_btn} onClick={onClose}>Cancel</button>}
        </div>
    );
};

export default ImagePicker;
