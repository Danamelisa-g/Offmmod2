import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import type { Post } from '../types/profile';
import '../styles/posts.css';

const moodColors: Record<string, { bg: string; border: string; text: string }> = {
  Anxious:   { bg: '#fce8f3', border: '#f4a7c3', text: '#c2547a' },
  Angry:     { bg: '#fde8e4', border: '#f47c6a', text: '#c0392b' },
  Happy:     { bg: '#fef6e0', border: '#f7d06e', text: '#b8860b' },
  Disgusted: { bg: '#e6f4ea', border: '#6abf8a', text: '#2e7d32' },
  Sad:       { bg: '#e3f0f8', border: '#7ab3d4', text: '#1565c0' },
};

const moodImgs: Record<string, string> = {
  Anxious:   new URL('../assets/Ansioso.png',    import.meta.url).href,
  Angry:     new URL('../assets/Enojado.png',    import.meta.url).href,
  Happy:     new URL('../assets/Feliz.png',      import.meta.url).href,
  Disgusted: new URL('../assets/Disgustado.png', import.meta.url).href,
  Sad:       new URL('../assets/Triste.png',     import.meta.url).href,
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

interface ProfilePostProps {
  post: Post;
}

const ProfilePost: React.FC<ProfilePostProps> = ({ post }) => {
  const { state, dispatch } = useAppContext();
  const [commentInput, setCommentInput] = useState('');

  const isLiked = state.likedPostIds.includes(post.id);
  const likeCount = state.postLikes[post.id] ?? post.likes;
  const comments = state.postComments[post.id] ?? (post.lastComment ? [{ user: post.lastComment.author, text: post.lastComment.text }] : []);

  const handleLike = () => {
    const current = state.postLikes[post.id] ?? post.likes;
    dispatch({ type: 'TOGGLE_LIKE', payload: post.id });
    dispatch({ type: 'SET_POST_LIKES', payload: { id: post.id, count: isLiked ? current - 1 : current + 1 } });
  };

  const handleComment = () => {
    const text = commentInput.trim();
    if (!text) return;
    dispatch({
      type: 'SET_POST_COMMENT',
      payload: { id: post.id, comments: [...comments, { user: state.currentUser?.name ?? 'Usuario', text }] },
    });
    setCommentInput('');
  };

  const mood = moodColors[post.mood] ?? moodColors.Happy;

  // intenta parsear la fecha, si falla usa el string directo
  const timeDisplay = (() => {
    const parsed = new Date(post.timeAgo);
    return isNaN(parsed.getTime()) ? post.timeAgo : timeAgo(post.timeAgo);
  })();

  return (
    <article className="home-card home-post">

      {/* Header */}
      <div className="post-header">
        <div className="post-author">
          <img src={post.authorAvatar} alt={post.authorName} className="post-avatar" />
          <div>
            <span className="post-username">{post.authorName}</span>
            <span className="post-time">{timeDisplay}</span>
          </div>
        </div>
        <div className="post-mood-badge" style={{ background: mood.bg, borderColor: mood.border, color: mood.text }}>
          <img src={moodImgs[post.mood] ?? post.moodImage} alt={post.mood} className="post-mood-icon" />
          <span>{post.mood}</span>
        </div>
      </div>

      {/* Contenido */}
      <p className="post-content">{post.content}</p>

      {/* Imagen */}
      {post.image && <img src={post.image} alt="post" className="post-image" />}

      {/* Acciones */}
      <div className="post-actions">
        <button
          className="post-action-btn"
          onClick={handleLike}
          style={{ color: isLiked ? '#e0345a' : undefined }}
        >
          {isLiked ? '♥' : '♡'} {likeCount}
        </button>
        <button className="post-action-btn">
          ○ {comments.length}
        </button>
      </div>

      {/* Comentarios */}
      {comments.map((c, i) => (
        <div key={i} className="post-comment">
          <span className="post-comment-user">{c.user}</span>
          <span className="post-comment-text"> {c.text}</span>
        </div>
      ))}

      {/* Input comentario */}
      <div className="post-comment-input">
        <img src={state.currentUser?.avatar ?? post.authorAvatar} alt="avatar" className="post-avatar-sm" />
        <input
          type="text"
          placeholder="Write your comment..."
          maxLength={200}
          value={commentInput}
          onChange={e => setCommentInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleComment(); }}
          className="post-input"
        />
        <span style={{ fontSize: '0.75rem', color: '#bbb', textAlign: 'right' }}>
          {commentInput.length}/200
        </span>
      </div>

    </article>
  );
};

export default ProfilePost;