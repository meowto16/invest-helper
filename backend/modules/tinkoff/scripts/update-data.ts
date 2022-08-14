import 'dotenv/config'
import * as sqlite3 from 'sqlite3'

import { DATA_PATH } from '../config/data'
import TinkoffApi from '../services/TinkoffAPI'
import { Instruments } from '../services/TinkoffAPI/types'

import InstrumentStatus = Instruments.InstrumentStatus
import InstrumentType = Instruments.InstrumentType
import InstrumentMethod = Instruments.InstrumentMethod
import InstrumentTableName = Instruments.InstrumentTableName

!(async function main() {
  const db = new sqlite3.Database(DATA_PATH);

  const updateData = {
    in: (instrument: InstrumentType, done?: () => void, fail?: () => void) => {
      const instrumentMap: Record<InstrumentType, InstrumentMethod> = {
        etf: 'Etfs',
        currency: 'Currencies',
        bond: 'Bonds',
        share: 'Shares'
      }
      
      const instrumentMethod: InstrumentMethod = instrumentMap[instrument]
      
      if (!instrumentMethod) {
        return
      }
      
      return new Promise<void>((resolve, reject) => {
        TinkoffApi.instruments[instrumentMethod]({ instrument_status: InstrumentStatus.INSTRUMENT_STATUS_BASE })
          .then((response) => {
            const tableInstrumentMap: Record<InstrumentType, InstrumentTableName> = {
              etf: 'etfs',
              share: 'shares',
              bond: 'bonds',
              currency: 'currencies'
            }

            const tableName = tableInstrumentMap[instrument]

            if (!tableName) {
              fail?.()
              return reject()
            }

            const instruments = response.instruments
            const values = instruments.map(({ figi, ticker, name, sector }) => {
              const values = [
                `"${figi}"`,
                `"${ticker}"`,
                `"${name}"`,
                ...(tableName === 'etfs' || tableName === 'shares' || tableName === 'bonds' ? [`"${sector}"`] : [])
              ]

              return `(${values.join(',')})`
            })
            
            db.exec(`
              DELETE FROM "${tableName}";

              INSERT INTO "${tableName}" VALUES
              ${values.join(',\n')}
            `)

            done?.()
            resolve()
          })
          .catch((err) => {
            fail?.()
            reject(err)
          })
      })
    }
  }

  const successLog = (name: string) => () => console.log(`Обновлены данные по ${name}`);
  const errorLog = (name: string) => () => console.error(`Не удалось обновить данные по ${name}`)

  await Promise.all([
    updateData.in('etf', successLog('ETF'), errorLog('ETF')),
    updateData.in('share', successLog('акциям'), errorLog('акциям')),
    updateData.in('currency', successLog('валютам'), errorLog('валютам')),
    updateData.in('bond', successLog('облигациям'), errorLog('облигациям')),
  ])
})();