import { X } from 'lucide-react';
import usePresentationStore from '../../store/usePresentationStore';
import { exportPresentationJson, exportToPdfPlaceholder } from '../../utils/export';
import Button from '../ui/Button';
import './Modal.css';

export default function ExportModal({ onClose }) {
  const presentation = usePresentationStore((s) => s.presentation);

  const handleExportJson = () => {
    exportPresentationJson(presentation);
    onClose();
  };

  const handleExportPdf = () => {
    exportToPdfPlaceholder();
    onClose();
  };

  const handleExportPng = () => {
    alert(
      'PNG export: Use browser screenshot or integrate html2canvas for production. Current slide can be captured via canvas API.'
    );
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Export">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>Export Presentation</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="modal__body">
          <p className="modal__description">
            Export your presentation in various formats. JSON export preserves full editability.
          </p>
          <div className="modal__options">
            <button type="button" className="export-option" onClick={handleExportPdf}>
              <strong>PDF</strong>
              <span>Print-ready document via browser print</span>
            </button>
            <button type="button" className="export-option" onClick={handleExportPng}>
              <strong>PNG</strong>
              <span>Image export per slide</span>
            </button>
            <button type="button" className="export-option" onClick={handleExportJson}>
              <strong>JSON</strong>
              <span>Full presentation data for backup</span>
            </button>
            <button type="button" className="export-option" disabled>
              <strong>PowerPoint (.pptx)</strong>
              <span>Coming soon — requires server-side conversion</span>
            </button>
          </div>
        </div>
        <div className="modal__footer">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
