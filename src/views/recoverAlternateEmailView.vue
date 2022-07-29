<template>

</template>

<script>
// @ is an alias to /src

import router from "@/router";

export default {
  name: 'recoverAlternateEmailView',
  beforeMount() {
    window.open('https://forms.gle/Ri5Z5aHtX2RrUJbp9', '_blank');
    router.push({name: 'home'})
  }
}
</script>
