import 'dotenv/config'
import * as process from 'process'
import { BondsRepository, CurrenciesRepository, EtfsRepository, SharesRepository } from '../services/CacheData'

import TinkoffApi from '../services/TinkoffAPI'

!(async function main() {
  const portfolioId = process.env.TINKOFF_PORTFOLIO_ID

  if (!portfolioId) {
    throw new Error('You should defined "TINKOFF_PORTFOLIO_ID" in .env.')
  }

  const api = TinkoffApi

  const portfolio = await api.operations.GetPortfolio({
    account_id: portfolioId
  });

  const { positions } = portfolio

  const sharesFigi = positions
    .filter((position) => position.instrument_type === 'share')
    .map((position) => position.figi)
  const bondsFigi = positions
    .filter((position) => position.instrument_type === 'bond')
    .map((position) => position.figi)
  const etfFigi = positions
    .filter((position) => position.instrument_type === 'etf')
    .map((position) => position.figi)
  const currenciesFigi = positions
    .filter((position) => position.instrument_type === 'currency')
    .map((position) => position.figi)

  const SharesCache = new SharesRepository()
  const EtfsCache = new EtfsRepository()
  const CurrenciesCache = new CurrenciesRepository()
  const BondsCache = new BondsRepository()

  const [sharesInfo, bondsInfo, etfInfo, currenciesInfo] = await Promise.all([
    SharesCache.getAllByFigi(sharesFigi),
    BondsCache.getAllByFigi(bondsFigi),
    EtfsCache.getAllByFigi(etfFigi),
    CurrenciesCache.getAllByFigi(currenciesFigi)
  ])

  const groupByFigi = (arr: any) => arr.reduce((acc: any, cur: any) => {
    acc[cur.figi] = cur

    return acc
  }, {})

  const sharesInfoByFigi = groupByFigi(sharesInfo)
  const bondsInfoByFigi = groupByFigi(bondsInfo)
  const etfInfoByFigi = groupByFigi(etfInfo)
  const currenciesInfoByFigi = groupByFigi(currenciesInfo)

  const infoMap = {
    share: sharesInfoByFigi,
    bond: bondsInfoByFigi,
    etf: etfInfoByFigi,
    currency: currenciesInfoByFigi,
  };

  const result = positions.map((position: any) => {
    return {
      ...position,
      // @ts-ignore
      ...(infoMap?.[position.instrument_type]?.[position.figi])
    }
  });

  console.log(`Текущее состояние портфеля:`)
  result.forEach((row: any) => {
    const type =
        row.instrument_type === 'share' ? 'Акция '
        : row.instrument_type === 'bond' ? 'Облигация '
        : row.instrument_type === 'etf' ? 'Фонд '
        : row.instrument_type === 'currency' ? 'Валюта ' : '';

    const currentPrice = parseInt(row.current_price, 10);
    const sum = row.quantity * currentPrice
    const average = parseInt(row.average_position_price, 10);

    console.log(`${type}"${row.name}". На сумму: ${sum} руб. Средняя: ${average} руб. Текущая цена: ${currentPrice} руб."`)
  })
})();
