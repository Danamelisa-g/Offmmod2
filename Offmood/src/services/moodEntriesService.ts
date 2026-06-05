import supabaseClient from './supabaseClient';
import type { MoodKey } from '../data/moods';

// Esta es la forma que tiene cada registro de emoción que viene de Supabase
export interface MoodEntry {
    id: string;
    created_at: string;
    user_id: string;
    mood: MoodKey;
    entry_date: string;
}

// Trae todas las emociones guardadas del usuario que esta logueado
export const getMoodEntries = async (userId: string) => {
    const response = await supabaseClient.get(
        `mood_entries?user_id=eq.${userId}&order=entry_date.asc`
    );

    return response.data as MoodEntry[];
};

// Guarda la emoción del usuario en un día especifico
export const saveMoodEntry = async (
    userId: string,
    mood: MoodKey,
    entryDate: string
) => {
    // Primero reviso si ya existe una emoción guardada para ese usuario en ese día
    const existingResponse = await supabaseClient.get(
        `mood_entries?user_id=eq.${userId}&entry_date=eq.${entryDate}`
    );

    const existingEntry = existingResponse.data?.[0];

    // Si ya existe, no creo otra fila, solo actualizo la emoción
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

    // Si no existe una emoción para ese día, se crea un registro nuevo
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