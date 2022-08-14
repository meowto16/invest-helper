import { Shared } from './services/TinkoffAPI/types'

export const sectorToNameMap: Record<Shared.SharesSector | Shared.EtfsSector | Shared.BondsSector | Shared.Sector, string> = {
  it: 'Информационные технологии (IT)',
  health_care: 'Здравоохранение',
  financial: 'Финансы',
  consumer: 'Потребительский',
  other: 'Другое',
  industrials: 'Промышленность',
  real_estate: 'Недвижимость',
  energy: 'Энергетика',
  materials: 'Добыча полезных ископаемых',
  ecomaterials: 'Эко-материалы',
  green_buildings: 'Эко-технологии',
  green_energy: 'Эко-энергия',
  electrocars: 'Электроавтомобили',
  government: 'Государство',
  municipal: 'Муниципалитет',
  utilities: 'Коммунальные услуги',
  telecom: 'Телекоммуникации',
  '': 'Неизвестно',
}