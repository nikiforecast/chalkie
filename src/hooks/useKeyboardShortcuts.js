import { useEffect } from 'react';
import usePresentationStore from '../store/usePresentationStore';

export default function useKeyboardShortcuts() {
  const undo = usePresentationStore((s) => s.undo);
  const redo = usePresentationStore((s) => s.redo);
  const deleteElements = usePresentationStore((s) => s.deleteElements);
  const selectedElementIds = usePresentationStore((s) => s.selectedElementIds);
  const clearSelection = usePresentationStore((s) => s.clearSelection);
  const setMode = usePresentationStore((s) => s.setMode);
  const mode = usePresentationStore((s) => s.mode);
  const addSlide = usePresentationStore((s) => s.addSlide);
  const duplicateSlide = usePresentationStore((s) => s.duplicateSlide);
  const activeSlideIndex = usePresentationStore((s) => s.activeSlideIndex);
  const setActiveSlideIndex = usePresentationStore((s) => s.setActiveSlideIndex);
  const presentation = usePresentationStore((s) => s.presentation);
  const setZoom = usePresentationStore((s) => s.setZoom);
  const zoom = usePresentationStore((s) => s.zoom);

  useEffect(() => {
    const handler = (e) => {
      const tag = e.target.tagName;
      const isEditing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
        return;
      }

      if (isEditing) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementIds.length) {
          e.preventDefault();
          deleteElements(selectedElementIds);
        }
        return;
      }

      if (e.key === 'Escape') {
        if (mode === 'present') setMode('edit');
        else clearSelection();
        return;
      }

      if (e.key === 'F5' || ((e.metaKey || e.ctrlKey) && e.key === 'Enter')) {
        e.preventDefault();
        setMode(mode === 'present' ? 'edit' : 'present');
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
        e.preventDefault();
        addSlide();
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        duplicateSlide(activeSlideIndex);
        return;
      }

      if (e.key === 'ArrowDown' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setActiveSlideIndex(Math.min(activeSlideIndex + 1, presentation.slides.length - 1));
        return;
      }

      if (e.key === 'ArrowUp' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setActiveSlideIndex(Math.max(activeSlideIndex - 1, 0));
        return;
      }

      if ((e.metaKey || e.ctrlKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        setZoom(zoom + 0.1);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === '-') {
        e.preventDefault();
        setZoom(zoom - 0.1);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [
    undo,
    redo,
    deleteElements,
    selectedElementIds,
    clearSelection,
    setMode,
    mode,
    addSlide,
    duplicateSlide,
    activeSlideIndex,
    setActiveSlideIndex,
    presentation.slides.length,
    setZoom,
    zoom,
  ]);
}
