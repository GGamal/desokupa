<template>
  <div class="q-pa-md">
    <div>
      <div class="text-h5 text-grey-10 text-weight-medium">Listado de Productos</div>
      <div class="text-grey-9">
        {{`En la siguiente tabla puedes ver todas las formas de pago\n
        configuradas en el sistema. Esta información la utilizaremos\n
        para crear Presupuestos en el módulo Ventas. Recuerda\n
        que en la columna Acción puedes editar o eliminar un\n
        registro.`}}
      </div>
    </div>

    <div class="row justify-end items-center q-py-md">
      <div class="row q-gutter-sm">
        <div class="row items-center">
          <div class="q-mr-sm text-weight-regular text-grey-10">Puedes filtar todas las columnas con un mismo filtro.</div>
          <q-input dense filled debounce="300" color="primary" v-model="filter" placeholder="Buscar productos">
            <template v-slot:after>
              <q-btn  color="primary" icon="search" />
            </template>
          </q-input>
        </div>
      </div>
    </div>

    <div class="row q-pt-xs q-pb-md">
      <q-tabs
          v-model="tab"
          dense
          align="left"
          active-color="white"
          no-caps
          class="col-12"
        >
          <q-tab :name="item.val" :label="item.val + ' cuotas'"
          v-for="(item, index) in categorias" :key="index"
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
      no-data-label="No hay formas registradas"
      no-results-label="No hay formas"
      class="no-shadow"
      :pagination.sync="pagination"
    >
      <template v-slot:body-cell-cuota="props">
        <q-td :props="props">
          <div class="row justify-center q-gutter-xs">
            <div>{{props.row.categoria}}</div>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-opcion="props">
        <q-td :props="props">
          <div class="row no-wrap justify-center q-gutter-xs">
            <q-btn  size="sm" icon="edit" color="blue" dense rounded push no-wrap style="width:90px"
            @click="$router.push('/editar_servicio/' + props.row._id)"/>
            <q-btn  size="sm" icon="delete" color="negative" dense rounded push no-wrap style="width:90px"
            @click="eliminar(props.row)"/>
          </div>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      listo: false,
      edit: false,
      tab: null,
      filter: '',
      form: {},
      valorCuotas: [],
      allData: [],
      data: [],
      columns: [
        { name: 'name', label: 'Nombre', align: 'left', field: 'name', sortable: true },
        { name: 'cuota', label: 'Categoria', align: 'center', field: 'cuota' },
        { name: 'subcategoria', label: 'SubCategoria', align: 'center', field: 'cuota' },
        { name: 'opcion', label: 'Opciones', align: 'center', field: 'opcion' }
      ],
      pagination: {
        rowsPerPage: 50 // current rows per page being displayed
      }
    }
  },
  validations: {
    form: {
      name: { required },
      categoria: { required }
    }
  },
  mounted () {
    this.getFormasPago()
  },
  methods: {
    getFormasPago () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      this.$api.get('productos').then(res => {
        if (res) {
          this.allData = res
          this.data = this.allData
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
        }
      })
    },
    verify (data) {
      this.valorCuotas = []
      /* const porcentaje = 100 / data */
      for (let i = 0; i < data; i++) {
        this.valorCuotas.push(0)
      }
      this.listo = true
    },
    guardar () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        var total = 0
        for (let i = 0; i < this.valorCuotas.length; i++) {
          total = total + this.valorCuotas[i]
        }
        if (total === 100) {
          this.$q.loading.show({
            message: 'Guardando forma de pago...'
          })
          this.form.valorCuotas = this.valorCuotas
          this.$api.post('nuevo_producto', this.form).then(res => {
            if (res) {
              this.dialog = false
              this.getFormasPago()
              this.$q.notify({
                message: 'Forma de pago guardada con éxito',
                color: 'positive'
              })
              this.$q.loading.hide()
            } else {
              this.$q.loading.hide()
            }
          })
        } else {
          this.$q.dialog({
            title: 'Atención',
            message: 'El total de los porcentajes debe ser el 100%',
            persistent: false
          }).onOk(() => {
            // volver
          })
        }
      }
    },
    actualizar () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        var total = 0
        for (let i = 0; i < this.valorCuotas.length; i++) {
          total = total + this.valorCuotas[i]
        }
        if (total === 100) {
          this.$q.loading.show({
            message: 'Actualizando servicio'
          })
          this.form.valorCuotas = this.valorCuotas
          this.$api.put('editar_producto/' + this.form._id, this.form).then(res => {
            if (res) {
              this.dialog = false
              this.getFormasPago()
              this.$q.notify({
                message: 'Forma de pago actualizada con éxito',
                color: 'positive'
              })
              this.$q.loading.hide()
            } else {
              this.$q.loading.hide()
            }
          })
        } else {
          this.$q.dialog({
            title: 'Atención',
            message: 'El total de los porcentajes debe ser el 100%',
            persistent: false
          }).onOk(() => {
            // volver
          })
        }
      }
    },
    eliminar (data) {
      this.$q.dialog({
        title: 'Confirma',
        message: '¿Seguro deseas eliminar este servico?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.put('eliminar_producto/' + data._id).then(res => {
          if (res) {
            this.getFormasPago()
          }
        })
      }).onCancel(() => {
        // Cancel
      })
    },
    filtrar (val) {
      if (val !== null) {
        this.data = this.allData.filter(v => v.cuota === val)
      } else {
        this.data = this.allData
      }
    }
  }
}
</script>
