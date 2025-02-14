import { create } from "zustand";
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast'

export const usePostStore = create((set) => ({
    posts: [],
    isCreatingPost: false,
    isLoadingPosts: false,
    isUpdatingPost: false,


    createPost: async (postData) => {
        try {
            set({ isCreatingPost: true });

            const res = await axiosInstance.post("/post/create", postData, {
                headers: { "Content-Type": "application/json" },
            });

            if (res.data) {
                set((state) => ({ posts: [...state.posts, res.data] }));
                toast.success("Post created successfully!");
                return true;
            }
        } catch (error) {
            console.error("Error in create post store", error);
            toast.error(error.response?.data?.message || "Failed to create post");
        } finally {
            set({ isCreatingPost: false });
        }
    },

    getPosts: async () => {
        try {
          const res = await axiosInstance.get("/post/view-posts");
          set({ posts: res.data }); 
        } catch (error) {
          console.error("Error in get post store", error);
          toast.error(error.response?.data?.message || "Failed to fetch posts");
        }
      },
      updatePost: async (postId, updatedData) => {
        try {
            set({ isUpdatingPost: true });
    
              await axiosInstance.put(`/post/${postId}`, updatedData);
    
            set((state) => ({
                posts: state.posts.map((post) =>
                    post._id === postId
                        ? { ...post, content: updatedData.content || "", image: updatedData.image || null }
                        : post
                ),
            })); 
    
            return true; 
    
        } catch (error) {
            console.error("Error updating post", error);
            toast.error(error.response?.data?.message || "Failed to update post");
            return false; 
        } finally {
            set({ isUpdatingPost: false });
        }
    },
    
    deletePost: async (postId) => {
        try {
            const res = await axiosInstance.delete(`/post/${postId}`);
    
            
            set((state) => ({
                posts: state.posts.filter((post) => post._id !== postId),
            }));
            toast.success(res.data.message || "Post deleted successfully!");
            return true;
            
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error(error.response?.data?.message || "Failed to delete post");
        }
    },
    
    likePost: async (postId) => {
        try {
          const { data } = await axiosInstance.put(`/post/like/${postId}`, {}, { withCredentials: true });
          set((state) => ({
            posts: state.posts.map((post) =>
              post._id === postId
                ? { ...post, likes: Array.isArray(data.likes) ? data.likes : [] }
                : post
            ),
          }));
          
          return data.liked;
        } catch (error) {
          console.error(error);
          return false;
        }
      },

      addComment: async (postId, text) => {
        try {
          const response = await axiosInstance.post(`/post/${postId}/comment`, { text });
          set((state) => ({
            posts: state.posts.map((post) =>
              post._id === postId ? { ...post, comments: response.data } : post
            ),
          }));
        } catch (error) {
          console.error("Error adding comment:", error);
        }
      },
}));