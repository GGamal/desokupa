<template>
  <div class="q-pa-lg">
    <div class="row justify-center">
      <img src="logo.png" style="width:260px" />
    </div>
    <div class="q-my-lg text-center text-h5 text-bold text-grey-8">{{!edit ? 'REGISTRO DE COMERCIAL' : 'EDICIÓN DE COMERCIAL'}}</div>

    <q-card class="q-pa-md">
      <div v-if="edit" class="row justify-end">
        <q-btn no-caps color="primary" label="Cambiar contraseña"
        @click="formPass = {}, $v.formPass.$reset(), verPassword = true" />
      </div>

      <div class="row items-center">
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            Nombre
            <q-input outlined v-model="form.name"  dense placeholder="Ingrese el nombre"
            error-message="Este campo es requerido" :error="$v.form.name.$error" @blur="$v.form.name.$touch()"/>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            Apellidos
            <q-input outlined v-model="form.last_name"  dense placeholder="Ingrese los apellidos"
            error-message="Este campo es requerido" :error="$v.form.last_name.$error" @blur="$v.form.last_name.$touch()"/>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            DNI
            <q-input outlined v-model="form.dni"  dense placeholder="Ingrese el DNI"
            error-message="Este campo es requerido" :error="$v.form.dni.$error" @blur="$v.form.dni.$touch()"/>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            Email
            <q-input :readonly="!edit ? false : true" outlined v-model="form.email"  dense placeholder="Ingrese el email"
            error-message="Este campo es requerido" :error="$v.form.email.$error" @blur="$v.form.email.$touch()"/>
          </div>
          <div v-if="!edit" class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            Contraseña
            <q-input outlined :type="ver ? 'text' : 'password'" v-model="password" dense placeholder="Ingrese la contraseña"
              error-message="Ingrese una contraseña válida, mínimo 6 caracteres" :error="$v.password.$error" @blur="$v.password.$touch()">
                <template v-slot:append>
                  <q-icon :name="ver ? 'visibility_off' : 'visibility'" class="cursor-pointer q-pa-sm" color="primary" @click="ver = !ver" />
                </template>
            </q-input>
          </div>
          <div v-if="!edit" class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            Repite Contraseña
            <q-input outlined :type="ver ? 'text' : 'password'" v-model="repeatPassword" dense placeholder="Repita la Contraseña"
              error-message="Las contraseñas deben ser iguales" :error="$v.repeatPassword.$error" @blur="$v.repeatPassword.$touch()"/>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-px-xs">
            Telefono1
            <q-input type="tel" outlined v-model="form.phone1"  dense placeholder="Ingrese un teléfono"
            error-message="Este campo es requerido" :error="$v.form.phone1.$error" @blur="$v.form.phone1.$touch()"/>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            Telefono2
            <q-input type="tel" outlined v-model="form.phone2"  dense placeholder="Ingrese otro teléfono"/>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            Dirección
            <q-input outlined v-model="form.direccion"  dense placeholder="Ingrese la dirección"
            error-message="Este campo es requerido" :error="$v.form.direccion.$error" @blur="$v.form.direccion.$touch()"/>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            Provincia
            <q-select v-model="provincia" outlined dense color="black" :options="provincias" label="Seleccione la provincia" map-options option-label="name" emit-value @input="localidadPorId(provincia.id)" error-message="Este campo es requerido" :error="$v.provincia.$error" @blur="$v.provincia.$touch()"/>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            Localidad
            <q-select v-model="localidad" outlined dense color="black" :options="localidades" label="Seleccione la localidad" map-options option-label="nameFull" emit-value @input="form.cp = localidad.cp" error-message="Este campo es requerido" :error="$v.localidad.$error" @blur="$v.localidad.$touch()">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-italic text-grey-8">
                    Selecciona una provincia
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            C.P
            <q-input readonly outlined v-model="form.cp"  dense placeholder="Ingrese el C.P" error-message="Este campo es requerido" :error="$v.form.cp.$error" @blur="$v.form.cp.$touch()"/>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            Cuenta corriente
            <q-input outlined v-model="form.cuenta" dense placeholder="Ingrese la cuenta corriente"
            error-message="Este campo es requerido" :error="$v.form.cuenta.$error" @blur="$v.form.cuenta.$touch()"/>
          </div>
      </div>
      <div class="row justify-center q-mt-lg">
        <q-btn color="primary" label="Guardar" style="width: 100%;"
          @click="!edit ? registrar() : actualizar()"/>
        </div>
    </q-card>

    <q-dialog v-model="verPassword">
      <q-card class="q-pa-none" style="width:100%">
        <div class="row justify-between q-pa-sm bg-primary" style="width:100%">
          <img src="desocupa 1.png" style="width:150px" />
          <q-btn round flat color="white" icon="clear" v-close-popup />
        </div>
        <div class="text-grey-8 text-center text-h5 q-mt-md">Cambiar contraseña</div>
        <div class="q-px-lg q-pb-xl">
          <div>
            Contraseña
            <q-input outlined :type="ver ? 'text' : 'password'" v-model="formPass.password" dense placeholder="Ingrese la nueva contraseña"
              error-message="Ingrese una contraseña válida, mínimo 6 caracteres" :error="$v.formPass.password.$error" @blur="$v.formPass.password.$touch()">
                <template v-slot:append>
                  <q-icon :name="ver ? 'visibility_off' : 'visibility'" class="cursor-pointer q-pa-sm" color="primary" @click="ver = !ver" />
                </template>
            </q-input>
          </div>
          <div>
            Repite Contraseña
            <q-input outlined :type="ver ? 'text' : 'password'" v-model="formPass.repeatPassword" dense placeholder="Repita la nueva Contraseña"
              error-message="Las contraseñas deben ser iguales" :error="$v.formPass.repeatPassword.$error" @blur="$v.formPass.repeatPassword.$touch()"/>
          </div>
          <q-btn style="width:100%" no-caps label="Guardar" color="primary" size="lg"
          @click="cambiarPass()" />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { required, maxLength, email, sameAs, minLength } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      provincia: null,
      localidad: null,
      ver: false,
      edit: false,
      verPassword: false,
      password: '',
      repeatPassword: '',
      user: {},
      form: {},
      formPass: {},
      provincias: [],
      localidades: []
    }
  },
  validations: {
    form: {
      name: { required },
      last_name: { required },
      dni: { required },
      cp: { required },
      direccion: { required },
      phone1: { required },
      cuenta: { required },
      email: { required, email }
    },
    formPass: {
      password: { required, maxLength: maxLength(256), minLength: minLength(6) },
      repeatPassword: { sameAsPassword: sameAs('password') }
    },
    provincia: { required },
    localidad: { required },
    password: { required, maxLength: maxLength(256), minLength: minLength(6) },
    repeatPassword: { sameAsPassword: sameAs('password') }
  },
  mounted () {
    this.getInfo()
    this.getProvincias()
    if (this.$route.params.id) {
      this.edit = true
      this.getUser(this.$route.params.id)
    }
  },
  methods: {
    async getInfo () {
      await this.$api.get('user_info').then(res => {
        if (res) {
          this.user = res
        }
      })
    },
    async getUser (id) {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      await this.$api.get('user_by_id/' + id).then(res => {
        if (res) {
          this.form = res
          this.provincia = res.provincia
          this.localidades = res.provincia.localidades
          this.localidad = res.localidad
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
        }
      })
    },
    getProvincias () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      this.$api.get('provincias').then(res => {
        if (res) {
          this.provincias = res
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
        }
      })
    },
    localidadPorId (id) {
      this.$q.loading.show({
        message: 'Buscando localidades...'
      })
      this.$api.get('localidadesPorId/' + id).then(res => {
        if (res) {
          this.localidades = res
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
        }
      })
    },
    registrar () {
      this.$v.provincia.$touch()
      this.$v.localidad.$touch()
      this.$v.form.$touch()
      this.$v.password.$touch()
      this.$v.repeatPassword.$touch()
      if (!this.$v.provincia.$error && !this.$v.localidad.$error && !this.$v.form.$error && !this.$v.password.$error && !this.$v.repeatPassword.$error) {
        this.$q.loading.show({
          message: 'Registrando...'
        })
        this.form.roles = [6]
        this.form.inmobiliaria_id = this.user._id
        this.form.provincia_id = this.provincia._id
        this.form.localidad_id = this.localidad._id
        this.form.password = this.password
        this.$api.post('register', this.form).then(res => {
          if (res) {
            this.$q.notify({
              message: 'Comercio registrado con éxito',
              color: 'positive'
            })
            this.$q.loading.hide()
            this.$router.go(-1)
          } else {
            this.$q.loading.hide()
          }
        })
      } else {
        this.$q.notify({
          message: 'Debe ingresar todos los datos requeridos',
          color: 'negative'
        })
      }
    },
    async actualizar () {
      this.$v.provincia.$touch()
      this.$v.localidad.$touch()
      this.$v.form.$touch()
      if (!this.$v.provincia.$error && !this.$v.localidad.$error && !this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Guardando...'
        })
        this.form.provincia_id = this.provincia._id
        this.form.localidad_id = this.localidad._id
        await this.$api.post('edit_user/' + this.form._id, this.form).then(res => {
          if (res) {
            this.$q.notify({
              message: 'Datos guardados correctamente',
              color: 'positive'
            })
            this.$q.loading.hide()
          } else {
            this.$q.loading.hide()
          }
        })
      } else {
        this.$q.notify({
          message: 'Debe ingresar todos los datos requeridos',
          color: 'negative'
        })
      }
    },
    async cambiarPass () {
      this.$v.formPass.$touch()
      if (!this.$v.formPass.$error) {
        this.$q.loading.show({
          message: 'Guardando contraseña...'
        })
        await this.$api.put('new_password/' + this.form._id, { password: this.formPass.password }).then(res => {
          if (res) {
            this.verPassword = false
            this.$q.notify({
              message: 'Contraseña guardada correctamente',
              color: 'positive'
            })
            this.$q.loading.hide()
          } else {
            this.$q.loading.hide()
          }
        })
      } else {
        this.$q.notify({
          message: 'Debe ingresar todos los datos requeridos',
          color: 'negative'
        })
      }
    }
  }
}
</script>
