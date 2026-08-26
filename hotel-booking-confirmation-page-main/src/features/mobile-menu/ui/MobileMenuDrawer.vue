<script setup lang="ts">
import SidebarWidget from '@/widgets/sidebar/ui/SidebarWidget.vue'

defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex md:hidden bg-neutral-900/40 backdrop-blur-sm"
    @click.self="$emit('close')"
  >
    <div class="w-full h-full bg-neutral-50 p-6 shadow-2xl border-r border-neutral-200 flex flex-col justify-between animate-in slide-in-from-left duration-300">
      <SidebarWidget :is-mobile="true" @close="$emit('close')" />
    </div>
  </div>
</template>
