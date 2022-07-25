// @ts-ignore
import tinkoffV2 from 'tinkoff-invest-v2-sdk'
import { APP_NAME, APP_TOKEN } from '../config/api'

export const createApi = () => {
  if (!APP_TOKEN) {
    throw new Error('You should define "TINKOFF_SECRET_TOCKET" in .env')
  }

  if (!APP_NAME) {
    throw new Error('You should defined "TINKOFF_APP_NAME" in .env.')
  }

  const api = tinkoffV2({ token: APP_TOKEN, appName: APP_NAME });

  const Api = {
    common: api.Common as any,
    instruments: api.Instruments as any,
    marketData: api.MarketData as any,
    operations: api.Operations as any,
    orders: api.Orders as any,
    sandbox: api.Sandbox as any,
    stopOrders: api.StopOrders as any,
    users: api.Users as any
  }

  return Api
}