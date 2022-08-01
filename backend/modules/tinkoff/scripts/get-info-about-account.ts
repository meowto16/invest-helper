import 'dotenv/config'
import * as process from 'process'
import * as sqlite3 from 'sqlite3';

import { createApi } from '../api'
import { DATA_PATH } from '../config/data'

!(async function main() {
  const token = process.env.TINKOFF_SECRET_TOCKET
  const portfolioId = process.env.TINKOFF_PORTFOLIO_ID

  if (!token) {
    throw new Error('You should define "TINKOFF_SECRET_TOCKET" in .env')
  }

  if (!portfolioId) {
    throw new Error('You should defined "TINKOFF_PORTFOLIO_ID" in .env.')
  }

  const api: any = createApi()
  const db = new (sqlite3.verbose()).Database(DATA_PATH);

  const { positions } = await api.operations.GetPortfolio({
    account_id: portfolioId
  });

  const sharesFigi = positions
    .filter((position: any) => position.instrument_type === 'share')
    .map((position: any) => position.figi)
  const bondsFigi = positions
    .filter((position: any) => position.instrument_type === 'bond')
    .map((position: any) => position.figi)
  const etfFigi = positions
    .filter((position: any) => position.instrument_type === 'etf')
    .map((position: any) => position.figi)

  const getData = (from: 'shares' | 'bonds' | 'etf') => new Promise((resolve, reject) => {
    const toParamList = (acc: any, _: any, idx: number) => acc + (idx === 0 ? '' : ',') + '?'

    const filter =
      from === 'shares' ? sharesFigi
      : from === 'bonds' ? bondsFigi
      : from === 'etf' ? etfFigi : [];

    const table =
      from === 'shares' ? 'shares'
      : from === 'bonds' ? 'bonds'
      : from === 'etf' ? 'etf' : '';

    if (!table || !filter.length) {
      resolve([]);
    }

    db.all(`
      SELECT figi, ticker, name
      FROM ${table}
      WHERE figi IN(${filter.reduce(toParamList, '')})
    `, filter, (err: any, rows: any) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows);
      }
    })
  })

  const [sharesInfo, bondsInfo, etfInfo] = await Promise.all([
    getData('shares'),
    getData('bonds'),
    getData('etf'),
  ]);

  const groupByFigi = (arr: any) => arr.reduce((acc: any, cur: any) => {
    acc[cur.figi] = cur

    return acc
  }, {})

  const sharesInfoByFigi = groupByFigi(sharesInfo);
  const bondsInfoByFigi = groupByFigi(bondsInfo);
  const etfInfoByFigi = groupByFigi(etfInfo);

  const infoMap = {
    share: sharesInfoByFigi,
    bond: bondsInfoByFigi,
    etf: etfInfoByFigi
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
        : row.instrument_type === 'etf' ? 'Фонд ' : '';

    const currentPrice = parseInt(row.current_price, 10);
    const sum = row.quantity * currentPrice
    const average = parseInt(row.average_position_price, 10);

    console.log(`${type}${row.name}. На сумму: ${sum} руб. Средняя: ${average} руб. Текущая цена: ${currentPrice} руб."`)
  })
})();
