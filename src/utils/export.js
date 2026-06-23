export async function exportSlideAsPng(stageRef, filename = 'slide.png') {
  if (!stageRef?.current) return;
  const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
  downloadDataUri(uri, filename);
}

export function exportAllSlidesAsPng(renderSlide, slideCount, presentationName) {
  for (let i = 0; i < slideCount; i++) {
    renderSlide(i, () => {
      const canvas = document.querySelector('.slide-canvas-export');
      if (canvas) {
        const uri = canvas.toDataURL?.('image/png');
        if (uri) downloadDataUri(uri, `${presentationName}-slide-${i + 1}.png`);
      }
    });
  }
}

export function exportPresentationJson(presentation) {
  const json = JSON.stringify(presentation, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  downloadBlob(blob, `${presentation.name || 'presentation'}.json`);
}

function downloadDataUri(uri, filename) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = uri;
  link.click();
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportToPdfPlaceholder() {
  window.print();
}
