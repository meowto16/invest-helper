// @ts-ignore
import tinkoffV2 from 'tinkoff-invest-v2-sdk'
import { APP_NAME, APP_TOKEN } from '../config/api'

import { TinkoffAPI } from './types'

export const createApi = (): TinkoffAPI => {
  if (!APP_TOKEN) {
    throw new Error('You should define "TINKOFF_SECRET_TOCKET" in .env')
  }

  if (!APP_NAME) {
    throw new Error('You should defined "TINKOFF_APP_NAME" in .env.')
  }

  const api = tinkoffV2({ token: APP_TOKEN, appName: APP_NAME });

  const Api: TinkoffAPI = {
    common: api.Common,
    instruments: api.Instruments,
    marketData: api.MarketData,
    operations: api.Operations,
    orders: api.Orders,
    sandbox: api.Sandbox,
    stopOrders: api.StopOrders,
    users: api.Users
  }

  return Api
}