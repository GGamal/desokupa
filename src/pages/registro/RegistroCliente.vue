<template>
  <div class="q-pa-lg">
    <div class="row justify-center">
      <img src="logo.png" style="width:260px" />
    </div>
    <div class="q-my-lg text-center text-h5 text-bold text-grey-8">{{!edit ? 'NUEVO CLIENTE' : 'EDICIÓN DE CLIENTE'}}</div>

    <q-card class="q-pa-md">
      <div class=" row justify-center">
          <q-file outlined v-model="form.imagen" style="max-width: 200px" label="Foto de perfil" filled bottom-slots label-color="grey-1" bg-color="grey-8">
            <template v-slot:before>
            </template>
            <template v-slot:prepend>
              <q-icon name="attach_file" color="grey-1"/>
            </template>
         </q-file>
      </div>
      <div class="row justify-center">
        <p style="font-size: 12px;">Imagen de 800x800 px</p>
      </div>
      <div class="row items-center">
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            Tipo de cliente
            <q-select outlined dense color="black" v-model="form.type" :options="tipos" label="Seleccione el tipo de cliente" map-options
              error-message="Este campo es requerido" :error="$v.form.type.$error" @blur="$v.form.type.$touch()"
              option-label="name" option-value="val" emit-value @input="form.type === 2 ? juridico = true : juridico = false, form.type === 2 ? form.last_name = '' : '', $v.apoderado.$reset()">
                <template v-slot:option="scope">
                  <q-item
                    v-bind="scope.itemProps"
                    v-on="scope.itemEvents"
                  >
                    <q-item-section>
                      <q-item-label v-html="scope.opt.name" />
                    </q-item-section>
                  </q-item>
                </template>
            </q-select>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            Nombre
            <q-input outlined v-model="form.name"  dense placeholder="Ingrese el nombre"
            error-message="Este campo es requerido" :error="$v.form.name.$error" @blur="$v.form.name.$touch()"/>
          </div>
          <div v-if="!juridico" class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            Apellidos
            <q-input outlined v-model="form.last_name"  dense placeholder="Ingrese los apellidos"/>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            {{!juridico ? 'Numero de identificacion' : 'Numero identificador'}}
            <q-input outlined v-model="form.dni"  dense :placeholder="!juridico ? 'Ingrese el numero de identificacion' : 'Ingrese su numero identificador'"
            error-message="Este campo es requerido" :error="$v.form.dni.$error" @blur="$v.form.dni.$touch()"/>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            Email
            <q-input outlined v-model="form.email"  dense placeholder="Ingrese el email"
            error-message="Este campo es requerido" :error="$v.form.email.$error" @blur="$v.form.email.$touch()"/>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            Telefono1
            <q-input type="tel" outlined v-model="form.phone1"  dense placeholder="Ingrese un teléfono"/>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-px-xs">
            Telefono2
            <q-input type="tel" outlined v-model="form.phone2"  dense placeholder="Ingrese otro teléfono"/>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            Ciudad
            <q-input outlined v-model="form.direccion"  dense placeholder="Ingrese la ciudad"
            error-message="Este campo es requerido" :error="$v.form.direccion.$error" @blur="$v.form.direccion.$touch()"/>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            Pais
            <q-select v-model="provincia" outlined dense color="black" :options="provincias" label="Seleccione un pais" map-options option-label="name" emit-value @input="localidadPorId(provincia.id)" error-message="Este campo es requerido" :error="$v.provincia.$error" @blur="$v.provincia.$touch()"/>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            Tipo de moneda
            <q-select v-model="localidad" outlined dense color="black" :options="localidades" label="Seleccione una moneda" map-options option-label="name" emit-value @input="form.cp = localidad.cp">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-italic text-grey-8">
                    Seleccione una moneda
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            C.P
            <q-input readonly outlined v-model="form.cp"  dense placeholder="Ingrese el C.P"/>
          </div> -->
          <!-- <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            Cuenta corriente
            <q-input outlined v-model="form.cuenta"  dense placeholder="Ingrese la cuenta"/>
          </div> -->
      </div>
      <div v-if="juridico">
        <div class="text-bold q-pt-lg">ADMINISTRADOR / APODERADO</div>
        <div class="row items-center">
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
                Nombre completo
                <q-input outlined v-model="apoderado.name"  dense placeholder="Ingrese el nombre completo"
                error-message="Este campo es requerido" :error="$v.apoderado.name.$error" @blur="$v.apoderado.name.$touch()"/>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
                Email
                <q-input type="tel" outlined v-model="apoderado.email"  dense placeholder="Ingrese su Email"/>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
                Cargo
                <q-input type="tel" outlined v-model="apoderado.cargo"  dense placeholder="Ingrese su cargo"/>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
                Telefono
                <q-input type="tel" outlined v-model="apoderado.phone"  dense placeholder="Ingrese un teléfono"/>
            </div>
        </div>
      </div>
      <div class="row justify-center q-mt-lg">
        <q-btn color="primary" label="Guardar" style="width: 100%;"
          @click="!edit ? registrar() : actualizar()"/>
        </div>
    </q-card>
  </div>
</template>
<script>
import { required, email, requiredIf } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      imagen: null,
      provincia: null,
      localidad: null,
      juridico: false,
      edit: false,
      form: {},
      apoderado: {},
      pais: {},
      provincias: [],
      localidades: [],
      tipos: [
        { val: 1, name: 'Persona natural' },
        { val: 2, name: 'Persona jurídica' }
      ]
    }
  },
  validations: {
    form: {
      imagen: { required },
      type: { required },
      dni: { required },
      direccion: { required },
      name: { required },
      email: { required, email }
    },
    provincia: { required },
    apoderado: {
      name: { required: requiredIf(function () { return this.juridico.name }) },
      email: { required: requiredIf(function () { return this.juridico.email }) },
      cargo: { required: requiredIf(function () { return this.juridico.cargo }) },
      phone: { required: requiredIf(function () { return this.juridico.phone }) }
    }
  },
  mounted () {
    this.getProvincias()
    console.log(this.$route.params.id)
    if (this.$route.params.id) {
      this.edit = true
      this.getCliente(this.$route.params.id)
    } else {
      this.edit = false
    }
  },
  methods: {
    async getCliente (id) {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      await this.$api.get('cliente_by_id/' + id).then(res => {
        if (res) {
          this.form = res
          if (res.type === 2) {
            this.juridico = true
            this.apoderado = res.apoderado
          }
          if (res.provincia_id) {
            this.provincia = res.provincia
            this.localidades = res.provincia.localidades
          }
          if (res.localidad_id) {
            this.localidad = res.localidad
          }
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
      this.$v.form.$touch()
      this.$v.provincia.$touch()
      this.$v.apoderado.$touch()
      const formData = new FormData()
      if (!this.$v.form.$error && !this.$v.apoderado.$error && !this.$v.provincia.$error) {
        this.$q.loading.show({
          message: 'Registrando...'
        })
        if (this.provincia) {
          this.form.provincia_id = this.provincia._id
        }
        if (this.localidad) {
          this.form.localidad_id = this.localidad._id
        }
        if (this.form.type === 2) {
          this.form.apoderado = this.apoderado
        }
        formData.append('imagen', this.form.imagen)
        formData.append('form', JSON.stringify(this.form))
        console.log(this.form.imagen)
        this.$api.post('register_cliente', formData).then(res => {
          if (res) {
            this.$q.notify({
              message: 'Cliente registrado con éxito',
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
      this.$v.form.$touch()
      this.$v.provincia.$touch()
      this.$v.apoderado.$touch()
      if (!this.$v.form.$error && !this.$v.apoderado.$error && !this.$v.provincia.$error) {
        this.$q.loading.show({
          message: 'Guardando...'
        })
        if (this.provincia) {
          this.form.provincia_id = this.provincia._id
        }
        if (this.localidad) {
          this.form.localidad_id = this.localidad._id
        }
        if (this.form.type === 2) {
          this.form.apoderado = this.apoderado
        }
        await this.$api.put('edit_cliente/' + this.form._id, this.form).then(res => {
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
    }
  }
}
</script>
