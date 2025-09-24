<script setup lang="ts">
import ExchangeCard from '@/components/ExchangeCard.vue'

</script>

<template>
  <main class="min-h-screen bg-gradient-to-b from-[#4A28AF] to-[#6E46E6] md:flex md:items-center">
    <section class="mx-auto max-w-6xl py-10 md:px-6 md:py-12 grid md:grid-cols-2 items-start md:items-center gap-6 md:gap-10 w-full">
      <div class="text-white text-center md:text-left px-5">
        <h1 class="font-medium text-[24px] leading-[1.05] tracking-normal md:text-[48px] md:leading-[1.02]">
          El mejor<br>tipo de cambio
        </h1>
        <p class="font-normal text-[14px] leading-[1] tracking-normal mt-2 md:text-[24px] md:mt-3">
          para cambiar dólares y soles online en Perú
        </p>
      </div>
      <div class="justify-self-center w-full max-w-none md:max-w-md mx-0 mt-4">
        <ExchangeCard />
      </div>
    </section>
  </main>
</template>
