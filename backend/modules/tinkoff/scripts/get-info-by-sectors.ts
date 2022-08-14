import { OperatorService } from '../services/Operator'

!(async function main() {
  const { positions, total_amount_shares, total_amount_etf, total_amount_bonds, total_amount_currencies, total_amount_futures } = await OperatorService.getPortfolioExtended()

  const total = {
    shares: parseInt(total_amount_shares, 10),
    etf: parseInt(total_amount_etf, 10),
    currencies: parseInt(total_amount_currencies, 10),
    bonds: parseInt(total_amount_bonds, 10),
    futures: parseInt(total_amount_futures, 10),
  }

  const totalAmount = total.shares + total.etf + total.currencies + total.bonds + total.futures

  const percentToTotal = {
    shares: +(total.shares / totalAmount * 100).toFixed(2),
    etf: +(total.etf / totalAmount * 100).toFixed(2),
    bonds: +(total.bonds / totalAmount * 100).toFixed(2),
    futures: +(total.futures / totalAmount * 100).toFixed(2),
    currencies: +(total.currencies / totalAmount * 100).toFixed(2),
  }

  console.log(
    `Текущее состояние портфеля: ${totalAmount}₽\n`
    + `Акции ${percentToTotal.shares}% / Облигации ${percentToTotal.bonds}% / Валюта ${percentToTotal.currencies}% / Фонды ${percentToTotal.etf}% / Фьючерсы ${percentToTotal.futures}%`
  )
})();