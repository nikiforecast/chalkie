import { Link } from 'react-router-dom';
import { SHOWCASES, SHOWCASE_SECTIONS } from '../components/ds-showcase';
import './DesignSystemPage.css';

export default function DesignSystemPage() {
  return (
    <div className="design-system">
      <aside className="design-system__nav">
        <div className="design-system__nav-inner">
          <Link to="/" className="design-system__back">
            ← Back to app
          </Link>
          <h1 className="design-system__heading">Design System</h1>
          <p className="design-system__intro">
            UI components used across Chalkie.
          </p>
          <nav className="design-system__toc" aria-label="Component sections">
            <ul>
              {SHOWCASE_SECTIONS.map(({ id, label }) => (
                <li key={id}>
                  <a href={`#${id}`} className="design-system__toc-link">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      <main className="design-system__main">
        {SHOWCASES.map(({ meta, Component }) => (
          <Component key={meta.id} />
        ))}
      </main>
    </div>
  );
}
