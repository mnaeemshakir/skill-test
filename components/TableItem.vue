<script setup>
import { useStore } from 'vuex';

const store = useStore();
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['edit']);

const dateEntries = computed(() => {
  const dates = props.item?.date ?? [];
  return dates.map((date, index) => {
    return {
      date,
      ...props.item.dates[index],
    };
  });
});

const formattedDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const formattedTime = (timeString) => {
  const time = new Date(timeString);
  return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
const editItem = () => {
  emit('edit', props.item);
};

const deleteItem = () => {
  store.dispatch('deleteItem', props.item.id);
};
</script>

<template>
  <Card>
    <template #title>
      <div class="flex justify-content-between align-items-center mb-1">
        <h5>{{ item.title }}</h5>
        <div class="flex">
          <Button icon="pi pi-pencil" class="p-button-rounded p-button-text" @click="editItem" />
          <Button icon="pi pi-trash" class="p-button-rounded p-button-text" @click="deleteItem" />
        </div>
      </div>
    </template>
    <template #subtitle>{{ item.description }}</template>
    <template #content>
      <h4>Dates</h4>
      <div class="date-list">
        <div
          v-for="(entry, index) in dateEntries"
          :key="index"
          class="flex justify-content-between align-items-center mb-2 p-2 bg-gray-900 text-white border-round"
        >
          <span>{{ formattedDate(entry.date) }}</span>
          <span>{{ formattedTime(entry.Starttime) }} - {{ formattedTime(entry.Endtime) }}</span>
          <span>{{ entry.Type }}</span>
          <span>{{ entry.Price }}</span>
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.date-entry {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  background-color: #333;
  color: white;
}
</style>
