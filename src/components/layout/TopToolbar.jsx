import { useState, useRef } from 'react';
import {
  Undo2,
  Redo2,
  MousePointer2,
  Type,
  Square,
  Circle,
  Minus,
  Image,
  Table,
  BarChart3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  Layers,
  Magnet,
  ZoomIn,
  ZoomOut,
  Play,
  Share2,
  Upload,
  FilePlus,
  Bold,
  Italic,
  Underline,
} from 'lucide-react';
import usePresentationStore from '../../store/usePresentationStore';
import { alignElements, distributeElements } from '../../utils/alignment';
import IconButton from '../ui/IconButton';
import Button from '../ui/Button';
import ToolbarGroup, { ToolbarDivider } from '../ui/ToolbarGroup';
import ExportModal from '../modals/ExportModal';
import ShareModal from '../modals/ShareModal';
import NewPresentationModal from '../modals/NewPresentationModal';
import './TopToolbar.css';

export default function TopToolbar() {
  const [showExport, setShowExport] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const fileInputRef = useRef(null);

  const presentation = usePresentationStore((s) => s.presentation);
  const updatePresentationName = usePresentationStore((s) => s.updatePresentationName);
  const undo = usePresentationStore((s) => s.undo);
  const redo = usePresentationStore((s) => s.redo);
  const historyIndex = usePresentationStore((s) => s.historyIndex);
  const future = usePresentationStore((s) => s.future);
  const tool = usePresentationStore((s) => s.tool);
  const setTool = usePresentationStore((s) => s.setTool);
  const addElement = usePresentationStore((s) => s.addElement);
  const selectedElementIds = usePresentationStore((s) => s.selectedElementIds);
  const getActiveSlide = usePresentationStore((s) => s.getActiveSlide);
  const updateElements = usePresentationStore((s) => s.updateElements);
  const updateElement = usePresentationStore((s) => s.updateElement);
  const showGuides = usePresentationStore((s) => s.showGuides);
  const setShowGuides = usePresentationStore((s) => s.setShowGuides);
  const zoom = usePresentationStore((s) => s.zoom);
  const setZoom = usePresentationStore((s) => s.setZoom);
  const setMode = usePresentationStore((s) => s.setMode);
  const getTheme = usePresentationStore((s) => s.getTheme);

  const theme = getTheme();
  const slide = getActiveSlide();
  const selectedElement =
    selectedElementIds.length === 1
      ? slide?.elements.find((e) => e.id === selectedElementIds[0])
      : null;

  const canRedo = future.length > 0;
  const canUndo = historyIndex >= 0;

  const addShape = (type) => {
    setTool('select');
    const defaults = {
      rect: { type: 'rect', width: 200, height: 120, fill: theme.primary + '20', stroke: theme.primary },
      ellipse: { type: 'ellipse', width: 160, height: 160, fill: theme.accent + '20', stroke: theme.accent },
      line: { type: 'line', width: 200, height: 0, stroke: theme.text, strokeWidth: 3, points: [0, 0, 200, 0] },
      table: { type: 'table', width: 400, height: 240, rows: 4, cols: 4 },
      chart: { type: 'chart', width: 400, height: 280, chartType: 'bar', fill: theme.primary },
    };
    addElement({
      x: 360,
      y: 300,
      rotation: 0,
      ...defaults[type],
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      addElement({
        type: 'image',
        x: 400,
        y: 250,
        width: 400,
        height: 300,
        src: reader.result,
        rotation: 0,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAlign = (alignment) => {
    const updates = alignElements(slide.elements, selectedElementIds, alignment);
    if (updates.length) updateElements(updates);
  };

  const handleDistribute = (axis) => {
    const updates = distributeElements(slide.elements, selectedElementIds, axis);
    if (updates.length) updateElements(updates);
  };

  const toggleTextStyle = (prop, onVal, offVal) => {
    if (!selectedElement || selectedElement.type !== 'text') return;
    updateElement(selectedElement.id, { [prop]: selectedElement[prop] === onVal ? offVal : onVal }, true);
  };

  return (
    <>
      <header className="top-toolbar" role="toolbar" aria-label="Editor toolbar">
        <div className="top-toolbar__section top-toolbar__section--brand">
          <div className="top-toolbar__logo">Chalkie</div>
          <input
            className="top-toolbar__title"
            value={presentation.name}
            onChange={(e) => updatePresentationName(e.target.value)}
            aria-label="Presentation title"
          />
        </div>

        <div className="top-toolbar__section top-toolbar__section--tools">
          <ToolbarGroup label="History">
            <IconButton icon={Undo2} label="Undo (⌘Z)" onClick={undo} disabled={!canUndo} />
            <IconButton icon={Redo2} label="Redo (⌘⇧Z)" onClick={redo} disabled={!canRedo} />
          </ToolbarGroup>

          <ToolbarDivider />

          <ToolbarGroup label="Tools">
            <IconButton icon={MousePointer2} label="Select" active={tool === 'select'} onClick={() => setTool('select')} />
            <IconButton icon={Type} label="Text" active={tool === 'text'} onClick={() => setTool('text')} />
            <IconButton icon={Square} label="Rectangle" onClick={() => addShape('rect')} />
            <IconButton icon={Circle} label="Ellipse" onClick={() => addShape('ellipse')} />
            <IconButton icon={Minus} label="Line" onClick={() => addShape('line')} />
            <IconButton icon={Image} label="Image" onClick={() => fileInputRef.current?.click()} />
            <IconButton icon={Table} label="Table" onClick={() => addShape('table')} />
            <IconButton icon={BarChart3} label="Chart" onClick={() => addShape('chart')} />
            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleImageUpload} />
          </ToolbarGroup>

          {selectedElement?.type === 'text' && (
            <>
              <ToolbarDivider />
              <ToolbarGroup label="Text formatting">
                <IconButton
                  icon={Bold}
                  label="Bold"
                  active={selectedElement.fontWeight === 'bold'}
                  onClick={() => toggleTextStyle('fontWeight', 'bold', 'normal')}
                />
                <IconButton
                  icon={Italic}
                  label="Italic"
                  active={selectedElement.fontStyle === 'italic'}
                  onClick={() => toggleTextStyle('fontStyle', 'italic', 'normal')}
                />
                <IconButton
                  icon={Underline}
                  label="Underline"
                  active={selectedElement.textDecoration === 'underline'}
                  onClick={() => toggleTextStyle('textDecoration', 'underline', '')}
                />
              </ToolbarGroup>
            </>
          )}

          {selectedElementIds.length >= 2 && (
            <>
              <ToolbarDivider />
              <ToolbarGroup label="Alignment">
                <IconButton icon={AlignLeft} label="Align left" onClick={() => handleAlign('left')} />
                <IconButton icon={AlignCenter} label="Align center" onClick={() => handleAlign('center-h')} />
                <IconButton icon={AlignRight} label="Align right" onClick={() => handleAlign('right')} />
                <IconButton icon={AlignStartVertical} label="Align top" onClick={() => handleAlign('top')} />
                <IconButton icon={AlignCenterVertical} label="Align middle" onClick={() => handleAlign('center-v')} />
                <IconButton icon={AlignEndVertical} label="Align bottom" onClick={() => handleAlign('bottom')} />
                <IconButton icon={Layers} label="Distribute horizontally" onClick={() => handleDistribute('horizontal')} />
                <IconButton icon={Layers} label="Distribute vertically" onClick={() => handleDistribute('vertical')} />
              </ToolbarGroup>
            </>
          )}

          <ToolbarDivider />

          <ToolbarGroup label="View">
            <IconButton icon={Magnet} label="Toggle snap guides" active={showGuides} onClick={() => setShowGuides(!showGuides)} />
            <IconButton icon={ZoomOut} label="Zoom out" onClick={() => setZoom(zoom - 0.1)} />
            <span className="top-toolbar__zoom">{Math.round(zoom * 100)}%</span>
            <IconButton icon={ZoomIn} label="Zoom in" onClick={() => setZoom(zoom + 0.1)} />
          </ToolbarGroup>
        </div>

        <div className="top-toolbar__section top-toolbar__section--actions">
          <Button variant="ghost" onClick={() => setShowNew(true)}>
            <FilePlus size={16} /> New
          </Button>
          <Button variant="ghost" onClick={() => setShowShare(true)}>
            <Share2 size={16} /> Share
          </Button>
          <Button variant="ghost" onClick={() => setShowExport(true)}>
            <Upload size={16} /> Export
          </Button>
          <Button variant="primary" onClick={() => setMode('present')}>
            <Play size={16} /> Present
          </Button>
        </div>
      </header>

      {showExport && <ExportModal onClose={() => setShowExport(false)} />}
      {showShare && <ShareModal onClose={() => setShowShare(false)} />}
      {showNew && <NewPresentationModal onClose={() => setShowNew(false)} />}
    </>
  );
}
