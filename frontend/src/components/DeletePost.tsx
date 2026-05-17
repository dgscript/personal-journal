import type { SetStateAction } from "react";
import { useState } from "react";
import axios from "axios";
import Notification from "./Notification";
import "../styles/me.css";

export default function DeletePost({
  id,
  setShowPopup,
}: {
  id: number;
  setShowPopup: React.Dispatch<
    SetStateAction<{
      visible: boolean;
      window: string;
    } | null>
  >;
}) {
  const [ntfn, setNtfn] = useState<{
    msg: string;
    situation: string;
    visible: boolean;
  } | null>(null);

  async function deletePost(id: number) {
    if (!id) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
        withCredentials: true,
      });
      setShowPopup(null);
      window.location.href = "/me";
    } catch (error) {
      showNotification("Unable to perform this action.", "error");
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
    <div className="delete-post-container">
      <Notification
        msg={ntfn?.msg ?? ""}
        situation={ntfn?.situation ?? ""}
        visible={ntfn?.visible ?? false}
      />
      <div className="delete-post">
        <p>Delete this post?</p>
        <p>
          This action cannot be undone. The post will be permanently removed.
        </p>

        <div className="btns">
          <button onClick={() => setShowPopup(null)}>KEEP IT</button>
          <button onClick={() => deletePost(id)}>DELETE</button>
        </div>
      </div>
    </div>
  );
}
