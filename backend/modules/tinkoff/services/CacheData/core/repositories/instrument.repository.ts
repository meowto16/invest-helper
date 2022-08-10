import { Shared } from '../../../TinkoffAPI/types'
import InstrumentModel from '../models/instrument.model'
import BaseRepository from './base.repository'

import { toParamList } from '../utils'

class InstrumentRepository extends BaseRepository {
  protected tableName = '';

  constructor() {
    super()
  }

  public getAllByFigi(figi: Shared.Figi[]): Promise<InstrumentModel[]> {
    return new Promise((resolve, reject) => {
      this.db.all(`
      SELECT figi, ticker, name
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

export default InstrumentRepository