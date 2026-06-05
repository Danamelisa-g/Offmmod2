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

// Convierte una fecha normal al formato que se compara con Supabase
const getDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
};

const MoodCalendar = () => {
    const { state } = useAppContext();

    // Emociones del usuario traidas desde Supabase
    const [entries, setEntries] = useState<MoodEntry[]>([]);

    // Mes que se esta mostrando en el calendario
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const userId = state.currentUser?.id;

    useEffect(() => {
        const loadMoodEntries = async () => {
            // Si no hay usuario, no se cargan emociones
            if (!userId) {
                return;
            }

            try {
                // Trae todos los registros de emociones del usuario
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

    // Calcula desde que día debe empezar la cuadricula del calendario
    const firstDayOfMonth = new Date(year, month, 1);
    const startDay = firstDayOfMonth.getDay();
    const calendarStartDate = new Date(year, month, 1 - startDay);

    const calendarDays = [];

    // Se crean los días visibles del calendario, incluyendo algunos del mes anterior o siguiente
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

                    // Busca si para este día hay una emoción guardada
                    const savedEntry = entries.find(
                        (entry) => entry.entry_date === dateKey
                    );

                    // Busca la imagen y datos visuales de esa emoción
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