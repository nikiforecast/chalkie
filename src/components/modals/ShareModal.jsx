import { X, Link, Users } from 'lucide-react';
import usePresentationStore from '../../store/usePresentationStore';
import Select from '../ui/Select';
import Button from '../ui/Button';
import './Modal.css';

export default function ShareModal({ onClose }) {
  const presentation = usePresentationStore((s) => s.presentation);
  const shareSettings = usePresentationStore((s) => s.shareSettings);

  const shareUrl = `${window.location.origin}?presentation=${presentation.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Share">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>Share Presentation</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="modal__body">
          <div className="share-link">
            <Link size={16} />
            <input readOnly value={shareUrl} aria-label="Share link" />
            <Button variant="default" size="sm" onClick={handleCopy}>
              Copy
            </Button>
          </div>
          <Select
            label="Who can view"
            value={shareSettings.view}
            onChange={() => {}}
            options={[
              { value: 'restricted', label: 'Restricted — only people added' },
              { value: 'link', label: 'Anyone with the link' },
              { value: 'public', label: 'Public on the web' },
            ]}
          />
          <Select
            label="Who can edit"
            value={shareSettings.edit}
            onChange={() => {}}
            options={[
              { value: 'owner', label: 'Owner only' },
              { value: 'editors', label: 'People with edit access' },
              { value: 'commenters', label: 'Commenters can suggest' },
            ]}
          />
          <div className="share-collaborators">
            <Users size={16} />
            <span>Real-time collaboration requires a backend (Yjs/Firebase). This prototype uses local state.</span>
          </div>
        </div>
        <div className="modal__footer">
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
