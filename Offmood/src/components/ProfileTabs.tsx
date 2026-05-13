import React from 'react';
 
// TabId define los dos valores posibles para la pestaña activa
export type TabId = 'posts' | 'liked';
 
// Props que recibe el componente:
// - active: cuál pestaña está seleccionada ahora mismo
// - onChange: función que se llama cuando el usuario cambia de pestaña
interface ProfileTabsProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}
 
const ProfileTabs: React.FC<ProfileTabsProps> = ({ active, onChange }) => {
  return (
    <div className="ptabs">
 
      {/* ── Pestaña "Your Posts" ──
          Si active === 'posts', le agrega la clase --active que pone el color primario
          y la línea debajo. Al hacer clic llama onChange('posts') para actualizar
          el estado en el componente padre (Profile.tsx) */}
      <button
        className={`ptabs-btn ${active === 'posts' ? 'ptabs-btn--active' : ''}`}
        onClick={() => onChange('posts')}
      >
        {/* Ícono de persona */}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        Your Posts
      </button>
 
      {/* ── Pestaña "Liked" ──
          Mismo comportamiento pero para los posts que el usuario le dio like */}
      <button
        className={`ptabs-btn ${active === 'liked' ? 'ptabs-btn--active' : ''}`}
        onClick={() => onChange('liked')}
      >
        {/* Ícono de corazón */}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        Liked
      </button>
 
    </div>
  );
};
 
export default ProfileTabs;