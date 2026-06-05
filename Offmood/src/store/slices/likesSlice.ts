import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supabaseClient from '../../services/supabaseClient';

interface Like {
  id: string;
  created_at: string;
  user_id: string;
  post_id: string;
}

interface LikesState {
  userLikes: Like[];    // likes del usuario actual
  allLikes: Like[];     // likes de todos los posts
  loading: boolean;
  error: string | null;
}

const initialState: LikesState = {
  userLikes: [],
  allLikes: [],
  loading: false,
  error: null,
};

export const fetchAllLikes = createAsyncThunk('likes/fetchAll', async () => {
  const response = await supabaseClient.get('likes');
  return response.data;
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
      .addCase(fetchAllLikes.fulfilled, (state, action) => {
        state.allLikes = action.payload;
      })
      .addCase(fetchUserLikes.fulfilled, (state, action) => {
        state.userLikes = action.payload;
        // también actualiza allLikes con los del usuario
        const otherLikes = state.allLikes.filter(
          l => !action.payload.some((ul: Like) => ul.id === l.id)
        );
        state.allLikes = [...otherLikes, ...action.payload];
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.userLikes.push(action.payload);
        state.allLikes.push(action.payload);
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        state.userLikes = state.userLikes.filter(
          l => !(l.user_id === action.payload.user_id && l.post_id === action.payload.post_id)
        );
        state.allLikes = state.allLikes.filter(
          l => !(l.user_id === action.payload.user_id && l.post_id === action.payload.post_id)
        );
      });
  },
});

export default likesSlice.reducer;