// Importamos las imágenes de emociones.
// IMPORTANTE:
// Los nombres deben coincidir EXACTAMENTE con tus archivos reales.
import anxiousImg from '../assets/Ansioso.png';
import angryImg from '../assets/Enojado.png';
import happyImg from '../assets/Feliz.png';
import disgustedImg from '../assets/Disgustado.png';
import sadImg from '../assets/Triste.png';


// Creamos un tipo para las emociones.
// Esto ayuda a TypeScript a saber cuáles emociones existen.
export type MoodKey =
    | 'anxious'
    | 'angry'
    | 'happy'
    | 'disgusted'
    | 'sad';


// Aquí guardamos TODA la información de cada emoción.
// Después podremos reutilizar esto en:
// - Home
// - Calendario
// - Perfil
export const moods = [
    {
        key: 'anxious' as MoodKey,
        label: 'Anxious',
        image: anxiousImg,
        color: '#F5A8C8',
    },

    {
        key: 'angry' as MoodKey,
        label: 'Angry',
        image: angryImg,
        color: '#F47C6A',
    },

    {
        key: 'happy' as MoodKey,
        label: 'Happy',
        image: happyImg,
        color: '#F7D36D',
    },

    {
        key: 'disgusted' as MoodKey,
        label: 'Disgusted',
        image: disgustedImg,
        color: '#79C99E',
    },

    {
        key: 'sad' as MoodKey,
        label: 'Sad',
        image: sadImg,
        color: '#7CB7D8',
    },
];