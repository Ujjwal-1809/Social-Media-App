import cloudinary from '../lib/cloudinary.js'
import Post from '../models/postModel.js'

export const handleCreatePost = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(403).json({ message: "Signup or Login to create a post" })
        }

        const { image, content } = req.body;
        if (!image) {
            return res.status(400).json({ message: "Image is required" });
        }
        const uploadedImage = await cloudinary.uploader.upload(image, {
            folder: "posts"
        });

        const post = new Post({
            createdBy: req.user._id,
            image: uploadedImage.secure_url,  // Save Cloudinary URL
            content,
        });

        await post.save();
        res.json(post);
    } catch (error) {
        console.log('Error in create post controller:', error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const handleGetPost = async(req, res) => {

    try {
        const posts = await Post.find().populate("createdBy", "username")
        .populate("comments.userId", "username")
        .sort({ createdAt: -1 })  // Sort posts by newest first

        res.json(posts);
    } catch (error) {
        console.log('error in get posts controller', error.message);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const handleUpdatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content, image } = req.body;

        // Find the post by ID
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if the logged-in user is the owner of the post
        if (post.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to update this post" });
        }

        // Update the content if provided
        if (content) post.content = content;

        // If a new image is provided, update it
        if (image) {
            const uploadedImage = await cloudinary.uploader.upload(image, {
                folder: "posts",
            });
            post.image = uploadedImage.secure_url; // Update the image URL
        }

        await post.save(); // Save changes to the database

        res.status(200).json({ message: "Post updated successfully", post });

    } catch (error) {
        console.error("Error in update post controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const handleDeletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id; // Get user ID from authentication middleware
 
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.createdBy.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Only the post owner can delete the post!" });
        }

        await Post.deleteOne({ _id: postId }); // More optimized deletion
        res.json({ message: "Post deleted successfully!" });
    } catch (error) {
        console.error("Error deleting Post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const handleLikedPost = async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = req.user.id;
  
      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ message: "Post not found" });
  
      // Ensure likes field is an array
      if (!Array.isArray(post.likes)) {
        post.likes = [];
      }
  
      // Toggle like
      const index = post.likes.indexOf(userId);
      if (index === -1) {
        post.likes.push(userId);
      } else {
        post.likes.splice(index, 1);
      }
  
      await post.save();
      res.status(200).json({ likes: post.likes.length, liked: index === -1 });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  export const handlePostComments =async (req, res) => {
    try {
      const { postId } = req.params;
      const { text } = req.body;
      const userId = req.user.id;
  
      if (!text.trim()) {
        return res.status(400).json({ message: "Comment cannot be empty" });
      }
  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      // Add new comment
      const newComment = { userId, text, createdAt: new Date() };
      post.comments.push(newComment);
      await post.save();
  
      // Populate comments with user details
      const updatedPost = await Post.findById(postId)
        .populate("comments.userId", "username") // Ensure username is populated
        .lean(); // Convert Mongoose document to plain object
  
      res.status(201).json(updatedPost.comments);
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };