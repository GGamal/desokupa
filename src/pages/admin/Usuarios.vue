<template>
  <div class="q-pa-md">
    <div>
      <div class="text-h5 text-grey-10 text-weight-medium">Listado de usuarios del sistema</div>
      <div class="text-grey-9">
        {{`A continuación, en la siguiente tabla puedes ver y gestionar a\n
        todos los usuario creados en el sistema. Recuerda que en la\n
        columna Acción puedes editar o eliminar un registro.`}}
      </div>
    </div>

    <div class="row justify-end items-center q-py-md">
      <div class="row q-gutter-sm">
        <div class="row items-center">
          <div class="q-mr-sm text-weight-regular text-grey-10">Puedes filtar todas las columnas con un mismo filtro.</div>
          <q-input dense filled debounce="300" color="primary" v-model="filter" placeholder="Buscar usuario">
            <template v-slot:after>
              <q-btn  color="primary" icon="search" />
            </template>
          </q-input>
        </div>
        <!-- <q-btn no-caps dense color="primary" label="Crear nuevo Usuario" icon="add" class="q-ml-sm q-px-sm"
        @click="$router.push('/registro/usuario')" /> -->
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
          v-for="(item, index) in roles" :key="index"
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
      no-data-label="No hay usuarios registrados"
      no-results-label="No hay usuarios"
      class="no-shadow"
      :pagination.sync="pagination"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <div class="row justify-start no-wrap q-gutter-xs">
            <q-btn icon="visibility" size="sm" color="orange" dense rounded push no-wrap style="width:80px"
            @click="usuario = props.row, dialog = true"/>
            <q-btn size="sm" icon="edit" color="blue" dense rounded push no-wrap style="width:80px"
            @click="$router.push('/editar/usuario/' + props.row._id)"/>
            <q-btn size="sm" icon="delete" color="negative" dense rounded push no-wrap style="width:90px"
            @click="eliminar(props.row)"/>
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
            Rol
            <q-field outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{usuario.roles[0] === 1 ? 'Administrador' : usuario.roles[0] === 2 ? 'Inmobiliaria' : usuario.roles[0] === 3 ? 'Lider Operario' : 'Legal'}}</div>
              </template>
            </q-field>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-md q-px-xs">
            Nombre
            <q-field outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{usuario.name}}</div>
              </template>
            </q-field>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-md q-px-xs">
            Apellidos
            <q-field outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{usuario.last_name}}</div>
              </template>
            </q-field>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-md q-px-xs">
            Numero de identificacion
            <q-field outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{usuario.dni}}</div>
              </template>
            </q-field>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-md q-px-xs">
            Email
            <q-field outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{usuario.email}}</div>
              </template>
            </q-field>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-md q-px-xs">
            Teléfono 1
            <q-field outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{usuario.phone1}}</div>
              </template>
            </q-field>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-md q-px-xs">
            Teléfono 2
            <q-field outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{usuario.phone2}}</div>
              </template>
            </q-field>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-md q-px-xs">
            Pais
            <q-field outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{usuario.provincia}}</div>
              </template>
            </q-field>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-md q-px-xs">
            Ciudad
            <q-field outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{usuario.direccion}}</div>
              </template>
            </q-field>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-md q-px-xs">
            Tipo de moneda
            <q-field outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{usuario.localidad}}</div>
              </template>
            </q-field>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import env from '../../env'
export default {
  data () {
    return {
      dialog: false,
      filterSelec: null,
      tab: null,
      baseu: '',
      filter: '',
      usuario: {},
      allData: [],
      data: [],
      roles: [
        { val: 1, name: 'Administrador' },
        { val: 2, name: 'Inmobiliaria' },
        { val: 3, name: 'Lider Operario' },
        { val: 4, name: 'Legal' },
        { val: 5, name: 'Operarios' },
        { val: 6, name: 'Comercial' }
      ],
      columns: [
        { name: 'full_name', label: 'Nombre', align: 'left', field: 'full_name', sortable: true },
        { name: 'dni', label: 'Numero identificador', align: 'left', field: 'dni' },
        { name: 'email', label: 'Email', align: 'left', field: 'email' },
        { name: 'phone1', label: 'Teléfono', align: 'left', field: 'phone1' },
        { name: 'provincia', label: 'Pais', align: 'left', field: 'provincia' },
        // { name: 'direccion', label: 'Ciudad', align: 'left', field: 'direccion' },
        // { name: 'localidad', label: 'Moneda', align: 'left', field: 'localidad' },
        { name: 'actions', label: 'Opciones', align: 'left', field: 'actions' }
      ],
      pagination: {
        rowsPerPage: 50 // current rows per page being displayed
      }
    }
  },
  mounted () {
    this.getUsuarios()
    this.baseu = env.apiUrl + 'perfil_img/'
  },
  methods: {
    getUsuarios () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      this.$api.post('user_by_rol', { rol: [1, 2, 3, 4, 5, 6] }).then(res => {
        if (res) {
          this.allData = res
          this.data = this.allData
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
        }
      })
    },
    filtrar (val) {
      if (val) {
        this.data = this.allData.filter(v => v.roles[0] === val)
      } else {
        this.data = this.allData
      }
    },
    eliminar (data) {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar este usuario?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.put('eliminar_user/' + data._id).then(res => {
          if (res) {
            this.getUsuarios()
          }
        })
      }).onCancel(() => {
        // cancel
      })
    }
  }
}
</script>
