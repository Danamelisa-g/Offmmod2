import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/index';
import { useAppContext } from '../../store/AppContext';
import ProfileHeader from '../../components/ProfileHeader';
import ProfileTabs, { type TabId } from '../../components/ProfileTabs';
import ProfilePost from '../../components/ProfilePost';
import type { Post } from '../../types/profile';
import './profile.css';

const moodImgMap: Record<string, string> = {
  anxious: 'Ansioso',
  angry: 'Enojado',
  happy: 'Feliz',
  disgusted: 'Disgustado',
  sad: 'Triste',
};

const Profile: React.FC = () => {
  const { state: appState } = useAppContext();
  const { posts } = useSelector((state: RootState) => state.posts);
  const { userLikes, allLikes } = useSelector((state: RootState) => state.likes);
  const currentUserId = appState.currentUser?.id ?? '';
  const [activeTab, setActiveTab] = useState<TabId>('posts');


  const myPosts: Post[] = posts
    .filter(p => p.user_id === currentUserId)
    .map(p => ({
      id: String(p.id),
      authorName: appState.currentUser?.name ?? p.user_id,
      authorAvatar: appState.currentUser?.avatar ?? '',
      timeAgo: p.created_at,
      content: p.content,
      image: p.image_url,
      mood: p.mood ? p.mood.charAt(0).toUpperCase() + p.mood.slice(1) : 'Happy',
      moodImage: `/src/assets/${moodImgMap[p.mood ?? 'happy'] ?? 'Feliz'}.png`,
      moodColor: '',
      likes: allLikes.filter((l: { post_id: string }) => l.post_id === p.id).length,
      commentsCount: 0,
      lastComment: null,
    }));

  const likedPostIds = userLikes.map((l: { post_id: string }) => l.post_id);

  const likedPosts: Post[] = posts
    .filter(p => likedPostIds.includes(p.id))
    .map(p => ({
      id: String(p.id),
      authorName: p.profiles?.username ?? p.user_id,
      authorAvatar: '',
      timeAgo: p.created_at,
      content: p.content,
      image: p.image_url,
      mood: p.mood ? p.mood.charAt(0).toUpperCase() + p.mood.slice(1) : 'Happy',
      moodImage: `/src/assets/${moodImgMap[p.mood ?? 'happy'] ?? 'Feliz'}.png`,
      moodColor: '',
      likes: allLikes.filter((l: { post_id: string }) => l.post_id === p.id).length,
      commentsCount: 0,
      lastComment: null,
    }));

  const profileWithStats = {
    ...appState.profile,
    name: appState.currentUser?.name ?? appState.profile.name,
    avatar: appState.currentUser?.avatar ?? appState.profile.avatar,
    stats: {
      ...appState.profile.stats,
      posts: myPosts.length,
      comments: appState.profile.stats.comments,
      followers: appState.profile.stats.followers,
    },
  };

  const displayPosts = activeTab === 'posts' ? myPosts : likedPosts;
console.log('userLikes:', userLikes);
console.log('likedPostIds:', likedPostIds);
console.log('posts ids:', posts.map(p => p.id));
  return (
    <div className="profile-page">
      <ProfileHeader profile={profileWithStats} />
      <ProfileTabs active={activeTab} onChange={setActiveTab} />
      <div className="profile-feed">
        {displayPosts.length === 0
          ? <p style={{ textAlign: 'center', color: '#aaa', padding: '32px' }}>
              {activeTab === 'posts' ? 'No posts yet.' : 'No liked posts yet.'}
            </p>
          : displayPosts.map(post => <ProfilePost key={post.id} post={post} />)
        }
      </div>
    </div>
  );
};

export default Profile;