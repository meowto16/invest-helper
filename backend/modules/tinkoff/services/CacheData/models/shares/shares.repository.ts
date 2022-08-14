import InstrumentRepository from '../../core/repositories/instrument.repository'
import { toParamList } from '../../core/utils'
import { Shared } from '../../../TinkoffAPI/types'

import { SharesModel } from './index'


class SharesRepository extends InstrumentRepository {
  constructor() {
    super()
    this.tableName = 'shares'
  }

  public getAllByFigi(figi: Shared.Figi[]): Promise<SharesModel[]> {
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

export default SharesRepository