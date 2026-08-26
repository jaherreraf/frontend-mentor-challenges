<script setup lang="ts">
import { guestInfoCards, wifiNetwork } from '@/entities/booking/model/booking-data'
import CopyWifiButton from '@/features/copy-wifi/ui/CopyWifiButton.vue'
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
    <div
      v-for="(card, index) in guestInfoCards"
      :key="index"
      class="bg-neutral-0 border border-neutral-200/70 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4"
    >
      <div>
        <div class="flex justify-between items-center mb-3">
          <div :class="`p-2 rounded-xl bg-${card.color} text-white size-8 flex items-center justify-center text-xs`">{{ card.icon }}</div>
          <span :class="`font-fraunces font-bold text-xl text-${card.color}`">{{ card.number }}</span>
        </div>
        <h4 class="font-fraunces font-bold text-base text-neutral-900">{{ card.title }}</h4>
        <p class="text-[11px] font-semibold text-neutral-600 mt-0.5">{{ card.subtitle }}</p>
      </div>

      <!-- Card 02: WiFi details -->
      <div v-if="index === 1" class="space-y-1.5 font-dm-mono text-[11px] w-full">
        <div class="flex justify-between items-center bg-neutral-50 px-2.5 py-1.5 rounded-lg border border-neutral-200/50">
          <span class="text-neutral-600 uppercase text-[9px] font-bold">Network</span>
          <span class="text-neutral-900 font-semibold font-dm-sans">{{ wifiNetwork.name }}</span>
        </div>
        <div class="flex justify-between items-center bg-neutral-50 px-2.5 py-1.5 rounded-lg border border-neutral-200/50">
          <span class="text-neutral-600 uppercase text-[9px] font-bold">Password</span>
          <div class="flex items-center gap-1.5 font-dm-sans">
            <span class="text-neutral-900 font-semibold">{{ wifiNetwork.password }}</span>
            <CopyWifiButton :password="wifiNetwork.password" />
          </div>
        </div>
      </div>

      <!-- Cards 01 & 03: Description -->
      <p v-else class="text-xs text-neutral-700 leading-relaxed font-normal">
        {{ card.description }}
      </p>
    </div>
  </div>
</template>
