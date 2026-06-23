import './ToolbarGroup.css';

export default function ToolbarGroup({ label, children }) {
  return (
    <div className="toolbar-group" role="group" aria-label={label}>
      {children}
    </div>
  );
}

export function ToolbarDivider() {
  return <div className="toolbar-divider" aria-hidden="true" />;
}
