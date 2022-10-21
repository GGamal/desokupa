<template>
  <div>
        <div class="text-grey-8 text-center text-h5 q-mt-md">
          Editar Presupuesto
        </div>
        <div class="q-px-lg q-pb-xl">
          <div>
            Cliente
            <q-select
              use-input
              @filter="filterFn"
              outlined
              dense
              color="black"
              v-model="cliente"
              :options="listCustomers"
              label="Seleccione el cliente"
              map-options
              error-message="Este campo es requerido"
              :error="$v.cliente.$error"
              @blur="$v.cliente.$touch()"
              option-label="full_name"
              @input="handleCustomerChange()"
            >
              <template v-slot:no-option @click="impuesto()">
                <q-item>
                  <q-item-section class="text-italic text-grey">
                    Aún no hay clientes registrados
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                  <q-item-section>
                    <q-item-label v-html="scope.opt.full_name" />
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- <div>
            Contrato con fecha de expiracion
            <q-select
              outlined
              dense
              color="black"
              v-model="form.type"
              :options="types"
              label="Seleccione el tipo de contrato"
              map-options
              error-message="Este campo es requerido"
              :error="$v.form.type.$error"
              @blur="$v.form.type.$touch()"
              option-label="name"
              option-value="val"
              emit-value
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                  <q-item-section>
                    <q-item-label v-html="scope.opt.name" />
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div> -->
          <div>
            Forma de pago
            <q-select
              outlined
              dense
              color="black"
              v-model="formaPago"
              :options="formasPago"
              label="Selecciona una forma de pago"
              map-options
              error-message="Este campo es requerido"
              :error="$v.formaPago.$error"
              @blur="$v.formaPago.$touch()"
              option-label="name"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-italic text-grey">
                    Aún no hay formas de pago
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                  <q-item-section>
                    <q-item-label v-html="scope.opt.name" />
                    <div class="row text-caption text-grey-9">
                      <div>{{ scope.opt.cuota + " cuotas (" }}</div>
                      <div
                        v-for="(item, index) in scope.opt.valorCuotas"
                        :key="index"
                        class="q-px-xs"
                      >
                        {{ item + "%"
                        }}{{
                          index === scope.opt.valorCuotas.length - 1 ? "" : ","
                        }}
                      </div>
                      )
                    </div>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div>
            Servicio
            <q-select
              outlined
              dense
              color="black"
              v-model="servicio"
              :options="servicios"
              label="Selecciona un servicio"
              map-options
              error-message="Este campo es requerido"
              :error="$v.servicio.$error"
              @blur="$v.servicio.$touch()"
              option-label="name"
              multiple
              counter
              use-chips
              filled
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-italic text-grey">
                    Aún no hay servicios
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                  <q-item-section>
                    <q-item-label v-html="scope.opt.name" />
                    <div class="row text-caption text-grey-9">
                      <div>{{ scope.opt.categoria + "" }}</div>
                      <div
                        v-for="(item, index) in scope.opt.categorias"
                        :key="index"
                        class="q-px-xs"
                      >
                      </div>
                    </div>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div>
            Valor
            <q-input
              v-model="moneda"
              type="number"
              outlined
              v-model.number="form.valor"
              dense
              error-message="Este campo es requerido"
              :error="$v.form.valor.$error"
              @blur="$v.form.valor.$touch()"
              label="Valor del contrato" stack-label
              @input="impuesto()"
            >
            <template v-slot:prepend>
              <div class="self-center full-width no-outline" tabindex="0">
                 <span style="font-size: 14px; color: black">{{moneda}}</span>
              </div>
            </template>
            </q-input>
          </div>
          <q-toggle
            v-model="activarimpuesto"
            icon="attach_money"
            label="Poner impuestos"
            val="lg"
            size="lg"
            />
          <div v-if="moneda === 'CLP' && activarimpuesto == true">
            Impuestos:
            <span>CLP IVA 19% del total </span>
            <q-field label="Total con impuesto agregado" outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{moneda}}:   {{total}}</div>
              </template>
            </q-field>
          </div>
          <div v-if="moneda === 'USD' && activarimpuesto == true">
            Impuestos:
            <span>Paypal 5,4 % + USD 0,30</span>
            <q-field label="Total con impuesto agregado" outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0"> {{moneda}}:   {{total}}</div>
              </template>
            </q-field>
          </div>
          <div style="max-width: 300px" class="q-my-md">
            Contrato con fecha de expiracion
            <q-input filled v-model="fecha" mask="date" :rules="['date']" error-message="Este campo es requerido" :error="$v.fecha.$error" @blur="$v.fecha.$touch()">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="fecha" :locale="myLocale">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <!-- <div>
            Inmuebles
            <q-select
              outlined
              dense
              multiple
              use-chips
              color="black"
              v-model="inmuebles"
              :options="inmueblesOption"
              label="Seleccione los inmuebles"
              map-options
              error-message="Este campo es requerido"
              :error="$v.inmuebles.$error"
              @blur="$v.inmuebles.$touch()"
              option-label="direccion"
              option-value="_id"
              emit-value
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-italic text-grey">
                    Selecciona un cliente con inmuebles registrados
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                  <div class="row items-center no-wrap">
                    <q-icon name="room" />
                    <div>{{ scope.opt.direccion }}</div>
                  </div>
                </q-item>
              </template>
            </q-select>
          </div> -->
        </div>
        <div class="row justify-center">
        <q-btn
            class="row justify-between items-center"
            style="width: 98.5%"
            no-caps
            label="Generar"
            color="primary"
            size="lg"
            @click="generar()"
          />
        </div>
  </div>
</template>
<script>
import { openURL } from 'quasar'
import env from '../../env'
import { required, requiredIf } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      edit: false,
      activarimpuesto: false,
      total: null,
      impuestos: 0,
      moneda: '',
      dialog: false,
      filterSelec: null,
      formaPago: null,
      servicio: null,
      tab: null,
      cliente: null,
      fecha: ('2022'),
      // inmuebles: null,
      filter: '',
      form: {},
      dataFormulario: {},
      formasPago: [],
      servicios: [],
      allData: [],
      data: [],
      clientes: [],
      allClients: [],
      // inmueblesOption: [],
      baseu: '',
      role: null,
      listCustomers: null,
      // types: [
      //   { val: 1, name: 'Contrato Desokupa' },
      //   { val: 2, name: 'Contrato 365' }
      // ]
      myLocale: {
        /* starting with Sunday */
        days: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
        daysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
        months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
        monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
        firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
        format24h: true,
        pluralDay: 'dias'
      }
    }
  },
  validations: {
    form: {
      // type: { required },
      valor: { required: requiredIf(function () { return this.form.type === 1 }) }
    },
    cliente: { required },
    // inmuebles: { required },
    formaPago: { required },
    servicio: { required },
    fecha: { required },
    impuestos: { required },
    total: { required }
  },
  mounted () {
    this.getServicios()
    this.getContratos()
    this.baseu = env.apiUrl + 'pdf_file/'
    this.getFormasPago()
    this.getClientes()
    this.impuesto()
    if (this.$route.params.id) {
      this.edit = true
      this.getPresupuestoID(this.$route.params.id)
    }
  },
  methods: {
    impuesto () {
      const activarimpuesto = this.activarimpuesto
      const moneda = this.moneda
      const valor = this.form.valor
      const total = this.form.valor
      this.total = this.form.valor
      if (moneda === 'CLP' && activarimpuesto === true) {
        const iva = valor * 19 / 100
        console.log('este es el iva', iva)
        const total = valor + iva
        console.log('este es el total', total)
        this.total = total
        this.impuestos = iva
      }
      if (moneda === 'USD' && activarimpuesto === true) {
        const iva = valor * 5.4 / 100 + 0.30
        console.log('este es impuesto paypal', iva)
        const total = valor + iva
        console.log('este es el total', total)
        this.total = total
        this.impuestos = iva
      }
      console.log('este total es sin iva', total)
    },
    handleCustomerChange () {
      const data = this.cliente.localidad
      console.log('data:', data)
      this.moneda = data
      console.log(this.moneda)
    },
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
    getServicios () {
      this.$api.get('productos').then(res => {
        if (res) {
          this.servicios = res
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
      // this.inmuebles = null
      this.formaPago = null
      this.servicio = null
      this.fecha = null
      // this.inmueblesOptio = []
      this.form = {}
      this.$v.form.$reset()
      this.$v.cliente.$reset()
      // this.$v.inmuebles.$reset()
      this.$v.formaPago.$reset()
      this.$v.servicio.$reset()
      this.$v.fecha.$reset()
      this.$v.total.$reset()
      this.$v.impuestos.$reset()
      this.dialog = true
    },
    generar () {
      this.$v.form.$touch()
      this.$v.formaPago.$touch()
      this.$v.cliente.$touch()
      this.$v.servicio.$touch()
      this.$v.fecha.$touch()
      this.$v.total.$touch()
      this.$v.impuestos.$touch()
      // this.$v.inmuebles.$touch()
      if (!this.$v.form.$error && !this.$v.formaPago.$error && !this.$v.cliente.$error && !this.$v.servicio.$error && !this.$v.fecha.$error) {
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
        this.form.servicio = this.servicio
        this.form.fecha = this.fecha
        this.form.total = this.total
        this.form.moneda = this.moneda
        this.form.impuestos = this.impuestos
        // this.form.email = this.cliente.email
        // this.form.imagen = this.cliente.imagen
        // this.form.phone = this.cliente.phone1
        // this.form.pais = this.cliente.provincia
        // this.form.inmuebles = this.inmuebles
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
