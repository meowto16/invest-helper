import { Shared } from '../../../TinkoffAPI/types'
import InstrumentRepository from '../../core/repositories/instrument.repository'
import { toParamList } from '../../core/utils'
import { BondsModel } from './index'

class BondsRepository extends InstrumentRepository {
  constructor() {
    super()
    this.tableName = 'bonds'
  }

  public getAllByFigi(figi: Shared.Figi[]): Promise<BondsModel[]> {
    return new Promise((resolve, reject) => {
      this.db.all(`
      SELECT figi, ticker, name, sector
      FROM ${this.tableName}
      WHERE figi IN(${figi.reduce(toParamList, '')})
    `, figi, (err: any, rows: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(rows);
        }
      })
    })
  }
}

export default BondsRepository