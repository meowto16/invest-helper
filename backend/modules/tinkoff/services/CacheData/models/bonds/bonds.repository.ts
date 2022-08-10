import InstrumentRepository from '../../core/repositories/instrument.repository'

class BondsRepository extends InstrumentRepository {
  constructor() {
    super()
    this.tableName = 'bonds'
  }
}

export default BondsRepository