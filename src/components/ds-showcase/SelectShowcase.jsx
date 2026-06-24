import { useState } from 'react';
import DsShowcase from './DsShowcase';
import Select from '../ui/Select';

export const showcaseMeta = { id: 'select', label: 'Select' };

export default function SelectShowcase() {
  const [value, setValue] = useState('option-a');

  return (
    <DsShowcase id={showcaseMeta.id}>
      <DsShowcase.Header>
        <DsShowcase.Title>Select</DsShowcase.Title>
        <DsShowcase.Description>
          Labeled dropdown for choosing from a list of options.
        </DsShowcase.Description>
      </DsShowcase.Header>
      <DsShowcase.Preview>
        <Select
          label="Example select"
          value={value}
          onChange={setValue}
          options={[
            { value: 'option-a', label: 'Option A' },
            { value: 'option-b', label: 'Option B' },
            { value: 'option-c', label: 'Option C' },
          ]}
        />
      </DsShowcase.Preview>
    </DsShowcase>
  );
}
