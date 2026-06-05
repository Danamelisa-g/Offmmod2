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

const getTodayKey = () => {
    return new Date().toISOString().split('T')[0];
};

const MoodSelector = () => {
    const { state } = useAppContext();

    const [entries, setEntries] = useState<MoodEntry[]>([]);
    const [loading, setLoading] = useState(false);

    const today = getTodayKey();
    const userId = state.currentUser?.id;

    const todayEntry = entries.find((entry) => entry.entry_date === today);
    const selectedMood = todayEntry?.mood;

    useEffect(() => {
        const loadMoodEntries = async () => {
            if (!userId) {
                return;
            }

            try {
                setLoading(true);

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

            const savedEntry = await saveMoodEntry(userId, mood, today);

            setEntries((currentEntries) => {
                const existingIndex = currentEntries.findIndex(
                    (entry) => entry.entry_date === savedEntry.entry_date
                );

                if (existingIndex >= 0) {
                    const updatedEntries = [...currentEntries];
                    updatedEntries[existingIndex] = savedEntry;
                    return updatedEntries;
                }

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

            <WeekHistory entries={entries} />
        </section>
    );
};

export default MoodSelector;