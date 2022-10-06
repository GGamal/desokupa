<template>
  <div>
        <div class="text-grey-8 text-center text-h5 q-mt-md">
          Generar Presupuesto
        </div>
        <div class="q-px-lg q-pb-xl">
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
            Tipo de contrato
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
          </div>
          <div v-if="form.type === 1">
            Valor
            <q-input
              prefix="€"
              type="number"
              outlined
              v-model.number="form.valor"
              dense
              placeholder="Valor del contrato"
              error-message="Este campo es requerido"
              :error="$v.form.valor.$error"
              @blur="$v.form.valor.$touch()"
            />
          </div>
          <div v-if="form.type === 2" class="q-pb-md">
            Valor
            <q-field label="Valor del contrato" outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ 365 }}€
                </div>
              </template>
            </q-field>
          </div>
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
              @input="
                (inmuebles = null),
                  $v.inmuebles.$reset(),
                  (inmueblesOption = cliente.inmuebles)
              "
            >
              <template v-slot:no-option>
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
          <div>
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
          </div>
          <q-btn
            style="width: 100%"
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
