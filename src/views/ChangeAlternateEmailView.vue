<template>
  <MainLayout>
    <div class="min-h-screen w-full flex flex-col items-center justify-start pt-10 px-4">

      <!-- HEADER -->
      <div class="mb-10 text-center">
        <h1 class="text-2xl font-semibold mb-2">
          Cambiar correo alterno
        </h1>
        <p class="text-base text-gray-600">
          Ingresa la información solicitada para actualizar tu correo alterno.
        </p>
      </div>

      <!-- FORM -->
      <div
        v-if="showForm"
        class="w-full max-w-md sm:max-w-lg lg:max-w-xl
               px-6 py-6 border shadow-md rounded-xl bg-gray-100">

        <!-- Usuario -->
        <div class="text-left mb-4">
          <label class="font-semibold block mb-2">Usuario Unibagué</label>
          <input
            v-model="user.value"
            placeholder="miguel.mateus"
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

        <!-- Password -->
        <div class="text-left mb-4">
          <label class="font-semibold block mb-2">Contraseña actual</label>
          <input
            type="password"
            v-model="password.value"
            class="rounded border px-3 py-2 w-full">
        </div>

        <hr class="my-5 border-gray-300">

        <!-- Correo alterno -->
        <div class="text-left mb-4">
          <label class="font-semibold block mb-2">Nuevo correo alterno</label>
          <input
            v-model="alternateEmail.value"
            placeholder="correo@ejemplo.com"
            class="rounded border px-3 py-2 w-full">

          <p class="mt-2 text-sm text-gray-700 flex items-center gap-2">
            <span v-html="getIcon('NOT_VALID_EMAIL','alternateEmail')"></span>
            Debe ingresar un correo válido
          </p>
        </div>

        <!-- Confirmación -->
        <div class="text-left mb-4">
          <label class="font-semibold block mb-2">Confirmar correo alterno</label>
          <input
            v-model="confirmAlternateEmail.value"
            class="rounded border px-3 py-2 w-full">

          <p
            v-if="confirmAlternateEmail.errors.length"
            class="mt-2 text-sm text-red-600">
            Los correos no coinciden
          </p>
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
                   flex items-center justify-center gap-2"
            :class="isProcessing || !isFormValid
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-[#0f1f39] text-white hover:bg-[#162d5a]'">

            <span
              v-if="isProcessing"
              class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>

            <span>{{ isProcessing ? 'Procesando...' : 'Cambiar' }}</span>
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
  name: "ChangeAlternateEmailView",
  components: {
    MainLayout
  },
  data() {
    return {
      isProcessing:false,
      notFound: false,
      showForm: true,
      message: 'Ha ocurrido un error. Por favor vuelve a intentarlo',
      user: {
        value: '',
      },
      password: {
        value: ''
      },
      role: {
        value: 0
      },
      alternateEmail: {
        value: '',
        errors: []
      },
      confirmAlternateEmail: {
        value: '',
        errors: []
      }
    }
  },

  methods: {
    async submitForm() {
      //Validar que el formulario esté bien
      if (!this.isFormValid) {
        return;
      }
      this.isProcessing = true;
      const domain = process.env.VUE_APP_DOMAIN;
      const url = domain + '/changeAlternateEmail';

      const data = {
        user: this.user.value,
        alternateEmail: this.alternateEmail.value,
        confirmAlternateEmail: this.confirmAlternateEmail.value,
        password: this.password.value,
        role: this.role.value,
      }
      try {
        let request = await axios.post(url, data);
        this.message = request.data.message;
        this.notFound = false;
      } catch (e) {
        this.notFound = true;
        this.message = e.response.data.message
      }
      this.isProcessing = false;
      this.showForm = false;
    },
    getIcon(errorName, property) {
      if (this[property].value.length === 0) {
        return '';
      }
      if (this[property].errors.includes(errorName)) {
        return '<i class="fa-solid fa-circle-xmark" style="color:red"></i>';
      } else {
        return '<i class="fa-solid fa-circle-check" style="color:green"></i>';
      }
    }
  },
  watch: {

    'alternateEmail.value'(newValue, oldValue) {
      if (valid(newValue)) {
        this.alternateEmail.errors = [];
      } else {
        if (!this.alternateEmail.errors.includes('NOT_VALID_EMAIL')) {
          this.alternateEmail.errors.push('NOT_VALID_EMAIL');
        }
      }
    },
    'confirmAlternateEmail.value'(newValue, oldValue) {
      if (newValue === this.alternateEmail.value) {
        this.confirmAlternateEmail.errors = [];
      } else {
        if (!this.confirmAlternateEmail.errors.includes('NOT_EQUAL_EMAIL')) {
          this.confirmAlternateEmail.errors.push('NOT_EQUAL_EMAIL');
        }
      }
    }
  },

  computed: {
    isFormValid() {

      return (this.confirmAlternateEmail.errors.length === 0
          && this.alternateEmail.errors.length === 0
          && this.user.value !== ''
          && this.confirmAlternateEmail.value !== ''
          && this.alternateEmail.value !== '');
    },

  }
}
</script>
