<script setup lang="ts">
import { ref, computed } from "vue";
import type { Organization } from "../types/organization";

const emit = defineEmits<{
  (e: "close"): void;
  (e: "add", organization: Omit<Organization, "id">): void;
}>();

const name = ref("");
const director = ref("");
const phone = ref("");

const isValid = computed(
  () =>
    name.value.trim() !== "" &&
    director.value.trim() !== "" &&
    phone.value.trim() !== ""
);

const handleSubmit = () => {
  if (isValid.value) {
    emit("add", {
      name: name.value,
      director: director.value,
      phone: phone.value,
    });
    emit("close");
  }
};
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal">
      <h2>Добавить организацию</h2>
      <div class="form-group">
        <div class="input-group">
          <label>Название организации</label>
          <input v-model="name" placeholder="Введите название" />
        </div>
        <div class="input-group">
          <label>ФИО директора</label>
          <input v-model="director" placeholder="Введите ФИО" />
        </div>
        <div class="input-group">
          <label>Номер телефона</label>
          <input v-model="phone" placeholder="+7 (___) ___-__-__" />
        </div>
      </div>
      <div class="buttons">
        <button class="cancel-button" @click="emit('close')">Отмена</button>
        <button
          class="submit-button"
          :disabled="!isValid"
          @click="handleSubmit"
        >
          Добавить
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 25px;
  border-radius: 8px;
  min-width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  margin: 0 0 20px 0;
  color: #333;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 20px 0;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-size: 14px;
  color: #666;
}

input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #4caf50;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-button,
.submit-button {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  font-size: 14px;
}

.cancel-button {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
}

.submit-button {
  background-color: #4caf50;
  color: white;
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.cancel-button:hover {
  background-color: #e9ecef;
}

.submit-button:hover:not(:disabled) {
  background-color: #45a049;
}
</style>
