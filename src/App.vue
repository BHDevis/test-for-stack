<script setup lang="ts">
import { ref, computed } from "vue";
import AddOrganizationModal from "./components/AddOrganizationModal.vue";
import type {
  Organization,
  SortField,
  SortDirection,
} from "./types/organization";

const organizations = ref<Organization[]>([]);
const showModal = ref(false);
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 5;
const sortField = ref<SortField>("name");
const sortDirection = ref<SortDirection>("asc");

const filteredOrganizations = computed(() => {
  return organizations.value
    .filter((org) =>
      org.director.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    .sort((a, b) => {
      const field = sortField.value;
      const modifier = sortDirection.value === "asc" ? 1 : -1;
      return a[field].localeCompare(b[field]) * modifier;
    });
});

const paginatedOrganizations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredOrganizations.value.slice(start, end);
});

const totalPages = computed(() =>
  Math.ceil(filteredOrganizations.value.length / itemsPerPage)
);

const handleSort = (field: SortField) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortDirection.value = "asc";
  }
};

const addOrganization = (newOrg: Omit<Organization, "id">) => {
  const id = organizations.value.length + 1;
  organizations.value.push({ ...newOrg, id });
};

const deleteOrganization = (id: number) => {
  organizations.value = organizations.value.filter((org) => org.id !== id);
};

// Добавляем computed для отображения страниц
const displayPage = computed(() =>
  organizations.value.length === 0 ? 0 : currentPage.value
);

const displayTotalPages = computed(() =>
  organizations.value.length === 0 ? 0 : totalPages.value
);

// Добавляем computed для иконок сортировки
const getSortIcon = (field: SortField) => {
  if (sortField.value !== field) return "↕️";
  return sortDirection.value === "asc" ? "↑" : "↓";
};
</script>

<template>
  <div class="container">
    <div class="controls">
      <div class="search">
        <input
          v-model="searchQuery"
          placeholder="Найти по ФИО..."
          class="search-input"
        />
      </div>
      <button @click="showModal = true" class="add-button">
        + Добавить организацию
      </button>
    </div>

    <table>
      <thead>
        <tr>
          <th @click="handleSort('name')" class="sortable">
            Название
            <span class="sort-icon">{{ getSortIcon("name") }}</span>
          </th>
          <th @click="handleSort('director')" class="sortable">
            ФИО директора
            <span class="sort-icon">{{ getSortIcon("director") }}</span>
          </th>
          <th>Номер телефона</th>
          <th class="action-column"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="organizations.length === 0">
          <td colspan="4" class="empty-message">Нет данных</td>
        </tr>
        <tr v-else v-for="org in paginatedOrganizations" :key="org.id">
          <td>{{ org.name }}</td>
          <td>{{ org.director }}</td>
          <td>{{ org.phone }}</td>
          <td class="action-column">
            <button @click="deleteOrganization(org.id)" class="delete-button">
              ×
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button
        :disabled="currentPage === 1 || organizations.length === 0"
        @click="currentPage--"
        class="page-button"
      >
        &lt;
      </button>
      <span>Страница {{ displayPage }} из {{ displayTotalPages }}</span>
      <button
        :disabled="currentPage === totalPages || organizations.length === 0"
        @click="currentPage++"
        class="page-button"
      >
        &gt;
      </button>
    </div>

    <AddOrganizationModal
      v-if="showModal"
      @close="showModal = false"
      @add="addOrganization"
    />
  </div>
</template>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 250px;
  font-size: 14px;
}

.add-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-button:hover {
  background-color: #45a049;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

th,
td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sort-icon {
  margin-left: 5px;
  font-size: 12px;
}

.action-column {
  width: 50px;
  text-align: center;
}

.delete-button {
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  line-height: 24px;
  padding: 0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.delete-button:hover {
  background-color: #cc0000;
}

.empty-message {
  text-align: center;
  color: #666;
  padding: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.page-button {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-button:hover:not(:disabled) {
  background-color: #e9ecef;
}

.page-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
