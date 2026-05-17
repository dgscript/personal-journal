import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import DeletePost from "./DeletePost";
import EditPost from "./EditPost";
import "../styles/me.css";

interface UserPosts {
  title: string;
  content: string;
  createdAt: string;
  post_id: number;
}

export default function Me() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [userPosts, setUserPosts] = useState<UserPosts[]>([]);
  const [filter, setFilter] = useState<string>("oldest");
  const [searchVal, setSearchVal] = useState<string>("");
  const [postId, setPostId] = useState<{
    id: number;
    action: string;
    content: { title: string; content: string };
  } | null>(null);
  const [showPopup, setShowPopup] = useState<{
    visible: boolean;
    window: string;
  } | null>(null);

  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
      return;
    }

    if (user?.posts) {
      setUserPosts(user.posts);
      sortPosts();
    }
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;

    setUserPosts(
      searchVal === ""
        ? user.posts
        : user.posts.filter(
            (post: UserPosts) =>
              post.title.includes(searchVal) ||
              post.content.includes(searchVal),
          ),
    );
  }, [searchVal]);

  useEffect(() => {
    if (!user) return;

    sortPosts();

    console.log(userPosts);
  }, [filter]);

  useEffect(() => {
    if (!postId) return;

    if (postId.action === "delete") {
      setShowPopup({ visible: true, window: "delete" });
      return;
    }

    if (postId.action === "edit") {
      setShowPopup({ visible: true, window: "edit" });
      return;
    }
  }, [postId]);

  function sortPosts() {
    setUserPosts((prev) => {
      let filtered;

      if (filter === "newest")
        filtered = [...prev].sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

      if (filter === "oldest")
        filtered = [...prev].sort((a, b) => {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        });

      return filtered || prev;
    });
  }

  return (
    <div className="profile-container">
      {showPopup?.visible && showPopup.window === "delete" && postId && (
        <DeletePost id={postId?.id} setShowPopup={setShowPopup} />
      )}
      {showPopup?.visible && showPopup.window === "edit" && postId && (
        <EditPost
          id={postId?.id}
          currentContent={postId.content}
          setShowPopup={setShowPopup}
        />
      )}
      <div className="profile-header-container">
        <div className="profile-header">
          <div>
            <p>My Posts</p>
            <p>
              {loading ? "0" : user ? userPosts.length : "0"} posts published
            </p>
          </div>
          <button onClick={() => navigate("/write")}>NEW POST</button>
        </div>
        <div className="profile-header-cards">
          <div>
            <p>TOTAL POSTS</p>
            <p>{loading ? "0" : user ? userPosts.length : "0"}</p>
          </div>
          <div>
            <p>LATEST</p>
            <p>
              {loading
                ? "?"
                : user
                  ? user.posts.length > 0
                    ? new Date(
                        user.posts[user.posts.length - 1].createdAt.slice(
                          0,
                          10,
                        ),
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                      })
                    : "?"
                  : "?"}
            </p>
          </div>
        </div>
        <div className="profile-header-search">
          <input
            type="text"
            placeholder="Search posts..."
            onChange={(e) => {
              setSearchVal(e.target.value);
            }}
            value={searchVal}
          />
          <select name="filter" onChange={(e) => setFilter(e.target.value)}>
            <option value="oldest">Oldest first</option>
            <option value="newest">Newest first</option>
          </select>
        </div>
      </div>
      <div className="posts-container">
        {loading ? (
          <div className="loading-spinner">
            <svg
              fill="hsl(228, 97%, 42%)"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                opacity=".25"
              />
              <path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  dur="0.75s"
                  values="0 12 12;360 12 12"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </div>
        ) : user ? (
          userPosts.map((post) => (
            <div className="post" key={post.post_id}>
              <p className="post-title">{post.title}</p>
              <p className="post-content">{post.content}</p>

              <div className="post-info">
                <p className="post-date">
                  {post.createdAt
                    .slice(0, 16)
                    .replace(/-/g, "/")
                    .replace("T", " - ")}
                </p>

                <div className="post-btns">
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setPostId({
                        id: post.post_id,
                        action: "edit",
                        content: { title: post.title, content: post.content },
                      });
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#e3e3e3"
                    >
                      <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                    </svg>
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() =>
                      setPostId({
                        id: post.post_id,
                        action: "delete",
                        content: { title: "", content: "" },
                      })
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#e3e3e3"
                    >
                      <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : null}
      </div>
    </div>
  );
}
