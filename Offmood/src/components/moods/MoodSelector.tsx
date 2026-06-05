import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { moods, type MoodKey } from '../../data/moods';
import { useAppContext } from '../../store/AppContext';
import {
    getMoodEntries,
    saveMoodEntry,
    type MoodEntry,
} from '../../services/moodEntriesService';
import './MoodSelector.css';
import WeekHistory from './WeekHistory';

// Saca la fecha de hoy en el formato que se guarda en Supabase
const getTodayKey = () => {
    return new Date().toISOString().split('T')[0];
};

const MoodSelector = () => {
    const { state } = useAppContext();

    // Aqui se guardan las emociones que vienen de Supabase
    const [entries, setEntries] = useState<MoodEntry[]>([]);

    // Esto lo uso para bloquear los botones mientras se guarda o carga algo
    const [loading, setLoading] = useState(false);

    const today = getTodayKey();

    // Se toma el id real del usuario que inicio sesión
    const userId = state.currentUser?.id;

    // Busca si el usuario ya registro una emoción el día de hoy
    const todayEntry = entries.find((entry) => entry.entry_date === today);
    const selectedMood = todayEntry?.mood;

    useEffect(() => {
        const loadMoodEntries = async () => {
            // Si no hay usuario, no se puede cargar nada
            if (!userId) {
                return;
            }

            try {
                setLoading(true);

                // Carga las emociones guardadas del usuario actual
                const moodEntries = await getMoodEntries(userId);
                setEntries(moodEntries);
            } catch (error) {
                console.error('Error loading mood entries:', error);
            } finally {
                setLoading(false);
            }
        };

        loadMoodEntries();
    }, [userId]);

    const handleSelectMood = async (mood: MoodKey) => {
        if (!userId) {
            console.log('No logged user found');
            return;
        }

        try {
            setLoading(true);

            // Guarda la emoción seleccionada para el día de hoy
            const savedEntry = await saveMoodEntry(userId, mood, today);

            // Actualiza el estado para que se vea el cambio sin recargar la pagina
            setEntries((currentEntries) => {
                const existingIndex = currentEntries.findIndex(
                    (entry) => entry.entry_date === savedEntry.entry_date
                );

                // Si ya estaba ese día en la lista, lo reemplazo
                if (existingIndex >= 0) {
                    const updatedEntries = [...currentEntries];
                    updatedEntries[existingIndex] = savedEntry;
                    return updatedEntries;
                }

                // Si no estaba, lo agrego como una emoción nueva
                return [...currentEntries, savedEntry];
            });
        } catch (error) {
            console.error('Error saving mood entry:', error);
        } finally {
            setLoading(false);
        }
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
                        style={{ '--mood-color': mood.color } as CSSProperties}
                        onClick={() => handleSelectMood(mood.key)}
                        type="button"
                        disabled={loading}
                    >
                        <img src={mood.image} alt={mood.label} />

                        <p>{mood.label}</p>
                    </button>
                ))}
            </div>

            {/* Muestra el resumen de emociones de la semana usando los datos cargados */}
            <WeekHistory entries={entries} />
        </section>
    );
};

export default MoodSelector;