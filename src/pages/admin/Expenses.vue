<template>
  <div class="q-pa-md">
    <q-card v-if="$route.path === '/analiticas/gastos'" class="text-white bg-primary q-pa-md"
    style="height:100%; border-radius: 15px">
      <div class="text-h6">Total de Gastos</div>
      <div class="text-h4 text-bold">{{total}}€</div>
    </q-card>

    <div>
      <div class="text-h5 text-grey-10 text-weight-medium">Listado de gastos generados</div>
      <div class="text-grey-9">
        {{`La siguiente tabla muestra todos los gastos generados.`}}
      </div>
    </div>

    <div class="row justify-end items-center q-py-md">
      <div>
        <div class="row items-center">
          <div class="q-mr-sm text-weight-regular text-grey-10">Puedes buscar un contrato específico.</div>
          <q-input dense filled debounce="300" color="primary" v-model="filter" placeholder="Buscar contrato">
            <template v-slot:after>
              <q-btn  color="primary" icon="search" />
            </template>
          </q-input>
        </div>
      </div>
    </div>

    <q-table
      :data="data"
      :columns="columns"
      row-key="name"
      :filter="filter"
      table-class="text-grey-9"
      table-header-class="text-black"
      no-data-label="No hay contratos probados"
      no-results-label="No hay contratos aprobados"
      class="q-mt-sm"
      :pagination.sync="pagination"
    >
      <template v-slot:body-cell-amount="props">
        <q-td :props="props">
          <div class="text-center">{{props.row.amount ? props.row.amount + '€' : '---'}}</div>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      data: [],
      filter: '',
      columns: [
        { name: 'contractTitle', label: 'Contrato', align: 'center', field: 'contractTitle' },
        { name: 'userName', label: 'Usuario', align: 'center', field: 'userName' },
        { name: 'amount', label: 'Monto', align: 'center', field: 'amount' },
        { name: 'description', label: 'Descripción', align: 'center', field: 'description' },
        { name: 'date', label: 'Fecha', align: 'center', field: 'date' }
      ],
      pagination: {
        rowsPerPage: 50 // current rows per page being displayed
      },
      total: null
    }
  },
  mounted () {
    this.getExpenses()
  },
  methods: {
    getExpenses () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      this.$api('getExpenses').then(res => {
        if (res) {
          this.data = res.data
          this.total = res.total
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
        }
      })
    }
  }
}
</script>
