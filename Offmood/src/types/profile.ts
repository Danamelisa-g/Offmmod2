export interface WeekMood {
  day: string;
  mood: string | null;
  image: string | null;
  color: string;
}
 
export interface ProfileStats {
  posts: number;
  comments: number;
  followers: number;
}
 
export interface ProfileData {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  stats: ProfileStats;
  moodVisibility: 'public' | 'followers' | 'private';
  weekMoods: WeekMood[];
}
 
export interface LastComment {
  author: string;
  text: string;
}
 
export interface Post {
  id: number;
  authorName: string;
  authorAvatar: string;
  timeAgo: string;
  content: string;
  image: string | null;
  mood: string;
  moodImage: string;
  moodColor: string;
  likes: number;
  commentsCount: number;
  lastComment: LastComment | null;
}