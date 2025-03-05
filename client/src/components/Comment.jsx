import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { usePostStore } from "../store/usePostStore";
import useThemeStore from '../store/useThemeStore'

const Comment = ({ post, onClose, addComment }) => {
  const { authUser } = useAuthStore();
  const { posts } = usePostStore();
  const [commentText, setCommentText] = useState("");
  const commentsEndRef = useRef(null); // Ref for the latest comment
  const { theme } = useThemeStore()

  // Get the latest post data from Zustand
  const updatedPost = posts.find((p) => p._id === post._id);

  const handleComment = async () => {
    if (!commentText.trim()) return;
    await addComment(post._id, commentText);
    setCommentText(""); // Clear input after submitting
  };

  // Auto-scroll to the latest comment when comments change
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [updatedPost?.comments]);

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className={`${theme === 'dark' ? 'bg-black border border-slate-700 text-white' : 'bg-zinc-200 text-black' } w-[90%] sm:w-[50%] p-6 rounded-lg shadow-lg relative`}>
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-2 right-2 text-lg cursor-pointer text-gray-500 hover:text-red-500 transition duration-200">
        <i className='fa-solid fa-square-xmark text-3xl'></i>
        </button>

        <h2 className="text-xl font-semibold text-center">Comments</h2>

        {/* Comments Section */}
        <div className="mt-4 h-60 overflow-y-auto">
          {updatedPost?.comments?.length > 0 ? (
            updatedPost.comments.map((comment, index) => (
              <div key={comment._id} className="flex items-center gap-x-3 mt-2">
                <img
                  className="h-7 w-7 rounded-full object-cover border border-slate-300"
                  src={comment.userId?.profileImg || "/avatar.png"}
                  alt="User Img"
                />
                <div className="border-b border-slate-400 w-[90%] pb-1">
                  <h4 className="font-semibold text-sm">
                    {comment.userId ? comment.userId.username : "Unknown User"}
                  </h4>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'} text-sm`}>{comment.text}</p>
                </div>
                {/* Added a ref to a separate self-closing <div/> after the last comment. It will ensure that scroll will be always done till the last comment */}
                {index === updatedPost.comments.length - 1 && <div ref={commentsEndRef} />}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-4">No comments available.</p>
          )}
        </div>

        {/* Add Comment Section */}
        <div className="flex items-center gap-x-3 mt-4">
          <img className="h-8 w-8 rounded-full object-cover border border-slate-300" src={authUser?.profileImg || "/avatar.png"} alt="User Img" />

          <div className="w-[90%] relative flex justify-center items-center">
            <input
              type="text"
              className="border text-sm w-full h-10 rounded-3xl focus:outline-indigo-600 pl-3 pr-10"
              placeholder="Write your comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <i onClick={handleComment} className="fa-solid fa-paper-plane absolute right-4 bottom-3 text-xl cursor-pointer"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
