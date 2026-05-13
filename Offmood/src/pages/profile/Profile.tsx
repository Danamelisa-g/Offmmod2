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

  const myPosts: Post[] = state.posts
    .filter(p => p.userId === state.currentUser?.id)
    .map(p => ({
      id: p.id,
      authorName: state.currentUser?.name ?? p.user,
      authorAvatar: state.currentUser?.avatar ?? p.avatar,
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

  const likedPosts: Post[] = state.posts
    .filter(p => state.likedPostIds.includes(p.id))
    .map(p => ({
      id: p.id,
      authorName: p.userId === state.currentUser?.id ? (state.currentUser?.name ?? p.user) : p.user,
      authorAvatar: p.userId === state.currentUser?.id ? (state.currentUser?.avatar ?? p.avatar) : p.avatar,
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

  // Stats calculados desde el estado real
  const myPostsCount = myPosts.length;
  const myCommentsCount = Object.values(state.postComments)
    .flat()
    .filter(c => c.user === state.currentUser?.name).length;

  const profileWithStats = {
    ...state.profile,
    stats: {
      ...state.profile.stats,
      posts: myPostsCount,
      comments: myCommentsCount,
    },
  };

  const posts = activeTab === 'posts' ? myPosts : likedPosts;

  return (
    <div className="profile-page">
      <ProfileHeader profile={profileWithStats} />
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