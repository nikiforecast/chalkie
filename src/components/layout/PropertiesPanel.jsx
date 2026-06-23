import {
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  MessageSquarePlus,
} from 'lucide-react';
import usePresentationStore from '../../store/usePresentationStore';
import { THEMES } from '../../constants/themes';
import { SLIDE_LAYOUTS } from '../../constants/layouts';
import { SLIDE_PRESETS } from '../../constants/dimensions';
import { FONT_LIBRARY } from '../../constants/themes';
import Select from '../ui/Select';
import ColorPicker from '../ui/ColorPicker';
import IconButton from '../ui/IconButton';
import Button from '../ui/Button';
import './PropertiesPanel.css';

export default function PropertiesPanel() {
  const presentation = usePresentationStore((s) => s.presentation);
  const activeSlideIndex = usePresentationStore((s) => s.activeSlideIndex);
  const selectedElementIds = usePresentationStore((s) => s.selectedElementIds);
  const getActiveSlide = usePresentationStore((s) => s.getActiveSlide);
  const updateElement = usePresentationStore((s) => s.updateElement);
  const deleteElements = usePresentationStore((s) => s.deleteElements);
  const setTheme = usePresentationStore((s) => s.setTheme);
  const setDimensions = usePresentationStore((s) => s.setDimensions);
  const setSlideBackground = usePresentationStore((s) => s.setSlideBackground);
  const setSlideNotes = usePresentationStore((s) => s.setSlideNotes);
  const applyLayout = usePresentationStore((s) => s.applyLayout);
  const bringToFront = usePresentationStore((s) => s.bringToFront);
  const sendToBack = usePresentationStore((s) => s.sendToBack);
  const moveLayer = usePresentationStore((s) => s.moveLayer);
  const addComment = usePresentationStore((s) => s.addComment);
  const comments = usePresentationStore((s) => s.comments);

  const slide = getActiveSlide();
  const selectedElement =
    selectedElementIds.length === 1
      ? slide?.elements.find((e) => e.id === selectedElementIds[0])
      : null;

  const slideComments = comments.filter((c) => c.slideId === slide?.id && !c.resolved);

  const handleAddComment = () => {
    const text = window.prompt('Add a comment:');
    if (text?.trim()) addComment(slide.id, text.trim(), 100, 100);
  };

  if (!slide) return null;

  return (
    <aside className="properties-panel" aria-label="Properties panel">
      <div className="properties-panel__section">
        <h3 className="properties-panel__heading">Presentation</h3>
        <Select
          label="Theme"
          value={presentation.themeId}
          onChange={setTheme}
          options={Object.values(THEMES).map((t) => ({ value: t.id, label: t.name }))}
        />
        <Select
          label="Dimensions"
          value={presentation.dimensions.preset || '16:9'}
          onChange={(v) => setDimensions(v)}
          options={Object.entries(SLIDE_PRESETS).map(([k, v]) => ({
            value: k,
            label: v.label,
          }))}
        />
      </div>

      <div className="properties-panel__section">
        <h3 className="properties-panel__heading">Slide</h3>
        <Select
          label="Layout"
          value={slide.layout}
          onChange={(v) => applyLayout(slide.id, v)}
          options={Object.values(SLIDE_LAYOUTS).map((l) => ({
            value: l.id,
            label: l.name,
          }))}
        />
        <Select
          label="Background"
          value={slide.background.type}
          onChange={(v) =>
            setSlideBackground(slide.id, {
              ...slide.background,
              type: v,
              color: slide.background.color || '#ffffff',
              colorStart: slide.background.colorStart || '#ffffff',
              colorEnd: slide.background.colorEnd || '#e2e8f0',
            })
          }
          options={[
            { value: 'solid', label: 'Solid color' },
            { value: 'gradient', label: 'Gradient' },
          ]}
        />
        {slide.background.type === 'solid' ? (
          <ColorPicker
            label="Background color"
            value={slide.background.color || '#ffffff'}
            onChange={(color) =>
              setSlideBackground(slide.id, { ...slide.background, type: 'solid', color })
            }
          />
        ) : (
          <>
            <ColorPicker
              label="Gradient start"
              value={slide.background.colorStart || '#ffffff'}
              onChange={(color) =>
                setSlideBackground(slide.id, { ...slide.background, type: 'gradient', colorStart: color })
              }
            />
            <ColorPicker
              label="Gradient end"
              value={slide.background.colorEnd || '#e2e8f0'}
              onChange={(color) =>
                setSlideBackground(slide.id, { ...slide.background, type: 'gradient', colorEnd: color })
              }
            />
          </>
        )}
        <label className="properties-panel__field">
          <span className="properties-panel__label">Speaker notes</span>
          <textarea
            className="properties-panel__textarea"
            value={slide.notes}
            onChange={(e) => setSlideNotes(slide.id, e.target.value)}
            placeholder="Add speaker notes for this slide..."
            rows={4}
          />
        </label>
      </div>

      {selectedElement && (
        <div className="properties-panel__section">
          <h3 className="properties-panel__heading">
            {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)}
          </h3>

          {selectedElement.type === 'text' && (
            <>
              <Select
                label="Font"
                value={selectedElement.fontFamily}
                onChange={(v) => updateElement(selectedElement.id, { fontFamily: v }, true)}
                options={FONT_LIBRARY.map((f) => ({ value: f, label: f }))}
              />
              <label className="properties-panel__field">
                <span className="properties-panel__label">Font size</span>
                <input
                  type="number"
                  min={8}
                  max={200}
                  value={selectedElement.fontSize}
                  onChange={(e) =>
                    updateElement(selectedElement.id, { fontSize: Number(e.target.value) }, true)
                  }
                />
              </label>
              <Select
                label="Alignment"
                value={selectedElement.align}
                onChange={(v) => updateElement(selectedElement.id, { align: v }, true)}
                options={[
                  { value: 'left', label: 'Left' },
                  { value: 'center', label: 'Center' },
                  { value: 'right', label: 'Right' },
                ]}
              />
              <ColorPicker
                label="Text color"
                value={selectedElement.fill}
                onChange={(v) => updateElement(selectedElement.id, { fill: v }, true)}
              />
            </>
          )}

          {(selectedElement.type === 'rect' ||
            selectedElement.type === 'ellipse') && (
            <>
              <ColorPicker
                label="Fill"
                value={selectedElement.fill || '#dbeafe'}
                onChange={(v) => updateElement(selectedElement.id, { fill: v }, true)}
              />
              <ColorPicker
                label="Stroke"
                value={selectedElement.stroke || '#2563eb'}
                onChange={(v) => updateElement(selectedElement.id, { stroke: v }, true)}
              />
              <label className="properties-panel__field">
                <span className="properties-panel__label">Stroke width</span>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={selectedElement.strokeWidth || 0}
                  onChange={(e) =>
                    updateElement(
                      selectedElement.id,
                      { strokeWidth: Number(e.target.value) },
                      true
                    )
                  }
                />
              </label>
            </>
          )}

          {selectedElement.type === 'rect' && (
            <label className="properties-panel__field">
              <span className="properties-panel__label">Corner radius</span>
              <input
                type="number"
                min={0}
                max={200}
                value={selectedElement.cornerRadius || 0}
                onChange={(e) =>
                  updateElement(
                    selectedElement.id,
                    { cornerRadius: Number(e.target.value) },
                    true
                  )
                }
              />
            </label>
          )}

          <div className="properties-panel__row">
            <span className="properties-panel__label">Position</span>
            <div className="properties-panel__inline-inputs">
              <label>
                X
                <input
                  type="number"
                  value={Math.round(selectedElement.x)}
                  onChange={(e) =>
                    updateElement(selectedElement.id, { x: Number(e.target.value) }, true)
                  }
                />
              </label>
              <label>
                Y
                <input
                  type="number"
                  value={Math.round(selectedElement.y)}
                  onChange={(e) =>
                    updateElement(selectedElement.id, { y: Number(e.target.value) }, true)
                  }
                />
              </label>
            </div>
          </div>

          <div className="properties-panel__row">
            <span className="properties-panel__label">Size</span>
            <div className="properties-panel__inline-inputs">
              <label>
                W
                <input
                  type="number"
                  min={10}
                  value={Math.round(selectedElement.width)}
                  onChange={(e) =>
                    updateElement(selectedElement.id, { width: Number(e.target.value) }, true)
                  }
                />
              </label>
              <label>
                H
                <input
                  type="number"
                  min={10}
                  value={Math.round(selectedElement.height)}
                  onChange={(e) =>
                    updateElement(selectedElement.id, { height: Number(e.target.value) }, true)
                  }
                />
              </label>
            </div>
          </div>

          <div className="properties-panel__layer-controls">
            <span className="properties-panel__label">Layer order</span>
            <div className="properties-panel__layer-buttons">
              <IconButton icon={ChevronsUp} label="Bring to front" size={28} onClick={() => bringToFront(selectedElement.id)} />
              <IconButton icon={ArrowUp} label="Move up" size={28} onClick={() => moveLayer(selectedElement.id, 'up')} />
              <IconButton icon={ArrowDown} label="Move down" size={28} onClick={() => moveLayer(selectedElement.id, 'down')} />
              <IconButton icon={ChevronsDown} label="Send to back" size={28} onClick={() => sendToBack(selectedElement.id)} />
            </div>
          </div>

          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteElements([selectedElement.id])}
            className="properties-panel__delete"
          >
            Delete element
          </Button>
        </div>
      )}

      <div className="properties-panel__section">
        <div className="properties-panel__comments-header">
          <h3 className="properties-panel__heading">Comments</h3>
          <IconButton icon={MessageSquarePlus} label="Add comment" size={28} onClick={handleAddComment} />
        </div>
        {slideComments.length === 0 ? (
          <p className="properties-panel__empty">No comments on this slide</p>
        ) : (
          <ul className="properties-panel__comments">
            {slideComments.map((c) => (
              <li key={c.id} className="properties-panel__comment">
                <strong>{c.author}</strong>
                <p>{c.text}</p>
                <time>{new Date(c.createdAt).toLocaleString()}</time>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
