import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supabaseClient from '../../services/supabaseClient';

interface Post {
  id: string;
  created_at: string;
  user_id: string;
  content: string;
  image_url: string | null;
  mood: string | null;
  profiles?: {
    username: string;
    avatar_url: string | null;
  };
}

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
};

export const fetchPosts = createAsyncThunk('posts/fetchAll', async () => {
  const response = await supabaseClient.get(
    'posts?select=*,profiles(username,avatar_url)&order=created_at.desc'
  );
  return response.data;
});

export const createPost = createAsyncThunk('posts/create', async (post: Omit<Post, 'id' | 'created_at' | 'profiles'>) => {
  const response = await supabaseClient.post(
    'posts?select=*,profiles(username,avatar_url)',
    post,
    { headers: { Prefer: 'return=representation' } }
  );
  return response.data[0];
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPosts.fulfilled, (state, action) => { state.loading = false; state.posts = action.payload; })
      .addCase(fetchPosts.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Error fetching posts'; })
      .addCase(createPost.fulfilled, (state, action) => { state.posts.unshift(action.payload); });
  },
});

export default postsSlice.reducer;