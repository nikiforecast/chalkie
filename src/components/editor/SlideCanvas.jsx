import { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Rect, Line, Transformer } from 'react-konva';
import usePresentationStore from '../../store/usePresentationStore';
import SlideElement from './SlideElement';
import TextEditor from './TextEditor';
import { getSnapGuides } from '../../utils/alignment';
import './SlideCanvas.css';

function SlideBackground({ background, width, height }) {
  if (background.type === 'gradient') {
    return (
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: width, y: height }}
        fillLinearGradientColorStops={[
          0,
          background.colorStart || '#ffffff',
          1,
          background.colorEnd || '#e2e8f0',
        ]}
      />
    );
  }
  return <Rect x={0} y={0} width={width} height={height} fill={background.color || '#ffffff'} />;
}

export default function SlideCanvas({ readOnly = false }) {
  const stageRef = useRef(null);
  const transformerRef = useRef(null);
  const containerRef = useRef(null);

  const presentation = usePresentationStore((s) => s.presentation);
  const activeSlideIndex = usePresentationStore((s) => s.activeSlideIndex);
  const selectedElementIds = usePresentationStore((s) => s.selectedElementIds);
  const selectElements = usePresentationStore((s) => s.selectElements);
  const clearSelection = usePresentationStore((s) => s.clearSelection);
  const updateElement = usePresentationStore((s) => s.updateElement);
  const addElement = usePresentationStore((s) => s.addElement);
  const zoom = usePresentationStore((s) => s.zoom);
  const showGuides = usePresentationStore((s) => s.showGuides);
  const tool = usePresentationStore((s) => s.tool);

  const slide = presentation.slides[activeSlideIndex];
  const { width: slideWidth, height: slideHeight } = presentation.dimensions;

  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const [editingTextId, setEditingTextId] = useState(null);
  const [activeGuides, setActiveGuides] = useState({ vertical: [], horizontal: [] });

  const fitScale = Math.min(
    (containerSize.width - 48) / slideWidth,
    (containerSize.height - 48) / slideHeight,
    1
  );
  const scale = fitScale * zoom;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setContainerSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const tr = transformerRef.current;
    const stage = stageRef.current;
    if (!tr || !stage || readOnly) return;
    const nodes = selectedElementIds
      .map((id) => stage.findOne(`#${id}`))
      .filter(Boolean);
    tr.nodes(nodes);
    tr.getLayer()?.batchDraw();
  }, [selectedElementIds, slide?.elements, readOnly]);

  const handleSelect = useCallback(
    (id, multi, startEdit = false) => {
      if (readOnly) return;
      if (multi) {
        const ids = selectedElementIds.includes(id)
          ? selectedElementIds.filter((i) => i !== id)
          : [...selectedElementIds, id];
        selectElements(ids);
      } else {
        selectElements([id]);
      }
      if (startEdit) {
        const el = slide.elements.find((e) => e.id === id);
        if (el?.type === 'text') setEditingTextId(id);
      }
    },
    [readOnly, selectedElementIds, selectElements, slide?.elements]
  );

  const handleStageClick = (e) => {
    if (readOnly) return;
    if (e.target === e.target.getStage()) {
      clearSelection();
      setEditingTextId(null);
    }
  };

  const handleDragMove = (elementId, e) => {
    if (!showGuides) return;
    const node = e.target;
    const el = slide.elements.find((item) => item.id === elementId);
    if (!el) return;
    const guides = getSnapGuides(
      slide.elements,
      elementId,
      node.x(),
      node.y(),
      el.width,
      el.height
    );
    setActiveGuides(guides);
    if (guides.vertical.length) node.x(guides.vertical[0].snap);
    if (guides.horizontal.length) node.y(guides.horizontal[0].snap);
  };

  const handleDragEnd = () => setActiveGuides({ vertical: [], horizontal: [] });

  const handleStageDblClick = () => {
    if (readOnly || tool !== 'text') return;
    const stage = stageRef.current;
    const pos = stage.getPointerPosition();
    if (!pos) return;
    const x = (pos.x - (containerSize.width - slideWidth * scale) / 2) / scale;
    const y = (pos.y - (containerSize.height - slideHeight * scale) / 2) / scale;
    const id = addElement({
      type: 'text',
      x,
      y,
      width: 300,
      height: 50,
      text: 'New text',
      fontSize: 24,
      fontFamily: 'Inter',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: '',
      fill: '#0f172a',
      align: 'left',
      verticalAlign: 'top',
      rotation: 0,
    });
    setEditingTextId(id);
  };

  if (!slide) return null;

  const sortedElements = [...slide.elements].sort((a, b) => a.zIndex - b.zIndex);
  const stageX = (containerSize.width - slideWidth * scale) / 2;
  const stageY = (containerSize.height - slideHeight * scale) / 2;

  return (
    <div className="slide-canvas-container" ref={containerRef}>
      <Stage
        ref={stageRef}
        width={containerSize.width}
        height={containerSize.height}
        scaleX={scale}
        scaleY={scale}
        x={stageX}
        y={stageY}
        onClick={handleStageClick}
        onTap={handleStageClick}
        onDblClick={handleStageDblClick}
      >
        <Layer>
          <SlideBackground
            background={slide.background}
            width={slideWidth}
            height={slideHeight}
          />
          <Rect
            x={0}
            y={0}
            width={slideWidth}
            height={slideHeight}
            stroke="#cbd5e1"
            strokeWidth={1 / scale}
            listening={false}
          />
        </Layer>

        <Layer>
          {sortedElements.map((element) => (
            <SlideElement
              key={element.id}
              element={element}
              onSelect={handleSelect}
              onChange={updateElement}
              draggable={!readOnly && tool === 'select'}
              onDragMove={(e) => handleDragMove(element.id, e)}
              onDragEnd={handleDragEnd}
            />
          ))}

          {showGuides &&
            activeGuides.vertical.map((g, i) => (
              <Line
                key={`vg-${i}`}
                points={[g.position, 0, g.position, slideHeight]}
                stroke="#ef4444"
                strokeWidth={1}
                dash={[4, 4]}
                listening={false}
              />
            ))}
          {showGuides &&
            activeGuides.horizontal.map((g, i) => (
              <Line
                key={`hg-${i}`}
                points={[0, g.position, slideWidth, g.position]}
                stroke="#ef4444"
                strokeWidth={1}
                dash={[4, 4]}
                listening={false}
              />
            ))}

          {!readOnly && (
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) =>
                newBox.width < 20 || newBox.height < 20 ? oldBox : newBox
              }
              rotateEnabled
              enabledAnchors={[
                'top-left',
                'top-right',
                'bottom-left',
                'bottom-right',
                'middle-left',
                'middle-right',
                'top-center',
                'bottom-center',
              ]}
            />
          )}
        </Layer>
      </Stage>

      {editingTextId && !readOnly && (
        <TextEditor
          element={slide.elements.find((e) => e.id === editingTextId)}
          scale={scale}
          offsetX={stageX}
          offsetY={stageY}
          onClose={() => setEditingTextId(null)}
          onChange={(updates) => updateElement(editingTextId, updates)}
        />
      )}
    </div>
  );
}
