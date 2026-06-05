import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supabaseClient from '../../services/supabaseClient';

interface Like {
  id: string;
  created_at: string;
  user_id: string;
  post_id: string;
}

interface LikesState {
  likes: Like[];
  loading: boolean;
  error: string | null;
}

const initialState: LikesState = {
  likes: [],
  loading: false,
  error: null,
};

export const fetchLikesByPost = createAsyncThunk('likes/fetchByPost', async (postId: string) => {
  const response = await supabaseClient.get(`likes?post_id=eq.${postId}`);
  return { postId, data: response.data };
});

export const fetchUserLikes = createAsyncThunk('likes/fetchUserLikes', async (userId: string) => {
  const response = await supabaseClient.get(`likes?user_id=eq.${userId}`);
  return response.data;
});

export const likePost = createAsyncThunk('likes/like', async (payload: { user_id: string; post_id: string }) => {
  const response = await supabaseClient.post('likes', payload, {
    headers: { Prefer: 'return=representation' },
  });
  return response.data[0];
});

export const unlikePost = createAsyncThunk('likes/unlike', async (payload: { user_id: string; post_id: string }) => {
  await supabaseClient.delete(`likes?user_id=eq.${payload.user_id}&post_id=eq.${payload.post_id}`);
  return payload;
});

const likesSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserLikes.fulfilled, (state, action) => {
        state.likes = action.payload;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.likes.push(action.payload);
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        state.likes = state.likes.filter(
          l => !(l.user_id === action.payload.user_id && l.post_id === action.payload.post_id)
        );
      });
  },
});

export default likesSlice.reducer;