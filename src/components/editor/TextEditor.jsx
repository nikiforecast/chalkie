import { useRef, useEffect } from 'react';
import usePresentationStore from '../../store/usePresentationStore';
import './TextEditor.css';

export default function TextEditor({ element, scale, offsetX, offsetY, onClose, onChange }) {
  const textareaRef = useRef(null);
  const recordHistory = usePresentationStore((s) => s.recordHistory);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.focus();
    ta.select();
  }, []);

  if (!element) return null;

  const style = {
    left: offsetX + element.x * scale,
    top: offsetY + element.y * scale,
    width: element.width * scale,
    minHeight: element.height * scale,
    fontSize: element.fontSize * scale,
    fontFamily: element.fontFamily,
    fontWeight: element.fontWeight,
    fontStyle: element.fontStyle,
    textDecoration: element.textDecoration,
    color: element.fill,
    textAlign: element.align,
    lineHeight: 1.2,
    transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
    transformOrigin: 'top left',
  };

  const handleBlur = () => {
    recordHistory();
    onClose();
  };

  return (
    <textarea
      ref={textareaRef}
      className="text-editor-overlay"
      style={style}
      value={element.text}
      onChange={(e) => onChange({ text: e.target.value })}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      }}
    />
  );
}
