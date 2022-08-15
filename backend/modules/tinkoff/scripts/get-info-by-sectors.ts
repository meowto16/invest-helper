import { sectorToNameMap } from '../constants'
import { OperatorService } from '../services/Operator'
import { Shared } from '../services/TinkoffAPI/types'
import { currency, groupBy } from '../utils'

!(async function main() {
  const { positions, total_amount_shares, total_amount_etf, total_amount_bonds, expected_yield, total_amount_currencies, total_amount_futures } = await OperatorService.getPortfolioExtended()

  const total = {
    shares: parseFloat(total_amount_shares),
    etf: parseFloat(total_amount_etf),
    currencies: parseFloat(total_amount_currencies),
    bonds: parseFloat(total_amount_bonds),
    futures: parseFloat(total_amount_futures),
  }

  const totalAmount = +(total.shares + total.etf + total.currencies + total.bonds + total.futures).toFixed(2)
  const totalIncome = +positions.reduce((acc, position) => acc + position.income, 0).toFixed(2)
  const sign = expected_yield >= 0 ? '+' : '-'

  const percentToTotal = {
    shares: +(total.shares / totalAmount * 100).toFixed(2),
    etf: +(total.etf / totalAmount * 100).toFixed(2),
    bonds: +(total.bonds / totalAmount * 100).toFixed(2),
    futures: +(total.futures / totalAmount * 100).toFixed(2),
    currencies: +(total.currencies / totalAmount * 100).toFixed(2),
  }

  const { share: shares, bond: bonds } = groupBy(positions, 'instrument_type')
  const sharesSectors = groupBy(shares, 'sector')
  const bondsSectors = groupBy(bonds, 'sector')

  type SectorInfo = {
    name: string;
    sector: Shared.Sector;
    sum: number;
    positions: unknown[]
    percent: number;
    income: number;
    incomePercent: number;
  }

  const sharesInfoBySector = Object.entries(sharesSectors)
    .reduce((acc, [sector, positions]) => {
      const sum = positions.reduce((acc, position) => acc + position.sum, 0)
      const income = positions.reduce((acc, position) => acc + position.income, 0)

      acc.push({
        sector,
        name: sectorToNameMap[sector],
        percent: +(sum / total.shares * 100).toFixed(2),
        sum: +sum.toFixed(2),
        income: +income.toFixed(2),
        incomePercent: +(income / totalIncome).toFixed(2),
        positions,
      })

      return acc
    }, [] as SectorInfo[])
    .sort((a, b) => b.sum - a.sum)

  const bondsInfoBySector = Object.entries(bondsSectors)
    .reduce((acc, [sector, positions]) => {
      const sum = positions.reduce((acc, position) => acc + position.sum, 0)
      const income = positions.reduce((acc, position) => acc + position.income, 0)

      acc.push({
        sector,
        name: sectorToNameMap[sector],
        percent: +(sum / total.bonds * 100).toFixed(2),
        sum: +sum.toFixed(2),
        income: +income.toFixed(2),
        incomePercent: +(income / totalIncome).toFixed(2),
        positions,
      })

      return acc
    }, [] as SectorInfo[])
    .sort((a, b) => b.sum - a.sum)

  console.log(
    `Текущее состояние портфеля: ${currency.rub(totalAmount)} (${sign}${currency.rub(totalIncome)} / ${sign}${Math.abs(expected_yield)}%)\n`
    + `Акции ${percentToTotal.shares}% / Облигации ${percentToTotal.bonds}% / Валюта ${percentToTotal.currencies}% / Фонды ${percentToTotal.etf}% / Фьючерсы ${percentToTotal.futures}%\n`
    + '======\n'
    + `Соотношение акций в портфеле по секторам: \n`
    + sharesInfoBySector.map((info) => `-- ${info.name} (${info.percent}% от портфеля). В сумме: ${currency.rub(info.sum)}. ${info.positions.length} эмит. Доходность: ${currency.rub(info.income)} / ${info.incomePercent}%\n`).join('')
    + '======\n'
    + 'Соотношение облигаций в портфеле по секторам \n'
    + bondsInfoBySector.map((info) => `-- ${info.name} (${info.percent}%): ${currency.rub(info.sum)}. ${info.positions.length} эмит. Доходность: ${currency.rub(info.income)} / ${info.incomePercent}%\n`).join('')
  )
})();