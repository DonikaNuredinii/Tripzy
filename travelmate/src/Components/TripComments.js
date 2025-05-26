import React, { useState, useEffect } from "react";
import axios from "axios";
import "../CSS/Style.css";

const TripComments = ({ tripId, onNewComment }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [tripId]);

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await axios.get(
        `http://localhost:8000/api/trips/${tripId}/comments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments(res.data);
      if (onNewComment) onNewComment(res.data.length); // Send live count
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const postComment = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      setLoading(true);
      await axios.post(
        `http://localhost:8000/api/trips/${tripId}/comments`,
        { Comment: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      fetchComments();

      if (onNewComment) onNewComment(); // 👈 update comment count in parent
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [tripId]);

  return (
    <div className="comments-wrapper">
      {comments.length === 0 ? (
        <p className="no-comments">No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.Commentid || comment.id} className="comment-card">
            <img
              className="comment-avatar"
              src="/Images/profile-placeholder.jpg"
              alt="avatar"
            />
            <div className="comment-body">
              <div className="comment-header">
                <span className="comment-author">
                  {comment.user?.Name || "Anonymous"}
                </span>
                <span className="comment-time">
                  {comment.created_at && !isNaN(new Date(comment.created_at))
                    ? `${new Date(comment.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })} · ${new Date(comment.created_at).toLocaleDateString()}`
                    : "Posted just now"}
                </span>
              </div>
              <div className="comment-text">{comment.Comment}</div>
            </div>
          </div>
        ))
      )}

      <div className="comment-input-wrapper">
        <img
          className="comment-avatar"
          src="/Images/profile-placeholder.jpg"
          alt="avatar"
        />
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          onClick={postComment}
          disabled={!newComment.trim() || loading}
          className="comment-send-btn"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default TripComments;
