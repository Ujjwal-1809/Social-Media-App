import React, { useState, useEffect } from "react";
import {  Link, useNavigate, useParams } from "react-router-dom";
import { usePostStore } from "../store/usePostStore";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import useThemeStore from '../store/useThemeStore'
 
const EditPost = () => {
  const { posts, updatePost, getPosts, isUpdatingPost } = usePostStore();
  const { postId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const { theme } = useThemeStore()

  useEffect(() => {
    const fetchPost = async () => {
      await getPosts(); // Ensure posts are fetched first
      const postToEdit = posts.find((p) => p._id === postId);
      if (postToEdit) {
        setContent(postToEdit.content || "");
        setPreview(postToEdit.image || null);
      }
    };

    fetchPost();
  }, [postId]); // Run only when postId changes

  useEffect(() => {
    // Ensure the content updates when posts change
    const postToEdit = posts.find((p) => p._id === postId);
    if (postToEdit) {
      setContent(postToEdit.content || "");
      setPreview(postToEdit.image || null);
    }
  }, [posts]); // Runs when posts are updated

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImage(reader.result);
        setPreview(reader.result);
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (content.trim() === "" && !image) {
      return toast.error("Post cannot be empty.");
    }

    const updatedData = { content: content.trim() };
    if (image) {
      updatedData.image = image;
    }

    const success = await updatePost(postId, updatedData);
    if (success) {
      toast.success("Post updated successfully!");
      navigate("/");
    }
  };

  return (
  <div className="h-screen xl:h-auto pb-1">

<nav className={`${theme === 'dark' ? 'bg-black text-white border-b border-slate-700' : 'bg-white'} h-16 w-full flex justify-between items-center shadow-lg`}>
<Link to='/' className='ml-[2%] text-2xl cursor-pointer font-bold'><i className="fa-solid fa-house"></i></Link>
     </nav>

      <div className={`${theme === 'dark' ? 'bg-black border border-slate-700 text-white' : 'bg-white'} w-[90%] md:w-[70%] xl:w-[50%] mx-auto m-10 p-6 shadow-2xl rounded-lg`}>
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Post</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          className="w-full p-3 border rounded-lg outline-2 -outline-offset-1 outline-slate-700 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-400"
          placeholder="Update your post..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="4"
        />

        {preview && (
          <div className="flex justify-center">
            <img
              src={preview}
              alt="Post preview"
              className="w-full max-h-60 object-cover rounded-md"
            />
          </div>
        )}

        <input className={`${theme === 'dark' ? 'hover:bg-slate-900' : 'hover:bg-slate-200'} border p-1.5 cursor-pointer rounded-xl`} type="file" accept="image/*" onChange={handleImageChange} />

        <button type="submit" className="cursor-pointer flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          disabled={isUpdatingPost}>
          {isUpdatingPost ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
            </>
          ) : (
            "Update Post"
          )}
        </button>
      </form>
    </div>
  </div>
  );
};

export default EditPost;
