<script setup lang="ts">
import { navItems, currentPath } from '@/shared/config/navigation'

defineProps<{
  isMobile?: boolean
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div class="flex flex-col justify-between h-full w-full">
    <div class="space-y-8">
      <div class="flex items-center justify-between w-full border-b border-neutral-200 pb-2">
        <img src="@/shared/assets/images/logo.svg" alt="Maison Soleil" class="size-28" />

        <button
          v-if="isMobile"
          @click="$emit('close')"
          class="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors border border-neutral-200"
        >
          <img src="@/shared/assets/images/icon-close.svg" class="size-6" />
        </button>
      </div>

      <nav>
        <ul class="flex flex-col gap-1 w-full text-sm font-medium text-neutral-600">
          <li
            v-for="item in navItems"
            :key="item.path"
            :class="[
              'group rounded-xl transition-all duration-200 hover:border-2 hover:border-terracotta-600 hover:bg-neutral-0',
              item.path === currentPath
                ? 'bg-neutral-0 border border-neutral-200/50 text-neutral-900 font-semibold px-4 py-2.5 shadow-sm'
                : 'hover:text-neutral-900 px-4 py-2.5'
            ]"
          >
            <a :href="item.path" class="flex items-center justify-between w-full">
              <div class="flex items-center gap-3">
                <img
                  :src="`/src/shared/assets/images/${item.icon}`"
                  alt=""
                  :class="[
                    'size-4 transition-opacity',
                    item.path === currentPath ? 'opacity-90' : 'opacity-60 group-hover:opacity-90'
                  ]"
                />
                <span>{{ item.name }}</span>
              </div>

              <span
                v-if="item.badge > 0"
                class="flex items-center justify-center size-5 rounded-full bg-terracotta-700 text-[10px] font-bold text-white animate-pulse"
              >
                {{ item.badge }}
              </span>
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <div class="space-y-6 mt-auto">
      <section class="relative overflow-hidden rounded-2xl bg-sun-200/60 p-4 text-neutral-900 shadow-sm border border-sun-300/40 bg-[url('/src/shared/assets/images/icon-weather.svg')] bg-no-repeat bg-[length:80px_80px] bg-[right_-15px_top_-15px]">
        <div class="flex flex-col justify-between h-full space-y-2 relative z-10">
          <span class="text-[10px] font-bold tracking-wider uppercase text-neutral-700">Today in Cassis</span>
          <span class="text-3xl font-fraunces font-bold">27°</span>
          <span class="text-xs text-neutral-700 font-medium">Sunny · light breeze</span>
        </div>
        <div class="absolute -right-3 -top-3 size-16 rounded-full bg-sun-500/30 blur-md"></div>
      </section>

      <footer class="text-[9px] uppercase tracking-widest text-neutral-600 space-y-2 font-dm-mono">
        <div class="border-t border-dashed border-neutral-400/40 pt-4">
          <span>Est. 1987</span>
        </div>
        <p class="leading-relaxed">Maison Soleil · 12 Rue des Oliviers · Cassis</p>
        <p class="text-neutral-400">© 2026 Maison Soleil</p>
      </footer>
    </div>
  </div>
</template>
