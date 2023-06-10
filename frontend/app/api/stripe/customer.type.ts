export type StripeCustomer = {
  id: string
  object: "customer"
  address: [Object]
  balance: number
  created: number
  currency: string
  default_source: null
  delinquent: boolean
  description: null
  discount: null
  email: string
  invoice_prefix: string
  invoice_settings: [Object]
  livemode: boolean
  metadata: {}
  name: string
  next_invoice_sequence: number
  phone: string | null
  preferred_locales: []
  shipping: string | null
  tax_exempt: string
  test_clock: string | null
}

export type CustomerResults = {
  object: "search_result"
  data: StripeCustomer[]
  has_more: boolean
  next_page: null
  url: "/v1/customers/search"
}
