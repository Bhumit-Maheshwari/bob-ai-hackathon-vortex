export default function AlertBanner({ type = 'info', icon, children }) {
  return (
    <div className={`alert-banner alert-banner-${type}`}>
      {icon && <span className="alert-banner-icon">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}
