export interface Post {
  id: number;
  userId: string;
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
    userId: 'other',
    user: "Sarah Chen",
    avatar: "https://i.pravatar.cc/40?img=5",
    content: "Finally finished that project I've been working on! I didn't came out the way i wanted, but it's a process, thanks for all the support you guys gave me 💙",
    image: null,
    date: "2026-05-11T10:00:00.000Z",
    mood: "sad"
  },
  {
    id: 2,
    userId: 'other',
    user: "Alex Rivera",
    avatar: "https://i.pravatar.cc/40?img=8",
    content: "Spent the morning meditating by the lake. I've been going thru a lot of things an changes in mi life lately. Sometimes we need to slow down and just breathe.\n\nTake som time to care of yourselves",
    image: null,
    date: "2026-05-11T07:00:00.000Z",
    mood: "anxious"
  },
  {
    id: 3,
    userId: 'other',
    user: "María Rivas",
    avatar: "https://i.pravatar.cc/40?img=10",
    content: "Sometimes silence speaks louder than words 🌿",
    image: null,
    date: "2026-05-10T15:00:00.000Z",
    mood: "sad"
  },
  {
    id: 4,
    userId: 'other',
    user: "Carlos M.",
    avatar: "https://i.pravatar.cc/40?img=12",
    content: "Nature really is amazing, is such a shame some people dont care about it",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80",
    date: "2026-05-09T12:00:00.000Z",
    mood: "angry"
  }
];