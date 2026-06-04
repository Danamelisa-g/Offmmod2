import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/index';
import { fetchPosts } from '../store/slices/postsSlice';
import { fetchCommentsByPost, createComment } from '../store/slices/commentsSlice';
import './Home.css';
import MoodSelector from '../components/moods/MoodSelector';

const moodColors: Record<string, { bg: string; border: string; text: string }> = {
  anxious:   { bg: '#fce8f3', border: '#f4a7c3', text: '#c2547a' },
  angry:     { bg: '#fde8e4', border: '#f47c6a', text: '#c0392b' },
  happy:     { bg: '#fef6e0', border: '#f7d06e', text: '#b8860b' },
  disgusted: { bg: '#e6f4ea', border: '#6abf8a', text: '#2e7d32' },
  sad:       { bg: '#e3f0f8', border: '#7ab3d4', text: '#1565c0' },
};

const moodImgs: Record<string, string> = {
  anxious:   new URL('../assets/Ansioso.png',    import.meta.url).href,
  angry:     new URL('../assets/Enojado.png',    import.meta.url).href,
  happy:     new URL('../assets/Feliz.png',      import.meta.url).href,
  disgusted: new URL('../assets/Disgustado.png', import.meta.url).href,
  sad:       new URL('../assets/Triste.png',     import.meta.url).href,
};

const moodLabels: Record<string, string> = {
  anxious: 'Anxious', angry: 'Angry', happy: 'Happy', disgusted: 'Disgusted', sad: 'Sad',
};

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading } = useSelector((state: RootState) => state.posts);
  const { comments } = useSelector((state: RootState) => state.comments);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
  const [localLikes, setLocalLikes] = useState<Record<string, number>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleExpandComments = (postId: string) => {
    if (!expandedPosts[postId]) {
      dispatch(fetchCommentsByPost(postId));
    }
    setExpandedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleLike = (postId: string) => {
    const isLiked = likedPosts[postId];
    setLikedPosts(prev => ({ ...prev, [postId]: !isLiked }));
    setLocalLikes(prev => ({ ...prev, [postId]: (prev[postId] ?? 0) + (isLiked ? -1 : 1) }));
  };

  const handleComment = async (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    await dispatch(createComment({
      post_id: postId,
      user_id: 'temp-user-id', // se reemplaza cuando Urbina conecte auth
      content: text,
    }));
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const postComments = (postId: string) =>
    comments.filter(c => c.post_id === postId);

  if (loading) return <div className="home-page"><p>Loading posts...</p></div>;

  return (
    <div className="home-page">

      <MoodSelector />

      {posts.map(post => {
        const mood = moodColors[post.mood ?? 'happy'] ?? moodColors.happy;
        const isLiked = likedPosts[post.id] ?? false;
        const likeCount = localLikes[post.id] ?? 0;
        const expanded = expandedPosts[post.id] ?? false;
        const postCommentsData = postComments(post.id);

        return (
          <div key={post.id} className="home-card home-post">

            {/* Header */}
            <div className="post-header">
              <div className="post-author">
                <div>
                  <span className="post-username">{post.user_id}</span>
                  <span className="post-time">{timeAgo(post.created_at)}</span>
                </div>
              </div>
              <div className="post-mood-badge" style={{ background: mood.bg, borderColor: mood.border, color: mood.text }}>
                <img src={moodImgs[post.mood ?? 'happy']} alt={post.mood ?? 'happy'} className="post-mood-icon" />
                <span>{moodLabels[post.mood ?? 'happy'] ?? post.mood}</span>
              </div>
            </div>

            {/* Contenido */}
            <p className="post-content">{post.content}</p>

            {/* Imagen */}
            {post.image_url && <img src={post.image_url} alt="post" className="post-image" />}

            {/* Acciones */}
            <div className="post-actions">
              <button
                className="post-action-btn"
                onClick={() => handleLike(post.id)}
                style={{ color: isLiked ? '#e0345a' : undefined }}
              >
                {isLiked ? '♥' : '♡'} {likeCount}
              </button>
              <button className="post-action-btn" onClick={() => handleExpandComments(post.id)}>
                ○ {postCommentsData.length}
              </button>
            </div>

            {/* Comentarios */}
            {expanded && (
              <>
                {postCommentsData.map((c) => (
                  <div key={c.id} className="post-comment">
                    <span className="post-comment-user">{c.user_id}</span>
                    <span className="post-comment-text"> {c.content}</span>
                  </div>
                ))}

                {/* Input comentario */}
                <div className="post-comment-input">
                  <input
                    type="text"
                    placeholder="Write your comment..."
                    maxLength={200}
                    value={commentInputs[post.id] ?? ''}
                    onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') handleComment(post.id); }}
                    className="post-input"
                  />
                  <span style={{ fontSize: '0.75rem', color: '#bbb', textAlign: 'right' }}>
                    {(commentInputs[post.id] ?? '').length}/200
                  </span>
                </div>
              </>
            )}

          </div>
        );
      })}
    </div>
  );
};

export default Home;