<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useExchangeStore } from '@/stores/exchange'
import syncUrl from '@/assets/icons/sync.svg'

const s = useExchangeStore()
const flipped = ref(false)

onMounted(() => {
  s.subscribeRates()
  s.fetchOnce()
})

const canCalc = computed(() => Number(String(s.amountInput).replace(',','.')) > 0)
const sendsValue = computed(() => {
  const n = Number(String(s.amountInput).replace(',', '.')) || 0
  return n.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 4 })
})
const receivesValue = computed(() =>
  s.result.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 4 })
)

function onSwap() {
  flipped.value = !flipped.value
  s.toggleMode()
}
</script>

<template>
  <div class="w-full max-w-none rounded-none bg-transparent shadow-none
  md:max-w-md md:rounded-2xl bg-white md:shadow-[0_10px_25px_rgba(0,0,0,0.12)]">
    <div class="px-5 pt-4">
      <div class="flex justify-center gap-10 md:gap-16 text-sm text-gray-600 pt-5">
        <div class="relative pb-2 overflow-hidden text-center">
          <span class="font-medium transition-colors duration-300" :class="s.isBuyActive ? 'text-[#4A28AF]' : 'text-gray-500'">
            <span class="block text-[12px]">Dólar compra</span>
            <span class="block text-[12px]">{{ s.dollarBuy.toFixed(4) }}</span>
          </span>
          <span
            class="absolute left-1/2 -translate-x-1/2 -bottom-[1px] h-[2px] w-full bg-[#4A28AF]
                  transition-transform duration-300 ease-out transform-gpu"
            :class="s.isBuyActive ? 'origin-left scale-x-100' : 'origin-right scale-x-0'"
          />
        </div>

        <div class="relative pb-2 overflow-hidden text-center">
          <span class="font-medium transition-colors duration-300" :class="s.isSellActive ? 'text-[#4A28AF]' : 'text-gray-500'">
            <span class="block text-[12px]">Dólar venta</span>
            <span class="block text-[12px]">{{ s.dollarSell.toFixed(4) }}</span>
          </span>
          <span
            class="absolute left-1/2 -translate-x-1/2 -bottom-[1px] h-[2px] w-full bg-[#4A28AF]
                  transition-transform duration-300 ease-out transform-gpu"
            :class="s.isSellActive ? 'origin-left scale-x-100' : 'origin-right scale-x-0'"
          />
        </div>
      </div>
    </div>
    <div class="h-px bg-gray-200/80"></div>

    <div class="p-5">
      <div class="relative space-y-3 ">
        <div class="relative rounded-[10px] border border-[#6E46E6] overflow-hidden ">
          <div class="grid grid-cols-[110px_1fr] items-stretch">
            <div class="bg-[#F2F1F7] text-[#6E46E6] text-[14px] grid place-items-center text-center px-4 py-2">
              {{ s.topLabel }}
            </div>
            <div class="absolute inset-y-0 left-[110px] w-px bg-[#E8E3F8]"></div>
            <div class="px-4 py-2 text-right">
              <div class="text-[12px] text-gray-400 leading-tight mb-0">Envías</div>
              <input
                class="w-full max-w-[160px] text-right text-[16px] text-gray-800 font-medium bg-transparent outline-none"
                :placeholder="s.sendsLabel + ' 0'"
                :value="s.amountInput"
                inputmode="decimal"
                @input="e => s.setAmount((e.target as HTMLInputElement).value)"
              />
            </div>
          </div>
        </div>

        <div class="relative rounded-[10px] border border-[#6E46E6] overflow-hidden">
          <div class="grid grid-cols-[110px_1fr] items-stretch">
            <div class="bg-[#F2F1F7] text-[#6E46E6] text-[14px] grid place-items-center text-center px-4 py-2">
              {{ s.bottomLabel }}
            </div>
            <div class="absolute inset-y-0 left-[110px] w-px bg-[#E8E3F8]"></div>
            <div class="px-4 py-2 text-right">
              <div class="text-[12px] text-gray-400 leading-tight mb-0">Recibes</div>
              <div class="text-[16px] text-gray-800 font-medium">
                {{ s.receivesLabel }} {{ receivesValue }}
              </div>
            </div>
          </div>
        </div>

        <button
          class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-[#6E46E6] text-white grid place-items-center shadow-md"
          aria-label="Invertir conversión"
          @click="onSwap"
        >
          <img :src="syncUrl" alt="" aria-hidden="true" class="w-7 h-7 transition-transform duration-300 ease-out" :class="flipped ? 'rotate-180' : 'rotate-0'" />
        </button>
      </div>

      <button
        class="mt-6 w-full rounded-xl bg-[#6E46E6] py-3 text-white text-[16px] hover:bg-[#5a37cd] transition-colors disabled:opacity-50"
        :disabled="!canCalc"
        @click="s.calculate()"
      >
        Iniciar operación
      </button>
    </div>
  </div>
</template>
