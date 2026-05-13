import React, { useState } from 'react';
import { useAppContext } from '../../store/AppContext';
import ProfileHeader from '../../components/ProfileHeader';
import ProfileTabs, { type TabId } from '../../components/ProfileTabs';
import ProfilePost from '../../components/ProfilePost';
import mockData from '../../services/mockData.json';
import type { Post } from '../../types/profile';
import './profile.css';

const Profile: React.FC = () => {
  // state tiene el perfil del usuario (nombre, bio, moods, stats...)
  const { state } = useAppContext();

  // controla cuál pestaña está activa: 'posts' o 'liked'
  // arranca en 'posts' por defecto
  const [activeTab, setActiveTab] = useState<TabId>('posts');

  // dependiendo de la pestaña activa, carga los posts del usuario
  // o los posts que le dió like — ambos vienen del mockData
  const posts: Post[] =
    activeTab === 'posts'
      ? (mockData.posts as Post[])
      : (mockData.likedPosts as Post[]);

  return (
    <div className="profile-page">

      {/* tarjeta de arriba con el avatar, nombre, bio, stats y los moods de la semana
          recibe state.profile que viene del AppContext */}
      <ProfileHeader profile={state.profile} />

      {/* las dos pestañas: "Your Posts" y "Liked"
          active le dice cuál está seleccionada
          onChange actualiza el estado activeTab cuando el usuario cambia de pestaña */}
      <ProfileTabs active={activeTab} onChange={setActiveTab} />

      {/* lista de posts — recorre el array y crea un ProfilePost por cada uno
          key={post.id} es obligatorio para que React los identifique */}
      <div className="profile-feed">
        {posts.map((post) => (
          <ProfilePost key={post.id} post={post} />
        ))}
      </div>

    </div>
  );
};

export default Profile;