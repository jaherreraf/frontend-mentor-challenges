<script setup lang="ts">
import { bookingReceipt } from '@/entities/booking/model/booking-data'

const b = bookingReceipt
</script>

<template>
  <div class="bg-neutral-0 w-full max-w-[380px] rounded-2xl p-6 shadow-xl border border-neutral-200/60 md:-rotate-3 md:-translate-x-16 md:translate-y-2 z-10 font-dm-mono text-xs text-neutral-700">
    <div class="flex justify-between items-start border-b border-dashed border-neutral-200 pb-3 mb-3">
      <div>
        <span class="text-[9px] uppercase tracking-wider text-neutral-600 block">Receipt</span>
        <span class="font-fraunces text-base font-bold text-neutral-900">Your stay</span>
      </div>
      <div class="text-right text-[10px] text-neutral-600">
        <p>№ {{ b.reservationNumber }}</p>
        <p>{{ b.hotelCode }}</p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 border-b border-dashed border-neutral-200 pb-3 mb-3 font-dm-sans">
      <div>
        <span class="text-[9px] uppercase text-neutral-600 block font-bold">Check in</span>
        <span class="text-lg font-bold text-neutral-900 block font-fraunces">{{ b.checkIn.date }}</span>
        <span class="text-[10px] text-neutral-600">{{ b.checkIn.day }} · {{ b.checkIn.time }}</span>
      </div>
      <div>
        <span class="text-[9px] uppercase text-neutral-600 block font-bold">Check out</span>
        <span class="text-lg font-bold text-neutral-900 block font-fraunces">{{ b.checkOut.date }}</span>
        <span class="text-[10px] text-neutral-600">{{ b.checkOut.day }} · {{ b.checkOut.time }}</span>
      </div>
    </div>

    <div class="space-y-1.5 pb-3 mb-3">
      <div class="flex justify-between font-dm-sans">
        <span class="text-neutral-700">Room · {{ b.room.name }} <span class="text-neutral-600 text-xs">× {{ b.room.nights }} nights</span></span>
        <span class="font-semibold text-neutral-900">€ {{ b.room.price.toFixed(2) }}</span>
      </div>
      <div class="flex justify-between font-dm-sans">
        <span class="text-neutral-700">Breakfast · {{ b.breakfast.guests }} guests</span>
        <span class="font-semibold text-neutral-900">€ {{ b.breakfast.price.toFixed(2) }}</span>
      </div>
      <div class="flex justify-between font-dm-sans">
        <span class="text-neutral-700">Tourist tax</span>
        <span class="font-semibold text-neutral-900">€ {{ b.touristTax.toFixed(2) }}</span>
      </div>
    </div>

    <div class="flex justify-between items-baseline border-b border-neutral-200 pb-3 mb-3 font-dm-sans">
      <span class="text-[10px] uppercase font-bold tracking-wider text-neutral-600">Total paid</span>
      <span class="text-2xl font-fraunces font-bold text-neutral-900">€ {{ b.totalPaid.toFixed(2) }}</span>
    </div>

    <div class="flex justify-between items-center pt-1 text-[10px]">
      <span class="uppercase font-semibold tracking-wider text-neutral-600">{{ b.paymentMethod }}</span>
      <div class="flex items-center gap-[2px] h-6 opacity-80">
        <div class="w-[2px] h-full bg-neutral-900"></div>
        <div class="w-[1px] h-full bg-neutral-900"></div>
        <div class="w-[3px] h-full bg-neutral-900"></div>
        <div class="w-[1px] h-full bg-neutral-900"></div>
        <div class="w-[2px] h-full bg-neutral-900"></div>
        <div class="w-[4px] h-full bg-neutral-900"></div>
      </div>
    </div>
  </div>
</template>
