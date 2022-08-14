import * as process from 'process'
import { BondsRepository, CurrenciesRepository, EtfsRepository, SharesRepository } from '../CacheData'
import TinkoffApi from '../TinkoffAPI'
import { Operations, Shared } from '../TinkoffAPI/types'

export const OperatorService = {
  getPortfolioExtended: async () => {
    const portfolioId = process.env.TINKOFF_PORTFOLIO_ID

    if (!portfolioId) {
      throw new Error('You should defined "TINKOFF_PORTFOLIO_ID" in .env.')
    }

    const api = TinkoffApi

    const portfolio = await api.operations.GetPortfolio({
      account_id: portfolioId
    });

    const { positions, ...other } = portfolio

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

    const positionsExtended = positions.map((position: any) => {
      // @ts-ignore
      const info = infoMap?.[position.instrument_type]?.[position.figi]

      const currentPrice = parseInt(position.current_price, 10);
      const sum = position.quantity * currentPrice
      const average = parseInt(position.average_position_price, 10);
      const diff = average - currentPrice;
      const diffSign = diff <= 0 ? '+' : '-';
      const diffPercent = (() => {
        const percent = currentPrice / average;
        const percentDiff = 1 - percent;
        return +(percentDiff * 100).toFixed(2)
      })();

      return {
        ...position,
        ...(info),
        currentPrice,
        sum,
        average,
        diff: Math.abs(diff),
        diffPercent: `${Math.abs(diffPercent)}%`,
        diffSign,
        income: Math.abs(diff * position.quantity),
      }
    })

    return { positions: positionsExtended, ...other }
  }
}