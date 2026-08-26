<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  password: string
}>()

const copied = ref(false)

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(props.password)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <button
    @click="copyToClipboard"
    class="text-[9px] font-bold bg-neutral-200 text-neutral-700 px-1 rounded uppercase hover:bg-neutral-300 cursor-pointer"
  >
    {{ copied ? 'Copied!' : 'Copy' }}
  </button>
</template>
