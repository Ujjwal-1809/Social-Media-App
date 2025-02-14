import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePostStore } from "../store/usePostStore";
import { Loader } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const ViewPosts = () => {
  const { posts, getPosts, isLoadingPosts, likePost, deletePost, addComment  } = usePostStore();
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState({});

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {isLoadingPosts ? (
        <div className="flex justify-center items-center h-40">
          <Loader className="size-12 animate-spin text-blue-600" />
        </div>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-500 text-2xl h-[73vh]">No posts are available. <br /> Create a post.</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 justify-items-center">
          {posts.map((post) => {
const isLiked = Array.isArray(post.likes) && post.likes.includes(authUser._id);

            const handleLike = async () => {
              await likePost(post._id);
            };

            const handleComment = async (postId) => {
              if (!commentText[postId]?.trim()) return;
              await addComment(postId, commentText[postId]);
              setCommentText((prev) => ({ ...prev, [postId]: "" })); // Clear input after submitting
            };

            return (
              <div
                key={post._id}
                className="w-[90%] sm:w-[70%] h-auto bg-white shadow-2xl rounded-xl p-5 hover:shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-x-2">
                    <img className="h-7 w-7 rounded-full" src="/avatar.png" alt="USER Img" />
                    <h2 className="font-semibold text-sm">{post.createdBy.username}</h2>
                  </div>
                  {authUser.username === post.createdBy.username && (
                    <button
                      type="button"
                      className="text-lg font-semibold relative group"
                      onClick={() => navigate(`/edit/${post._id}`)}
                    >
                      <i className="fa-solid fa-pen cursor-pointer"></i>
                      <div className="hidden sm:block absolute right-[-20px] bottom-8 w-max px-2 py-1 text-xs text-white bg-gray-900 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Edit Post
                      </div>
                    </button>
                  )}
                </div>

                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="h-[50vh] sm:h-[60vh] w-full object-cover rounded-lg mt-3"
                  />
                )}

                <div className="flex items-center justify-between">
                  <pre className="text-sm font-semibold text-gray-700 leading-relaxed mt-3">
                    {post.content}
                  </pre>
                  {authUser.username === post.createdBy.username && (
                    <button
                      onClick={() => deletePost(post._id)}
                      className="mt-6 border bg-red-500 text-xs p-2 cursor-pointer font-semibold text-white rounded-3xl hover:bg-red-600"
                    >
                      Delete Post &nbsp; <i className="fa-solid fa-trash"></i>
                    </button>
                  )}
                </div>

                <div className="flex gap-x-9 mt-3">
                  <div className="flex text-lg items-center gap-x-2">
                    <i
                      onClick={handleLike}
                      className={`cursor-pointer text-xl ${
                        isLiked ? "fa-solid fa-heart text-red-500" : "fa-regular fa-heart"
                      }`}
                    ></i>
                    <h3>Liked by {post.likes.length}</h3>
                  </div>

                </div>
                <div className="flex items-center gap-x-3 mt-4">
                  <img
                    className="h-8 w-8 rounded-full"
                    src="/avatar.png"
                    alt="USER Img"
                  />
                  <div className="w-[90%] relative flex justify-center items-center">
                    <input
                      type="text"
                      className="mb-1.5 border text-sm w-full h-10 rounded-3xl focus:outline-indigo-600 pl-3"
                      placeholder="Write your comment..."
                      value={commentText[post._id] || ""}
                      onChange={(e) =>
                        setCommentText((prev) => ({ ...prev, [post._id]: e.target.value }))
                      }
                    />
                    <i onClick={() => handleComment(post._id)} className="fa-solid fa-paper-plane absolute right-4 bottom-4 text-xl cursor-pointer"></i>
                  </div>
                </div>
                {/* Display Comments */}
<div className="mt-4">
  {post.comments.map((comment) => (
    <div key={comment._id} className="flex items-center gap-x-3 mt-2">
      <img className="h-7 w-7 rounded-full" src="/avatar.png" alt="User Img" />
      <div className="bg-gray-100 px-4 py-2 rounded-lg">
        <h4 className="font-semibold text-sm">
          {comment.userId ? comment.userId.username : "Unknown User"}
        </h4>
        <p className="text-sm text-gray-700">{comment.text}</p>
      </div>
    </div>
  ))}
</div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ViewPosts;
