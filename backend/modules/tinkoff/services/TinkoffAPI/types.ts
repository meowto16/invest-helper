export type TinkoffApiInstance = {
  common: unknown
  instruments: Instruments.Methods
  marketData: unknown
  operations: Operations.Methods
  orders: unknown
  sandbox: unknown
  stopOrders: unknown
  users: unknown
}

export namespace DataTypes {
  type Unit = number;
  type Nano = number;

  export type Int32 = number;
  export type Int64 = number;
  export type Timestamp = number;

  export type MoneyValue = {
    currency: string;
    units: Unit;
    nano: Nano;
  }

  export type Quotation = {
    units: Unit;
    nano: Nano;
  }
}

export namespace Shared {
  export type Uid = string;
  export type Figi = string;
  export type Name = string;
  export type Ticker = string;
  export type ClassCode = string;
  export type Isin = string;
  export type Lot = DataTypes.Int32;
  export type Currency = string;
  export type IsoCurrencyName = string;
  export type ForIisFlag = boolean;
  export type ShortEnabledFlag = boolean;
  export type Exchange = string;
  export type CountryOfRisk = string;
  export type CountryOfRiskName = string;
  export type Sector = string;
  export type IssueKind = 'documentary' | 'non_documentary'
  export type OtcFlag = boolean;
  export type BuyAvailableFlag = boolean;
  export type SellAvailableFlag = boolean;
  export type ApiTradeAvailableFlag = boolean;
  export type InstrumentType = 'share' | 'currency' | 'bond' | 'etf'
}

export namespace Instruments {
  export type InstrumentType = 'etf' | 'currency' | 'share' | 'bond'
  export type InstrumentMethod = 'Etfs' | 'Currencies' | 'Shares' | 'Bonds'
  export type InstrumentTableName = 'etfs' | 'currencies' | 'shares' | 'bonds'

  export enum InstrumentStatus {
    INSTRUMENT_STATUS_UNSPECIFIED = 0,
    INSTRUMENT_STATUS_BASE = 1,
    INSTRUMENT_STATUS_ALL = 2,
  }

  export enum SecurityTradingStatus {
    SECURITY_TRADING_STATUS_UNSPECIFIED = 0,
    SECURITY_TRADING_STATUS_NOT_AVAILABLE_FOR_TRADING = 1,
    SECURITY_TRADING_STATUS_OPENING_PERIOD = 2,
    SECURITY_TRADING_STATUS_CLOSING_PERIOD = 3,
    SECURITY_TRADING_STATUS_BREAK_IN_TRADING = 4,
    SECURITY_TRADING_STATUS_NORMAL_TRADING = 5,
    SECURITY_TRADING_STATUS_CLOSING_AUCTION = 6,
    SECURITY_TRADING_STATUS_DARK_POOL_AUCTION = 7,
    SECURITY_TRADING_STATUS_DISCRETE_AUCTION = 8,
    SECURITY_TRADING_STATUS_OPENING_AUCTION_PERIOD = 9,
    SECURITY_TRADING_STATUS_TRADING_AT_CLOSING_AUCTION_PRICE = 10,
    SECURITY_TRADING_STATUS_SESSION_ASSIGNED = 11,
    SECURITY_TRADING_STATUS_SESSION_CLOSE = 12,
    SECURITY_TRADING_STATUS_SESSION_OPEN = 13,
    SECURITY_TRADING_STATUS_DEALER_NORMAL_TRADING = 14,
    SECURITY_TRADING_STATUS_DEALER_BREAK_IN_TRADING = 15,
    SECURITY_TRADING_STATUS_DEALER_NOT_AVAILABLE_FOR_TRADING = 16
  }

  export enum RealExchange {
    REAL_EXCHANGE_UNSPECIFIED = 0,
    REAL_EXCHANGE_MOEX = 1,
    REAL_EXCHANGE_RTS = 2,
    REAL_EXCHANGE_OTC = 3,
  }

  export enum FocusType {
    EQUITY = 'equity',
    FIXED_INCOME = 'fixed_income',
    MIXED_ALLOCATION = 'mixed_allocation',
    MONEY_MARKET = 'money_market',
    REAL_ESTATE = 'real_estate',
    COMMODITY = 'commodity',
    SPECIALITY = 'specialty',
    PRIVATE_EQUITY = 'private_equity',
    ALTERNATIVE_INVESTMENT = 'alternative_investment'
  }

  export enum ShareType {
    SHARE_TYPE_UNSPECIFIED = 0,
    SHARE_TYPE_COMMON = 1,
    SHARE_TYPE_PREFERRED = 2,
    SHARE_TYPE_ADR = 3,
    SHARE_TYPE_GDR = 4,
    SHARE_TYPE_MLP = 5,
    SHARE_TYPE_NY_REG_SHRS = 6,
    SHARE_TYPE_CLOSED_END_FUND = 7,
    SHARE_TYPE_REIT = 8
  }

  type WithRiskRate = {
    klong: DataTypes.Quotation;
    kshort: DataTypes.Quotation;
    dlong: DataTypes.Quotation;
    dshort: DataTypes.Quotation;
    dlong_min: DataTypes.Quotation;
    dshort_min: DataTypes.Quotation;
  }

  type WithBasicInfo = {
    uid: Shared.Uid;
    position_uid: Shared.Uid;
    figi: Shared.Figi;
    ticker: Shared.Ticker;
    class_code: Shared.ClassCode;
    isin: Shared.Isin;
    lot: Shared.Lot;
    currency: Shared.Currency;
    name: Shared.Name;
    exchange: Shared.Exchange;
    real_exchange: RealExchange;
    for_iis_flag: Shared.ForIisFlag;
    trading_status: SecurityTradingStatus;
    sector: Shared.Sector;
    otc_flag: Shared.OtcFlag;
    buy_available_flag: Shared.BuyAvailableFlag;
    sell_available_flag: Shared.SellAvailableFlag;
    country_of_risk: Shared.CountryOfRisk;
    country_of_risk_name: Shared.CountryOfRiskName;
    api_trade_available_flat: Shared.ApiTradeAvailableFlag;
  }

  type WithCandles = {
    first_1min_candle_date: DataTypes.Timestamp;
    first_1day_candle_date: DataTypes.Timestamp;
  }

  type Bond = WithBasicInfo & WithRiskRate & WithCandles & {
    short_enabled_flag: Shared.ShortEnabledFlag;
    coupon_quantity_per_year: DataTypes.Int32;
    maturity_date: DataTypes.Timestamp;
    nominal: DataTypes.MoneyValue;
    state_reg_date: DataTypes.Timestamp;
    placement_date: DataTypes.Timestamp;
    placement_price: DataTypes.MoneyValue;
    aci_value: DataTypes.MoneyValue;
    issue_kind: Shared.IssueKind;
    issue_size: DataTypes.Int64;
    issue_size_plan: DataTypes.Int64;
    floating_coupon_flag: boolean;
    perpetual_flag: boolean;
    amortization_flag: boolean;
    min_price_increment: DataTypes.Quotation;
  }

  export type Etf = WithBasicInfo & WithRiskRate & WithCandles & {
    fixed_commission: DataTypes.Quotation;
    focus_type: FocusType;
    released_date: DataTypes.Timestamp;
    rebalancing_freq: string;
    min_price_increment: DataTypes.Quotation;
  }

  export type Share = WithBasicInfo & WithRiskRate & WithCandles & {
    short_enabled_flag: Shared.ShortEnabledFlag;
    ipo_date: DataTypes.Timestamp;
    issue_size: DataTypes.Int64;
    issue_size_plan: DataTypes.Int64;
    nominal: DataTypes.MoneyValue;
    div_yield_flag: boolean;
    share_type: ShareType;
    min_price_increment: DataTypes.Quotation;
  }

  export type Currency = WithBasicInfo & WithRiskRate & WithCandles & {
    short_enabled_flag: Shared.ShortEnabledFlag;
    min_price_increment: DataTypes.Quotation;
    iso_currency_name: Shared.IsoCurrencyName;
  }

  type EtfsParams = { instrument_status: InstrumentStatus }
  type EtfsResponse = { instruments: Etf[] }
  type EtfsMethod = (params: EtfsParams) => Promise<EtfsResponse>

  type SharesParams = { instrument_status: InstrumentStatus }
  type SharesResponse = { instruments: Share[] }
  type SharesMethod = (params: SharesParams) => Promise<SharesResponse>

  type BondsParams = { instrument_status: InstrumentStatus }
  type BondsResponse = { instruments: Bond[] }
  type BondsMethod = (params: BondsParams) => Promise<BondsResponse>

  type CurrenciesParams = { instrument_status: InstrumentStatus }
  type CurrenciesResponse = { instruments: Currency[] }
  type CurrenciesMethod = (params: CurrenciesParams) => Promise<CurrenciesResponse>

  export type Methods = {
    Etfs: EtfsMethod
    Shares: SharesMethod
    Bonds: BondsMethod
    Currencies: CurrenciesMethod
  }
}

export namespace Operations {
  export type PortfolioPosition = {
    figi: Shared.Figi
    instrument_type: Shared.InstrumentType
    quantity: DataTypes.Quotation;
    average_position_price: DataTypes.MoneyValue;
    expected_yield: DataTypes.Quotation;
    current_nkd: DataTypes.MoneyValue;
    average_position_price_pt: DataTypes.Quotation;
    current_price: DataTypes.MoneyValue;
    average_position_price_fifo: DataTypes.MoneyValue;
    quantity_lots: DataTypes.Quotation;
    blocked: boolean;
  }

  type GetPortfolioParams = { account_id: string; }
  type GetPortfolioResponse = {
    total_amount_shares: DataTypes.MoneyValue;
    total_amount_bonds: DataTypes.MoneyValue;
    total_amount_etf: DataTypes.MoneyValue;
    total_amount_currencies: DataTypes.MoneyValue;
    total_amount_futures: DataTypes.MoneyValue;
    expected_yield: DataTypes.Quotation;
    positions: PortfolioPosition[]
  }
  type GetPortfolioMethod = (params: GetPortfolioParams) => Promise<GetPortfolioResponse>

  export type Methods = {
    GetPortfolio: GetPortfolioMethod
  }
}