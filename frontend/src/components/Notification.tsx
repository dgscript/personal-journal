import "../styles/notification.css";

export default function Notification({
  msg,
  situation,
  visible,
}: {
  situation: string;
  msg: string;
  visible: boolean;
}) {
  return (
    <div
      className={`notifi-container ${situation === "success" ? "notifi-success" : "notifi-error"}`}
      style={{ opacity: `${visible ? 1 : 0}` }}
    >
      <p>{msg}</p>
    </div>
  );
}
