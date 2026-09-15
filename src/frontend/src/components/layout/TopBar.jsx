export default function TopBar({ title, onMenuClick }) {
  return (
    <header className="topbar">
      <button className="topbar-menu-btn" onClick={onMenuClick} aria-label="Open menu">
        ☰
      </button>
      <span className="topbar-title">{title}</span>
    </header>
  );
}
