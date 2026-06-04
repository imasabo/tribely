import { Path } from 'react-native-svg';

interface TabIconPathProps {
  d: string;
  color: string;
  active: boolean;
  fillRule?: 'evenodd' | 'nonzero';
  /** Stroke width in the path’s coordinate space (use when parent applies a scale transform). */
  inactiveStrokeWidth?: number;
}

export function TabIconPath({
  d,
  color,
  active,
  fillRule,
  inactiveStrokeWidth = 1.75,
}: TabIconPathProps) {
  const strokeWidth = inactiveStrokeWidth;

  return (
    <Path
      d={d}
      fill={active ? color : 'none'}
      stroke={active ? 'none' : color}
      strokeWidth={active ? 0 : strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
      fillRule={fillRule}
      clipRule={fillRule}
    />
  );
}
