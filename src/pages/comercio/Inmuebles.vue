<template>
  <div class="q-pa-md">
    <div>
      <div class="text-h5 text-grey-10 text-weight-medium">Listado de Inmuebles</div>
      <div class="text-grey-9">
        {{`Revisa el total de los inmuebles creados dentro de la app.\n
          Recuerda que en la columna Acción puedes editar o eliminar\n
          un registro.`}}
      </div>
    </div>
    <div class="row justify-end items-center q-py-md">
      <div class="row q-gutter-sm">
        <div class="row items-center">
          <div class="q-mr-sm text-weight-regular text-grey-10">Puedes filtar todas las columnas con un mismo filtro.</div>
          <q-input dense filled debounce="300" color="primary" v-model="filter" placeholder="Buscar inmueble">
            <template v-slot:after>
              <q-btn  color="primary" icon="search" />
            </template>
          </q-input>
        </div>
        <q-btn no-caps dense color="primary" label="Crear Inmueble" icon="add" class="q-ml-sm q-px-sm"
        @click="$router.push('/registro/inmueble')" />
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
          v-for="(item, index) in clientes" :key="index"
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
      no-data-label="No hay inmuebles registrados"
      no-results-label="No hay inmuebles"
      class="no-shadow"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <div class="row justify-center no-wrap q-gutter-xs">
            <q-btn label="Ver" size="sm" icon="visibility" color="orange" dense rounded push no-wrap style="width:90px"
            @click="inmueble = props.row, dialog = true"/>
            <q-btn label="Editar" size="sm" icon="edit" color="blue" dense rounded push no-wrap style="width:90px"
            @click="$router.push('/editar/inmueble/' + props.row._id)"/>
            <q-btn label="Eliminar" size="sm" icon="delete" color="negative" dense rounded push no-wrap style="width:90px"
            @click="eliminar(props.row)"/>
          </div>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialog">
      <q-card class="q-pa-none" style="width:100%">
        <div class="row justify-between q-pa-sm bg-primary" style="width:100%">
          <img src="desocupa 1.png" style="width:150px" />
          <q-btn round flat color="white" icon="clear" v-close-popup />
        </div>
        <div class="row items-center q-px-md q-pb-xl">
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-md q-px-xs">
            Cliente
            <q-field outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{inmueble.cliente_name}}</div>
              </template>
            </q-field>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-md q-px-xs">
            Dirección
            <q-field outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{inmueble.direccion}}</div>
              </template>
            </q-field>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-md q-px-xs">
            C.P
            <q-field outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{inmueble.cp}}</div>
              </template>
            </q-field>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-md q-px-xs">
            Provincia
            <q-field outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{inmueble.provincia}}</div>
              </template>
            </q-field>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-md q-px-xs">
            Localidad
            <q-field outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{inmueble.localidad}}</div>
              </template>
            </q-field>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialog: false,
      filterSelec: null,
      tab: null,
      rol: null,
      filter: '',
      inmueble: {},
      allData: [],
      data: [],
      clientes: [],
      columns: [
        { name: 'cliente_name', label: 'Cliente', align: 'left', field: 'cliente_name', sortable: true },
        { name: 'direccion', label: 'Dirección', align: 'center', field: 'direccion' },
        { name: 'provincia', label: 'Provincia', align: 'center', field: 'provincia' },
        { name: 'localidad', label: 'Localidad', align: 'center', field: 'localidad' },
        { name: 'actions', label: 'Opciones', align: 'center', field: 'actions' }
      ]
    }
  },
  mounted () {
    this.getRol()
    this.getInmuebles()
  },
  methods: {
    getRol () {
      this.$api.get('user_logueado').then(v => {
        if (v) {
          this.rol = v.roles[0]
        }
      })
    },
    getInmuebles () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      this.$api.get('inmuebles').then(res => {
        if (res) {
          this.allData = res
          this.data = this.allData
          for (let i = 0; i < res.length; i++) {
            if (!this.clientes.find(v => v.val === res[i].cliente_id)) {
              var arr = { val: res[i].cliente_id, name: res[i].cliente_name }
              this.clientes.push(arr)
            }
          }
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
        }
      })
    },
    filtrar (val) {
      if (val) {
        this.data = this.allData.filter(v => v.cliente_id === val)
      } else {
        this.data = this.allData
      }
    },
    eliminar (data) {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar este inmueble?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.put('eliminar_inmueble/' + data._id).then(res => {
          if (res) {
            this.getInmuebles()
          }
        })
      }).onCancel(() => {
        // cancel
      })
    }
  }
}
</script>
