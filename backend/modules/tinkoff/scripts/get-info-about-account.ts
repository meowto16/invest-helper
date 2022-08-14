import 'dotenv/config'

import { OperatorService } from '../services/Operator'
import { Shared } from '../services/TinkoffAPI/types'

!(async function main() {
  const { positions } = await OperatorService.getPortfolioExtended()

  console.log(`Текущее состояние портфеля:`)
  positions.forEach((row: any) => {
    const typeMap: Record<Shared.InstrumentType, string> = {
      share: 'Акция ',
      bond: 'Облигация ',
      etf: 'Фонд ',
      currency: 'Валюта '
    };
    const type = typeMap[row.instrument_type as Shared.InstrumentType]

    console.log(`-- ${type}"${row.name}" (${row.sum}₽ / ${row.diffSign}${row.income}₽ (${row.diffSign}${row.diffPercent}) / ${row.quantity} шт.) \n` +
      `---- Потрачено: ${row.average * row.quantity}₽\n` +
      `---- Средняя: ${row.average}₽\n` +
      `---- Текущая цена: ${row.currentPrice}₽"\n`)
  })
})();
