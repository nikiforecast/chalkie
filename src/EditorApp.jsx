import AppShell from './components/layout/AppShell';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';

export default function EditorApp() {
  useKeyboardShortcuts();
  return <AppShell />;
}
