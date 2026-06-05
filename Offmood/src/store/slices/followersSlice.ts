import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supabaseClient from '../../services/supabaseClient';

interface Follower {
  id: string;
  created_at: string;
  follower_id: string;
  following_id: string;
}

interface FollowersState {
  followers: Follower[];
  following: Follower[];
  loading: boolean;
  error: string | null;
}

const initialState: FollowersState = {
  followers: [],
  following: [],
  loading: false,
  error: null,
};

export const fetchFollowing = createAsyncThunk('followers/fetchFollowing', async (userId: string) => {
  const response = await supabaseClient.get(`followers?follower_id=eq.${userId}`);
  return response.data;
});

export const followUser = createAsyncThunk('followers/follow', async (payload: { follower_id: string; following_id: string }) => {
  const response = await supabaseClient.post('followers', payload, {
    headers: { Prefer: 'return=representation' },
  });
  return response.data[0];
});

export const unfollowUser = createAsyncThunk('followers/unfollow', async (payload: { follower_id: string; following_id: string }) => {
  await supabaseClient.delete(
    `followers?follower_id=eq.${payload.follower_id}&following_id=eq.${payload.following_id}`
  );
  return payload;
});

const followersSlice = createSlice({
  name: 'followers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.following = action.payload;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.following.push(action.payload);
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.following = state.following.filter(
          f => f.following_id !== action.payload.following_id
        );
      });
  },
});

export default followersSlice.reducer;