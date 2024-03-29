<template>
  <MainLayout>
    <div class="h-full w-full flex flex-col items-center justify-center">
      <div class="mb-10">
        <h1 class="text-3xl">
          Cambio de contraseña
        </h1>
        <p class="text-lg">
          Si deseas cambiar tu contraseña, por favor diligencia los campos solicitados.
        </p>
      </div>
      <!--FORM CONTAINER-->
      <div v-if="showForm" class="px-3 py-4 border shadow rounded-lg bg-gray-100  md:w-1/2 lg:w-1/4">

        <template v-if="!isVerified">
          <div class="text-left mb-2">
            <label for="user" class="font-semibold block mb-2">Usuario Unibagué</label>
            <input type="text" id="user" v-model="user.value" placeholder="juan.ospina"
                   class="rounded border px-3 py-1 w-full">
          </div>

          <div class="text-left my-4">
            <label for="role" class="font-semibold block my-2">Eres un ...</label>
            <select class="rounded border px-3 py-1.5 w-full bg-white" type="date" v-model="role.value" id="role">
              <option value="0">Estudiante o egresado</option>
              <option value="1">Administrativo</option>
            </select>
          </div>

          <div class="text-left mt-4">
            <label for="password" class="font-semibold block my-2">Contraseña actual</label>
            <input type="password" id="password" v-model="password.value"
                   class="rounded border px-3 py-1 w-full">
          </div>
        </template>

        <div class="text-left mt-4">
          <label for="newPassword" class="font-semibold block my-2">Nueva contraseña</label>

          <input type="password" id="newPassword" v-model="newPassword.value"
                 class="rounded border px-3 py-1 w-full">
          <p class="mt-3">
            <span v-html="getIcon('UPPERCASE')"></span>
            Debe contener letras mayúsculas
          </p>
          <p>
            <span v-html="getIcon('LOWERCASE')"></span>
            Debe contener letras minúsculas
          </p>
          <p>
            <span v-html="getIcon('MIN_LENGTH')"></span>
            Debe tener una longitud de mínimo 8 caracteres
          </p>
          <p>
            <span v-html="getIcon('DIGITS')"></span>
            Debe contener al menos un número
          </p>

        </div>
        <div class="text-left mt-3">
          <label for="confirmNewPassword" class="font-semibold block my-2">Confirma tu nueva contraseña</label>
          <input type="password" id="confirmNewPassword" v-model="confirmNewPassword.value"
                 class="rounded border px-3 py-1 w-full">
          <p class="mt-2">
            {{ confirmNewPassword.errors }}
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 justify-between w-full mt-4 ">
          <div>
            <router-link class="rounded py-2 text-center w-full bg-gray-200 block"
                         :to="{name:'home'}">
              Ir atrás
            </router-link>
          </div>
          <div>
            <button
                :disabled="!isFormValid"
                :class="{'cursor-not-allowed':!isFormValid}"
                class="rounded py-2 text-center w-full text-white" style="background-color: #0f1f39"
                @click="submitForm">
              Cambiar
            </button>
          </div>
        </div>

      </div>
      <!--message container-->
      <div v-else class="px-3 py-4 border shadow rounded-lg bg-gray-100  md:w-1/2 lg:w-1/4">
        {{ message }}

        <button v-if="notFound"
                @click="showForm = true"
                class=" rounded py-2 text-center mt-3 w-full text-white" style="background-color: #0f1f39">
          Ir atrás
        </button>

        <router-link v-else
                     class="rounded py-2 text-center mt-3 w-full text-white block" style="background-color: #0f1f39"
                     :to="{name: 'home'}">
          Ir atrás
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
    // this.verifyHasToken();
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
      const domain = process.env.VUE_APP_DOMAIN;
      const url = domain + '/changePassword';
      let data = {};
      if (this.isVerified) {
        data = {
          newPassword: this.newPassword.value,
          confirmNewPassword: this.confirmNewPassword.value,
          token: this.token,
          role: this.role.value
        }
      } else {
        data = {
          user: this.user.value,
          password: this.password.value,
          newPassword: this.newPassword.value,
          confirmNewPassword: this.confirmNewPassword.value,
          role: this.role.value
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
