import styles from './TeruTeruBozu.module.css';

type Props = {
    type?: 'normal' | 'sakasa';
    memo?: string;
    date?: string;
    faceType?: 'smile' | 'frown' | 'neutral' | 'none';
};

export default function TeruTeruBozu({ type = 'normal', memo, date, faceType = 'smile' }: Props) {
    const isSakasa = type === 'sakasa';

    return (
        <div className={`${styles.container} ${isSakasa ? styles.sakasa : ''}`}>
            <div className={styles.string}></div>
            <div className={styles.bozu}>
                <div className={styles.head}>
                    {faceType !== 'none' && (
                        <div className={styles.face}>
                            <div className={styles.eye}></div>
                            <div className={styles.eye}></div>
                            <div className={`${styles.mouth} ${styles[faceType]}`}></div>
                        </div>
                    )}
                </div>
                <div className={styles.body}></div>
            </div>
            {memo && (
                <div className={styles.tag}>
                    <div className={styles.date}>{date}</div>
                    <div className={styles.memoText}>{memo}</div>
                </div>
            )}
        </div>
    );
}
