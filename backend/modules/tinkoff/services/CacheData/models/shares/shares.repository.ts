import InstrumentRepository from '../../core/repositories/instrument.repository'

class SharesRepository extends InstrumentRepository {
  constructor() {
    super()
    this.tableName = 'shares'
  }
}

export default SharesRepository