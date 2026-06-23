import './Select.css';

export default function Select({ label, options, value, onChange, className = '' }) {
  return (
    <label className={`select-field ${className}`}>
      {label && <span className="select-field__label">{label}</span>}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
