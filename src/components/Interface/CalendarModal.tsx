import { useState } from 'react';
import styles from './CalendarModal.module.css';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (date: string) => void;
};

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

export default function CalendarModal({ isOpen, onClose, onSelect }: Props) {
    const [currentDate, setCurrentDate] = useState(new Date());

    if (!isOpen) return null;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
    const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const handleSelect = (day: number) => {
        const selectedDate = new Date(year, month, day);
        // Format YYYY-MM-DD manually to avoid timezone issues
        const y = selectedDate.getFullYear();
        const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const d = String(selectedDate.getDate()).padStart(2, '0');
        onSelect(`${y}-${m}-${d}`);
        onClose();
    };

    const days = [];
    // Empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
    }
    // Days
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(year, month, d);
        const isPast = dateObj < today;

        days.push(
            <button
                key={d}
                type="button"
                onClick={() => !isPast && handleSelect(d)}
                className={`${styles.day} ${isPast ? styles.past : ''}`}
                disabled={isPast}
            >
                {d}
            </button>
        );
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <button type="button" onClick={prevMonth} className={styles.navButton}>&lt;</button>
                    <h3>{year}年 {month + 1}月</h3>
                    <button type="button" onClick={nextMonth} className={styles.navButton}>&gt;</button>
                </div>
                <div className={styles.calendar}>
                    <div className={styles.weekdays}>
                        {WEEKDAYS.map((w, i) => (
                            <div key={w} className={`${styles.weekday} ${i === 0 ? styles.sunday : ''} ${i === 6 ? styles.saturday : ''}`}>
                                {w}
                            </div>
                        ))}
                    </div>
                    <div className={styles.daysGrid}>
                        {days}
                    </div>
                </div>
                <button type="button" onClick={onClose} className={styles.cancelButton}>閉じる</button>
            </div>
        </div>
    );
}
