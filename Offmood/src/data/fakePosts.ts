export interface Post {
  id: number;
  user: string;
  avatar: string;
  content: string;
  image: string | null;
  date: string;
  mood: string;
}

export const fakePosts: Post[] = [
  {
    id: 1,
    user: "Adam Smith",
    avatar: "https://i.pravatar.cc/40?img=3",
    content: "Hoy fue un día increíble, me siento muy agradecido 😊",
    image: null,
    date: "2026-05-12",
    mood: "happy"
  },
  {
    id: 2,
    user: "Adam Smith",
    avatar: "https://i.pravatar.cc/40?img=3",
    content: "Reflexionando sobre la semana... hay cosas que mejorar pero voy bien.",
    image: null,
    date: "2026-05-11",
    mood: "happy"
  },
  {
    id: 3,
    user: "Adam Smith",
    avatar: "https://i.pravatar.cc/40?img=3",
    content: "No fue el mejor día, pero mañana es otro día 💪",
    image: null,
    date: "2026-05-10",
    mood: "sad"
  }
];