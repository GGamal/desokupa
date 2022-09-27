<template>
  <div class="row justify-center">
    <div class="absolute-center row justify-center items-start bg-white q-pt-xl" style="width:80%">
      <div class="column col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 bg-primary q-pa-md">
        <div class="text-white text-h6 q-pb-md">Hola, Bienvenidos de nuevo</div>
        <div class="text-white text-h5">Inicio de sesión</div>
        <div class="col-xs-12 col-sm-6 q-ma-sm col-md-6 col-lg-6">

          <div class="q-mb-sm text-white text-caption">Correo</div>
          <q-input dense type="email" v-model="form.email" placeholder="Correo electrónico" bg-color="white" filled :error="$v.form.email.$error" error-message="Este campo es requerido" @blur="$v.form.email.$touch()" >
            <template v-slot:prepend>
              <q-icon name="mail_outline" color= "secondary" />
            </template>
          </q-input>
          <div class="q-mb-sm text-white text-caption"> Contraseña</div>
          <q-input dense :type="isPwd ? 'password' : 'text'" v-model="form.password" placeholder="Contraseña" bg-color="white" filled :error="$v.form.password.$error" error-message="Este campo es requerido" @blur="$v.form.password.$touch()" >
            <template v-slot:prepend>
              <q-icon name="vpn_key" color= "secondary" />
            </template>
          </q-input>
        </div>

        <div class="col-xs-12 col-sm-6 q-ma-sm col-md-6 col-lg-6">
          <q-btn class="full-width q-py-xs" color="secondary" :loading="loading"
            @click="onSubmit()" no-caps>
              <div class="text-primary text-subtitle1 text-bold">Empezar ahora</div>
              <template v-slot:loading>
                <q-spinner-hourglass class="on-center" />
                Cargando...
              </template>
          </q-btn>
        </div>
        <div class="row justify-center q-pb-md">
          <div class="text-caption text-white" style="cursor:pointer" @click="cambio = true">¿Olvidaste tu contraseña?</div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
        <div class="row justify-center q-pt-lg">
          <img src="logo.png" style="width:260px" />
        </div>
        <div class="q-pt-xl">
          <img src="image 1.png" style="width: 100%" />
        </div>
      </div>
      <!-- <div class="absolute-bottom-left">
        <q-btn label="RunSeeds" flat color="primary" @click="runSeeds()"/>
        <q-btn label="DropBd" flat color="primary" @click="dropDB()"/>
      </div> -->
    </div>

    <q-dialog v-model="cambio">
      <q-card class="column items-center justify-center q-px-xl q-pb-xl">
        <div class="text-h6 q-py-lg">¿Olvidaste tu contraseña?</div>
        <q-input rounded outlined v-model="email" label="Introduce tu correo aqui" autofocus>
            <template v-slot:prepend>
              <q-icon color="primary" name="mail" />
            </template>
        </q-input>
        <div class="row justify-center q-pt-xl">
            <q-btn
              :loading="loading2"
              outlined
              no-caps
              color="primary"
              @click="recuperar()"
            >Recuperar contraseña
            <template v-slot:loading>
              <q-spinner-hourglass class="on-center" />
              Cargando...
            </template>
            </q-btn>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      form: {},
      isPwd: true,
      cambio: false,
      email: '',
      loading2: false,
      loading: false,
      user: {}
    }
  },
  validations: {
    form: {
      email: { required },
      password: { required }
    }
  },
  methods: {
    ...mapMutations('generals', ['login']),
    ...mapActions('generals', ['saveUser']),
    onSubmit () {
      this.$v.$touch()
      if (!this.$v.form.$error) {
        this.loading = true
        this.$q.loading.show({
          message: 'Iniciando sesión'
        })
        this.$api.post('login', this.form).then(res => {
          if (res) {
            this.user = res.TRI_SESSION_INFO

            this.login(res)
            if (this.user.roles[0] === 0) {
              this.$router.push('/contratos_aprobados')
            } else if (this.user.roles[0] === 1) {
              this.$router.push('/contratos_aprobados')
            } else if (this.user.roles[0] === 2) {
              this.$router.push('/inicio/inmobiliaria')
            } else if (this.user.roles[0] === 3) {
              this.$router.push('/operarios')
            } else if (this.user.roles[0] === 4) {
              this.$router.push('/legal/contratos_disponibles')
            } else if (this.user.roles[0] === 5) {
              this.$router.push('/contratos_asignados')
            } else if (this.user.roles[0] === 6) {
              this.$router.push('/presupuestos')
            }
          } else {
            console.log('error de ususario')
            this.loading = false
            this.$q.loading.hide()
          }
          this.$q.loading.hide()
          this.loading = false
        })
      }
    },
    async recuperar () {
      if (this.email) {
        this.simulateProgress()
        // this.loading2 = true
        this.$q.loading.show()
        await this.$api.get('email_send_app/' + this.email).then(res => {
          this.$q.loading.hide()
          if (res) {
            this.$q.notify({
              message: 'Se envio un correo para recuperar tu contraseña',
              color: 'positive'
            })
          }
        })
      } else {
        this.$q.notify({
          message: 'Campo Vacio',
          color: 'negative'
        })
        // this.loading2 = false
      }
      // this.loading2 = false
    },
    async dropDB () {
      this.$q.loading.show({
        message: 'Borrando DB'
      })
      await this.$api.delete('/dropDB').then(res => {
        if (res) {
          this.$q.notify({
            message: 'Se ha borrado la DB correctamente',
            color: 'positive'
          })
          this.$q.loading.hide()
        }
      })
    },
    async runSeeds () {
      this.$q.loading.show({
        message: 'Creando Seeders'
      })
      await this.$api.post('/runSeeds').then(res => {
        if (res) {
          this.$q.notify({
            message: 'Se han creado los seeders correctamente',
            color: 'positive'
          })
          this.$q.loading.hide()
        }
      })
    },
    simulateProgress () {
      this.loading2 = true
      // simulate a delay
      setTimeout(() => {
        // we're done, we reset loading state
        this.loading2 = false
      }, 5000)
    }
  }
}
</script>
