<script setup>
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { useStore } from 'vuex';

const store = useStore();
const props = defineProps({
  visible: Boolean,
  selectedItem: Object,
});

const emit = defineEmits(['update:visible']);

const isBarOpen = computed({
  get: () => props.visible,
  set: (value) => {
    emit('update:visible', value);
  },
});

const options = ['Consultation', 'Telephone', 'Ambulance'];

const schema = yup.object({
  title: yup.string().required('Title is required').max(100),
  description: yup.string().required('Description is required').max(500),
  date: yup.array().of(yup.date()).required('Date is required'),
  dates: yup
    .array()
    .of(
      yup.object({
        // Starttime: yup.date()
        //   .required('Starttime is required')
        //   .typeError('Starttime must be a valid date'),
        // Endtime: yup.date()
        //   .required('Endtime is required')
        //   .typeError('Endtime must be a valid date')
        //   .test('is-after', 'Endtime must be later than Starttime', function (value) {
        //     const { Starttime } = this.parent;
        //     return value && Starttime ? new Date(value) > new Date(Starttime) : true;
        //   }),
        Price: yup.number().min(0, 'Price must be at least 0').required('Price is required'),
        Type: yup
          .string()
          .oneOf(['Consultation', 'Telephone', 'Ambulance'], 'Invalid Type')
          .required('Type is required'),
      }),
    )
    .min(1, 'At least one date entry is required')
    .max(10, 'A maximum of 10 date entries are allowed'),
});

const { handleSubmit, errors, setErrors, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    title: props.selectedItem?.title ?? '',
    description: props.selectedItem?.description ?? '',
    date: props.selectedItem?.date ?? '',
    dates: props.selectedItem?.dates ?? [],
  },
});

const { value: title } = useField('title');
const { value: description } = useField('description');
const { value: date } = useField('date');
const { value: dates, errorMessage: datesError } = useField('dates');

watch(date, (newDates) => {
  if (date.value.length !== dates.value.length) {
    dates.value = newDates.map((date) => ({
      Starttime: new Date(),
      Endtime: new Date(),
      Price: 0,
      Type: 'Consultation',
    }));
  }
});

const submit = handleSubmit(async (values) => {
  store.dispatch('addFormData', { ...values, id: props.selectedItem?.id ?? Math.random() });
  isBarOpen.value = false;
  resetForm();
});

watch(
  () => props.visible,
  () => {
    if (!props.visible) {
      resetForm();
    }
  },
);

watch(
  () => props.selectedItem,
  (newItem) => {
    if (newItem && props.visible && Object.keys(newItem).length > 0) {
      title.value = newItem.title;
      description.value = newItem.description;
      dates.value = newItem.dates.map((date) => ({ ...date }));
      date.value = newItem.date;
    }
  },
);
</script>
<template>
  <Sidebar
    v-model:visible="isBarOpen"
    header="Create/Edit"
    position="right"
    :pt="{
      header: { class: 'justify-content-between' },
      root: { class: 'h-full', style: { width: '33.33%' } },
    }"
  >
    <div class="flex flex-column gap-2">
      <label for="title">Title</label>
      <InputText id="title" v-model="title" />
      <small v-if="errors.title">
        <span class="invalid">{{ errors.title }}</span>
      </small>
    </div>
    <div class="flex flex-column gap-2 mt-3">
      <label for="description">Description</label>
      <Textarea id="description" v-model="description" rows="5" cols="30" />
      <small v-if="errors.description">
        <span class="invalid">{{ errors.description }}</span>
      </small>
    </div>
    <div class="flex flex-column gap-2 mt-3">
      <label for="date">Select Dates</label>
      <Calendar id="date" v-model="date" selectionMode="multiple" />
      <small v-if="errors.date">
        <span class="invalid">{{ errors.date }}</span>
      </small>
    </div>
    <div v-for="(dateEntry, index) in dates" :key="index" class="flex flex-column gap-2 mt-3">
      <h4>Date: {{ new Date(date[index]).toLocaleDateString() }}</h4>
      <div class="flex gap-2">
        <div class="flex flex-column gap-2">
          <label>Starttime</label>
          <Calendar v-model="dateEntry.Starttime" timeOnly />
        </div>
        <div class="flex flex-column gap-2">
          <label>Endtime</label>
          <Calendar v-model="dateEntry.Endtime" timeOnly />
        </div>
        <div class="flex flex-column gap-2">
          <label>Price</label>
          <InputNumber v-model="dateEntry.Price" :min="0" :minFractionDigits="2" />
        </div>
        <div class="flex flex-column gap-2">
          <label>Type</label>
          <Dropdown v-model="dateEntry.Type" :options="options" placeholder="Select" class="w-full" />
        </div>
      </div>
    </div>
    <div>
      <small v-if="errors.dates">
        <span class="invalid">{{ errors.dates }}</span>
      </small>
    </div>
    <Button @click="submit" label="Submit" class="mt-3" />
  </Sidebar>
</template>
