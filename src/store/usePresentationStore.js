import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { THEMES } from '../constants/themes';
import { SLIDE_PRESETS } from '../constants/dimensions';
import { SLIDE_LAYOUTS } from '../constants/layouts';
import { createSamplePresentation, createNewPresentation } from '../utils/sampleData';

const MAX_HISTORY = 50;

function cloneState(state) {
  return JSON.parse(JSON.stringify(state));
}

function pushHistory(state) {
  const snapshot = {
    presentation: cloneState(state.presentation),
    activeSlideIndex: state.activeSlideIndex,
  };
  const history = state.history.slice(0, state.historyIndex + 1);
  history.push(snapshot);
  if (history.length > MAX_HISTORY) history.shift();
  return { history, historyIndex: history.length - 1, future: [] };
}

const usePresentationStore = create((set, get) => ({
  presentation: createSamplePresentation(),
  activeSlideIndex: 0,
  selectedElementIds: [],
  mode: 'edit',
  zoom: 1,
  showGrid: false,
  showGuides: true,
  tool: 'select',
  history: [],
  historyIndex: -1,
  future: [],
  comments: [],
  shareSettings: { view: 'restricted', edit: 'owner' },

  getActiveSlide: () => {
    const { presentation, activeSlideIndex } = get();
    return presentation.slides[activeSlideIndex];
  },

  getTheme: () => {
    const { presentation } = get();
    return THEMES[presentation.themeId] || THEMES.default;
  },

  recordHistory: () => {
    set((state) => pushHistory(state));
  },

  undo: () => {
    const { history, historyIndex, presentation, activeSlideIndex } = get();
    if (historyIndex < 0) return;
    const snapshot = history[historyIndex];
    const current = {
      presentation: cloneState(presentation),
      activeSlideIndex,
    };
    set({
      presentation: cloneState(snapshot.presentation),
      activeSlideIndex: snapshot.activeSlideIndex,
      historyIndex: historyIndex - 1,
      future: [current, ...get().future],
      selectedElementIds: [],
    });
  },

  redo: () => {
    const { future } = get();
    if (!future.length) return;
    const [next, ...rest] = future;
    const current = {
      presentation: cloneState(get().presentation),
      activeSlideIndex: get().activeSlideIndex,
    };
    const history = [...get().history];
    history.push(current);
    set({
      presentation: cloneState(next.presentation),
      activeSlideIndex: next.activeSlideIndex,
      history,
      historyIndex: history.length - 1,
      future: rest,
      selectedElementIds: [],
    });
  },

  setMode: (mode) => set({ mode, selectedElementIds: mode === 'present' ? [] : get().selectedElementIds }),

  setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(2, zoom)) }),

  setTool: (tool) => set({ tool }),

  setShowGrid: (showGrid) => set({ showGrid }),

  setShowGuides: (showGuides) => set({ showGuides }),

  selectElements: (ids) => set({ selectedElementIds: ids }),

  clearSelection: () => set({ selectedElementIds: [] }),

  setActiveSlideIndex: (index) =>
    set({ activeSlideIndex: index, selectedElementIds: [] }),

  updatePresentationName: (name) => {
    get().recordHistory();
    set((state) => ({
      presentation: {
        ...state.presentation,
        name,
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  setTheme: (themeId) => {
    get().recordHistory();
    const theme = THEMES[themeId];
    if (!theme) return;
    set((state) => ({
      presentation: {
        ...state.presentation,
        themeId,
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  setDimensions: (preset, customWidth, customHeight) => {
    get().recordHistory();
    const dims = SLIDE_PRESETS[preset] || SLIDE_PRESETS['16:9'];
    set((state) => ({
      presentation: {
        ...state.presentation,
        dimensions: {
          width: preset === 'custom' ? customWidth : dims.width,
          height: preset === 'custom' ? customHeight : dims.height,
          preset,
        },
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  setSlideBackground: (slideId, background) => {
    get().recordHistory();
    set((state) => ({
      presentation: {
        ...state.presentation,
        slides: state.presentation.slides.map((s) =>
          s.id === slideId ? { ...s, background } : s
        ),
        updatedAt: new Date().toISOString(),
      },
    }));
  },

  setSlideNotes: (slideId, notes) => {
    set((state) => ({
      presentation: {
        ...state.presentation,
        slides: state.presentation.slides.map((s) =>
          s.id === slideId ? { ...s, notes } : s
        ),
      },
    }));
  },

  applyLayout: (slideId, layoutId) => {
    get().recordHistory();
    const theme = get().getTheme();
    const layout = SLIDE_LAYOUTS[layoutId];
    if (!layout) return;
    set((state) => ({
      presentation: {
        ...state.presentation,
        slides: state.presentation.slides.map((s) =>
          s.id === slideId
            ? {
                ...s,
                layout: layoutId,
                elements: layout.elements(theme).map((el, i) => ({
                  ...el,
                  id: uuid(),
                  zIndex: i,
                })),
              }
            : s
        ),
        updatedAt: new Date().toISOString(),
      },
      selectedElementIds: [],
    }));
  },

  addSlide: (layoutId = 'blank', afterIndex) => {
    get().recordHistory();
    const theme = get().getTheme();
    const layout = SLIDE_LAYOUTS[layoutId] || SLIDE_LAYOUTS.blank;
    const { presentation, activeSlideIndex } = get();
    const insertAt = afterIndex ?? activeSlideIndex + 1;
    const newSlide = {
      id: uuid(),
      title: `Slide ${presentation.slides.length + 1}`,
      layout: layoutId,
      background: { type: 'solid', color: theme.background },
      notes: '',
      elements: layout.elements(theme).map((el, i) => ({ ...el, id: uuid(), zIndex: i })),
    };
    const slides = [...presentation.slides];
    slides.splice(insertAt, 0, newSlide);
    set({
      presentation: {
        ...presentation,
        slides,
        updatedAt: new Date().toISOString(),
      },
      activeSlideIndex: insertAt,
      selectedElementIds: [],
    });
  },

  duplicateSlide: (index) => {
    get().recordHistory();
    const { presentation } = get();
    const slide = presentation.slides[index];
    const copy = cloneState(slide);
    copy.id = uuid();
    copy.title = `${slide.title} (copy)`;
    copy.elements = copy.elements.map((el) => ({ ...el, id: uuid() }));
    const slides = [...presentation.slides];
    slides.splice(index + 1, 0, copy);
    set({
      presentation: {
        ...presentation,
        slides,
        updatedAt: new Date().toISOString(),
      },
      activeSlideIndex: index + 1,
      selectedElementIds: [],
    });
  },

  deleteSlide: (index) => {
    const { presentation } = get();
    if (presentation.slides.length <= 1) return;
    get().recordHistory();
    const slides = presentation.slides.filter((_, i) => i !== index);
    set({
      presentation: {
        ...presentation,
        slides,
        updatedAt: new Date().toISOString(),
      },
      activeSlideIndex: Math.min(index, slides.length - 1),
      selectedElementIds: [],
    });
  },

  reorderSlide: (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    get().recordHistory();
    const { presentation, activeSlideIndex } = get();
    const slides = [...presentation.slides];
    const [moved] = slides.splice(fromIndex, 1);
    slides.splice(toIndex, 0, moved);
    let newActive = activeSlideIndex;
    if (activeSlideIndex === fromIndex) newActive = toIndex;
    else if (fromIndex < activeSlideIndex && toIndex >= activeSlideIndex)
      newActive = activeSlideIndex - 1;
    else if (fromIndex > activeSlideIndex && toIndex <= activeSlideIndex)
      newActive = activeSlideIndex + 1;
    set({
      presentation: {
        ...presentation,
        slides,
        updatedAt: new Date().toISOString(),
      },
      activeSlideIndex: newActive,
    });
  },

  addElement: (element) => {
    get().recordHistory();
    const { presentation, activeSlideIndex } = get();
    const slide = presentation.slides[activeSlideIndex];
    const maxZ = slide.elements.reduce((m, e) => Math.max(m, e.zIndex), -1);
    const newElement = { ...element, id: uuid(), zIndex: maxZ + 1 };
    const slides = presentation.slides.map((s, i) =>
      i === activeSlideIndex
        ? { ...s, elements: [...s.elements, newElement] }
        : s
    );
    set({
      presentation: { ...presentation, slides, updatedAt: new Date().toISOString() },
      selectedElementIds: [newElement.id],
    });
    return newElement.id;
  },

  updateElement: (elementId, updates, recordHistory = false) => {
    if (recordHistory) get().recordHistory();
    const { presentation, activeSlideIndex } = get();
    const slides = presentation.slides.map((s, i) =>
      i === activeSlideIndex
        ? {
            ...s,
            elements: s.elements.map((el) =>
              el.id === elementId ? { ...el, ...updates } : el
            ),
          }
        : s
    );
    set({
      presentation: { ...presentation, slides, updatedAt: new Date().toISOString() },
    });
  },

  updateElements: (updates, recordHistory = true) => {
    if (recordHistory) get().recordHistory();
    const { presentation, activeSlideIndex } = get();
    const updateMap = Object.fromEntries(updates.map((u) => [u.id, u]));
    const slides = presentation.slides.map((s, i) =>
      i === activeSlideIndex
        ? {
            ...s,
            elements: s.elements.map((el) =>
              updateMap[el.id] ? { ...el, ...updateMap[el.id] } : el
            ),
          }
        : s
    );
    set({
      presentation: { ...presentation, slides, updatedAt: new Date().toISOString() },
    });
  },

  deleteElements: (elementIds) => {
    if (!elementIds.length) return;
    get().recordHistory();
    const { presentation, activeSlideIndex } = get();
    const idSet = new Set(elementIds);
    const slides = presentation.slides.map((s, i) =>
      i === activeSlideIndex
        ? { ...s, elements: s.elements.filter((el) => !idSet.has(el.id)) }
        : s
    );
    set({
      presentation: { ...presentation, slides, updatedAt: new Date().toISOString() },
      selectedElementIds: [],
    });
  },

  bringToFront: (elementId) => {
    get().recordHistory();
    const { presentation, activeSlideIndex } = get();
    const slide = presentation.slides[activeSlideIndex];
    const maxZ = Math.max(...slide.elements.map((e) => e.zIndex));
    get().updateElement(elementId, { zIndex: maxZ + 1 });
  },

  sendToBack: (elementId) => {
    get().recordHistory();
    const slide = get().getActiveSlide();
    const minZ = Math.min(...slide.elements.map((e) => e.zIndex));
    get().updateElement(elementId, { zIndex: minZ - 1 });
  },

  moveLayer: (elementId, direction) => {
    get().recordHistory();
    const slide = get().getActiveSlide();
    const sorted = [...slide.elements].sort((a, b) => a.zIndex - b.zIndex);
    const idx = sorted.findIndex((e) => e.id === elementId);
    if (idx < 0) return;
    const swapIdx = direction === 'up' ? idx + 1 : idx - 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const updates = [
      { id: sorted[idx].id, zIndex: sorted[swapIdx].zIndex },
      { id: sorted[swapIdx].id, zIndex: sorted[idx].zIndex },
    ];
    get().updateElements(updates, false);
  },

  addComment: (slideId, text, x, y) => {
    const comment = {
      id: uuid(),
      slideId,
      text,
      x,
      y,
      author: 'You',
      createdAt: new Date().toISOString(),
      resolved: false,
    };
    set((state) => ({ comments: [...state.comments, comment] }));
  },

  newPresentation: (preset, themeId) => {
    set({
      presentation: createNewPresentation(preset, themeId),
      activeSlideIndex: 0,
      selectedElementIds: [],
      history: [],
      historyIndex: -1,
      future: [],
      mode: 'edit',
      comments: [],
    });
  },
}));

export default usePresentationStore;
