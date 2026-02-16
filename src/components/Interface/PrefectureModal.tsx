import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './PrefectureModal.module.css';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (pref: string) => void;
};

const REGIONS = [
    { name: '北海道・東北', prefs: ['北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県'] },
    { name: '関東', prefs: ['茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県'] },
    { name: '中部', prefs: ['新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県', '三重県'] },
    { name: '近畿', prefs: ['滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県'] },
    { name: '中国・四国', prefs: ['鳥取県', '島根県', '岡山県', '広島県', '山口県', '徳島県', '香川県', '愛媛県', '高知県'] },
    { name: '九州・沖縄', prefs: ['福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'] },
];

export default function PrefectureModal({ isOpen, onClose, onSelect }: Props) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3>場所を選択</h3>
                    <button onClick={onClose} className={styles.closeButton}>×</button>
                </div>
                <div className={styles.content}>
                    {REGIONS.map((region) => (
                        <div key={region.name} className={styles.region}>
                            <h4>{region.name}</h4>
                            <div className={styles.prefGrid}>
                                {region.prefs.map((pref) => (
                                    <button
                                        key={pref}
                                        onClick={() => {
                                            onSelect(pref);
                                            onClose();
                                        }}
                                        className={styles.prefButton}
                                    >
                                        {pref}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>,
        document.body
    );
}
