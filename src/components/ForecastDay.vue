<template>
  <div class="weather-day"></div>
</template>

<script setup lang="ts">
import type ForecastDay from '@/model/ForecastDay';
import { withDefaults } from 'vue';

interface Props {
  forecast: ForecastDay;
  current?: boolean;
}

withDefaults(defineProps<Props>(), {
  current: true
});
</script>

<style scoped lang="scss"></style>
