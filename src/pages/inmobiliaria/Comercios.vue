<template>
  <div class="q-pa-md">
    <div class="row justify-between items-center q-py-md">
      <div class="text-h6 cursor-pointer">Lista de Comerciales</div>
      <div class="row q-gutter-sm">
        <q-input dense filled debounce="300" color="primary" v-model="filter" placeholder="Buscar comercial">
          <template v-slot:after>
            <q-btn  color="primary" icon="search" />
          </template>
        </q-input>
        <q-btn no-caps dense color="primary" label="Crear Comercial" icon="add" class="q-ml-sm q-px-sm"
        @click="$router.push('/registro/comercial')" />
      </div>
    </div>

    <q-table
      :data="data"
      :columns="columns"
      row-key="name"
      :filter="filter"
      table-class="text-grey-9"
      table-header-class="text-black"
      no-data-label="No hay comerciales registrados"
      no-results-label="No hay comerciales"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <div class="row no-wrap q-gutter-xs">
            <q-btn label="Ver" icon="visibility" color="orange" size="sm" dense rounded push no-wrap style="width:90px"
            @click="$router.push('/comercial/' + props.row._id)"/>
            <q-btn label="Editar" icon="edit" color="blue" size="sm" dense rounded push no-wrap style="width:90px"
            @click="$router.push('/editar/comercial/' + props.row._id)"/>
            <q-btn label="Eliminar" icon="delete" color="negative" size="sm" dense rounded push no-wrap style="width:90px"
            @click="eliminar(props.row)"/>
          </div>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import env from '../../env'
export default {
  data () {
    return {
      filterSelec: null,
      baseu: '',
      filter: '',
      allData: [],
      data: [],
      columns: [
        { name: 'full_name', label: 'Nombre completo', align: 'left', field: 'full_name', sortable: true },
        { name: 'dni', label: 'DNI', align: 'center', field: 'dni' },
        { name: 'phone1', label: 'Teléfono', align: 'center', field: 'phone1' },
        { name: 'direccion', label: 'Dirección', align: 'center', field: 'direccion' },
        { name: 'provincia', label: 'Provincia', align: 'center', field: 'provincia' },
        { name: 'localidad', label: 'Localidad', align: 'center', field: 'localidad' },
        { name: 'email', label: 'Email', align: 'center', field: 'email' },
        { name: 'actions', label: 'Opciones', align: 'center', field: 'actions' }
      ]
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
      this.$api.get('comercios_by_user').then(res => {
        if (res) {
          this.allData = res
          this.data = this.allData
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
        }
      })
    },
    eliminar (data) {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar este comercial?',
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
