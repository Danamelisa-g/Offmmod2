import { moods } from '../../data/moods';
import type { MoodEntry } from '../../services/moodEntriesService';

interface WeekHistoryProps {
    entries: MoodEntry[];
}

// Arma la semana actual desde domingo hasta sabado
const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);

    startOfWeek.setDate(today.getDate() - currentDay);

    const dayLabels = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    const week = [];

    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startOfWeek);

        currentDate.setDate(startOfWeek.getDate() + i);

        week.push({
            label: dayLabels[i],
            date: currentDate.toISOString().split('T')[0],
        });
    }

    return week;
};

const WeekHistory = ({ entries }: WeekHistoryProps) => {
    const weekDates = getCurrentWeekDates();

    const today = new Date().toISOString().split('T')[0];

    // Solo se muestra el historial semanal si ya hay una emoción registrada hoy
    const todayMood = entries.find((entry) => entry.entry_date === today);

    if (!todayMood) {
        return null;
    }

    return (
        <section className="week-history">
            <div className="week-history-divider"></div>

            <h3 className="week-history-title">Your week so far</h3>

            <div className="week-history-days">
                {weekDates.map((day) => {
                    // Revisa si cada día de la semana tiene una emoción guardada
                    const savedEntry = entries.find(
                        (entry) => entry.entry_date === day.date
                    );

                    const savedMood = moods.find(
                        (mood) => mood.key === savedEntry?.mood
                    );

                    return (
                        <div className="week-day" key={day.date}>
                            <div className="week-day-circle">
                                {savedMood ? (
                                    <img src={savedMood.image} alt={savedMood.label} />
                                ) : (
                                    <span className="week-day-dot"></span>
                                )}
                            </div>

                            <p className="week-day-label">{day.label}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default WeekHistory;