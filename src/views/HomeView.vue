<template>
  <MainLayout>
    <div class="min-h-screen w-full px-6 sm:px-10 lg:px-44 py-10">

      <!-- HEADER -->
      <div class="mb-10 text-center">
        <h1 class="text-3xl font-semibold mb-2">
          Servicios para tu cuenta Unibagué
        </h1>
        <p class="text-gray-600 text-base">
          Selecciona el servicio que deseas gestionar
        </p>
      </div>

      <!-- CARDS -->
      <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
        <router-link
          v-for="item in items"
          :key="item.title"
          :to="item.to"
          class="group h-56 p-8 flex flex-col justify-center items-center
                 rounded-2xl shadow-lg cursor-pointer
                 transition transform
                 bg-[#0f1f39] text-white
                 hover:-translate-y-1 hover:shadow-2xl">

          <i
            :class="item.icon"
            class="fa-3x mb-5 transition group-hover:scale-110">
          </i>

          <h2 class="font-semibold text-lg text-center">
            {{ item.title }}
          </h2>
        </router-link>
      </div>

    </div>
  </MainLayout>
</template>


<script>
// @ is an alias to /src

import MainLayout from "@/layouts/MainLayout";

export default {
  name: 'HomeView',
  components: {
    MainLayout,
  },
  data() {
    return {
      items: [
        {
          title: 'Cambio de contraseña',
          icon: 'fa-solid fa-arrows-rotate',
          to: {name: 'changePasswordView'}
        },
        {
          title: 'Recuperar contraseña',
          icon: 'fa-solid fa-unlock',
          to: {name: 'recoverPassword'}
        },
        {
          title: 'Olvidé mi usuario',
          icon: 'fa-solid fa-user-xmark',
          to: {name: 'RememberEmailView'}
        },

        {
          title: 'Cambiar correo alterno',
          icon: 'fa-solid fa-envelope',
          to: {name: 'changeAlternateEmailView'}
        },
        {
          title: 'Perdí acceso a mi correo alterno',
          icon: 'fa-solid fa-circle-exclamation',
          to: {name: 'recoverAlternateEmailView'}
        },
      ]
    }
  }
}
</script>
