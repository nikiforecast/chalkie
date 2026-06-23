import { Group, Rect, Ellipse, Line, Text, Image as KonvaImage } from 'react-konva';
import useImage from './useImage';

function TableElement({ element }) {
  const { x, y, width, height, rows = 3, cols = 3, fill = '#ffffff', stroke = '#cbd5e1' } = element;
  const cellW = width / cols;
  const cellH = height / rows;

  return (
    <Group x={x} y={y}>
      <Rect width={width} height={height} fill={fill} stroke={stroke} strokeWidth={1} />
      {Array.from({ length: rows - 1 }).map((_, i) => (
        <Line
          key={`h-${i}`}
          points={[0, (i + 1) * cellH, width, (i + 1) * cellH]}
          stroke={stroke}
          strokeWidth={1}
        />
      ))}
      {Array.from({ length: cols - 1 }).map((_, i) => (
        <Line
          key={`v-${i}`}
          points={[(i + 1) * cellW, 0, (i + 1) * cellW, height]}
          stroke={stroke}
          strokeWidth={1}
        />
      ))}
    </Group>
  );
}

function ChartElement({ element }) {
  const { x, y, width, height, chartType = 'bar', fill = '#2563eb' } = element;
  const data = element.data || [40, 70, 55, 90, 60];
  const max = Math.max(...data);
  const barW = width / data.length - 8;

  return (
    <Group x={x} y={y}>
      <Rect width={width} height={height} fill="#f8fafc" stroke="#e2e8f0" strokeWidth={1} cornerRadius={4} />
      {chartType === 'bar' &&
        data.map((val, i) => {
          const barH = (val / max) * (height - 40);
          return (
            <Rect
              key={i}
              x={i * (barW + 8) + 8}
              y={height - barH - 16}
              width={barW}
              height={barH}
              fill={fill}
              cornerRadius={[4, 4, 0, 0]}
            />
          );
        })}
    </Group>
  );
}

function ImageElement({ element }) {
  const [image] = useImage(element.src);
  if (!image) {
    return (
      <Rect
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        fill="#f1f5f9"
        stroke="#cbd5e1"
        strokeWidth={1}
        dash={[6, 4]}
      />
    );
  }
  return (
    <KonvaImage
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      image={image}
    />
  );
}

export default function SlideElement({
  element,
  onSelect,
  onChange,
  draggable,
  onDragMove,
  onDragEnd: onDragEndProp,
}) {
  const commonProps = {
    id: element.id,
    draggable,
    onClick: (e) => {
      e.cancelBubble = true;
      onSelect(element.id, e.evt.shiftKey);
    },
    onTap: (e) => {
      e.cancelBubble = true;
      onSelect(element.id, false);
    },
    onDragMove: (e) => onDragMove?.(e),
    onDragEnd: (e) => {
      onChange(element.id, { x: e.target.x(), y: e.target.y() }, true);
      onDragEndProp?.(e);
    },
    onTransformEnd: (e) => {
      const node = e.target;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      node.scaleX(1);
      node.scaleY(1);
      onChange(
        element.id,
        {
          x: node.x(),
          y: node.y(),
          width: Math.max(20, node.width() * scaleX),
          height: Math.max(20, node.height() * scaleY),
          rotation: node.rotation(),
        },
        true
      );
    },
  };

  switch (element.type) {
    case 'text':
      return (
        <Text
          {...commonProps}
          x={element.x}
          y={element.y}
          width={element.width}
          height={element.height}
          text={element.text}
          fontSize={element.fontSize}
          fontFamily={element.fontFamily}
          fontStyle={`${element.fontStyle || ''} ${element.fontWeight === 'bold' ? 'bold' : ''}`.trim()}
          textDecoration={element.textDecoration}
          fill={element.fill}
          align={element.align}
          verticalAlign={element.verticalAlign}
          rotation={element.rotation}
          wrap="word"
          onDblClick={() => onSelect(element.id, false, true)}
        />
      );

    case 'rect':
      return (
        <Rect
          {...commonProps}
          x={element.x}
          y={element.y}
          width={element.width}
          height={element.height}
          fill={element.fill}
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          cornerRadius={element.cornerRadius || 0}
          rotation={element.rotation}
        />
      );

    case 'ellipse':
      return (
        <Ellipse
          {...commonProps}
          x={element.x + element.width / 2}
          y={element.y + element.height / 2}
          radiusX={element.width / 2}
          radiusY={element.height / 2}
          fill={element.fill}
          stroke={element.stroke}
          strokeWidth={element.strokeWidth}
          rotation={element.rotation}
        />
      );

    case 'line':
      return (
        <Line
          {...commonProps}
          x={element.x}
          y={element.y}
          points={element.points || [0, 0, element.width, element.height]}
          stroke={element.stroke || '#0f172a'}
          strokeWidth={element.strokeWidth || 3}
          lineCap="round"
          rotation={element.rotation}
        />
      );

    case 'image':
      return (
        <Group {...commonProps} x={element.x} y={element.y}>
          <ImageElement element={{ ...element, x: 0, y: 0 }} />
        </Group>
      );

    case 'table':
      return (
        <Group {...commonProps}>
          <TableElement element={{ ...element, x: 0, y: 0 }} />
        </Group>
      );

    case 'chart':
      return (
        <Group {...commonProps}>
          <ChartElement element={{ ...element, x: 0, y: 0 }} />
        </Group>
      );

    default:
      return null;
  }
}
