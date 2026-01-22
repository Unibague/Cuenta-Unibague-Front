<template>
  <MainLayout>
    <div class="min-h-screen w-full flex flex-col items-center justify-start pt-10 px-4">

      <!-- HEADER -->
      <div class="mb-10 text-center">
        <h1 class="text-2xl font-semibold mb-2">
          Cambio de contraseña
        </h1>
        <p class="text-base text-gray-600">
          Diligencia los campos solicitados para actualizar tu contraseña.
        </p>
      </div>

      <!-- FORM -->
      <div
        v-if="showForm"
        class="w-full max-w-md sm:max-w-lg lg:max-w-xl
               px-6 py-6 border shadow-md rounded-xl bg-gray-100">

        <!-- SIN TOKEN -->
        <template v-if="!isVerified">
          <div class="text-left mb-4">
            <label class="font-semibold block mb-2">Usuario Unibagué</label>
            <input
              v-model="user.value"
              placeholder="juan.ospina"
              class="rounded border px-3 py-2 w-full">
          </div>

          <div class="text-left mb-4">
            <label class="font-semibold block mb-2">Eres un ...</label>
            <select
              v-model.number="role.value"
              class="rounded border px-3 py-2 w-full bg-white">
              <option :value="0">Estudiante o egresado</option>
              <option :value="1">Administrativo</option>
            </select>
          </div>

          <div class="text-left mb-4">
            <label class="font-semibold block mb-2">Contraseña actual</label>
            <input
              type="password"
              v-model="password.value"
              class="rounded border px-3 py-2 w-full">
          </div>

          <hr class="my-5 border-gray-300">
        </template>

        <!-- NUEVA CONTRASEÑA -->
        <div class="text-left mb-4">
          <label class="font-semibold block mb-2">Nueva contraseña</label>
          <input
            type="password"
            v-model="newPassword.value"
            class="rounded border px-3 py-2 w-full">

          <div class="mt-4 space-y-1 text-sm text-gray-700">
            <p class="flex items-center gap-2">
              <span v-html="getIcon('UPPERCASE')"></span> Letras mayúsculas
            </p>
            <p class="flex items-center gap-2">
              <span v-html="getIcon('LOWERCASE')"></span> Letras minúsculas
            </p>
            <p class="flex items-center gap-2">
              <span v-html="getIcon('MIN_LENGTH')"></span> Mínimo 8 caracteres
            </p>
            <p class="flex items-center gap-2">
              <span v-html="getIcon('DIGITS')"></span> Al menos un número
            </p>
          </div>
        </div>

        <!-- CONFIRM -->
        <div class="text-left mb-4">
          <label class="font-semibold block mb-2">
            Confirmar contraseña
          </label>
          <input
            type="password"
            v-model="confirmNewPassword.value"
            class="rounded border px-3 py-2 w-full">

          <p
            v-if="confirmNewPassword.errors"
            class="mt-2 text-sm text-red-600">
            {{ confirmNewPassword.errors }}
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
            :disabled="!isFormValid"
            @click="submitForm"
            class="rounded py-2 text-center w-full font-semibold transition
                   flex items-center justify-center
                   text-white"
            :class="!isFormValid
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#0f1f39] hover:bg-[#162d5a]'">
            Cambiar
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
import {validate} from 'secure-password-validator'
import axios from "axios";

export default {
  name: "ChangePasswordView",
  components: {
    MainLayout

  },
  data() {
    return {
      notFound: true,
      isVerified: false,
      token: '',
      message: '',
      showForm: true,
      user: {
        value: ''
      },
      password: {
        value: '',
      },
      role: {
        value: 0,
      },
      newPassword: {
        value: '',
        errors: ''
      },
      confirmNewPassword: {
        value: '',
        errors: ''
      },
    }
  },

  created() {
    this.isVerified = true;
    this.verifyHasToken();
  },

  computed: {
    isFormValid() {
      return (this.newPassword.value.length > 0 && this.newPassword.errors.length === 0 && this.confirmNewPassword.value === this.newPassword.value);
    }
  },
  methods: {
    async verifyHasToken() {
      const token = this.$route.query.token;
      //undefined, null, or empty string are not allowed
      if (token === undefined || token === null || token === '') {
        this.isVerified = false;
        return;
      }
      this.token = token;
      //The user provided a token, lets check if is a valid token
      const domain = process.env.VUE_APP_DOMAIN;
      const url = domain + '/verifyToken';

      const data = {
        token: this.token,
      }

      try {
        await axios.post(url, data);
        this.isVerified = true;
      } catch (e) {
        this.isVerified = false;
      }
    },

    async submitForm() {
      if (!this.isFormValid) {
        return;
      }
      const role = Number(this.role.value);
      const domain = process.env.VUE_APP_DOMAIN;
      const url = domain + '/changePassword';
      let data = {};
     if (this.isVerified) {
  data = {
    newPassword: this.newPassword.value,
    confirmNewPassword: this.confirmNewPassword.value,
    token: this.token,
    role: role
  }
} else {
  data = {
    user: this.user.value,
    password: this.password.value,
    newPassword: this.newPassword.value,
    confirmNewPassword: this.confirmNewPassword.value,
    role: role
  }
}


      try {
        let request = await axios.post(url, data);
        this.message = request.data.message;
        this.notFound = false;
      } catch (e) {
        this.notFound = true;
        this.message = e.response.data.message
      }
      this.showForm = false;
    },

    getIcon(errorName) {
      if (this.newPassword.value.length === 0) {
        return '';
      }
      if (this.newPassword.errors.includes(errorName)) {
        return '<i class="fa-solid fa-circle-xmark" style="color:red"></i>';
      } else {
        return '<i class="fa-solid fa-circle-check" style="color:green"></i>';
      }
    }
  },
  watch: {
    'newPassword.value'(newValue, oldValue) {
      const options = {
        digits: true,
        letters: true,
        uppercase: true,
        lowercase: true
      }
      const result = validate(newValue, options);
      this.newPassword.errors = result.errors;
    },
    'confirmNewPassword.value'(newValue, oldValue) {
      if (newValue !== this.newPassword.value) {
        this.confirmNewPassword.errors = 'Las contraseñas no coinciden'
      } else {
        this.confirmNewPassword.errors = ''
      }
    }
  }
}
</script>
