import { useEffect, useRef, useState } from "react";
import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import Notification from "./Notification";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const msgProcess: string[] = [
  "Sign in to continue writing",
  "Please, enter valid credentials to proceed.",
  "Please, enter a valid username.",
  "Please, enter a valid password.",
  "Wrong username or password.",
  "Internal server error.",
];
const regex = /^[A-Za-z0-9_]+$/;

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [msgProcessIndex, setMsgProcessIndex] = useState<number>(0);
  const [ntfn, setNtfn] = useState<{
    msg: string;
    situation: string;
    visible: boolean;
  } | null>(null);

  const submitBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (username.length < 4 || password.length < 8) {
      submitBtn.current!.disabled = true;
      submitBtn.current!.classList.add("disabled-btn");
    } else {
      submitBtn.current!.disabled = false;
      submitBtn.current!.classList.remove("disabled-btn");
    }
  }, [username, password]);

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

  async function checkLogin() {
    if (username === "" && password === "") return setMsgProcessIndex(1);
    if (username === "" || !regex.test(username)) return setMsgProcessIndex(2);
    if (password === "" || password.length === 0) return setMsgProcessIndex(3);

    setMsgProcessIndex(0);
    submitBtn.current!.disabled = true;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          username: username,
          password: password,
        },
        {
          withCredentials: true,
        },
      );
      console.log(response.data);
      setMsgProcessIndex(0);
      submitBtn.current!.disabled = false;
      showNotification(`Welcome back, ${response.data.username}!`, "success");
      setUser(response.data);
      navigate("/me");
    } catch (error: any) {
      submitBtn.current!.disabled = false;
      if (!error.response) return setMsgProcessIndex(5);
      setMsgProcessIndex(4);
      console.log(error.response.data);
    }
  }

  return (
    <div className="login-wrapper">
      <Notification
        msg={ntfn?.msg ?? ""}
        situation={ntfn?.situation ?? ""}
        visible={ntfn?.visible ?? false}
      />
      <div className="login-container">
        <p>Welcome back</p>
        <p className={msgProcessIndex > 0 ? "invalid-login" : ""}>
          {msgProcess[msgProcessIndex]}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label htmlFor="username-login">USERNAME</label>
          <input
            required
            type="text"
            name="username-login"
            id="username-login"
            placeholder="your_username"
            onChange={(e) => setUsername(e.target.value.trim())}
            value={username}
            maxLength={32}
          />

          <label htmlFor="password-login">PASSWORD</label>
          <input
            required
            type="password"
            name="password-login"
            id="password-login"
            placeholder="*******"
            onChange={(e) => setPassword(e.target.value.trim())}
            value={password}
            maxLength={32}
          />

          <button
            className="disabled-btn"
            ref={submitBtn}
            onClick={() => checkLogin()}
            onKeyDown={(e) => {
              if (e.key === "Enter") checkLogin();
            }}
          >
            SIGN IN
          </button>
        </form>

        <p>
          No account?{" "}
          <span>
            <Link to={{ pathname: "/signin" }}>Create one</Link>
          </span>
        </p>
      </div>
    </div>
  );
}
