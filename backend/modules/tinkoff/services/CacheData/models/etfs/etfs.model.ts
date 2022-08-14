import { Shared } from '../../../TinkoffAPI/types'
import InstrumentModel from '../../core/models/instrument.model'

class EtfsModel extends InstrumentModel {
  sector: Shared.EtfsSector;
}

export default EtfsModel