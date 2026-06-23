import './ColorPicker.css';

export default function ColorPicker({ label, value, onChange }) {
  return (
    <label className="color-picker">
      {label && <span className="color-picker__label">{label}</span>}
      <div className="color-picker__input">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label || 'Color'}
        />
        <span className="color-picker__value">{value}</span>
      </div>
    </label>
  );
}
