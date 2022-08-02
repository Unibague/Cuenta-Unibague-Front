<template>
  <MainLayout>
    <div class="h-full w-full flex flex-col items-center justify-center">
      <div class="mb-10">
        <h1 class="text-3xl p-1">
          Recuerda tu usuario Unibague
        </h1>
        <p class="text-lg p-1">
          Si deseas recordar tu usuario ingresa tu numero de documento (Sin puntos o comas)
        </p>
      </div>


      <div v-if="showForm"
           class="p-5 border shadow rounded-lg bg-gray-100  md:w-1/2 lg:w-1/4">
        <div class="text-left my-4">
          <label for="Ndocument" class="font-semibold block my-2">Numero de documento</label>
          <input type="text" id="Ndocument" v-model="documentNumber.value" placeholder=""
                 class="rounded border px-3 py-1 w-full">
        </div>

        <div class="text-left my-4">
          <label for="birthday" class="font-semibold block my-2">Fecha de nacimiento</label>
          <input class="rounded border px-3 py-1 w-full" type="date" v-model="birthday.value" id="birthday"/>
        </div>


        <div class="text-left my-4">
          <label for="role" class="font-semibold block my-2">Eres un</label>
          <select class="rounded border px-3 py-1.5 w-full bg-white" type="date" v-model="role.value" id="role">
            <option value="0">Estudiante o egresado</option>
            <option value="1">Administrativo</option>
          </select>
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
                :disabled="!isFormValid"
                :class="{'cursor-not-allowed':!isFormValid}"
                @click="submitForm"
                class=" rounded py-2 text-center w-full text-white" style="background-color: #0f1f39">
              Recordar
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
      message: 'Numero de documento no encontrado',
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
      const domain = 'http://cuenta-unibague.test';
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
        this.message = e.response.data.message
      }
      this.showForm = false;
    },

  },

}
</script>