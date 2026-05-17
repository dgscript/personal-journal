import { Link } from "react-router-dom";
import "../styles/notfound.css";

export default function NotFound() {
  return (
    <div className="not-found-container">
      <h1>Page not found.</h1>
      <p className="code">404</p>
      <p className="msg">
        The page that you are trying to access does not exist.
      </p>
      <Link to={{ pathname: "/" }}>RETURN</Link>
    </div>
  );
}
