<script setup lang="ts">
import { hostNote } from '@/entities/booking/model/booking-data'

const h = hostNote
</script>

<template>
  <div class="bg-gradient-to-br from-terracotta-600 to-terracotta-700 w-full max-w-[360px] rounded-2xl p-6 shadow-2xl text-neutral-0 md:rotate-3 md:translate-x-12 md:-translate-y-2 z-20 flex flex-col justify-between min-h-[300px] relative">
    <div>
      <div class="flex justify-between items-center mb-6">
        <span class="text-[9px] uppercase tracking-widest font-bold opacity-60 font-dm-mono">Welcome card</span>
        <span class="text-xl">☀️</span>
      </div>
      <p class="font-fraunces italic text-lg opacity-90 leading-tight">A note from your host,</p>
      <h3 class="font-fraunces font-bold text-3xl mt-1 mb-4">{{ h.hostName }}.</h3>
      <p class="text-xs font-light leading-relaxed opacity-90 font-dm-sans">
        "{{ h.message }}"
      </p>
    </div>

    <div class="mt-8 border-t border-white/20 pt-3">
      <span class="text-[9px] uppercase tracking-widest font-bold opacity-60 font-dm-mono block">Room</span>
      <span class="font-fraunces text-base font-semibold">{{ h.roomName }}</span>
    </div>
  </div>
</template>
