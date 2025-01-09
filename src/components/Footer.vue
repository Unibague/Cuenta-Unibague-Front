<template>
  <div class="h-14 flex items-center justify-center w-full" style="background-color:#0d0d0d">
    <span class="text-white text-bold">Unibagué {{year}}</span>
  </div>
</template>

<script>
export default {
  name: "Footer",

  data() {
    return {
      year: "", // Reactive property for the year
    };
  },

  created() {
    this.getYear(); // Call the method to set the year
  },

  methods: {
    getYear() {
      this.year = new Date().getFullYear(); // Set the current year
    },
  },

}

function getYear(){
  this.year = new Date().getFullYear()
}


</script>

<style scoped>

</style>