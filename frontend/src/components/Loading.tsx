import "../styles/loading.css";

export default function Loading() {
  return (
    <div className="main-loading-container">
      <div className="main-loading">
        <div>
          <p>Personal Journal</p>
          <img src="/ico.png" alt="logo" />
        </div>
        <p className="l-msg">Loading application...</p>
      </div>
    </div>
  );
}
