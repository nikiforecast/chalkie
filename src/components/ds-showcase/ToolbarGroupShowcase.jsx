import { Bold, Italic, Underline, Plus } from 'lucide-react';
import DsShowcase from './DsShowcase';
import Button from '../ui/Button';
import IconButton from '../ui/IconButton';
import ToolbarGroup, { ToolbarDivider } from '../ui/ToolbarGroup';

export const showcaseMeta = { id: 'toolbar-group', label: 'Toolbar group' };

export default function ToolbarGroupShowcase() {
  return (
    <DsShowcase id={showcaseMeta.id}>
      <DsShowcase.Header>
        <DsShowcase.Title>Toolbar group</DsShowcase.Title>
        <DsShowcase.Description>
          Groups related toolbar controls with optional dividers between sections.
        </DsShowcase.Description>
      </DsShowcase.Header>
      <DsShowcase.Preview>
        <div className="ds-showcase__toolbar-demo">
          <ToolbarGroup label="Formatting">
            <IconButton icon={Bold} label="Bold" />
            <IconButton icon={Italic} label="Italic" />
            <IconButton icon={Underline} label="Underline" />
          </ToolbarGroup>
          <ToolbarDivider />
          <ToolbarGroup label="Insert">
            <Button size="sm">
              <Plus size={14} /> Add
            </Button>
          </ToolbarGroup>
        </div>
      </DsShowcase.Preview>
    </DsShowcase>
  );
}
