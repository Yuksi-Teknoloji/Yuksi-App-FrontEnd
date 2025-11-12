import MotorcycleSvg from '@/assets/images/motorcycle.svg';
import MinivanSvg from '@/assets/images/minivan.svg';
import PanelvanSvg from '@/assets/images/panelvan.svg';
import PickupTruckSvg from '@/assets/images/pickup-truck.svg';
import TruckSvg from '@/assets/images/truck.svg';

export const vehicleItems = [
  {
    id: 1,
    name: 'Motorsiklet',
    description:
      '40–50 kg’a kadar. Küçük ve hızlı teslimatlar için idealdir.',
    IconComponent: MotorcycleSvg,
    accentColor: '#7FB3FF',
  },
  {
    id: 2,
    name: 'Minivan',
    description:
      '500–800 kg’a kadar. Ev eşyaları ve toplu alışveriş için.',
    IconComponent: MinivanSvg,
    accentColor: '#76A9FA',
  },
  {
    id: 3,
    name: 'Panelvan',
    description:
      '1.500 kg’a kadar. Orta ölçekli ticari taşımalar.',
    IconComponent: PanelvanSvg,
    accentColor: '#6690FF',
  },
  {
    id: 4,
    name: 'Kamyonet',
    description:
      '500 kg’a kadar. Şehir içi pratik nakliye.',
    IconComponent: PickupTruckSvg,
    accentColor: '#5E81F4',
  },
  {
    id: 5,
    name: 'Kamyon',
    description:
      '2.000 kg’a kadar. Büyük ve ağır yükler.',
    IconComponent: TruckSvg,
    accentColor: '#4C6FFF',
  },
];
