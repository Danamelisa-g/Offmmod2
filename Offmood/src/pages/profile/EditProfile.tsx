import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../store/AppContext';
import type { ProfileData } from '../../types/profile';
import './editProfile.css';

/* 
   SUB-COMPONENTE: AvatarSection
 */
interface AvatarSectionProps {
  avatar: string;
  name: string;
  onChange: (base64: string) => void;
}

// muestra la foto de perfil actual y el botón para cambiarla
// cuando el usuario elige una imagen, la convierte a base64 y llama onChange
const AvatarSection: React.FC<AvatarSectionProps> = ({ avatar, name, onChange }) => {
  const ref = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="ep-field">
      <span className="ep-label">Profile Picture</span>
      <div className="ep-avatar-row">
        <div className="ep-avatar-ring">
          {/* si tiene avatar muestra la imagen, si no muestra la inicial del nombre */}
          {avatar
            ? <img src={avatar} alt={name} className="ep-avatar-img" />
            : <div className="ep-avatar-init">{name.charAt(0)}</div>
          }
        </div>
        <div className="ep-avatar-side">
          {/* al hacer clic dispara el input de archivo oculto */}
          <button className="ep-change-btn" onClick={() => ref.current?.click()}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            Change Profile Picture
          </button>
          <p className="ep-avatar-hint">JPG, PNG or GIF. Max size 70MB</p>
          {/* input oculto — solo se activa cuando el botón de arriba hace clic */}
          <input ref={ref} type="file" accept="image/*"
            style={{ display: 'none' }} onChange={handleFile} />
        </div>
      </div>
    </div>
  );
};

/* 
   SUB-COMPONENTE: VisibilityPicker
*/
type Visibility = 'public' | 'followers' | 'private';

interface VisibilityPickerProps {
  value: Visibility;
  onChange: (v: Visibility) => void;
}

// las 3 opciones de privacidad del perfil
const OPTIONS: { value: Visibility; label: string; desc: string }[] = [
  { value: 'public',    label: 'Public',        desc: 'Everyone can see your mood history' },
  { value: 'followers', label: 'Followers Only', desc: 'Only your followers can see your mood history' },
  { value: 'private',   label: 'Private',        desc: 'Only you can see your mood history' },
];

// muestra las 3 opciones como radio cards
// la card activa tiene borde y fondo de color primario
const VisibilityPicker: React.FC<VisibilityPickerProps> = ({ value, onChange }) => (
  <div className="ep-vis-group">
    {OPTIONS.map((opt) => (
      <label
        key={opt.value}
        className={`ep-vis-card ${value === opt.value ? 'ep-vis-card--active' : ''}`}
      >
        <input
          type="radio"
          name="visibility"
          value={opt.value}
          checked={value === opt.value}
          onChange={() => onChange(opt.value)}
        />
        <div className="ep-vis-text">
          <span className="ep-vis-label">{opt.label}</span>
          <span className="ep-vis-desc">{opt.desc}</span>
        </div>
      </label>
    ))}
  </div>
);

/* 
   PÁGINA PRINCIPAL: EditProfile
*/
const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  // state tiene el perfil actual, dispatch manda los cambios al store
  const { state, dispatch } = useAppContext();
  const profile = state.profile;

  // estado local de cada campo — arranca con los valores actuales del perfil
  const [avatar,     setAvatar]     = useState(profile.avatar ?? '');
  const [name,       setName]       = useState(profile.name ?? '');
  const [bio,        setBio]        = useState(profile.bio ?? '');
  const [visibility, setVisibility] = useState<Visibility>(profile.moodVisibility ?? 'public');

  // guarda los cambios en el store global y vuelve al perfil
  const handleSave = () => {
    const updated: Partial<ProfileData> = { avatar, name, bio, moodVisibility: visibility };
    dispatch({ type: 'UPDATE_PROFILE', payload: updated });
    navigate('/profile');
  };

  const handleCancel = () => navigate('/profile');

  return (
    <div className="ep-page">
      <div className="ep-container">

        {/* volver al perfil sin guardar */}
        <button className="ep-back" onClick={handleCancel}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Profile
        </button>

        <div className="ep-heading">
          <h1 className="ep-title">Edit Profile</h1>
          <p className="ep-subtitle">Update your profile information and preferences</p>
        </div>

        {/* card principal con avatar, nombre y bio */}
        <div className="ep-card">

          {/* foto de perfil */}
          <AvatarSection avatar={avatar} name={profile.name} onChange={setAvatar} />

          <div className="ep-divider" />

          {/* nombre que aparece en el header del perfil */}
          <div className="ep-field">
            <label className="ep-label" htmlFor="ep-name">Name</label>
            <div className="ep-input-wrap">
              <svg className="ep-input-icon" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input
                id="ep-name"
                className="ep-input"
                type="text"
                placeholder="Your display name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="ep-divider" />

          {/* descripción que aparece debajo del nombre en el perfil */}
          <div className="ep-field">
            <label className="ep-label" htmlFor="ep-bio">Bio</label>
            <textarea
              id="ep-bio"
              className="ep-textarea"
              placeholder="How are you feeling today? Share your thoughts, emotions, or what's been on your mind..."
              maxLength={200}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            {/* contador de caracteres */}
            <span className="ep-char">{bio.length}/200 characters</span>
          </div>

        </div>

        {/* sección de privacidad */}
        <div className="ep-section-hd">
          <div>
            <h2 className="ep-section-title">Privacy Settings</h2>
            <p className="ep-section-sub">Control who can see your mood history</p>
          </div>
        </div>

        <div className="ep-card">
          <span className="ep-label">Mood Visibility</span>
          <VisibilityPicker value={visibility} onChange={setVisibility} />
        </div>

        {/* botones de acción */}
        <div className="ep-actions">
          <button className="ep-cancel" onClick={handleCancel}>Cancel</button>
          <button className="ep-save"   onClick={handleSave}>Save changes</button>
        </div>

        <p className="ep-note">
          <strong>Note:</strong> Your profile information helps others connect with you.
          Choose settings that make you feel comfortable sharing your emotional journey.
        </p>

      </div>
    </div>
  );
};

export default EditProfilePage;