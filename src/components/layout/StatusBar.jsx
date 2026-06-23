import usePresentationStore from '../../store/usePresentationStore';
import './StatusBar.css';

export default function StatusBar() {
  const presentation = usePresentationStore((s) => s.presentation);
  const activeSlideIndex = usePresentationStore((s) => s.activeSlideIndex);
  const selectedElementIds = usePresentationStore((s) => s.selectedElementIds);
  const zoom = usePresentationStore((s) => s.zoom);

  const slide = presentation.slides[activeSlideIndex];
  const dims = presentation.dimensions;

  return (
    <footer className="status-bar" role="status">
      <span>
        Slide {activeSlideIndex + 1} of {presentation.slides.length}
        {slide?.title ? ` — ${slide.title}` : ''}
      </span>
      <span className="status-bar__center">
        {selectedElementIds.length > 0
          ? `${selectedElementIds.length} element${selectedElementIds.length > 1 ? 's' : ''} selected`
          : 'No selection'}
      </span>
      <span>
        {dims.width} × {dims.height} · {Math.round(zoom * 100)}%
      </span>
    </footer>
  );
}
