<template>
  <div class="q-pa-md">
    <q-card class="text-white bg-primary q-pa-md" style="height:100%; border-radius: 15px">
      <div class="text-h6">Total de Ventas</div>
      <div class="text-h4 text-bold">{{total}}€</div>
    </q-card>
    <div class="row justify-between items-center q-pt-md">
      <div class="text-h6 cursor-pointer">Lista de Ventas</div>
      <div>
        <q-input dense filled debounce="300" color="primary" v-model="filter" placeholder="Buscar contrato">
          <template v-slot:after>
            <q-btn  color="primary" icon="search" />
          </template>
        </q-input>
      </div>
    </div>
    <q-table
      :data="data"
      :columns="columns"
      row-key="name"
      :filter="filter"
      table-class="text-grey-9"
      table-header-class="text-black"
      no-data-label="No hay ventas aún"
      no-results-label="No hay ventas aún"
      class="q-mt-sm"
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
        { name: 'contractTitle', label: 'Contrato', align: 'left', field: 'contractTitle' },
        { name: 'userName', label: 'Admin', align: 'center', field: 'userName' },
        { name: 'amount', label: 'valor', align: 'center', field: 'amount' }
      ],
      total: null
    }
  },
  mounted () {
    this.getIncomes()
  },
  methods: {
    getIncomes () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      this.$api('getIncomes').then(res => {
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
