<template>
<div class="min-h-screen flex flex-col">
    <Menu></Menu>
    <!--CONTENIDO-->
    <slot></slot>
    <Footer></Footer>
  </div>

</template>

<script>
// @ is an alias to /src
import Footer from "@/components/Footer";
import Menu from "@/components/Menu";

export default {
  name: 'MainLayout',
  components: {
    Footer,
    Menu
  },

}
</script>
