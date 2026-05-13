import React, { useState } from 'react';
import { useAppContext } from '../../store/AppContext';
import ProfileHeader from '../../components/ProfileHeader';
import ProfileTabs, { type TabId } from '../../components/ProfileTabs';
import ProfilePost from '../../components/ProfilePost';
import type { Post } from '../../types/profile';
import './profile.css';

const Profile: React.FC = () => {
  const { state } = useAppContext();
  const [activeTab, setActiveTab] = useState<TabId>('posts');

  // Convierte los posts del estado global al formato que espera ProfilePost
  const myPosts: Post[] = state.posts
    .filter(p => p.user === state.currentUser?.name)
    .map(p => ({
      id: p.id,
      authorName: p.user,
      authorAvatar: p.avatar,
      timeAgo: p.date,
      content: p.content,
      image: p.image,
      mood: p.mood.charAt(0).toUpperCase() + p.mood.slice(1),
      moodImage: `/src/assets/${
        p.mood === 'anxious' ? 'Ansioso' :
        p.mood === 'angry' ? 'Enojado' :
        p.mood === 'happy' ? 'Feliz' :
        p.mood === 'disgusted' ? 'Disgustado' : 'Triste'
      }.png`,
      moodColor: '',
      likes: 0,
      commentsCount: 0,
      lastComment: null,
    }));

  // Posts likeados desde el feed
  const likedPosts: Post[] = state.posts
    .filter(p => state.likedPostIds.includes(p.id))
    .map(p => ({
      id: p.id,
      authorName: p.user,
      authorAvatar: p.avatar,
      timeAgo: p.date,
      content: p.content,
      image: p.image,
      mood: p.mood.charAt(0).toUpperCase() + p.mood.slice(1),
      moodImage: `/src/assets/${
        p.mood === 'anxious' ? 'Ansioso' :
        p.mood === 'angry' ? 'Enojado' :
        p.mood === 'happy' ? 'Feliz' :
        p.mood === 'disgusted' ? 'Disgustado' : 'Triste'
      }.png`,
      moodColor: '',
      likes: 0,
      commentsCount: 0,
      lastComment: null,
    }));

  const posts = activeTab === 'posts' ? myPosts : likedPosts;

  return (
    <div className="profile-page">
      <ProfileHeader profile={state.profile} />
      <ProfileTabs active={activeTab} onChange={setActiveTab} />
      <div className="profile-feed">
        {posts.length === 0
          ? <p style={{ textAlign: 'center', color: '#aaa', padding: '32px' }}>
              {activeTab === 'posts' ? 'No posts yet.' : 'No liked posts yet.'}
            </p>
          : posts.map(post => <ProfilePost key={post.id} post={post} />)
        }
      </div>
    </div>
  );
};

export default Profile;