import ButtonsShowcase, { showcaseMeta as buttonsMeta } from './ButtonsShowcase';
import IconButtonsShowcase, { showcaseMeta as iconButtonsMeta } from './IconButtonsShowcase';
import SelectShowcase, { showcaseMeta as selectMeta } from './SelectShowcase';
import ColorPickerShowcase, { showcaseMeta as colorPickerMeta } from './ColorPickerShowcase';
import ToolbarGroupShowcase, { showcaseMeta as toolbarGroupMeta } from './ToolbarGroupShowcase';

export { default as DsShowcase } from './DsShowcase';
export { default as ButtonsShowcase } from './ButtonsShowcase';
export { default as IconButtonsShowcase } from './IconButtonsShowcase';
export { default as SelectShowcase } from './SelectShowcase';
export { default as ColorPickerShowcase } from './ColorPickerShowcase';
export { default as ToolbarGroupShowcase } from './ToolbarGroupShowcase';

export const SHOWCASES = [
  { meta: buttonsMeta, Component: ButtonsShowcase },
  { meta: iconButtonsMeta, Component: IconButtonsShowcase },
  { meta: selectMeta, Component: SelectShowcase },
  { meta: colorPickerMeta, Component: ColorPickerShowcase },
  { meta: toolbarGroupMeta, Component: ToolbarGroupShowcase },
];

export const SHOWCASE_SECTIONS = SHOWCASES.map(({ meta }) => meta);
