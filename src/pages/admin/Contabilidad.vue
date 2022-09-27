<template>
  <div class="q-pa-md">
    <div>
      <div class="text-h5 text-grey-10 text-weight-medium">Historial de Movimientos</div>
      <div class="text-grey-9">
        La siguiente tabla muestra todos los contratos en los cuales se ha generado un movimiento de dinero.
      </div>
    </div>

    <div class="row justify-end items-center q-py-md">
      <div class="row items-center">
        <div class="q-mr-sm text-weight-regular text-grey-10">Puedes filtar todas las columnas con un mismo filtro.</div>
        <q-input dense filled debounce="300" color="primary" v-model="filter" placeholder="Buscar contrato">
          <template v-slot:after>
            <q-btn  color="primary" icon="search" />
          </template>
        </q-input>
      </div>
    </div>

    <div class="row q-pt-xs q-pb-md">
      <q-tabs
          v-model="tab"
          dense
          outline
          align="left"
          active-color="white"
          no-caps
          class="col-12"
        >
          <q-tab :name="item.val" :label="item.name"
          v-for="(item, index) in status" :key="index"
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
      no-data-label="No hay contratos probados"
      no-results-label="No hay contratos aprobados"
      class="no-shadow"
    >
      <template v-slot:body-cell-type="props">
        <q-td :props="props">
          <div class="text-center">{{props.row.type === 1 ? 'Contrato Desokupa' : 'Contrato 365'}}</div>
        </q-td>
      </template>
      <template v-slot:body-cell-valor="props">
        <q-td :props="props">
          <div class="text-center">{{props.row.valor ? props.row.valor + '€' : '---'}}</div>
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <div class="row no-wrap items-center justify-center">
            <q-icon name="circle" size="sm" :color="props.row.status === 2 ? 'green' : props.row.status === 4 ? 'blue' : props.row.status === 5 ? 'yellow' : props.row.status === 6 ? 'blue' : props.row.status === 7 ? 'yellow' : 'green'" />
            <div>{{props.row.status === 2 ? 'Aprobado' : props.row.status === 4 ? 'Disponible para Op' : props.row.status === 5 ? 'Asignado a Op' : props.row.status === 6 ? 'Disponible para Legal' : props.row.status === 7 ? 'Tomado por Legal' :  'Finalizado'}}</div>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-paymentStatus="props">
        <q-td :props="props">
          <div class="row no-wrap items-center justify-center">
            <q-icon name="circle" size="sm" :color="props.row.paymentStatus === 2 ? 'green' : props.row.paymentStatus === 1 ? 'yellow' : 'red'" />
            <div>{{props.row.paymentStatus === 2 ? 'Pago Completado' : props.row.paymentStatus === 1 ? 'Abonado' : 'En Deuda'}}</div>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-opcion="props">
        <q-td :props="props">
          <div class="row no-wrap justify-center q-gutter-xs">
            <q-btn icon="euro" label="Ver Cuotas" color="orange" size="sm" dense rounded push no-wrap style="width:100px"
            @click="cambiar(props.row)"/>
          </div>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="verCuotas">
      <q-card class="q-pa-none" style="width:100%">
        <div class="row justify-between q-pa-sm bg-primary" style="width:100%">
          <img src="desocupa 1.png" style="width:150px" />
          <q-btn round flat color="white" icon="clear" v-close-popup />
        </div>
        <div class="text-grey-8 text-center text-h5 q-my-md">Cuotas del contrato</div>
        <div class="q-px-lg q-pb-xl">
          <div class="row">
            <div v-for="(item, index) in contrato.cuotas" :key="index" class="col-6 q-px-sm q-mb-md">
              <div>Cuota {{index + 1}}</div>
              <q-field outlined dense stack-label>
                <template v-slot:control>
                  <q-checkbox v-model="item.listo" :label="item.val + ' %'" color="green" />
                </template>
              </q-field>
            </div>
          </div>
          <q-btn style="width:100%" no-caps label="Guardar" color="primary" size="lg"
          @click="guardar()"/>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      verCuotas: false,
      show: false,
      tab: null,
      filter: '',
      contrato: {},
      allData: [],
      data: [],
      form: {},
      status: [
        { val: 2, name: 'Aprobados' },
        { val: 4, name: 'Disponible para Op' },
        { val: 5, name: 'Asignado a Op' },
        { val: 6, name: 'Disponible para Legal' },
        { val: 7, name: 'Tomado por Legal' },
        { val: 8, name: 'Finalizados' }
      ],
      columns: [
        { name: 'numero', label: 'Número', align: 'left', field: 'numero', sortable: true },
        { name: 'inmobiliaria', label: 'Inmobiliaria', align: 'center', field: 'inmobiliaria', sortable: true },
        { name: 'comercial', label: 'Comercial', align: 'center', field: 'comercial', sortable: true },
        { name: 'clientName', label: 'Cliente', align: 'center', field: 'clientName', sortable: true },
        { name: 'adminName', label: 'Creado por', align: 'center', field: 'adminName', sortable: true },
        { name: 'type', label: 'Tipo', align: 'center', field: 'type' },
        { name: 'pagoInfo', label: 'Forma de pago', align: 'center', field: 'pagoInfo' },
        { name: 'valor', label: 'Valor', align: 'center', field: 'valor' },
        { name: 'status', label: 'Estado', align: 'center', field: 'status' },
        { name: 'paymentStatus', label: 'Estado de pago', align: 'center', field: 'paymentStatus' },
        { name: 'date', label: 'Fecha de Creación', align: 'center', field: 'date' },
        { name: 'opcion', label: 'Opciones', align: 'center', field: 'opcion' }
      ]
    }
  },
  mounted () {
    this.getContratos()
  },
  methods: {
    getContratos () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      this.comercios = []
      this.$api.get('contratos_by_cuotas').then(res => {
        if (res) {
          this.allData = res
          this.data = this.allData
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
        }
      })
    },
    cambiar (data) {
      this.contrato = JSON.parse(JSON.stringify(data))
      this.verCuotas = true
    },
    guardar () {
      this.$q.loading.show({
        message: 'Guardando datos...'
      })
      var bool = false
      if (!this.contrato.cuotas.find(v => v.listo === false)) {
        bool = true
      }
      this.$api.put('status_contrato/' + this.contrato._id, { cuotas: this.contrato.cuotas, listo: bool }).then(v => {
        if (v) {
          this.getContratos()
          this.verCuotas = false
          this.$q.notify({
            message: 'Datos guardados con éxito',
            color: 'positive'
          })
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
        }
      })
    },
    filtrar (val) {
      if (val !== null) {
        this.data = this.allData.filter(v => v.status === val)
      } else {
        this.data = this.allData
      }
    }
  }
}
</script>
