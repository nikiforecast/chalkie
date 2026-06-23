import { v4 as uuid } from 'uuid';
import { THEMES } from '../constants/themes';
import { SLIDE_PRESETS } from '../constants/dimensions';
import { SLIDE_LAYOUTS } from '../constants/layouts';

function createSlide(layoutId = 'title-content', theme = THEMES.default, index = 0) {
  const layout = SLIDE_LAYOUTS[layoutId] || SLIDE_LAYOUTS.blank;
  return {
    id: uuid(),
    title: `Slide ${index + 1}`,
    layout: layoutId,
    background: { type: 'solid', color: theme.background },
    notes: '',
    elements: layout.elements(theme).map((el, i) => ({ ...el, zIndex: i })),
  };
}

export function createSamplePresentation() {
  const theme = THEMES.default;
  const slides = [
    createSlide('title', theme, 0),
    createSlide('title-content', theme, 1),
    createSlide('comparison', theme, 2),
    createSlide('two-column', theme, 3),
    createSlide('blank', theme, 4),
  ];

  slides[0].title = 'Welcome';
  slides[0].elements[0].text = 'Chalkie';
  slides[0].elements[1].text = 'Slide Creation Prototype';
  slides[0].notes = 'Introduce the presentation and welcome the audience.';

  slides[1].title = 'Overview';
  slides[1].elements[1].text =
    '• Create and edit slide presentations\n• Add text, shapes, images, and more\n• Apply themes and layouts\n• Present with speaker notes';

  return {
    id: uuid(),
    name: 'Untitled Presentation',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dimensions: { ...SLIDE_PRESETS['16:9'], preset: '16:9' },
    themeId: 'default',
    slides,
  };
}

export function createNewPresentation(preset = '16:9', themeId = 'default') {
  const theme = THEMES[themeId] || THEMES.default;
  const dims = SLIDE_PRESETS[preset] || SLIDE_PRESETS['16:9'];
  return {
    id: uuid(),
    name: 'Untitled Presentation',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dimensions: { ...dims, preset },
    themeId,
    slides: [createSlide('title', theme, 0)],
  };
}
