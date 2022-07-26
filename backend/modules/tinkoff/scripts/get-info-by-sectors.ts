const chalk = require('chalk')

import { sectorToNameMap } from '../constants'
import { OperatorService } from '../services/Operator'
import { Shared } from '../services/TinkoffAPI/types'
import { currency, getMOEXLink, getSmartlabLink, groupBy, chalkIncome } from '../utils'

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

  const getPositionsDesc = (positions: any[], sectorPositionsSum: number, type: 'shares' | 'bonds'): string => {
    const totalSum: number = (() => {
      if (type === 'shares') return total.shares;
      if (type === 'bonds') return total.bonds;

      return 0;
    })();

    return positions
      .sort((a, b) => b.sum - a.sum)
      .map((position) => {
        const colorIncome = (str: string) => {
          return position.diffSign === '-'
            ? chalkIncome(-1, str)
            : chalkIncome(1, str)
        }

        const sum = currency.rub(position.sum);
        const income = `${position.diffSign}${currency.rub(Math.abs(position.income))}`
        const percent = `${position.diffSign}${Math.abs(position.diffPercent)}%`
        const from = currency.rub(position.average)
        const to = currency.rub(position.currentPrice)
        const percentInSector = +(position.sum / sectorPositionsSum * 100).toFixed(2) + '%'
        const percentInInstrumentType = +(position.sum / totalSum * 100).toFixed(2) + '%'

        return `---- ${chalk.bgGray(`${position.name} (${position.ticker})`)} \n`
             + `------ Доход: ${colorIncome(`${income}`)} / ${colorIncome(`${percent}`)}.\n`
             + `------ Цена: ${colorIncome(`${from} → ${to}`)}\n`
             + `------ Соотношение: ${percentInSector} от сектора / ${percentInInstrumentType} от инструмента.\n`
             + `------ Сумма: ${chalk.underline(sum)}.\n`
             + `------ SmartLab: ${getSmartlabLink(position.ticker, type)}\n`
             + `------ MOEX: ${getMOEXLink(position.ticker)}`
      })
      .join('\n')
  }

  const getInfo = (info: any, type: 'shares' | 'bonds') => {
    const name = info.name
    const percent = `${info.percent}%`
    const sum = currency.rub(info.sum)
    const amount = info.positions.length
    const income = currency.rub(info.income)
    const incomePercent = info.incomePercent + '%'

    const colorIncome = (str: string) => chalkIncome(info.income, str)

    const title = `-- ${chalk.bgCyanBright(name)} (${percent}): ${chalk.underline(sum)}. ${amount} эмит. Доходность: ${colorIncome(income)} / ${colorIncome(incomePercent)}\n`
    const desc = getPositionsDesc(info.positions, info.sum, type);

    return title + desc + '\n';
  }

  const colorTotalIncome = (str: string) => chalkIncome(expected_yield, str)
  const colored = {
    total: {
      amount: currency.rub(totalAmount),
      income: colorTotalIncome(`${sign}${currency.rub(totalIncome)}`),
      incomePercent: colorTotalIncome(`${sign}${Math.abs(+expected_yield.toFixed(2))}%`)
    }
  }

  console.log(
    `Текущее состояние портфеля: ${colored.total.amount} (${colored.total.income} / ${colored.total.incomePercent})\n`
    + `== Акции ${percentToTotal.shares}% (${currency.rub(total.shares)})\n`
    + `== Облигации ${percentToTotal.bonds}% (${currency.rub(total.bonds)})\n`
    + `== Валюта ${percentToTotal.currencies}% (${currency.rub(total.currencies)})\n`
    + `== Фонды ${percentToTotal.etf}% (${currency.rub(total.etf)})\n`
    + `== Фьючерсы ${percentToTotal.futures}% (${currency.rub(total.futures)})\n`
    + '\nСоотношение акций в портфеле по секторам: \n'
    + '==============================\n'
    + sharesInfoBySector.map((info) => getInfo(info, 'shares')).join('\n')
    + '\n' + chalk.underline(chalk.bold('Соотношение облигаций в портфеле по секторам')) + '\n'
    + bondsInfoBySector.map((info) => getInfo(info, 'bonds')).join('\n')
  )
})();
