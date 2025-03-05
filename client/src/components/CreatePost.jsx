import { useState } from "react";
import { usePostStore } from "../store/usePostStore";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import useThemeStore from '../store/useThemeStore'

const CreatePost = () => {
  const [formData, setFormData] = useState({
    image: null,
    content: "",
  });

  const navigate = useNavigate();
  const { createPost, isCreatingPost } = usePostStore();
  const { theme } = useThemeStore()

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await createPost(formData);
    if (success) {
      navigate("/");
    }
  };

  return (
  <div className="flex flex-col justify-center items-center h-auto">
<nav className={`${theme === 'dark' ? 'bg-black text-white border-b border-slate-700' : 'bg-white'} h-16 w-full flex justify-between items-center shadow-lg`}>
<Link to='/' className='ml-[2%] text-2xl cursor-pointer font-bold'><i className="fa-solid fa-house"></i></Link>
     </nav>

      <div className={`${theme === 'dark' ? 'border border-slate-700 text-white' : 'text-gray-800'} w-[90%] sm:w-[60%] lg:w-[40%] mx-auto p-6 shadow-2xl rounded-lg m-6 h-auto md:h-auto`}>
      <h2 className="text-2xl font-semibold text-center mb-4">
        Create a New Post
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Content Input */}
        <div>
          <label htmlFor="content" className="block font-medium">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            required
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full mt-1 p-3 border rounded-lg outline-1 -outline-offset-1 outline-slate-700 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-400"
            placeholder="Write something..."
            rows="4"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block font-medium">
            Upload Image
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={`${theme === 'dark' ? 'hover:bg-slate-900' : 'hover:bg-slate-200'} w-full mt-1 p-2 border rounded-xl cursor-pointer`}
          />
        </div>

        {/* Image Preview */}
        {formData.image && (
          <div className="mt-2 flex justify-center">
            <img
              src={formData.image}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" className="cursor-pointer flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          disabled={isCreatingPost}>
          {isCreatingPost ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
            </>
          ) : (
            "Create Post"
          )}
        </button>
      </form>
    </div>
  </div>
  );
};

export default CreatePost;
