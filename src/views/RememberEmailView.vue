<template>
  <MainLayout>
    <div class="min-h-screen w-full flex flex-col items-center justify-start pt-10 px-4">

      <!-- HEADER -->
      <div class="mb-10 text-center">
        <h1 class="text-2xl font-semibold mb-2">
          Recuerda tu usuario Unibagué
        </h1>
        <p class="text-base text-gray-600 max-w-lg">
          Ingresa tu número de documento y fecha de nacimiento
          (sin puntos ni comas) para consultar tu usuario.
        </p>
      </div>

      <!-- FORM -->
      <div
        v-if="showForm"
        class="w-full max-w-md sm:max-w-lg
               px-6 py-6 border shadow-md rounded-xl bg-gray-100">

        <!-- Documento -->
        <div class="text-left mb-4">
          <label class="font-semibold block mb-2">
            Número de documento
          </label>
          <input
            v-model="documentNumber.value"
            placeholder="1005839105"
            class="rounded border px-3 py-2 w-full">
        </div>

        <!-- Fecha -->
        <div class="text-left mb-4">
          <label class="font-semibold block mb-2">
            Fecha de nacimiento
          </label>
          <input
            type="date"
            v-model="birthday.value"
            class="rounded border px-3 py-2 w-full">
        </div>

        <!-- Rol -->
        <div class="text-left mb-4">
          <label class="font-semibold block mb-2">
            Eres un ...
          </label>
          <select
            v-model.number="role.value"
            class="rounded border px-3 py-2 w-full bg-white">
            <option :value="0">Estudiante o egresado</option>
            <option :value="1">Administrativo</option>
          </select>
        </div>

        <!-- ACTIONS -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <router-link
            class="rounded py-2 text-center w-full bg-gray-200 block"
            :to="{ name: 'home' }">
            Ir atrás
          </router-link>

          <button
            :disabled="!isFormValid"
            @click="submitForm"
            class="rounded py-2 text-center w-full font-semibold transition text-white"
            :class="!isFormValid
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#0f1f39] hover:bg-[#162d5a]'">
            Recordar
          </button>
        </div>
      </div>

      <!-- RESULT -->
      <div
        v-else
        class="w-full max-w-md px-6 py-6 rounded-xl shadow-md text-center"
        :class="notFound
          ? 'bg-red-50 border border-red-300'
          : 'bg-green-50 border border-green-300'">

        <p
          class="font-semibold mb-2"
          :class="notFound ? 'text-red-700' : 'text-green-700'"
          v-html="message">
        </p>

        <router-link
          class="rounded py-2 mt-4 w-full text-white block font-semibold"
          :class="notFound ? 'bg-red-600' : 'bg-[#0f1f39]'"
          :to="{ name: 'home' }">
          Volver
        </router-link>
      </div>

    </div>
  </MainLayout>
</template>


<script>
import MainLayout from "@/layouts/MainLayout";
import axios from "axios";

export default {
  name: "RememberEmailView",
  components: {
    MainLayout
  },

  data() {
    return {
      notFound: true,
      showForm: true,
      message: 'Número de documento no encontrado',
      documentNumber: {
        value: ''
      },
      birthday: {
        value: ''
      },
      role: {
        value: 0
      }
    }
  },
  computed: {
    isFormValid() {
      return (this.documentNumber.value !== '' && this.birthday.value !== '');
    }
  },
  methods: {
    async submitForm() {
      if (!this.isFormValid) {
        return;
      }
      const domain = process.env.VUE_APP_DOMAIN;
      const url = domain + '/rememberEmail';

      const data = {
        documentNumber: this.documentNumber.value,
        birthday: this.birthday.value,
        role: this.role.value,
      }
      try {
        let request = await axios.post(url, data);
        this.message = request.data.message;
        this.notFound = false;
      } catch (e) {
        if (e.response.data['redirect']) {
          console.log('redirect');
          window.location.href = e.response.data['redirect'];
          return;
        }
        this.message = e.response.data.message
      }
      this.showForm = false;
    },

  },

}
</script>