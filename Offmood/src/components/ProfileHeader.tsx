import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ProfileData } from '../types/profile';
import { useAppContext } from '../store/AppContext';
import { moods } from '../data/moods';
import {
  getMoodEntries,
  type MoodEntry,
} from '../services/moodEntriesService';

interface ProfileHeaderProps {
  profile: ProfileData;
}

const getCurrentWeekDates = () => {
  const today = new Date();
  const currentDay = today.getDay();
  const startOfWeek = new Date(today);

  startOfWeek.setDate(today.getDate() - currentDay);

  const dayLabels = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  const week = [];

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startOfWeek);

    currentDate.setDate(startOfWeek.getDate() + i);

    week.push({
      day: dayLabels[i],
      date: currentDate.toISOString().split('T')[0],
    });
  }

  return week;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const navigate = useNavigate();
  const { state } = useAppContext();

  const [entries, setEntries] = useState<MoodEntry[]>([]);

  const userId = state.currentUser?.id;
  const weekDates = getCurrentWeekDates();

  useEffect(() => {
    const loadMoodEntries = async () => {
      if (!userId) {
        return;
      }

      try {
        const moodEntries = await getMoodEntries(userId);
        setEntries(moodEntries);
      } catch (error) {
        console.error('Error loading profile mood entries:', error);
      }
    };

    loadMoodEntries();
  }, [userId]);

  return (
    <section className="ph-card">
      <div className="ph-top">
        <div className="ph-avatar-wrap">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="ph-avatar"
          />
        </div>

        <div className="ph-info">
          <div className="ph-name-row">
            <h1 className="ph-name">{profile.name}</h1>

            <button
              className="ph-edit-btn"
              onClick={() => navigate('/profile/edit')}
              type="button"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>

              <span className="ph-edit-label">Edit Profile</span>
            </button>
          </div>

          <p className="ph-bio">{profile.bio}</p>

          <div className="ph-stats">
            <div className="ph-stat">
              <span className="ph-stat-num">{profile.stats.posts}</span>
              <span className="ph-stat-lbl">Posts</span>
            </div>

            <div className="ph-stat">
              <span className="ph-stat-num">{profile.stats.comments}</span>
              <span className="ph-stat-lbl">Comments</span>
            </div>

            <div className="ph-stat">
              <span className="ph-stat-num">{profile.stats.followers}</span>
              <span className="ph-stat-lbl">Followers</span>
            </div>
          </div>
        </div>
      </div>

      <div className="ph-moods">
        <p className="ph-moods-label">
          This week's <em className="ph-moods-accent">moods</em>
        </p>

        <div className="ph-moods-row">
          {weekDates.map((item) => {
            const savedEntry = entries.find(
              (entry) => entry.entry_date === item.date
            );

            const savedMood = moods.find(
              (mood) => mood.key === savedEntry?.mood
            );

            return (
              <div key={item.date} className="ph-mood-item">
                <div
                  className="ph-mood-bubble"
                  title={savedMood?.label ?? 'No mood'}
                >
                  {savedMood ? (
                    <img
                      src={savedMood.image}
                      alt={savedMood.label}
                      className="ph-mood-img"
                    />
                  ) : (
                    <span className="ph-mood-empty" />
                  )}
                </div>

                <span className="ph-mood-day">{item.day}</span>
              </div>
            );
          })}
        </div>

        <p className="ph-moods-hint">
          Track your emotional patterns over the week
        </p>
      </div>
    </section>
  );
};

export default ProfileHeader;