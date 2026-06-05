import supabaseClient from './supabaseClient';
import type { MoodKey } from '../data/moods';

export interface MoodEntry {
    id: string;
    created_at: string;
    user_id: string;
    mood: MoodKey;
    entry_date: string;
}

export const getMoodEntries = async (userId: string) => {
    const response = await supabaseClient.get(
        `mood_entries?user_id=eq.${userId}&order=entry_date.asc`
    );

    return response.data as MoodEntry[];
};

export const saveMoodEntry = async (
    userId: string,
    mood: MoodKey,
    entryDate: string
) => {
    const existingResponse = await supabaseClient.get(
        `mood_entries?user_id=eq.${userId}&entry_date=eq.${entryDate}`
    );

    const existingEntry = existingResponse.data?.[0];

    if (existingEntry) {
        const response = await supabaseClient.patch(
            `mood_entries?id=eq.${existingEntry.id}`,
            {
                mood,
            },
            {
                headers: {
                    Prefer: 'return=representation',
                },
            }
        );

        return response.data[0] as MoodEntry;
    }

    const response = await supabaseClient.post(
        'mood_entries',
        {
            user_id: userId,
            mood,
            entry_date: entryDate,
        },
        {
            headers: {
                Prefer: 'return=representation',
            },
        }
    );

    return response.data[0] as MoodEntry;
};