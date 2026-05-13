import { moods, type MoodKey } from '../../data/moods';
import { useAppContext } from '../../store/AppContext';
import './MoodSelector.css';
import WeekHistory from './WeekHistory';


// Función para obtener la fecha de hoy. formato: YYYY-MM-DD
const getTodayKey = () => {

    return new Date().toISOString().split('T')[0];
};


const MoodSelector = () => {

    // Obtenemos estado y dispatch del contexto global
    const { state, dispatch } = useAppContext();

    // Fecha actual
    const today = getTodayKey();

    // Mood seleccionado hoy
    const selectedMood = state.dailyMoods[today];


    // Función para seleccionar emoción
    const handleSelectMood = (mood: MoodKey) => {

        dispatch({

            type: 'SET_DAILY_MOOD',

            payload: {
                date: today,
                mood,
            },
        });
    };


    return (

        <section className="mood-selector-card">

            <h3 className="mood-selector-title">
                How are you <span>feeling</span> today?
            </h3>


            <div className="mood-selector-options">

                {moods.map((mood) => (

                    <button
                        key={mood.key}
                        className={`mood-selector-button${selectedMood === mood.key ? ' selected' : ''}`}
                        style={{['--mood-color' as string]: mood.color,} as React.CSSProperties}
                        onClick={() => handleSelectMood(mood.key)}
                        type="button"
                    >
                        <img
                            src={mood.image}
                            alt={mood.label}
                        />

                        <p>
                            {mood.label}
                        </p>
                    </button>
                ))}
            </div>


            <WeekHistory />

        </section>
    );
};

export default MoodSelector;