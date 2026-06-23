import './Button.css';

export default function Button({
  children,
  variant = 'default',
  size = 'md',
  active = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      type="button"
      className={`btn btn--${variant} btn--${size} ${active ? 'btn--active' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
