<template>
  <div class="q-pa-lg">
    <div class="row justify-center">
      <img src="logo.png" style="width:260px" />
    </div>
    <div class="q-my-lg text-center text-h5 text-bold text-grey-8">{{!edit ? 'NUEVO INMUEBLE' : 'EDICIÓN DE INMUEBLE'}}</div>

    <q-card class="q-pa-md">

      <div class="row items-center">
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            Cliente
            <q-select outlined dense color="black" v-model="form.cliente_id" :options="clientes" label="Seleccione el cliente al que pertenece" map-options
              error-message="Este campo es requerido" :error="$v.form.cliente_id.$error" @blur="$v.form.cliente_id.$touch()"
              option-label="full_name" option-value="_id" emit-value>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-italic text-grey">
                    Aún no hay clientes registrados
                  </q-item-section>
                </q-item>
              </template>
                <template v-slot:option="scope">
                  <q-item
                    v-bind="scope.itemProps"
                    v-on="scope.itemEvents"
                  >
                    <q-item-section>
                      <q-item-label v-html="scope.opt.full_name" />
                    </q-item-section>
                  </q-item>
                </template>
            </q-select>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            Dirección
            <q-input outlined v-model="form.direccion"  dense placeholder="Ingrese la dirección"
            error-message="Este campo es requerido" :error="$v.form.direccion.$error" @blur="$v.form.direccion.$touch()"/>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            Provincia
            <q-select v-model="provincia" outlined dense color="black" :options="provincias" label="Seleccione la provincia" map-options option-label="name" emit-value @input="localidadPorId(provincia.id)"/>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            Localidad
            <q-select v-model="localidad" outlined dense color="black" :options="localidades" label="Seleccione la localidad" map-options option-label="nameFull" emit-value @input="form.cp = localidad.cp">
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
            <q-input readonly outlined v-model="form.cp"  dense placeholder="Ingrese el C.P"/>
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
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      provincia: null,
      localidad: null,
      edit: false,
      form: {},
      provincias: [],
      localidades: [],
      clientes: []
    }
  },
  validations: {
    form: {
      cliente_id: { required },
      direccion: { required }
    }
  },
  mounted () {
    this.getProvincias()
    this.getClientes()
    if (this.$route.params.id) {
      this.edit = true
      this.getInmueble(this.$route.params.id)
    }
  },
  methods: {
    async getInmueble (id) {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      await this.$api.get('inmueble_by_id/' + id).then(res => {
        if (res) {
          this.form = res
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
    getClientes () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      this.$api.get('clientes').then(res => {
        if (res) {
          this.clientes = res
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
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Registrando...'
        })
        if (this.provincia) {
          this.form.provincia_id = this.provincia._id
        }
        if (this.localidad) {
          this.form.localidad_id = this.localidad._id
        }
        this.$api.post('register_inmueble', this.form).then(res => {
          if (res) {
            this.$q.notify({
              message: 'Inmueble registrado con éxito',
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
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Guardando...'
        })
        if (this.provincia) {
          this.form.provincia_id = this.provincia._id
        }
        if (this.localidad) {
          this.form.localidad_id = this.localidad._id
        }
        await this.$api.put('edit_inmueble/' + this.form._id, this.form).then(res => {
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
