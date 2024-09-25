<template>
  <article>
    <div v-for="(value, key) in propertiesToShow" :key="key" class="flex gap-2">
      <strong>{{ getTitle(key) }}: {{ value }}</strong>
    </div>
    <a :href="'/editor/geometry/' + geometryId">редактировать</a>
  </article>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  const props = defineProps(['feature', 'transcryptor', 'geometryId'])

  const propertiesToShow = computed(() => {
    const excludeKeys = ['category_id', 'show_on_map', 'icon_url']
    return Object.fromEntries(
      Object.entries(props.feature.properties).filter(([key]) => !excludeKeys.includes(key))
    )
  })

  const getTitle = (key: string) => {
    return props.transcryptor[key] || key
  }
</script>
