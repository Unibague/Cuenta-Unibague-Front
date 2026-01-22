<template>
  <MainLayout>
    <div class="min-h-screen w-full flex flex-col items-center justify-start pt-10 px-4">

      <!-- HEADER -->
      <div class="mb-10 text-center">
        <h1 class="text-2xl font-semibold mb-2">
          Recuperar contraseña
        </h1>
        <p class="text-base text-gray-600">
          Ingresa tu usuario para recibir las instrucciones de recuperación.
        </p>
      </div>

      <!-- FORM -->
      <div
        v-if="showForm"
        class="w-full max-w-md sm:max-w-lg
               px-6 py-6 border shadow-md rounded-xl bg-gray-100">

        <!-- Usuario -->
        <div class="text-left mb-4">
          <label class="font-semibold block mb-2">Usuario Unibagué</label>
          <input
            v-model="user.value"
            placeholder="julio.buitrago"
            class="rounded border px-3 py-2 w-full">
        </div>

        <!-- Rol -->
        <div class="text-left mb-4">
          <label class="font-semibold block mb-2">Eres un ...</label>
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
            :disabled="!isFormValid || isProcessing"
            @click="submitForm"
            class="rounded py-2 text-center w-full font-semibold transition
                   flex items-center justify-center gap-2 text-white"
            :class="!isFormValid || isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#0f1f39] hover:bg-[#162d5a]'">

            <span
              v-if="isProcessing"
              class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>

            <span>{{ isProcessing ? 'Procesando...' : 'Recuperar' }}</span>
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
          :class="notFound ? 'text-red-700' : 'text-green-700'">
          {{ message }}
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
import valid from "@/helpers/valid_email";
import axios from "axios";

export default {
  name: "RecoverPassword",
  components: {
    MainLayout
  },
  data() {
    return {
      isProcessing: false,
      notFound: true,
      showForm: true,
      message: 'Ha ocurrido un error. Por favor vuelve a intentarlo',
      user: {
        value: '',
        errors: []
      },
      role: {
        value: 0,
      }
    }
  },
  methods: {
    async submitForm() {
      this.isProcessing = true;
      //Validar que el formulario esté bien

      if (!this.isFormValid) {
        return;
      }

      const domain = process.env.VUE_APP_DOMAIN;
      const url = domain + '/recoverPassword';

      const data = {
        user: this.user.value,
        role: this.role.value,
      }
      try {
        let request = await axios.post(url, data);
        this.message = request.data.message;
        this.notFound = false;
      } catch (e) {
        this.message = e.response.data.message
      }
      this.showForm = false;
      this.isProcessing = false;
    },
    getIcon(errorName) {
      if (this.user.value.length === 0) {
        return '';
      }
      if (this.user.errors.includes(errorName)) {
        return '<i class="fa-solid fa-circle-xmark" style="color:red"></i>';
      } else {
        return '<i class="fa-solid fa-circle-check" style="color:green"></i>';
      }
    }
  },
  /*watch: {
    'user.value'(newValue) {
      if (valid(newValue)) {
        this.user.errors = [];
      } else {
        if (!this.user.errors.includes('NOT_VALID_EMAIL')) {
          this.user.errors.push('NOT_VALID_EMAIL');
        }
      }
    },
  },*/
  computed: {
    isFormValid() {
      return (this.user.value.length > 0);
      // return (this.user.value.length > 0 && !this.user.errors.includes('NOT_VALID_EMAIL'));
    }
  }
}
</script>
