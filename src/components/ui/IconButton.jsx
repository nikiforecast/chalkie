import './IconButton.css';

export default function IconButton({
  icon: Icon,
  label,
  active = false,
  size = 32,
  variant = 'ghost',
  ...props
}) {
  return (
    <button
      type="button"
      className={`icon-btn icon-btn--${variant} ${active ? 'icon-btn--active' : ''}`}
      style={{ width: size, height: size }}
      aria-label={label}
      title={label}
      {...props}
    >
      <Icon size={size <= 28 ? 16 : 18} strokeWidth={1.75} />
    </button>
  );
}
