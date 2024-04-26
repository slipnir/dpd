<template>
  <div>
    <input
        type="text"
        v-model="searchQuery"
        placeholder="Search..."
        class="search-input"
    />
    <table>
      <thead>
      <tr>
        <th>Avatar</th>
        <th>Full Name</th>
        <th>Gender</th>
        <th>Country</th>
        <th>Date of Birth</th>
        <th>Email Address</th>
        <th>Phone Number</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user in paginatedFilteredData" :key="user.login.uuid">
        <td>
          <img :src="user.picture.thumbnail" alt="Avatar" width="50" height="50" />
        </td>
        <td>{{ user.name.title }} {{ user.name.first }} {{ user.name.last }}</td>
        <td>{{ user.gender }}</td>
        <td>{{ user.location.country }}</td>
        <td>{{ new Date(user.dob.date).toLocaleDateString() }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.phone }}</td>
      </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button :disabled="currentPage === 1" @click="prevPage">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="nextPage">Next</button>
      <input
          type="number"
          v-model="goToPageInput"
          @change="goToPage"
          min="1"
          :max="totalPages"
      />
      <span>Input page you want to view</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import userData from '@/assets/data/api.json';

interface User {
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  location: {
    country: string;
  };
  dob: {
    date: string;
  };
  email: string;
  phone: string;
  picture: {
    thumbnail: string;
  };
  login: {
    uuid: string;
  };
}

export default defineComponent({
  name: 'UserTable',
  data() {
    const route = useRoute();
    const searchQuery = Array.isArray(route.query.search)
        ? route.query.search[0]
        : route.query.search || '';

    const currentPage = Array.isArray(route.query.page)
        ? Number(route.query.page[0])
        : Number(route.query.page) || 1;

    return {
      users: userData.results as User[],
      searchQuery: '',
      currentPage,
      pageSize: 20,
      goToPageInput: currentPage,
    };
  },
  computed: {
    filteredData(): User[] {
      const query = this.searchQuery.trim().toLowerCase();
      if (query === '') {
        return this.users;
      }

      return this.users.filter((user) => {
        return (
            user.gender.toLowerCase().includes(query) ||
            `${user.name.title} ${user.name.first} ${user.name.last}`.toLowerCase().includes(query) ||
            user.location.country.toLowerCase().includes(query) ||
            new Date(user.dob.date).toLocaleDateString().toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.phone.toLowerCase().includes(query)
        );
      });
    },
    totalPages(): number {
      return Math.ceil(this.filteredData.length / this.pageSize);
    },
    paginatedFilteredData(): User[] {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredData.slice(start, end);
    },
  },
  methods: {
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    goToPage() {
      if (
          this.goToPageInput >= 1 &&
          this.goToPageInput <= this.totalPages
      ) {
        this.currentPage = this.goToPageInput;
      }
    },
  },
  mounted() {
    const router = useRouter();

    watch(
        () => this.searchQuery,
        (newValue) => {
          router.push({
            query: {
              search: newValue,
              page: this.currentPage.toString(),
            },
          });
        },
        { immediate: true }
    );

    watch(
        () => this.currentPage,
        (newValue) => {
          router.push({
            query: {
              search: this.searchQuery,
              page: newValue.toString(),
            },
          });
        },
        { immediate: true }
    );
  },
});
</script>

<style scoped>
.search-input {
  margin-bottom: 10px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
  text-align: left;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
