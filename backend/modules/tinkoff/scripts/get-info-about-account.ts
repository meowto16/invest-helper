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

    const name = `${type}"${row.name}"`
    const sum = `${row.sum}₽`
    const income = `${row.diffSign}${Math.abs(row.income)}₽`
    const incomePercent = `${row.diffSign}${Math.abs(row.diffPercent)}%`
    const quantity = `${row.quantity} шт.`
    const expenses = `${row.average * row.quantity}₽`
    const average = `${row.average}₽`
    const currentPrice = `${row.currentPrice}₽`


    console.log(`-- ${name} (${sum} / ${income} (${incomePercent}) / ${quantity}) \n` +
      `---- Потрачено: ${expenses} \n` +
      `---- Средняя: ${average} \n` +
      `---- Текущая цена: ${currentPrice}\n`)
  })
})();
