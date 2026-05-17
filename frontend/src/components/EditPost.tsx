import { useState, type SetStateAction } from "react";
import "../styles/me.css";
import axios from "axios";
import Notification from "./Notification";

export default function EditPost({
  id,
  currentContent,
  setShowPopup,
}: {
  id: number;
  setShowPopup: React.Dispatch<
    SetStateAction<{
      visible: boolean;
      window: string;
    } | null>
  >;
  currentContent: { title: string; content: string };
}) {
  const [title, setTitle] = useState<string>(currentContent.title || "");
  const [content, setContent] = useState<string>(currentContent.content || "");
  const [ntfn, setNtfn] = useState<{
    msg: string;
    situation: string;
    visible: boolean;
  } | null>(null);

  async function saveEdit() {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/posts`,
        {
          post_id: id,
          title: title,
          content: content,
        },
        { withCredentials: true },
      );
      setShowPopup(null);
      window.location.href = "/me";
    } catch (error) {
      showNotification("Unable to peform this action.", "error");
      console.log(error);
    }
  }

  function showNotification(msg: string, situation: string) {
    setNtfn({
      msg: msg,
      situation: situation,
      visible: true,
    });
    setTimeout(() => {
      setNtfn((prev) => (prev ? { ...prev, visible: false } : null));
    }, 5000);
  }

  return (
    <div className="edit-post-container">
      <Notification
        msg={ntfn?.msg ?? ""}
        situation={ntfn?.situation ?? ""}
        visible={ntfn?.visible ?? false}
      />
      <div className="edit-post">
        <p>Edit post</p>

        <label htmlFor="edit-tlt">TITLE</label>
        <input
          type="text"
          name="title"
          id="edit-tlt"
          maxLength={50}
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />

        <label htmlFor="edit-cnt">CONTENT</label>
        <textarea
          name="content"
          id="edit-cnt"
          maxLength={5000}
          onChange={(e) => setContent(e.target.value)}
          value={content}
        ></textarea>

        <div className="btns">
          <button onClick={() => setShowPopup(null)}>CANCEL</button>
          <button
            className={`${title === "" || content === "" ? "disabled-btn" : ""}`}
            onClick={() => {
              if (title === "" || content === "") return;
              saveEdit();
            }}
          >
            SAVE CHANGES
          </button>
        </div>
      </div>
    </div>
  );
}
