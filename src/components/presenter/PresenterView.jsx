import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import usePresentationStore from '../../store/usePresentationStore';
import SlideCanvas from '../editor/SlideCanvas';
import IconButton from '../ui/IconButton';
import './PresenterView.css';

export default function PresenterView() {
  const presentation = usePresentationStore((s) => s.presentation);
  const activeSlideIndex = usePresentationStore((s) => s.activeSlideIndex);
  const setActiveSlideIndex = usePresentationStore((s) => s.setActiveSlideIndex);
  const setMode = usePresentationStore((s) => s.setMode);
  const getActiveSlide = usePresentationStore((s) => s.getActiveSlide);

  const slide = getActiveSlide();
  const total = presentation.slides.length;

  const goNext = () => {
    if (activeSlideIndex < total - 1) setActiveSlideIndex(activeSlideIndex + 1);
  };

  const goPrev = () => {
    if (activeSlideIndex > 0) setActiveSlideIndex(activeSlideIndex - 1);
  };

  return (
    <div className="presenter-view" role="region" aria-label="Presentation mode">
      <div className="presenter-view__main">
        <div className="presenter-view__slide">
          <SlideCanvas readOnly />
        </div>
        <div className="presenter-view__controls">
          <IconButton icon={ChevronLeft} label="Previous slide" onClick={goPrev} disabled={activeSlideIndex === 0} />
          <span className="presenter-view__counter">
            {activeSlideIndex + 1} / {total}
          </span>
          <IconButton icon={ChevronRight} label="Next slide" onClick={goNext} disabled={activeSlideIndex >= total - 1} />
          <IconButton icon={X} label="Exit presentation (Esc)" onClick={() => setMode('edit')} />
        </div>
      </div>

      <aside className="presenter-view__notes" aria-label="Speaker notes">
        <h3>Speaker Notes</h3>
        <p>{slide?.notes || 'No notes for this slide.'}</p>
        <div className="presenter-view__next">
          <h4>Up next</h4>
          <p>{presentation.slides[activeSlideIndex + 1]?.title || '— End of presentation —'}</p>
        </div>
      </aside>
    </div>
  );
}
