<template>
  <div class="q-pa-md">
    <div>
      <div class="text-h6 cursor-pointer">Lista de Contratos Asignados</div>
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
            <q-btn label="Ver" icon="visibility" color="orange" size="sm" dense rounded push no-wrap style="width:90px"
            @click="$router.push('/contrato/' + props.row._id)"/>
            <q-btn label="Generar gasto" icon="money_off" color="red" size="sm" dense rounded push no-wrap style="width:110px"
            @click="setExpenseShow(props.row)"/>
          </div>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="show">
      <q-card class="q-pa-none" style="width:100%">
        <div class="row justify-between q-pa-sm bg-primary" style="width:100%">
          <img src="desocupa 1.png" style="width:150px" />
          <q-btn round flat color="white" icon="clear" v-close-popup />
        </div>
        <div class="text-grey-8 text-center text-h5 q-my-md">Generar Gasto</div>
        <div class="q-px-lg q-pb-xl">
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            Monto del gasto
            <q-input min="0" prefix="€" outlined type="number" v-model.number="form.amount" dense placeholder="Ingrese el monto"
            error-message="Este campo es requerido" :error="$v.form.amount.$error" @blur="$v.form.amount.$touch()" style="width:100%"/>
            <q-input outlined type="textarea" v-model="form.description" dense placeholder="Ingrese una breve descripción del gasto"
            error-message="Este campo es requerido" :error="$v.form.description.$error" @blur="$v.form.description.$touch()" style="width:100%"/>
          </div>
          <q-btn style="width:100%" no-caps label="Guardar" color="primary" size="lg"
          @click="setExpense()"/>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
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
        { name: 'valor', label: 'Valor', align: 'center', field: 'valor' },
        { name: 'date', label: 'Fecha de Creación', align: 'center', field: 'date' },
        { name: 'opcion', label: 'Opciones', align: 'center', field: 'opcion' }
      ]
    }
  },
  validations: {
    form: {
      amount: { required },
      description: { required, maxLength: maxLength(256), minLength: minLength(6) }
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
      this.$api.post('contratos_by_status', { status: [5, 6, 7, 8] }).then(res => {
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
    setExpenseShow (data) {
      this.contract = { ...data }
      this.show = true
    },
    setExpense () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Guardando datos...'
        })
        this.form.contract_id = this.contract._id
        this.$api.post('setExpense', this.form).then(res => {
          if (res) {
            this.$q.notify({
              message: 'Gasto realizado con éxito',
              color: 'positive'
            })
            this.$q.loading.hide()
            this.$v.$reset()
            this.form = {}
            this.show = false
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
