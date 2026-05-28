import { useEffect, useRef, useState } from "react";
import "../styles/write.css";
import Notification from "./Notification";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

export default function Write() {
  const { user, loading } = useAuth();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [length, setLength] = useState<number>(0);
  const [ntfn, setNtfn] = useState<{
    msg: string;
    situation: string;
    visible: boolean;
  } | null>(null);
  const [moreBtnsVisible, setMoreBtnsVisible] = useState<boolean>(false);

  const moreBtns = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    setLength(content.length);
  }, [content]);
  useEffect(() => {
    if (moreBtnsVisible) {
      moreBtns.current!.style.display = "flex";
    } else {
      moreBtns.current!.style.display = "none";
    }
  }, [moreBtnsVisible]);

  function saveDraft() {
    if (title.length === 0 || content.length === 0) return;
    const draft = {
      title: title,
      content: content,
    };
    localStorage.setItem("draft", JSON.stringify(draft));
    setTitle("");
    setContent("");
    showNotification("Post saved as draft!", "success");

    setMoreBtnsVisible(false);
  }

  function pasteDraft() {
    const draft = localStorage.getItem("draft");
    if (!draft) return showNotification("No drafts saved yet.", "error");

    setTitle("");
    setContent("");

    setTitle(JSON.parse(draft).title);
    setContent(JSON.parse(draft).content);

    setMoreBtnsVisible(false);
  }

  async function savePost() {
    if (title.length === 0 || content.length === 0) return;

    if (!user && !loading)
      return showNotification(
        "You must be logged to save your posts!",
        "error",
      );

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts`,
        {
          title: title,
          content: content,
        },
        {
          withCredentials: true,
        },
      );
      setTitle("");
      setContent("");
      window.location.href = "/me";
    } catch (error: any) {
      console.log(error);
      showNotification(error.response.data.message, "error");
    }
  }

  return (
    <div className="write-wrapper">
      <Notification
        msg={ntfn?.msg ?? ""}
        situation={ntfn?.situation ?? ""}
        visible={ntfn?.visible ?? false}
      />
      <h3>New post</h3>
      <input
        type="text"
        placeholder="Your title..."
        onChange={(e) => {
          setTitle(e.target.value.slice(0, 50));
        }}
        maxLength={50}
        value={title}
      />
      <textarea
        placeholder="Begin writing. There are no rules here..."
        onChange={(e) => {
          setContent(e.target.value.slice(0, 5000));
        }}
        value={content}
        maxLength={5000}
      ></textarea>

      <div className="write-subcontainer">
        <div className="btn-container">
          <button
            className={`${content.length <= 0 || title.length <= 0 ? "disabled-btn" : ""}`}
            onClick={() => savePost()}
            disabled={content.length <= 0 || title.length <= 0 ? true : false}
          >
            SAVE
          </button>
          <button onClick={() => setMoreBtnsVisible(!moreBtnsVisible)}>
            ...
          </button>
          <div className="more-btns" ref={moreBtns}>
            <button
              className={`${content.length <= 0 || title.length <= 0 ? "disabled-btn" : ""}`}
              onClick={() => saveDraft()}
              disabled={content.length <= 0 || title.length <= 0 ? true : false}
            >
              SAVE AS DRAFT
            </button>
            <button onClick={() => pasteDraft()}>PASTE DRAFT</button>
          </div>
        </div>
        <p
          className={`char-counter ${content.length >= 2500 ? "min-length" : ""} ${content.length >= 3500 ? "mdn-length" : ""} ${content.length >= 4500 ? "max-length" : ""}`}
        >
          {length} | 5000
        </p>
      </div>
    </div>
  );
}
