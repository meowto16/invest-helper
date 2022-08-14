import { Shared } from '../../../TinkoffAPI/types'
import InstrumentModel from '../../core/models/instrument.model'

class BondsModel extends InstrumentModel {
  sector: Shared.BondsSector = '';
}

export default BondsModel