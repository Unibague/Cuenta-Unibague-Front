<template>
  <MainLayout>
    <div class="h-full w-full flex flex-col items-center justify-center">
      <div class="mb-10">
        <h1 class="text-3xl p-1">
          Cambiar correo alterno
        </h1>
        <p class="text-lg p-1">
          Si deseas cambiar tu correo alterno ingresa el siguiente formulario
        </p>
      </div>


      <div v-if="showForm"
           class="p-5 border shadow rounded-lg bg-gray-100  md:w-1/2 lg:w-1/4">
        <div class="text-left my-4">
          <label for="user" class="font-semibold block my-2">Usuario Unibagué</label>
          <input type="text" id="user" v-model="user.value" placeholder="Miguel.Mateus"
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

        <div class="text-left mt-4">
          <label for="alternateEmail" class="font-semibold block my-2">Nuevo correo alterno</label>
          <input type="text" id="alternateEmail" v-model="alternateEmail.value"
                 class="rounded border px-3 py-1 w-full">

          <p class="mt-3">
            <span v-html="getIcon('NOT_VALID_EMAIL','alternateEmail')"></span>
            Debe ingresar un correo válido
          </p>

        </div>

        <div class="text-left mt-4">
          <label for="confirmAlternateEmail" class="font-semibold block my-2">Confirmacion correo alterno</label>
          <input type="text" id="confirmAlternateEmail" v-model="confirmAlternateEmail.value"
                 class="rounded border px-3 py-1 w-full">
          <p class="mt-3" v-if="(confirmAlternateEmail.value !== '' && confirmAlternateEmail.errors.length > 0)">
            Debe coincidir con el valor ingresado anteriormente
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 justify-between w-full mt-4 ">
          <div class="">
            <router-link class="rounded py-2 text-center w-full bg-gray-200 block"
                         :to="{name:'home'}">
              Ir atrás
            </router-link>
          </div>

          <div class="">
            <button
                :disabled="(!isFormValid || isProcessing)"
                :class="{'cursor-not-allowed':(!isFormValid || isProcessing)}"
                @click="submitForm"
                style="background-color: #0f1f39"
                class="rounded py-2 text-center w-full text-white">
              Cambiar
            </button>
          </div>
        </div>

      </div>

      <div v-else
           class="p-5 border shadow rounded-lg bg-gray-100 md:w-1/2 lg:w-1/4">
        <p>
          {{ message }}
        </p>

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
