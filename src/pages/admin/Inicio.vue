<template>
  <div>
    <div class="text-h5 text-grey-8 q-mt-lg q-px-md"><b class="text-black">Hola {{user.roles && user.roles[0] === 0 ? 'Administrador' : user.name}},</b> tus analíticas están listas</div>
    <div class="row q-pa-md">
          <div class="col-xs-12 col-sm-12 col-md-6 q-px-md q-mb-sm">
              <q-card class="row items-center justify-between no-wrap" style="height:100%; border-radius: 15px">
                  <div class="q-pa-md">
                      <div class="text-h6 text-grey-8 ellipsis">Escenario actual</div>
                      <div class="text-primary text-h4 text-bold">0%</div>
                      <div class="text-grey-8 ellipsis-2-lines">Las estadísticas actuales explican la nueva forma actual de inversión</div>
                  </div>
                  <q-img src="image 56.png" style="width:450px; height: 100%; border-radius: 15px" />
              </q-card>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 q-px-md q-mb-sm">
              <q-card class="text-white bg-primary q-pa-md" style="height:100%; border-radius: 15px">
                <div class="text-h6">Escenario actual</div>
                <div class="text-h4 text-bold">0.00€</div>
                <div class="text-subtitle2">Facturación estimada</div>
                <div class="text-subtitle2">Ciclo del més actual</div>
              </q-card>
          </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {}
    }
  },
  mounted () {
    this.getUser()
  },
  methods: {
    getUser () {
      this.$api.get('user_logueado').then(v => {
        if (v) {
          this.user = v
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.bordes {
  border-left: 6px solid $primary;
  background-color: rgba(202, 202, 202, 0.474);
  border-radius: 12px;
}
.estilo-titulos {
  background-color: #fff599;
  width: 250px;
  border-radius: 12px
}
</style>>
