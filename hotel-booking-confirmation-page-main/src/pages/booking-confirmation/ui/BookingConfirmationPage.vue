<script setup lang="ts">
import { ref } from 'vue'
import SidebarWidget from '@/widgets/sidebar/ui/SidebarWidget.vue'
import MobileMenuDrawer from '@/features/mobile-menu/ui/MobileMenuDrawer.vue'
import ReceiptCard from '@/widgets/receipt-card/ui/ReceiptCard.vue'
import HostNoteCard from '@/widgets/host-note/ui/HostNoteCard.vue'
import GuestInfoCards from '@/widgets/guest-info-cards/ui/GuestInfoCards.vue'

const isMobileMenuOpen = ref(false)
</script>

<template>
  <div class="relative min-h-screen bg-neutral-50 text-neutral-900 font-dm-sans antialiased overflow-hidden">
    <div class="grid md:grid-cols-9 h-screen">
      <aside class="hidden md:flex md:col-span-2 border-r border-neutral-200 p-6 h-full w-full bg-neutral-50">
        <SidebarWidget />
      </aside>

      <main class="col-span-9 md:col-span-7 p-6 md:p-10 flex flex-col justify-between overflow-y-auto h-full">
        <div class="md:hidden flex justify-between items-center mb-6">
          <img src="@/shared/assets/images/logo.svg" alt="Maison Soleil" class="h-8" />
          <button @click="isMobileMenuOpen = true" class="p-2 border border-neutral-200 rounded-xl bg-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        <div>
          <header class="w-full flex items-center justify-between mb-8">
            <div class="flex flex-col">
              <span class="text-xs font-bold tracking-widest text-neutral-600 uppercase">Booking · Confirmed</span>
              <h1 class="text-4xl font-fraunces text-neutral-900 mt-1">Bienvenue, <span class="text-terracotta-600 italic font-normal">Lucia.</span></h1>
            </div>
            <div class="flex items-center gap-3 text-xs font-semibold">
              <button class="px-4 py-2 rounded-full border border-neutral-400 text-neutral-900 bg-neutral-0 hover:bg-neutral-100 transition-colors cursor-pointer active:outline-2 active:outline-terracota-600">Print receipt</button>
              <button class="px-4 py-2 rounded-full bg-neutral-900 text-neutral-0 hover:bg-neutral-800 transition-colors cursor-pointer active:outline-2 active:outline-terracota-600">Add to calendar</button>
            </div>
          </header>

          <div class="relative flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0 md:min-h-[360px] my-4 w-full max-w-4xl mx-auto">
            <ReceiptCard />
            <HostNoteCard />
            <div class="hidden md:block absolute bottom-[-20px] text-[10px] tracking-widest uppercase text-neutral-600 font-bold font-dm-mono flex items-center gap-1">
              ✦ Hover to fan ✦
            </div>
          </div>

          <GuestInfoCards />
        </div>

        <footer class="fixed bottom-0 left-0 right-0 translate-y-[calc(100%-20px)] hover:translate-y-0 transition-all duration-300 ease-in-out text-center text-[10px] text-neutral-600 bg-neutral-50/80 backdrop-blur-sm py-2 z-40">
          Challenge by <a href="https://www.frontendmentor.io?ref=challenge" class="underline hover:text-neutral-900" target="_blank">Frontend Mentor</a>.
          Coded by <a href="#" class="underline hover:text-neutral-900" target="_blank">Jaherreraf</a>.
        </footer>
      </main>
    </div>

    <MobileMenuDrawer :is-open="isMobileMenuOpen" @close="isMobileMenuOpen = false" />
  </div>
</template>
