import 'dotenv/config'
import * as process from 'process'
import { BondsRepository, CurrenciesRepository, EtfsRepository, SharesRepository } from '../services/CacheData'

import TinkoffApi from '../services/TinkoffAPI'
import { Operations, Shared } from '../services/TinkoffAPI/types'

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

  const instrumentsMap: Record<Shared.InstrumentType, Operations.PortfolioPosition['figi'][]> = {
    share: [],
    bond: [],
    etf: [],
    currency: []
  }

  const { share: shares, bond: bonds, etf: etfs, currency: currencies } = positions.reduce<typeof instrumentsMap>((acc, position) => {
    const instruments: Shared.InstrumentType[] = ['share', 'bond', 'etf', 'currency']

    instruments.forEach((instrument) => {
      if (position.instrument_type === instrument) {
        acc[instrument].push(position.figi)
      }
    })

    return acc
  }, instrumentsMap)

  const SharesCache = new SharesRepository()
  const EtfsCache = new EtfsRepository()
  const CurrenciesCache = new CurrenciesRepository()
  const BondsCache = new BondsRepository()

  const [sharesInfo, bondsInfo, etfInfo, currenciesInfo] = await Promise.all([
    SharesCache.getAllByFigi(shares),
    BondsCache.getAllByFigi(bonds),
    EtfsCache.getAllByFigi(etfs),
    CurrenciesCache.getAllByFigi(currencies)
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
    const typeMap: Record<Shared.InstrumentType, string> = {
      share: 'Акция ',
      bond: 'Облигация ',
      etf: 'Фонд ',
      currency: 'Валюта '
    };
    const type = typeMap[row.instrument_type as Shared.InstrumentType]

    const currentPrice = parseInt(row.current_price, 10);
    const sum = row.quantity * currentPrice
    const average = parseInt(row.average_position_price, 10);

    console.log(`-- ${type}"${row.name}" (${row.quantity} шт.). На сумму: ${sum} руб. Средняя: ${average} руб. Текущая цена: ${currentPrice} руб."`)
  })
})();
