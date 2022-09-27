<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App',
  async mounted () {
    await this.universalL()
  },
  methods: {
    async universalL () {
      const vm = this
      if (this.$q.platform.is.mobile) { // Si es teléfono
        await universalLinks.subscribe('ul_recuperar', function (eventData) {
          // do some work
          // alert('Did launch application from the link: ' + eventData.url)
          vm.$router.push('/recuperacion/' + eventData.params.codigo)
        })
      }
    }
  }
}
</script>
