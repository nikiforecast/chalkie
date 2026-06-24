import { Bold, Italic, Underline } from 'lucide-react';
import DsShowcase from './DsShowcase';
import IconButton from '../ui/IconButton';

export const showcaseMeta = { id: 'icon-buttons', label: 'Icon buttons' };

export default function IconButtonsShowcase() {
  return (
    <DsShowcase id={showcaseMeta.id}>
      <DsShowcase.Header>
        <DsShowcase.Title>Icon buttons</DsShowcase.Title>
        <DsShowcase.Description>
          Compact icon-only controls for toolbars and dense UI.
        </DsShowcase.Description>
      </DsShowcase.Header>
      <DsShowcase.Preview>
        <div className="ds-showcase__row">
          <span className="ds-showcase__label">Default</span>
          <IconButton icon={Bold} label="Bold" />
          <IconButton icon={Italic} label="Italic" />
          <IconButton icon={Underline} label="Underline" />
        </div>
        <div className="ds-showcase__row">
          <span className="ds-showcase__label">Active & sizes</span>
          <IconButton icon={Bold} label="Bold" active />
          <IconButton icon={Italic} label="Italic" size={28} />
          <IconButton icon={Underline} label="Underline" size={28} active />
        </div>
        <div className="ds-showcase__row">
          <span className="ds-showcase__label">Disabled</span>
          <IconButton icon={Bold} label="Bold" disabled />
        </div>
      </DsShowcase.Preview>
    </DsShowcase>
  );
}
