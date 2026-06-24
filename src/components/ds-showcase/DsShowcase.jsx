import './DsShowcase.css';

function DsShowcase({ id, children }) {
  return (
    <section id={id} className="ds-showcase">
      {children}
    </section>
  );
}

function DsShowcaseHeader({ children }) {
  return <header className="ds-showcase__header">{children}</header>;
}

function DsShowcaseTitle({ children }) {
  return <h2 className="ds-showcase__title">{children}</h2>;
}

function DsShowcaseDescription({ children }) {
  return <p className="ds-showcase__description">{children}</p>;
}

function DsShowcasePreview({ children }) {
  return <div className="ds-showcase__preview">{children}</div>;
}

DsShowcase.Header = DsShowcaseHeader;
DsShowcase.Title = DsShowcaseTitle;
DsShowcase.Description = DsShowcaseDescription;
DsShowcase.Preview = DsShowcasePreview;

export default DsShowcase;
