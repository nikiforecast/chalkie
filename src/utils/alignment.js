export function getSnapGuides(elements, movingId, x, y, width, height, threshold = 8) {
  const guides = { vertical: [], horizontal: [] };
  const movingCenterX = x + width / 2;
  const movingCenterY = y + height / 2;
  const movingRight = x + width;
  const movingBottom = y + height;

  for (const el of elements) {
    if (el.id === movingId) continue;
    const elRight = el.x + el.width;
    const elBottom = el.y + el.height;
    const elCenterX = el.x + el.width / 2;
    const elCenterY = el.y + el.height / 2;

    const checks = [
      { axis: 'vertical', val: el.x, snap: el.x },
      { axis: 'vertical', val: elCenterX, snap: elCenterX - width / 2 },
      { axis: 'vertical', val: elRight, snap: elRight - width },
      { axis: 'horizontal', val: el.y, snap: el.y },
      { axis: 'horizontal', val: elCenterY, snap: elCenterY - height / 2 },
      { axis: 'horizontal', val: elBottom, snap: elBottom - height },
    ];

    for (const check of checks) {
      const compare =
        check.axis === 'vertical'
          ? [x, movingCenterX, movingRight]
          : [y, movingCenterY, movingBottom];
      for (const c of compare) {
        if (Math.abs(c - check.val) < threshold) {
          guides[check.axis].push({ position: check.val, snap: check.snap });
        }
      }
    }
  }

  return guides;
}

export function alignElements(elements, selectedIds, alignment) {
  const selected = elements.filter((e) => selectedIds.includes(e.id));
  if (selected.length < 2) return [];

  const minX = Math.min(...selected.map((e) => e.x));
  const maxX = Math.max(...selected.map((e) => e.x + e.width));
  const minY = Math.min(...selected.map((e) => e.y));
  const maxY = Math.max(...selected.map((e) => e.y + e.height));
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  return selected.map((el) => {
    let x = el.x;
    let y = el.y;
    switch (alignment) {
      case 'left':
        x = minX;
        break;
      case 'center-h':
        x = centerX - el.width / 2;
        break;
      case 'right':
        x = maxX - el.width;
        break;
      case 'top':
        y = minY;
        break;
      case 'center-v':
        y = centerY - el.height / 2;
        break;
      case 'bottom':
        y = maxY - el.height;
        break;
      default:
        break;
    }
    return { id: el.id, x, y };
  });
}

export function distributeElements(elements, selectedIds, axis) {
  const selected = [...elements.filter((e) => selectedIds.includes(e.id))].sort(
    (a, b) => (axis === 'horizontal' ? a.x - b.x : a.y - b.y)
  );
  if (selected.length < 3) return [];

  if (axis === 'horizontal') {
    const totalWidth = selected.reduce((s, e) => s + e.width, 0);
    const minX = selected[0].x;
    const maxX = selected[selected.length - 1].x + selected[selected.length - 1].width;
    const gap = (maxX - minX - totalWidth) / (selected.length - 1);
    let cursor = minX;
    return selected.map((el) => {
      const update = { id: el.id, x: cursor };
      cursor += el.width + gap;
      return update;
    });
  }

  const totalHeight = selected.reduce((s, e) => s + e.height, 0);
  const minY = selected[0].y;
  const maxY = selected[selected.length - 1].y + selected[selected.length - 1].height;
  const gap = (maxY - minY - totalHeight) / (selected.length - 1);
  let cursor = minY;
  return selected.map((el) => {
    const update = { id: el.id, y: cursor };
    cursor += el.height + gap;
    return update;
  });
}
