import {
  GiPaintedPottery,
  GiWool,
  GiDiamondRing,
  GiWoodBeam,
  GiSewingMachine,
  GiPaintBrush,
  GiAnvil,
  GiChisel,
} from 'react-icons/gi';

const ICON_MAP = {
  GiPaintedPottery,
  GiWool,
  GiDiamondRing,
  GiWoodBeam,
  GiSewingMachine,
  GiPaintBrush,
  GiAnvil,
  GiChisel,
};

/**
 * Renders a category icon by string name.
 * Usage: <CategoryIcon name="GiPotteryVase" size={24} />
 */
export default function CategoryIcon({ name, size = 20, className = '' }) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon size={size} className={className} />;
}
