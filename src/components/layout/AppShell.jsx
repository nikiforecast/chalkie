import usePresentationStore from '../../store/usePresentationStore';
import TopToolbar from './TopToolbar';
import SlideThumbnails from './SlideThumbnails';
import PropertiesPanel from './PropertiesPanel';
import StatusBar from './StatusBar';
import SlideCanvas from '../editor/SlideCanvas';
import PresenterView from '../presenter/PresenterView';
import './AppShell.css';

export default function AppShell() {
  const mode = usePresentationStore((s) => s.mode);

  if (mode === 'present') {
    return <PresenterView />;
  }

  return (
    <div className="app-shell">
      <TopToolbar />
      <div className="app-shell__body">
        <SlideThumbnails />
        <main className="app-shell__canvas" aria-label="Slide editor">
          <SlideCanvas />
        </main>
        <PropertiesPanel />
      </div>
      <StatusBar />
    </div>
  );
}
