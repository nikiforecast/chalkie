import { useState } from 'react';
import DsShowcase from './DsShowcase';
import ColorPicker from '../ui/ColorPicker';

export const showcaseMeta = { id: 'color-picker', label: 'Color picker' };

export default function ColorPickerShowcase() {
  const [value, setValue] = useState('#2563eb');

  return (
    <DsShowcase id={showcaseMeta.id}>
      <DsShowcase.Header>
        <DsShowcase.Title>Color picker</DsShowcase.Title>
        <DsShowcase.Description>
          Native color input with hex value display.
        </DsShowcase.Description>
      </DsShowcase.Header>
      <DsShowcase.Preview>
        <ColorPicker label="Fill color" value={value} onChange={setValue} />
      </DsShowcase.Preview>
    </DsShowcase>
  );
}
