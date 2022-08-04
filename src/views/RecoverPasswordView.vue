<template>
  <MainLayout>
    <div class="h-full w-full flex flex-col items-center justify-center">
      <div class="mb-10">
        <h1 class="text-3xl p-1">
          Recuperar contraseña
        </h1>
      </div>

      <div v-if="showForm"
           class="p-5 border shadow rounded-lg bg-gray-100 md:w-1/2 lg:w-1/3">
        <div class="text-left my-4">
          <label for="user" class="font-semibold block my-2">Usuario Unibagué</label>
          <input type="user" id="user" v-model="user.value" placeholder="julio.buitrago"
                 class="rounded border px-3 py-1 w-full">

          <!--          <p class="mt-3">
                      <span v-html="getIcon('NOT_VALID_EMAIL')"></span>
                      Debes ingresar un correo válido
                    </p>-->

        </div>

        <div class="text-left my-4">
          <label for="role" class="font-semibold block my-2">Eres un ...</label>
          <select class="rounded border px-3 py-1.5 w-full bg-white" type="date" v-model="role.value" id="role">
            <option value="0">Estudiante o egresado</option>
            <option value="1">Administrativo</option>
          </select>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 justify-between w-full mt-4 ">

          <div class="">

            <router-link class="rounded py-2 text-center w-full bg-gray-200 block mt-2"
                         :to="{name:'home'}">
              Ir atrás
            </router-link>
          </div>

          <div class="">
            <button
                :disabled="(!isFormValid || isProcessing)"
                :class="{'cursor-not-allowed':(!isFormValid || isProcessing)}"
                @click="submitForm"
                class="rounded py-2 text-center w-full text-white mt-2" style="background-color: #0f1f39">
              Recuperar
            </button>
          </div>
        </div>

      </div>

      <div v-else
           class="p-5 border shadow rounded-lg bg-gray-100  md:w-1/2 lg:w-1/4">
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
