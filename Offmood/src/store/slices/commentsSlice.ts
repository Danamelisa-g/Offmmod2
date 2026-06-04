import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supabaseClient from '../../services/supabaseClient';

interface Comment {
  id: string;
  created_at: string;
  user_id: string;
  post_id: string;
  content: string;
}

interface CommentsState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  comments: [],
  loading: false,
  error: null,
};

export const fetchCommentsByPost = createAsyncThunk('comments/fetchByPost', async (postId: string) => {
  const response = await supabaseClient.get(`comments?post_id=eq.${postId}&order=created_at.asc`);
  return response.data;
});

export const createComment = createAsyncThunk('comments/create', async (comment: Omit<Comment, 'id' | 'created_at'>) => {
  const response = await supabaseClient.post('comments', comment, {
    headers: { Prefer: 'return=representation' },
  });
  return response.data[0];
});

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsByPost.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCommentsByPost.fulfilled, (state, action) => { state.loading = false; state.comments = action.payload; })
      .addCase(fetchCommentsByPost.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Error fetching comments'; })
      .addCase(createComment.fulfilled, (state, action) => { state.comments.push(action.payload); });
  },
});

export default commentsSlice.reducer;