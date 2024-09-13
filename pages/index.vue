<script setup>
import { useStore } from 'vuex';
const store = useStore();
const isBarOpen = ref(false);
const priceFilter = ref(0);
const editItem = ref();

const minPrice = computed(() => {
  const itemPrices = store.getters.getFormDataArray.map((item) => item.dates.map((date) => date.Price)).flat();
  return Math.min(...itemPrices);
});

const maxPrice = computed(() => {
  const itemPrices = store.getters.getFormDataArray.map((item) => item.dates.map((date) => date.Price)).flat();
  return Math.max(...itemPrices);
});

const filteredData = computed(() => {
  return store.getters.getFormDataArray.filter((item) => {
    return item.dates.some((date) => date.Price >= priceFilter.value);
  });
});

function handleFormBar(value) {
  editItem.value = {};
  isBarOpen.value = value;
}

function handleEditForm(item) {
  editItem.value = { ...item };
  isBarOpen.value = true;
}
</script>

<template>
  <div class="p-3">
    <div v-if="store.getters.getFormDataArray.length > 0" class="mb-4">
      <h3 class="filter-header underline">Filter</h3>
      <div class="flex align-items-center gap-3">
        <span>Filter on price</span>
        <Slider v-model="priceFilter" :min="minPrice" :max="maxPrice" :step="1" :range="false" class="w-14rem" />
      </div>
    </div>
    <div class="flex justify-content-between align-items-center">
      <h3 class="shift-header underline">Shifts</h3>
      <Button label="ADD SHIFT" class="p-button-secondary p-button-rounded" @click="isBarOpen = true" />
    </div>
  </div>
  <CreateUpdateForm v-model:visible="isBarOpen" :selectedItem="editItem" @update:visible="handleFormBar" />

  <DataTable
    class="p-datatable-sm text-[0.80rem] flex-nowrap md:!overflow-auto text-sm font-normal border border-solid border-gray-200 border-round-lg root"
    :row-hover="true"
    removable-sort
    reorderable-columns
    striped-rows
    responsive-layout="scroll"
    data-key="id"
    :value="filteredData"
    :pt="{
      thead: { style: 'display: none;' },
    }"
  >
    <template #empty>
      <div  class="flex align-items-center justify-content-center">
        <p class="text-base font-bold">No shift was found.</p>
      </div>
    </template>
    <Column field="id" header="">
      <template #body="slotProps">
        <TableItem :item="slotProps.data" @edit="handleEditForm" />
      </template>
    </Column>
  </DataTable>
</template>
<style scoped>
.filter-header,
.shift-header {
  text-decoration-color: red;
}
</style>
