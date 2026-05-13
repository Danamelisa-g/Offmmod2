// Se importan los moods disponibles.
import { moods } from '../../data/moods';

// Se importa el contexto global.
import { useAppContext } from '../../store/AppContext';


// Se generan las fechas correspondientes
// a la semana actual.
const getCurrentWeekDates = () => {

    const today = new Date();

    const currentDay = today.getDay();

    const startOfWeek = new Date(today);

    startOfWeek.setDate(today.getDate() - currentDay);

    const dayLabels = [
        'sun',
        'mon',
        'tue',
        'wed',
        'thu',
        'fri',
        'sat',
    ];

    const week = [];

    for (let i = 0; i < 7; i++) {

        const currentDate = new Date(startOfWeek);

        currentDate.setDate(startOfWeek.getDate() + i);

        week.push({

            label: dayLabels[i],

            date: currentDate
                .toISOString()
                .split('T')[0],
        });
    }

    return week;
};


const WeekHistory = () => {

    const { state } = useAppContext();

    const weekDates = getCurrentWeekDates();

    // Se verifica si hoy tiene una emoción registrada.
    const today = new Date()
        .toISOString()
        .split('T')[0];

    const todayMood = state.dailyMoods[today];

    // Si hoy todavía no tiene emoción,
    // no se renderiza la sección semanal.
    if (!todayMood) {

        return null;
    }

    return (

        <section className="week-history">

            <div className="week-history-divider"></div>

            <h3 className="week-history-title">
                Your week so far
            </h3>


            <div className="week-history-days">

                {weekDates.map((day) => {

                    const savedMoodKey =
                        state.dailyMoods[day.date];

                    const savedMood = moods.find(
                        (mood) => mood.key === savedMoodKey
                    );

                    return (

                        <div
                            className="week-day"
                            key={day.date}
                        >

                            <div className="week-day-circle">

                                {savedMood ? (

                                    <img
                                        src={savedMood.image}
                                        alt={savedMood.label}
                                    />

                                ) : (

                                    <span className="week-day-dot"></span>
                                )}

                            </div>

                            <p className="week-day-label">
                                {day.label}
                            </p>

                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default WeekHistory;