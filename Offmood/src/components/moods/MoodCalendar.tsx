import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { moods } from '../../data/moods';
import { useAppContext } from '../../store/AppContext';
import {
    getMoodEntries,
    type MoodEntry,
} from '../../services/moodEntriesService';
import './MoodCalendar.css';

const weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const getDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
};

const MoodCalendar = () => {
    const { state } = useAppContext();

    const [entries, setEntries] = useState<MoodEntry[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const userId = state.currentUser?.id;

    useEffect(() => {
        const loadMoodEntries = async () => {
            if (!userId) {
                return;
            }

            try {
                const moodEntries = await getMoodEntries(userId);
                setEntries(moodEntries);
            } catch (error) {
                console.error('Error loading calendar mood entries:', error);
            }
        };

        loadMoodEntries();
    }, [userId]);

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startDay = firstDayOfMonth.getDay();
    const calendarStartDate = new Date(year, month, 1 - startDay);

    const calendarDays = [];

    for (let i = 0; i < 35; i++) {
        const date = new Date(calendarStartDate);
        date.setDate(calendarStartDate.getDate() + i);

        calendarDays.push(date);
    }

    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(year, month - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth(new Date(year, month + 1, 1));
    };

    return (
        <section className="mood-calendar-card">
            <div className="mood-calendar-header">
                <h2>
                    {monthNames[month]} {year}
                </h2>

                <div className="mood-calendar-actions">
                    <button type="button" onClick={goToPreviousMonth}>
                        <ChevronLeft size={24} />
                    </button>

                    <button type="button" onClick={goToNextMonth}>
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            <div className="mood-calendar-weekdays">
                {weekDays.map((day) => (
                    <span key={day}>{day}</span>
                ))}
            </div>

            <div className="mood-calendar-grid">
                {calendarDays.map((date) => {
                    const dateKey = getDateKey(date);

                    const savedEntry = entries.find(
                        (entry) => entry.entry_date === dateKey
                    );

                    const savedMood = moods.find(
                        (mood) => mood.key === savedEntry?.mood
                    );

                    const isCurrentMonth = date.getMonth() === month;

                    return (
                        <div
                            key={dateKey}
                            className={`mood-calendar-day ${!isCurrentMonth ? 'outside-month' : ''}`}
                        >
                            <div className="mood-calendar-circle">
                                {savedMood ? (
                                    <img src={savedMood.image} alt={savedMood.label} />
                                ) : (
                                    <span className="mood-calendar-dot"></span>
                                )}
                            </div>

                            <p>{date.getDate()}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default MoodCalendar;