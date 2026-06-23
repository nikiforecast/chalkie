import { useState } from 'react';
import { Plus, Copy, Trash2, GripVertical } from 'lucide-react';
import { Stage, Layer, Rect } from 'react-konva';
import usePresentationStore from '../../store/usePresentationStore';
import SlideElement from '../editor/SlideElement';
import IconButton from '../ui/IconButton';
import Button from '../ui/Button';
import './SlideThumbnails.css';

function ThumbnailPreview({ slide, width, height, slideWidth, slideHeight }) {
  const scale = Math.min(width / slideWidth, height / slideHeight);
  const sorted = [...slide.elements].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <Stage width={width} height={height} scaleX={scale} scaleY={scale}>
      <Layer>
        <Rect
          x={(width / scale - slideWidth) / 2}
          y={(height / scale - slideHeight) / 2}
          width={slideWidth}
          height={slideHeight}
          fill={slide.background?.color || '#fff'}
        />
        {sorted.map((el) => (
          <SlideElement
            key={el.id}
            element={{
              ...el,
              x: el.x + (width / scale - slideWidth) / 2,
              y: el.y + (height / scale - slideHeight) / 2,
            }}
            onSelect={() => {}}
            onChange={() => {}}
            draggable={false}
          />
        ))}
      </Layer>
    </Stage>
  );
}

export default function SlideThumbnails() {
  const presentation = usePresentationStore((s) => s.presentation);
  const activeSlideIndex = usePresentationStore((s) => s.activeSlideIndex);
  const setActiveSlideIndex = usePresentationStore((s) => s.setActiveSlideIndex);
  const addSlide = usePresentationStore((s) => s.addSlide);
  const duplicateSlide = usePresentationStore((s) => s.duplicateSlide);
  const deleteSlide = usePresentationStore((s) => s.deleteSlide);
  const reorderSlide = usePresentationStore((s) => s.reorderSlide);

  const [dragIndex, setDragIndex] = useState(null);

  const { width: slideWidth, height: slideHeight } = presentation.dimensions;

  const handleDragStart = (index) => setDragIndex(index);

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== index) {
      reorderSlide(dragIndex, index);
      setDragIndex(index);
    }
  };

  return (
    <aside className="slide-thumbnails" aria-label="Slides panel">
      <div className="slide-thumbnails__header">
        <span className="slide-thumbnails__title">Slides</span>
        <span className="slide-thumbnails__count">{presentation.slides.length}</span>
      </div>

      <div className="slide-thumbnails__list" role="list">
        {presentation.slides.map((slide, index) => (
          <div
            key={slide.id}
            role="listitem"
            className={`slide-thumbnail ${index === activeSlideIndex ? 'slide-thumbnail--active' : ''}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={() => setDragIndex(null)}
            onClick={() => setActiveSlideIndex(index)}
          >
            <div className="slide-thumbnail__grip" aria-hidden="true">
              <GripVertical size={12} />
            </div>
            <span className="slide-thumbnail__number">{index + 1}</span>
            <div className="slide-thumbnail__preview">
              <ThumbnailPreview
                slide={slide}
                width={168}
                height={94}
                slideWidth={slideWidth}
                slideHeight={slideHeight}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="slide-thumbnails__actions">
        <Button variant="default" size="sm" onClick={() => addSlide()} aria-label="Add slide">
          <Plus size={14} /> Add
        </Button>
        <IconButton
          icon={Copy}
          label="Duplicate slide"
          size={28}
          onClick={() => duplicateSlide(activeSlideIndex)}
        />
        <IconButton
          icon={Trash2}
          label="Delete slide"
          size={28}
          onClick={() => deleteSlide(activeSlideIndex)}
          disabled={presentation.slides.length <= 1}
        />
      </div>
    </aside>
  );
}
