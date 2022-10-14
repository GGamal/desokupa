<template>
  <div class="q-pa-md">
    <div>
      <div class="text-h5 text-grey-10 text-weight-medium">Listado de Clientes</div>
      <div class="text-grey-9">
        {{`A continuación puedes revisar el listado de clientes completos\n
        asociados al sistema. Puedes editar, ver o eliminarlos.\n
        Recuerda que en la columna Acción puedes editar o eliminar\n
        un registro.`}}
      </div>
    </div>

    <div class="row justify-end items-center q-py-md">
      <div class="row q-gutter-sm">
        <div class="row items-center">
          <div class="q-mr-sm text-weight-regular text-grey-10">Puedes filtar todas las columnas con un mismo filtro.</div>
          <q-input dense filled debounce="300" color="primary" v-model="filter" placeholder="Buscar cliente">
            <template v-slot:after>
              <q-btn  color="primary" icon="search" />
            </template>
          </q-input>
        </div>
        <!-- <q-btn no-caps dense color="primary" label="Crear Cliente" icon="add" class="q-ml-sm q-px-sm"
        @click="$router.push('/registro/cliente')" /> -->
      </div>
    </div>
    <div class="row q-pb-md">
      <q-tabs
          v-model="tab"
          dense
          align="left"
          active-color="white"
          no-caps
          class="col-12"
        >
          <q-tab :name="item.val" :label="item.name"
          v-for="(item, index) in tipos" :key="index"
          @click="filtrar(item.val), tab = item.val" :class="tab === item.val ? 'bg-white text-red' : 'bg-primary text-white'" />
        </q-tabs>
    </div>

    <q-table
      :data="data"
      :columns="columns"
      row-key="name"
      :filter="filter"
      table-class="text-grey-9"
      table-header-class="text-black"
      no-data-label="No hay clientes registrados"
      no-results-label="No hay clientes"
      class="no-shadow"
      :pagination.sync="pagination"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <div class="row justify-center no-wrap q-gutter-xs">
            <q-btn icon="visibility" size="sm" color="orange" dense rounded push no-wrap style="width:90px"
            @click="cliente = props.row, dialog = true"/>
            <q-btn size="sm" icon="edit" color="blue" dense rounded push no-wrap style="width:90px"
            @click="$router.push('/editar/cliente/' + props.row._id)"/>
            <q-btn size="sm" icon="delete" color="negative" dense rounded push no-wrap style="width:90px"
            @click="eliminar(props.row)"/>
            <!-- <q-btn v-if="props.row.inmuebles.length > 0" label="Inmuebles" size="sm" icon="apartment" color="green" dense rounded push no-wrap style="width:130px" @click="showState = true, state = props.row.inmuebles"/> -->
          </div>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialog">
      <q-card class="q-pa-none" style="width:100%">
        <div class="row justify-between q-pa-sm bg-primary" style="width:100%">
          <img src="logoblanco.png" style="width:150px" />
          <q-btn round flat color="white" icon="clear" v-close-popup />
        </div>
        <div class="row items-center q-px-md q-pb-xl">
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-md q-px-xs">
            Tipo de cliente
            <q-field outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{cliente.type === 1 ? 'Persona natural' : cliente.type === 2 ? 'Persona jurídica' : ''}}</div>
              </template>
            </q-field>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-md q-px-xs">
            Nombre
            <q-field outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{cliente.name}}</div>
              </template>
            </q-field>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-md q-px-xs">
            Apellidos
            <q-field outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{cliente.last_name}}</div>
              </template>
            </q-field>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-md q-px-xs">
            Numero de identificaion
            <q-field outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{cliente.dni}}</div>
              </template>
            </q-field>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-md q-px-xs">
            Email
            <q-field outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{cliente.email}}</div>
              </template>
            </q-field>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-md q-px-xs">
            Teléfono 1
            <q-field outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{cliente.phone1}}</div>
              </template>
            </q-field>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-md q-px-xs">
            Teléfono 2
            <q-field outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{cliente.phone2}}</div>
              </template>
            </q-field>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-md q-px-xs">
            Pais
            <q-field outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{cliente.provincia}}</div>
              </template>
            </q-field>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-md q-px-xs">
            Ciudad
            <q-field outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{cliente.direccion}}</div>
              </template>
            </q-field>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-md q-px-xs">
            Tipo de moneda
            <q-field outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{cliente.localidad}}</div>
              </template>
            </q-field>
          </div>
          <div v-if="cliente.type === 2" class="col-12">
            <div class="text-bold q-pt-lg">ADMINISTRADOR / APODERADO</div>
            <div class="row items-center">
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-md q-px-xs">
                    Nombre
                    <q-field outlined dense stack-label>
                        <template v-slot:control>
                            <div class="self-center full-width no-outline" tabindex="0">{{cliente.apoderado.name}}</div>
                        </template>
                    </q-field>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-md q-px-xs">
                    Apellidos
                    <q-field outlined dense stack-label>
                        <template v-slot:control>
                            <div class="self-center full-width no-outline" tabindex="0">{{cliente.apoderado.last_name}}</div>
                        </template>
                    </q-field>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-md q-px-xs">
                    Telefono
                    <q-field outlined dense stack-label>
                        <template v-slot:control>
                            <div class="self-center full-width no-outline" tabindex="0">{{cliente.apoderado.phone}}</div>
                        </template>
                    </q-field>
                </div>
            </div>
          </div>
        </div>
      </q-card>
    </q-dialog>

    <!-- <q-dialog v-model="newInmueble">
      <q-card class="q-pa-none" style="width: 100%">
      <div class="row justify-between q-pa-sm bg-primary" style="width:100%">
        <img src="desocupa 1.png" style="width:150px" />
        <q-btn round flat color="white" icon="clear" v-close-popup />
      </div>

      <div class="row items-center q-pa-sm">
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
            <q-select v-model="localidad" outlined dense color="black" :options="localidades" label="Seleccione la localidad" map-options option-label="nameFull" emit-value @input="form.cp = localidad.cp"/>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            C.P
            <q-input readonly outlined v-model="form.cp"  dense placeholder="Ingrese el C.P"/>
          </div>
      </div>
      <div class="row justify-center q-mt-lg q-pa-md">
        <q-btn color="primary" label="Guardar" style="width: 100%;"
          @click="registrar()"/>
        </div>
    </q-card>
    </q-dialog>
    <q-dialog v-model="showState">
      <q-card class="q-pa-none" style="width: 100%">
        <div class="row justify-between q-pa-sm bg-primary" style="width:100%">
          <img src="desocupa 1.png" style="width:150px" />
          <q-btn round flat color="white" icon="clear" v-close-popup />
        </div>

            <div class="text-bold text-center text-primary q-mt-sm text-h6">Inmuebles</div>
        <div class="row justify-center q-pa-md">
          <q-card class="row justify-center bg-grey-3 q-pa-sm col-10 q-mb-sm" style="border-radius:20px" v-for="(item, index) in state" :key="index">
            <div class="col-12 row items-center">
              <q-icon class="q-mr-sm" name="my_location" color="primary" size="sm"/>
              <div class="text-bold">Direccion: {{item.direccion}}</div>
            </div>
            <div class="col-12 row items-center">
              <q-icon class="q-mr-sm" name="location_city" color="primary" size="sm"/>
              <div class="text-bold">Localidad: {{item.locationName}}</div>
            </div>
            <div class="col-12 row items-center">
              <q-icon class="q-mr-sm" name="map" color="primary" size="sm"/>
              <div class="text-bold">Provincia: {{item.provinceName}}</div>
            </div>
            <div class="col-12 row items-center">
              <q-icon class="q-mr-sm" name="tag" color="primary" size="sm"/>
              <div class="text-bold">cp: {{item.cp}}</div>
            </div>
          </q-card>
        </div>
      </q-card>
    </q-dialog> -->
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      dialog: false,
      newInmueble: false,
      filterSelec: null,
      tab: null,
      provincia: null,
      localidad: null,
      rol: null,
      filter: '',
      cliente: {},
      form: {},
      provincias: [],
      localidades: [],
      allData: [],
      data: [],
      tipos: [
        { val: 1, name: 'Persona física' },
        { val: 2, name: 'Persona jurídica' }
      ],
      columns: [
        { name: 'full_name', label: 'Nombre', align: 'left', field: 'full_name', sortable: true },
        { name: 'dni', label: 'Numero identificador', align: 'center', field: 'dni' },
        { name: 'email', label: 'Email', align: 'center', field: 'email' },
        { name: 'phone1', label: 'Teléfono', align: 'center', field: 'phone1' },
        { name: 'provincia', label: 'Pais', align: 'center', field: 'provincia' },
        // { name: 'direccion', label: 'Ciudad', align: 'center', field: 'direccion' },
        // { name: 'localidad', label: 'Moneda', align: 'center', field: 'localidad' },
        { name: 'actions', label: 'Opciones', align: 'center', field: 'actions' }
      ],
      showState: false,
      state: [],
      pagination: {
        rowsPerPage: 50 // current rows per page being displayed
      }
    }
  },
  validations: {
    form: {
      direccion: { required }
    }
  },
  mounted () {
    this.getRol()
    this.getClientes()
    this.getProvincias()
  },
  methods: {
    getRol () {
      this.$api.get('user_logueado').then(v => {
        if (v) {
          this.rol = v.roles[0]
        }
      })
    },
    getClientes () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      this.$api.get('clientes').then(res => {
        if (res) {
          this.allData = res
          this.data = this.allData
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
        }
      })
    },
    getProvincias () {
      this.$api.get('provincias').then(res => {
        if (res) {
          this.provincias = res
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
            this.getClientes()
            this.newInmueble = false
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
    filtrar (val) {
      if (val) {
        this.data = this.allData.filter(v => v.type === val)
      } else {
        this.data = this.allData
      }
    },
    eliminar (data) {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar este cliente?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.put('eliminar_cliente/' + data._id).then(res => {
          if (res) {
            this.getClientes()
          }
        })
      }).onCancel(() => {
        // cancel
      })
    }
  }
}
</script>
