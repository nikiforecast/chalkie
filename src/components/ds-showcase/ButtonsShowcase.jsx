import { Plus } from 'lucide-react';
import DsShowcase from './DsShowcase';
import Button from '../ui/Button';

export const showcaseMeta = { id: 'buttons', label: 'Buttons' };

export default function ButtonsShowcase() {
  return (
    <DsShowcase id={showcaseMeta.id}>
      <DsShowcase.Header>
        <DsShowcase.Title>Buttons</DsShowcase.Title>
        <DsShowcase.Description>
          Primary actions, secondary controls, and destructive actions. Available in small and
          medium sizes.
        </DsShowcase.Description>
      </DsShowcase.Header>
      <DsShowcase.Preview>
        <div className="ds-showcase__row">
          <span className="ds-showcase__label">Variants</span>
          <Button variant="default">Default</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
        <div className="ds-showcase__row">
          <span className="ds-showcase__label">Sizes</span>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="sm" variant="primary">
            <Plus size={14} /> With icon
          </Button>
        </div>
        <div className="ds-showcase__row">
          <span className="ds-showcase__label">States</span>
          <Button active>Active</Button>
          <Button disabled>Disabled</Button>
          <Button variant="primary" disabled>
            Disabled primary
          </Button>
        </div>
      </DsShowcase.Preview>
    </DsShowcase>
  );
}
