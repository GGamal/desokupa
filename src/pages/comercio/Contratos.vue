<template>
  <div class="q-pa-md">
    <div>
      <div class="text-h5 text-grey-10 text-weight-medium">Listado de Presupuestos</div>
      <div class="text-grey-9">
        {{`En la siguiente tabla puedes revisar todos los presupuestos\n
        creados dentro de la aplicación. Recuerda que en la columna\n
        Acción puedes editar o eliminar un registro.`}}
      </div>
    </div>

    <div class="row justify-end items-center q-py-md">
      <div class="row q-gutter-sm">
        <div class="row items-center">
          <div class="q-mr-sm text-weight-regular text-grey-10">Puedes filtar todas las columnas con un mismo filtro.</div>
          <q-input dense filled debounce="300" color="primary" v-model="filter" placeholder="Buscar presupuesto">
            <template v-slot:after>
              <q-btn  color="primary" icon="search" />
            </template>
          </q-input>
        </div>
        <q-btn no-caps dense color="primary" label="Crear presupuesto" icon="add" class="q-ml-sm q-px-sm"
        @click="crearContrato()" />
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
      no-data-label="No hay presupuestos registrados"
      no-results-label="No hay presupuestos"
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
            <q-icon name="circle" size="sm" :color="props.row.status === 0 ? 'orange' : props.row.status === 1 ? 'blue' : props.row.status === 2 ? 'green' : props.row.status === 4 ? 'blue' : props.row.status === 5 ? 'yellow' : props.row.status === 6 ? 'blue' : props.row.status === 7 ? 'yellow' : props.row.status === 8 ? 'green' : 'red'" />
            <div>{{props.row.status === 0 ? 'Generado' : props.row.status === 1 ? 'Llenado' : props.row.status === 2 ? 'Aprobado' : props.row.status === 4 ? 'Disponible para Op' : props.row.status === 5 ? 'Asignado a OP' : props.row.status === 6 ? 'Disponible para Legal' : props.row.status === 7 ? 'Tomado por Legal' : props.row.status === 8 ? 'Finalizado' : 'Rechazado'}}</div>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-opcion="props">
        <q-td :props="props">
          <div class="row no-wrap justify-center q-gutter-xs">
            <q-btn label="Ver" size="sm" icon="visibility" color="orange" dense rounded push no-wrap style="width:90px"
            @click="ver(props.row)"/>
            <q-btn v-if="props.row.status === 0" label="Aprobar" icon="thumb_up_off_alt" color="green" size="sm" dense rounded no-wrap style="width:90px"
            @click="cambiar(true, props.row)"/>
            <q-btn v-if="props.row.status === 0" label="Rechazar" icon="thumb_down_off_alt" color="red" size="sm" dense rounded push no-wrap style="width:90px"
            @click="cambiar(false, props.row)"/>
            <q-btn label="PDF" size="sm" icon="picture_as_pdf" color="brown" dense rounded push no-wrap style="width:90px"
            @click="makePdf(props.row)"/>
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
        <div class="text-grey-8 text-center text-h5 q-mt-md">Generar Presupuesto</div>
        <div class="q-px-lg q-pb-xl">
          <div>
            Forma de pago
            <q-select outlined dense color="black" v-model="formaPago" :options="formasPago" label="Selecciona una forma de pago" map-options
              error-message="Este campo es requerido" :error="$v.formaPago.$error" @blur="$v.formaPago.$touch()"
              option-label="name">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-italic text-grey">
                    Aún no hay formas de pago
                  </q-item-section>
                </q-item>
              </template>
                <template v-slot:option="scope">
                  <q-item
                    v-bind="scope.itemProps"
                    v-on="scope.itemEvents"
                  >
                    <q-item-section>
                      <q-item-label v-html="scope.opt.name" />
                      <div class="row text-caption text-grey-9">
                        <div>{{scope.opt.cuota + ' cuotas ('}}</div>
                        <div v-for="(item, index) in scope.opt.valorCuotas" :key="index"
                        class="q-px-xs">{{item + '%'}}{{index === (scope.opt.valorCuotas.length - 1) ? '' : ','}}</div>
                        )
                      </div>
                    </q-item-section>
                  </q-item>
                </template>
            </q-select>
          </div>
          <div>
            Tipo de contrato
            <q-select outlined dense color="black" v-model="form.type" :options="types" label="Seleccione el tipo de contrato" map-options
              error-message="Este campo es requerido" :error="$v.form.type.$error" @blur="$v.form.type.$touch()"
              option-label="name" option-value="val" emit-value>
                <template v-slot:option="scope">
                  <q-item
                    v-bind="scope.itemProps"
                    v-on="scope.itemEvents"
                  >
                    <q-item-section>
                      <q-item-label v-html="scope.opt.name" />
                    </q-item-section>
                  </q-item>
                </template>
            </q-select>
          </div>
          <div v-if="form.type === 1">
            Valor
            <q-input prefix="€" type="number" outlined v-model.number="form.valor"  dense placeholder="Valor del contrato"
            error-message="Este campo es requerido" :error="$v.form.valor.$error" @blur="$v.form.valor.$touch()"/>
          </div>
          <div v-if="form.type === 2" class="q-pb-md">
            Valor
            <q-field label="Valor del contrato" outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{365}}€</div>
              </template>
            </q-field>
          </div>
          <div>
            Cliente
            <q-select use-input @filter="filterFn" outlined dense color="black" v-model="cliente" :options="listCustomers" label="Seleccione el cliente" map-options
              error-message="Este campo es requerido" :error="$v.cliente.$error" @blur="$v.cliente.$touch()"
              option-label="full_name" @input="inmuebles = null, $v.inmuebles.$reset(), inmueblesOption = cliente.inmuebles">
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
          <div>
            Inmuebles
            <q-select outlined dense multiple use-chips color="black" v-model="inmuebles" :options="inmueblesOption" label="Seleccione los inmuebles" map-options
              error-message="Este campo es requerido" :error="$v.inmuebles.$error" @blur="$v.inmuebles.$touch()"
              option-label="direccion" option-value="_id" emit-value>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-italic text-grey">
                    Selecciona un cliente con inmuebles registrados
                  </q-item-section>
                </q-item>
              </template>
                <template v-slot:option="scope">
                  <q-item
                    v-bind="scope.itemProps"
                    v-on="scope.itemEvents"
                  >
                    <div class="row items-center no-wrap">
                      <q-icon name="room" />
                      <div>{{scope.opt.direccion}}</div>
                    </div>
                  </q-item>
                </template>
            </q-select>
          </div>
          <q-btn style="width:100%" no-caps label="Generar" color="primary" size="lg"
          @click="generar()" />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { openURL } from 'quasar'
import env from '../../env'
import { required, requiredIf } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      dialog: false,
      filterSelec: null,
      formaPago: null,
      tab: null,
      cliente: null,
      inmuebles: null,
      filter: '',
      form: {},
      dataFormulario: {},
      formasPago: [],
      allData: [],
      data: [],
      clientes: [],
      allClients: [],
      inmueblesOption: [],
      baseu: '',
      role: null,
      listCustomers: null,
      types: [
        { val: 1, name: 'Contrato Desokupa' },
        { val: 2, name: 'Contrato 365' }
      ],
      status: [
        { val: null, name: 'Todos' },
        { val: 0, name: 'Generados' },
        { val: 2, name: 'Aprobados' },
        { val: 3, name: 'Rechazados' }
        /* { val: 4, name: 'Disponible para Op' },
        { val: 5, name: 'Asignado a Op' },
        { val: 6, name: 'Disponible para Legal' },
        { val: 7, name: 'Tomado por Legal' },
        { val: 8, name: 'Finalizados' } */
      ],
      columns: [
        { name: 'numero', label: 'Número', align: 'left', field: 'numero', sortable: true },
        { name: 'cliente', label: 'Cliente', align: 'center', field: 'cliente' },
        { name: 'type', label: 'Tipo', align: 'center', field: 'type' },
        { name: 'pagoInfo', label: 'Forma de pago', align: 'center', field: 'pagoInfo' },
        { name: 'valor', label: 'Valor', align: 'center', field: 'valor' },
        { name: 'status', label: 'Estado', align: 'center', field: 'status' },
        { name: 'date', label: 'Fecha de Creación', align: 'center', field: 'date' },
        { name: 'opcion', label: 'Opciones', align: 'center', field: 'opcion' }
      ]
    }
  },
  validations: {
    form: {
      type: { required },
      valor: { required: requiredIf(function () { return this.form.type === 1 }) }
    },
    cliente: { required },
    inmuebles: { required },
    formaPago: { required }
  },
  mounted () {
    this.getContratos()
    this.baseu = env.apiUrl + 'pdf_file/'
    this.getFormasPago()
    this.getClientes()
  },
  methods: {
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.listCustomers = this.clientes
        })
      }
      update(() => {
        const needle = val.toLowerCase()
        this.listCustomers = this.clientes.filter(v => v.full_name.toLowerCase().indexOf(needle) > -1)
      })
    },
    async getContratos () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      await this.$api.get('contratos').then(res => {
        if (res) {
          this.role = res.role
          this.allData = res.contracts
          this.data = this.allData
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
        }
      })
    },
    getFormasPago () {
      this.$api.get('formas_pagos').then(res => {
        if (res) {
          this.formasPago = res
        }
      })
    },
    getClientes () {
      this.$api.get('clientes').then(res => {
        if (res) {
          this.clientes = [...res]
          this.listCustomers = [...res]
        }
      })
    },
    crearContrato () {
      this.cliente = null
      this.inmuebles = null
      this.formaPago = null
      this.inmueblesOptio = []
      this.form = {}
      this.$v.form.$reset()
      this.$v.cliente.$reset()
      this.$v.inmuebles.$reset()
      this.$v.formaPago.$reset()
      this.dialog = true
    },
    generar () {
      this.$v.form.$touch()
      this.$v.formaPago.$touch()
      this.$v.cliente.$touch()
      this.$v.inmuebles.$touch()
      if (!this.$v.form.$error && !this.$v.formaPago.$error && !this.$v.cliente.$error && !this.$v.inmuebles.$error) {
        this.$q.loading.show({
          message: 'Generando Presupuesto...'
        })
        if (this.form.type === 2) {
          this.form.valor = 365
        }
        this.form.cuotas = []
        for (let i = 0; i < this.formaPago.valorCuotas.length; i++) {
          this.form.cuotas.push({ val: this.formaPago.valorCuotas[i], listo: false })
        }
        this.form.formaPago = this.formaPago._id
        this.form.cliente_id = this.cliente._id
        this.form.inmuebles = this.inmuebles
        this.form.listo = false
        this.form.status = 0
        this.form.adjuntos = []
        this.$api.post('generar_link', this.form).then(res => {
          if (res) {
            this.dialog = false
            this.getContratos()
            this.$q.notify({
              message: 'Presupuesto generado con éxito',
              color: 'positive'
            })
            this.$q.loading.hide()
          } else {
            this.$q.loading.hide()
          }
        })
      }
    },
    async makePdf (row) {
      this.$q.loading.show({
        message: 'Generando PDF'
      })
      this.$api.post('makeCommercialContractPdf', row).then(res => {
        if (res) {
          var vm = this
          setTimeout(function () {
            openURL(vm.baseu + res)
            vm.$q.loading.hide()
          }, 5000)
        } else {
          this.$q.loading.hide()
        }
      })
    },
    ver (data) {
      this.$router.push('/contrato/' + data._id)
    },
    cambiar (bool, data) {
      this.$q.dialog({
        title: 'Confirma',
        message: bool ? '¿Seguro deseas aprobar este contrato?' : '¿Seguro deseas rechazar este contrato?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$api.put('status_contrato/' + data._id, { status: bool ? 2 : 3 }).then(res => {
          if (res) {
            this.getContratos()
            this.$q.notify({
              message: bool ? 'Contrato aprobado con éxito' : 'Contrato rechazado con éxito',
              color: bool ? 'positive' : 'negative'
            })
          }
        })
      }).onCancel(() => {
        // cancel
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
