import { useState } from 'react';
import { X } from 'lucide-react';
import usePresentationStore from '../../store/usePresentationStore';
import { THEMES } from '../../constants/themes';
import { SLIDE_PRESETS } from '../../constants/dimensions';
import Select from '../ui/Select';
import Button from '../ui/Button';
import './Modal.css';

export default function NewPresentationModal({ onClose }) {
  const newPresentation = usePresentationStore((s) => s.newPresentation);
  const [preset, setPreset] = useState('16:9');
  const [themeId, setThemeId] = useState('default');

  const handleCreate = () => {
    newPresentation(preset, themeId);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="New presentation">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>New Presentation</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="modal__body">
          <Select
            label="Slide dimensions"
            value={preset}
            onChange={setPreset}
            options={Object.entries(SLIDE_PRESETS)
              .filter(([k]) => k !== 'custom')
              .map(([k, v]) => ({ value: k, label: v.label }))}
          />
          <Select
            label="Theme"
            value={themeId}
            onChange={setThemeId}
            options={Object.values(THEMES).map((t) => ({ value: t.id, label: t.name }))}
          />
          <p className="modal__description">
            Creates a new presentation with a title slide. Your current work is replaced.
          </p>
        </div>
        <div className="modal__footer" style={{ padding: '0 20px 20px' }}>
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="button" onClick={handleCreate}>
            Create
          </Button>
        </div>
      </div>
    </div>
  );
}
