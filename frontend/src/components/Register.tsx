import { useState, useRef, useEffect } from "react";
import "../styles/register.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const msgProcess: string[] = [
  "A place for your writing, forever yours",
  "You must fill in all the details.",
  "Please, choose a valid username.",
  "Your password must be longer than 8 characters.",
  "Your username must be longer than 3 characters and lesser than 20 characters.",
  "Internal server error.",
  "Username already taken.",
];
const MSG_INDEX = {
  default: 0,
  empty_details: 1,
  invalid_username: 2,
  password_short: 3,
  username_invalid_len: 4,
  server_error: 5,
  username_taken: 6,
};
const regex = /^[A-Za-z0-9_]+$/;

export default function Register() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [msgProcessIndex, setMsgProcessIndex] = useState<number>(
    MSG_INDEX.default,
  );

  const submitBtn = useRef<HTMLButtonElement>(null);

  async function checkRegister() {
    if (username === "" || password === "")
      return setMsgProcessIndex(MSG_INDEX.empty_details);
    if (!regex.test(username))
      return setMsgProcessIndex(MSG_INDEX.invalid_username);
    if (username.length > 20 || username.length < 3)
      return setMsgProcessIndex(MSG_INDEX.username_invalid_len);
    if (password.length < 8)
      return setMsgProcessIndex(MSG_INDEX.password_short);

    submitBtn.current!.disabled = true;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/register`,
        {
          username: username,
          password: password,
        },
        {
          withCredentials: true,
        },
      );
      console.log(response.data);
      setMsgProcessIndex(MSG_INDEX.default);
      submitBtn.current!.disabled = false;
      setUser(response.data);
      navigate("/me");
    } catch (error: any) {
      submitBtn.current!.disabled = false;
      if (!error.response) return setMsgProcessIndex(5);
      setMsgProcessIndex(MSG_INDEX.username_taken);
      console.log(error.response.data);
    }
  }

  useEffect(() => {
    if (username.length < 4 || password.length < 8) {
      submitBtn.current!.disabled = true;
      submitBtn.current!.classList.add("disabled-btn");
    } else {
      submitBtn.current!.disabled = false;
      submitBtn.current!.classList.remove("disabled-btn");
    }
  }, [username, password]);

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <p>Start your journal</p>
        <p className={msgProcessIndex > 0 ? "invalid-register" : ""}>
          {msgProcess[msgProcessIndex]}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label htmlFor="username-register">USERNAME</label>
          <input
            required
            type="text"
            name="username-register"
            id="username-register"
            placeholder="choose a handle"
            onChange={(e) => setUsername(e.target.value.trim())}
            value={username}
            minLength={3}
            maxLength={20}
          />

          <label htmlFor="password-register">PASSWORD</label>
          <input
            required
            type="password"
            name="password-register"
            id="password-register"
            placeholder="choose a password"
            onChange={(e) => setPassword(e.target.value.trim())}
            value={password}
            minLength={8}
            maxLength={32}
          />

          <button
            className="disabled-btn"
            ref={submitBtn}
            onClick={() => checkRegister()}
            onKeyDown={(e) => {
              if (e.key === "Enter") checkRegister();
            }}
          >
            REGISTER
          </button>
        </form>

        <p>
          Already writing?{" "}
          <span>
            <Link to={{ pathname: "/login" }}>Sign in</Link>
          </span>
        </p>
      </div>
    </div>
  );
}
