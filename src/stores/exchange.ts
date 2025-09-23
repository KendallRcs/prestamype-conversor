import { defineStore } from 'pinia'
import { db } from '@/services/firebase'
import { doc, onSnapshot, getDoc } from 'firebase/firestore'

type ExchangeMode = 'USD_TO_PEN' | 'PEN_TO_USD'
interface ExchangeRate { purchase_price: number; sale_price: number; updated_at?: string }

const COLLECTION = import.meta.env.VITE_FS_COLLECTION as string
const DOC_ID     = import.meta.env.VITE_FS_DOC_ID as string

export const useExchangeStore = defineStore('exchange', {
  state: () => ({
    rate: { purchase_price: 0, sale_price: 0 } as ExchangeRate,
    mode: 'USD_TO_PEN' as ExchangeMode,
    amountInput: '' as string,
    result: 0 as number,
    loading: true,
    error: '' as string
  }),
  getters: {
    dollarBuy: s => s.rate.purchase_price,
    dollarSell: s => s.rate.sale_price,
    topLabel:   s => (s.mode === 'USD_TO_PEN' ? 'Dólares' : 'Soles'),
    bottomLabel:s => (s.mode === 'USD_TO_PEN' ? 'Soles'   : 'Dólares'),
    sendsLabel: s => (s.mode === 'USD_TO_PEN' ? '$' : 'S/'),
    receivesLabel: s => (s.mode === 'USD_TO_PEN' ? 'S/' : '$'),
    isBuyActive:  s => s.mode === 'USD_TO_PEN',
    isSellActive: s => s.mode === 'PEN_TO_USD'
  },
  actions: {
    subscribeRates() {
      const ref = doc(db, COLLECTION, DOC_ID)
      const unsub = onSnapshot(ref, snap => {
        if (!snap.exists()) { this.loading = false; return }
        this.rate = snap.data() as ExchangeRate
        this.loading = false
      }, err => {
        console.error('ERROR:', err.code, err.message)
        this.error = err.message
        this.loading = false
      })
      return unsub
    },

    async fetchOnce() {
      const ref = doc(db, COLLECTION, DOC_ID)
      const snap = await getDoc(ref)
      console.log('data:', snap.data())
    },

    setAmount(v: string) {
      this.amountInput = v
    },

    toggleMode() {
      this.mode = this.mode === 'USD_TO_PEN' ? 'PEN_TO_USD' : 'USD_TO_PEN'
      this.result = 0
    },

    calculate() {
      const n = Number(String(this.amountInput).replace(',', '.')) || 0
      this.result = this.mode === 'USD_TO_PEN'
        ? n * (this.dollarBuy || 0)
        : (this.dollarSell ? n / this.dollarSell : 0)
    }
  }
})