<template>
  <div class="q-pa-md">
    <div class="text-center text-h6 text-grey-8">Historial</div>

    <q-card class="q-pa-md q-mt-md bg-primary" style="border-radius:10px">
      <q-expansion-item dark >
        <template v-slot:header>
          <q-item-section avatar>
            <q-icon name="account_circle" color="white" size="md" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-h5">Información del comercial</q-item-label>
            <q-item-label class="text-white text-subtitle1 text-bold">{{user.full_name ? user.full_name : user.name + ' ' + user.last_name}}</q-item-label>
          </q-item-section>
        </template>

        <q-card>
          <q-card-section class="row">
            <div class="col-xs-12 col-sm-6 col-md-6">
              <q-item>
                <q-item-section avatar> <q-icon name="account_circle" /> </q-item-section>
                <q-item-section> <div>Nombre: <b>{{user.full_name ? user.full_name : user.name}}</b></div> </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar> <q-icon name="perm_identity" /> </q-item-section>
                <q-item-section> <div>DNI: <b>{{user.dni}}</b></div> </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar> <q-icon name="phone" /> </q-item-section>
                <q-item-section> <div>Teléfono: <b>{{user.phone1}}</b></div> </q-item-section>
              </q-item>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6">
              <q-item>
                <q-item-section avatar> <q-icon name="public" /> </q-item-section>
                <q-item-section> <div>Provincia: <b>{{user.provincia}}</b></div> </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar> <q-icon name="place" /> </q-item-section>
                <q-item-section> <div>Localidad: <b>{{user.localidad}}</b></div> </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar> <q-icon name="my_location" /> </q-item-section>
                <q-item-section> <div>Dirección: <b>{{user.direccion}}</b></div> </q-item-section>
              </q-item>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-card>

    <q-card class="q-pa-md q-mt-md bg-primary" style="border-radius:10px">
      <q-expansion-item dark>
        <template v-slot:header>
          <q-item-section avatar>
            <q-icon name="request_quote" color="white" size="md" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-h5">Módulo de contabilidad</q-item-label>
          </q-item-section>
        </template>

        <q-card>
          <q-card-section class="row">
            <div class="col-xs-12 col-sm-4 col-md-4">
              <q-item>
                <q-item-section avatar> <q-icon name="euro" /> </q-item-section>
                <q-item-section> <div>Valor: <b class="text-green text-h6">{{contrato.valor}}</b></div> </q-item-section>
              </q-item>
              <q-item v-if="contrato.fechaFirma">
                <q-item-section avatar> <q-icon name="event" /> </q-item-section>
                <q-item-section> <div>Fecha de la firma: <b class="text-grey-8">{{contrato.fechaFirma}}</b></div> </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar> <q-icon name="credit_card" /> </q-item-section>
                <q-item-section>Método de Pago:</q-item-section>
              </q-item>
              <div style="margin-left: 100px">
                <div class="text-grey-8"><b>{{contrato.paidMethod ? contrato.paidMethod.name : ''}}</b></div>
                <div class="text-grey-8"><b># de cuotas: {{contrato.paidMethod ? contrato.paidMethod.cuota : ''}}</b></div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-4 col-md-4">
              <q-item>
                <q-item-section avatar> <q-icon name="payments" /> </q-item-section>
                <q-item-section>
                  <div class="row items-center">
                    <div class="q-pr-md">Cuotas:</div>
                    <q-btn v-if="(rol === 0 || rol === 1)" no-caps dense outline label="Realizar Cobro" color="primary" icon="add"
                    @click="cobrar()" />
                  </div>
                </q-item-section>
              </q-item>
              <div v-if="contrato.cuotas && contrato.cuotas.length">
                <div v-for="(item, index1) in contrato.cuotas" :key="index1" style="margin-left: 100px">
                  <div class="text-grey-8">{{item.val}} % = <b>{{item.amount}}</b>
                    <q-icon v-if="item.listo === true" size="sm" name="check" color="green"/>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-4 col-md-4">
              <q-item>
                <q-item-section avatar> <q-icon name="point_of_sale" /> </q-item-section>
                <q-item-section>
                  <div class="row items-center">
                    <div class="q-pr-md">Gastos:</div>
                    <q-btn v-if="(rol === 0 || rol === 1)" no-caps dense outline label="Generar Gasto" color="primary" icon="add"
                    @click="setExpenseShow()" />
                  </div>
                </q-item-section>
              </q-item>
              <div v-if="contrato.expenses && contrato.expenses.length">
                <div v-for="(item2, index2) in contrato.expenses" :key="index2" style="margin-left: 100px">
                  <div class="text-grey-8">{{item2.amount}}€ <b>{{item2.userName}}</b></div>
                </div>
                <q-separator horizontal/>
                <div style="margin-left: 57px" class="row">
                  <div class="text-grey text-bold">Total:</div>
                  <div class="text-grey-8 q-ml-sm"><b>{{contrato.expensesTotal}}€</b></div>
                </div>
              </div>
              <div v-else class="text-grey-8" style="margin-left: 100px">Aun no hay gastos</div>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-card>

    <q-card class="q-pa-md q-mt-md bg-primary" style="border-radius:10px">
      <q-expansion-item dark>
        <template v-slot:header>
          <q-item-section avatar>
            <q-icon name="article" color="white" size="md" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-h5">Información del contrato</q-item-label>
            <q-item-label class="text-white text-subtitle1 text-bold">{{contrato.status === 0 ? 'Estado actual: Generado' : contrato.status === 2 ? 'Estado actual: Aprobado' : contrato.status === 4 ? 'Estado actual: Disponible para Op' : contrato.status === 5 ? 'Estado actual: Asignado a OP' : contrato.status === 6 ? 'Estado actual: Disponible para Legal' : contrato.status === 7 ? 'Estado actual: Tomado por Legal' : contrato.status === 8 ? 'Estado actual: Finalizado' : 'Estado actual: Rechazado'}}</q-item-label>
          </q-item-section>
        </template>

        <q-card>
          <q-card-section class="row">
            <div class="col-xs-12 col-sm-6 col-md-6">
              <div class="text-bold">Información del cliente</div>
              <q-item>
                <q-item-section avatar> <q-icon name="account_circle" /> </q-item-section>
                <q-item-section> <div>Nombre: <b>{{contrato.cliente ? contrato.cliente.name : ''}} {{contrato.cliente && contrato.cliente.last_name ? contrato.cliente.last_name : ''}}</b></div> </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar> <q-icon name="perm_identity" /> </q-item-section>
                <q-item-section> <div>DNI: <b>{{contrato.cliente ? contrato.cliente.dni : ''}}</b></div> </q-item-section>
              </q-item>
              <q-item>
                <q-item-section avatar> <q-icon name="phone" /> </q-item-section>
                <q-item-section> <div>Teléfono: <b>{{contrato.cliente ? contrato.cliente.phone1 : ''}}</b></div> </q-item-section>
              </q-item>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6">
              <div class="text-bold">Inmuebles</div>
              <div v-if="contrato.inmueblesInfo && contrato.inmueblesInfo.length">
                <q-item v-for="(item, index) in contrato.inmueblesInfo" :key="index">
                  <q-item-section avatar> <q-icon name="business" /> </q-item-section>
                  <q-item-section>{{item.direccion}}</q-item-section>
                </q-item>
              </div>
              <div v-if="contrato.inmueblesInfo && contrato.inmueblesInfo.length">
                <q-item v-for="(item, index) in contrato.inmueblesInfo" :key="index">
                  <q-item-section avatar> <q-icon name="place" /> </q-item-section>
                  <q-item-section>{{item.provinciaName}}</q-item-section>
                </q-item>
              </div>
              <div v-if="contrato.inmueblesInfo && contrato.inmueblesInfo.length">
                <q-item v-for="(item, index) in contrato.inmueblesInfo" :key="index">
                  <q-item-section avatar> <q-icon name="location_city" /> </q-item-section>
                  <q-item-section>{{item.localidadName}} {{item.cp}}</q-item-section>
                </q-item>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-card>

    <q-card v-if="contrato.status >= 2" class="q-pa-md q-mt-md bg-primary" style="border-radius:10px">
      <q-expansion-item dark >
        <template v-slot:header>
          <q-item-section avatar>
            <q-icon name="folder_open" color="white" size="md" />
          </q-item-section>

          <q-item-section>
            <div class="row items-center">
              <div class="text-h5 q-pr-md">Comentarios de administración</div>
              <div v-if="(rol === 0 || rol === 1)">
                <q-btn no-caps outline label="Generar Tarea" icon="add" color="white"
                @click="otherHito()"/>
              </div>
            </div>
          </q-item-section>
        </template>

        <q-card>
          <q-card-section v-if="hitosGenerales.length">
            <div v-for="(item, index) in hitosGenerales" :key="index" class="q-ma-sm">
              <div class="row">
                <q-icon name="folder_open" size="md" />
                <div class="q-pl-md">
                  <div class="text-subtitle1">{{item.titulo}}</div>
                  <div class="text-grey-8"><b>Fecha de operación:</b> {{item.fecha}}</div>
                  <div class="text-grey-8 text-bold q-mt-sm">Descripción</div>
                  <div class="text-grey-8">{{item.coment}}</div>
                  <div v-if="item.adjunto" class="row items-center q-mt-md cursor-pointer"
                  @click="descargaHito(item)">
                    <q-icon name="save" color="grey-6" size="md" />
                    <div class="q-pl-sm">
                      <div class="text-grey-8 text-bold">Documento</div>
                    </div>
                  </div>
                </div>
              </div>
              <q-separator class="q-my-md" />
            </div>
          </q-card-section>
          <q-card-section v-else class="text-center">No hay comentarios de administración</q-card-section>
        </q-card>
      </q-expansion-item>
    </q-card>

    <q-card v-if="contrato.status >= 2" class="q-pa-md q-mt-md bg-primary" style="border-radius:10px">
      <q-expansion-item dark >
        <template v-slot:header>
          <q-item-section avatar>
            <q-icon name="folder_open" color="white" size="md" />
          </q-item-section>

          <q-item-section>
            <div class="row items-center">
              <div class="text-h5 q-pr-md">Módulo Operativos</div>
              <div v-if="(rol === 5)">
                <q-btn no-caps outline label="Generar Tarea" icon="add" color="white"
                @click="otherHito()"/>
              </div>
            </div>
          </q-item-section>
        </template>

        <q-card>
          <q-card-section v-if="hitosOperativos.length">
            <div v-for="(item, index) in hitosOperativos" :key="index" class="q-ma-sm">
              <div class="row">
                <q-icon name="folder_open" size="md" />
                <div class="q-pl-md">
                  <div class="text-subtitle1">{{item.titulo}}</div>
                  <div class="text-grey-8"><b>Fecha de operación:</b> {{item.fecha}}</div>
                  <div class="text-grey-8 text-bold q-mt-sm">Descripción</div>
                  <div class="text-grey-8">{{item.coment}}</div>
                  <div v-if="item.adjunto" class="row items-center q-mt-md cursor-pointer"
                  @click="descargaHito(item)">
                    <q-icon name="save" color="grey-6" size="md" />
                    <div class="q-pl-sm">
                      <div class="text-grey-8 text-bold">Documento</div>
                    </div>
                  </div>
                </div>
              </div>
              <q-separator class="q-my-md" />
            </div>
          </q-card-section>
          <q-card-section v-else class="text-center">No hay hitos operativos</q-card-section>
        </q-card>
      </q-expansion-item>
    </q-card>

    <q-card v-if="contrato.status >= 2" class="q-pa-md q-mt-md bg-primary" style="border-radius:10px">
      <q-expansion-item dark >
        <template v-slot:header>
          <q-item-section avatar>
            <q-icon name="folder_open" color="white" size="md" />
          </q-item-section>

          <q-item-section>
            <div class="row items-center">
              <div class="text-h5 q-pr-md">Módulo Juridicos</div>
            </div>
          </q-item-section>
        </template>

        <q-card>
          <q-card-section v-if="hitosJuridicos.length">
            <div v-for="(item, index) in hitosJuridicos" :key="index" class="q-ma-sm">
              <div class="row">
                <q-icon name="folder_open" size="md" />
                <div class="q-pl-md">
                  <div class="text-subtitle1">{{item.titulo}}</div>
                  <div class="text-grey-8"><b>Fecha de operación:</b> {{item.fecha}}</div>
                  <div class="text-grey-8 text-bold q-mt-sm">Descripción</div>
                  <div class="text-grey-8">{{item.coment}}</div>
                  <div v-if="item.adjunto" class="row items-center q-mt-md cursor-pointer"
                  @click="descargaHito(item)">
                    <q-icon name="save" color="grey-6" size="md" />
                    <div class="q-pl-sm">
                      <div class="text-grey-8 text-bold">Documento</div>
                    </div>
                  </div>
                </div>
              </div>
              <q-separator class="q-my-md" />
            </div>
          </q-card-section>
          <q-card-section v-else class="text-center">No hay hitos jurídicos</q-card-section>
        </q-card>
      </q-expansion-item>
    </q-card>

    <q-card v-if="contrato.status >= 2" class="q-pa-md q-mt-md bg-primary" style="border-radius:10px">
      <q-expansion-item dark >
        <template v-slot:header>
          <q-item-section avatar>
            <q-icon name="format_align_left" color="white" size="md" />
          </q-item-section>

          <q-item-section>
            <div class="row items-center">
              <div class="text-h5 q-pr-md">Documentación</div>
              <div v-if="(rol === 0 || rol === 1) && contrato.status !== 8">
                <q-btn no-caps outline label="Cargar documentos" icon="add" color="white"
                @click="otherAdjunto()"/>
              </div>
            </div>
          </q-item-section>
        </template>

        <q-card>
          <q-card-section v-if="contrato.adjuntos && contrato.adjuntos.length">
            <div class="row items-start">
              <div v-for="(item, index) in contrato.adjuntos" :key="index" class="row q-mt-md q-pr-lg cursor-pointer"
              @click="descargaAdjunto(item.file)">
                <q-icon name="save" size="md" />
                <div class="q-pl-sm">
                  <div class="text-bold">{{item.name}}</div>
                  <div class="text-grey-8 text-caption">Documento {{index + 1}}</div>
                </div>
              </div>
            </div>
          </q-card-section>
          <q-card-section v-else class="text-center">No hay documentos cargados</q-card-section>
        </q-card>
      </q-expansion-item>
    </q-card>

    <q-dialog v-model="showGasto">
      <q-card class="q-pa-none" style="width:100%">
        <div class="row justify-between q-pa-sm bg-primary" style="width:100%">
          <img src="desocupa 1.png" style="width:150px" />
          <q-btn round flat color="white" icon="clear" v-close-popup />
        </div>
        <div class="text-grey-8 text-center text-h5 q-my-md">Generar Gasto</div>
        <div class="q-px-lg q-pb-xl">
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            Monto del gasto
            <q-input min="0" prefix="€" outlined type="number" v-model.number="formGasto.amount" dense placeholder="Ingrese el monto"
            error-message="Este campo es requerido" :error="$v.formGasto.amount.$error" @blur="$v.formGasto.amount.$touch()" style="width:100%"/>
            <q-input outlined type="textarea" v-model="formGasto.description" dense placeholder="Ingrese una breve descripción del gasto"
            error-message="Este campo es requerido" :error="$v.formGasto.description.$error" @blur="$v.formGasto.description.$touch()" style="width:100%"/>
          </div>
          <q-btn style="width:100%" no-caps label="Guardar" color="primary" size="lg"
          @click="setExpense()"/>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showCobro">
      <q-card class="q-pa-none" style="width:100%">
        <div class="row justify-between q-pa-sm bg-primary" style="width:100%">
          <img src="desocupa 1.png" style="width:150px" />
          <q-btn round flat color="white" icon="clear" v-close-popup />
        </div>
        <div class="text-grey-8 text-center text-h5 q-my-md">Cuotas del contrato</div>
        <div class="q-px-lg q-pb-xl">
          <div class="row">
            <div v-for="(item, index) in formCobro.cuotas" :key="index" class="col-6 q-px-sm q-mb-md">
              <div>Cuota {{index + 1}}</div>
              <q-field outlined dense stack-label>
                <template v-slot:control>
                  <q-checkbox v-model="item.listo" :label="item.val + ' %'" color="green" />
                </template>
              </q-field>
            </div>
          </div>
          <q-btn style="width:100%" no-caps label="Guardar" color="primary" size="lg"
          @click="guardarCobro()"/>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="newHito">
      <q-card class="q-pa-none" style="width:100%">
        <div class="row justify-between q-pa-sm bg-primary" style="width:100%">
          <img src="desocupa 1.png" style="width:150px" />
          <q-btn round flat color="white" icon="clear" v-close-popup />
        </div>
        <div class="text-grey-8 text-center text-h5 q-mt-md">Generar Tarea</div>
        <div class="q-px-lg q-pb-xl">
          <div>
            Nombre de la tarea
            <q-input outlined v-model="form.titulo"  dense placeholder="Ingrese el título"
            error-message="Este campo es requerido" :error="$v.form.titulo.$error" @blur="$v.form.titulo.$touch()"/>
          </div>
          <div>
            Descripción
            <q-input type="textarea" outlined v-model="form.coment" dense
            error-message="Este campo es requerido" :error="$v.form.coment.$error" @blur="$v.form.coment.$touch()"/>
          </div>
          <div v-if="rol === 3">
            Seleccione el operario asignar
            <q-select outlined dense color="black" v-model="form.operario_id" :options="operarios" label="Seleccione el operario" map-options
              error-message="Este campo es requerido" :error="$v.form.operario_id.$error" @blur="$v.form.operario_id.$touch()"
              option-label="name" option-value="_id" emit-value >
                <template v-slot:option="scope">
                  <q-item
                    v-bind="scope.itemProps"
                    v-on="scope.itemEvents"
                  >
                    <q-item-section>
                      <q-item-label v-html="scope.opt.name + ' ' + scope.opt.last_name" />
                    </q-item-section>
                  </q-item>
                </template>
            </q-select>
          </div>
          <div>
            <div class="row items-center q-pb-md">
              <div class="q-pr-md">Archivo</div>
              <q-file dense outlined v-model="adjunto" label="Selecciona un archivo" accept=".pdf">
                <template v-slot:prepend>
                  <q-icon class="cursor-pointer" name="folder" color="primary" />
                </template>
              </q-file>
            </div>
          </div>
          <q-btn style="width:100%" no-caps label="Generar" color="primary" size="lg"
          @click="generar()" />
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="newDocument">
      <q-card class="q-pa-none" style="width:100%">
        <div class="row justify-between q-pa-sm bg-primary" style="width:100%">
          <img src="desocupa 1.png" style="width:150px" />
          <q-btn round flat color="white" icon="clear" v-close-popup />
        </div>
        <div class="text-grey-8 text-center text-h5 q-mt-md">Añadir Archivo</div>
        <div class="q-px-lg q-pb-xl">
          <div>
            Nombre del Archivo
            <q-input outlined v-model="title"  dense placeholder="Ingrese el nombre del archivo"
            error-message="Este campo es requerido" :error="$v.title.$error" @blur="$v.title.$touch()"/>
          </div>
          <div>
            <div class="row items-center q-pb-md">
              <div class="q-pr-md">Archivo</div>
              <q-file dense outlined v-model="documento" label="Selecciona un archivo" accept=".pdf"
              error-message="Este campo es requerido" :error="$v.documento.$error" @blur="$v.documento.$touch()">
                <template v-slot:prepend>
                  <q-icon class="cursor-pointer" name="folder" color="primary" />
                </template>
              </q-file>
            </div>
          </div>
          <q-btn style="width:100%" no-caps label="Guardar" color="primary" size="lg"
          @click="addDocument()" />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import env from '../env'
import { openURL } from 'quasar'
import { required, requiredIf, maxLength, minLength } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      rol: null,
      adjunto: null,
      documento: null,
      hito: false,
      showGasto: false,
      showCobro: false,
      newHito: false,
      newDocument: false,
      title: '',
      baseuHito: '',
      baseuAdjunto: '',
      form: {},
      formGasto: {},
      formCobro: {},
      user: {},
      contrato: {},
      dataFormulario: {},
      operarios: [],
      hitosGenerales: [],
      hitosJuridicos: [],
      hitosOperativos: []
    }
  },
  validations: {
    form: {
      titulo: { required },
      coment: { required },
      operario_id: { required: requiredIf(function () { return this.rol === 3 }) }
    },
    formGasto: {
      amount: { required },
      description: { required, maxLength: maxLength(256), minLength: minLength(6) }
    },
    title: { required },
    documento: { required }
  },
  mounted () {
    this.baseuHito = env.apiUrl + 'hito_file/'
    this.baseuAdjunto = env.apiUrl + 'adjunto_file/'
    this.getData()
  },
  methods: {
    getRol () {
      this.$api.get('user_logueado').then(v => {
        if (v) {
          this.rol = v.roles[0]
          if (this.rol === 0 || this.rol === 1) {
            if (this.contrato.status <= 2) {
              this.hito = true
            } else {
              this.hito = false
            }
          } else if (this.rol === 3) {
            if (this.contrato.status === 4) {
              this.getOperarios()
              this.hito = true
            } else {
              this.hito = false
            }
          } else if (this.rol === 5) {
            if (this.contrato.status === 5) {
              this.hito = true
            } else {
              this.hito = false
            }
          } else if (this.rol === 4) {
            if (this.contrato.status === 7) {
              this.hito = true
            } else {
              this.hito = false
            }
          }
        }
      })
    },
    async getData () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      await this.$api.get('contrato_by_id/' + this.$route.params.id).then(res => {
        if (res) {
          this.contrato = res
          this.hitosGenerales = res.hitosGenerales
          this.hitosJuridicos = res.hitosJuridicos
          this.hitosOperativos = res.hitosOperativos
          this.user = res.comercio
          this.dataFormulario = res
          this.getRol()
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
        }
      })
    },
    getOperarios () {
      this.$api.get('operarios_by_user').then(res => {
        if (res) {
          this.operarios = res
        }
      })
    },
    cobrar () {
      this.formCobro = JSON.parse(JSON.stringify(this.contrato))
      this.showCobro = true
    },
    setExpenseShow () {
      this.formGasto = {}
      this.$v.formGasto.$reset()
      this.showGasto = true
    },
    otherHito () {
      this.adjunto = null
      this.form = {}
      this.$v.form.$reset()
      this.newHito = true
    },
    otherAdjunto () {
      this.title = ''
      this.$v.title.$reset()
      this.documento = null
      this.$v.documento.$reset()
      this.newDocument = true
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
            this.getData()
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
    generar () {
      this.$v.form.$touch()
      if (!this.$v.form.$error) {
        this.$q.loading.show({
          message: 'Generando Tarea...'
        })
        this.form.contrato_id = this.contrato._id
        var formData = new FormData()
        if (this.adjunto) {
          this.form.img = true
          formData.append('file', this.adjunto)
        } else {
          this.form.img = false
        }
        formData.append('dat', JSON.stringify(this.form))
        this.$api.post('generar_hito', formData, {
          headers: {
            'Content-Type': undefined
          }
        }).then(res => {
          if (res) {
            this.getData()
            this.newHito = false
            this.$q.notify({
              message: 'Tarea generada con éxito',
              color: 'positive'
            })
            this.$q.loading.hide()
          } else {
            this.$q.loading.hide()
          }
        })
      }
    },
    addDocument () {
      this.$v.documento.$touch()
      this.$v.title.$touch()
      if (!this.$v.documento.$error && !this.$v.title.$error) {
        this.$q.loading.show({
          message: 'Guardando archivo...'
        })
        var formData = new FormData()
        formData.append('file', this.documento)
        formData.append('dat', JSON.stringify(this.title))
        this.$api.post('subir_archivo/' + this.contrato._id, formData, {
          headers: {
            'Content-Type': undefined
          }
        }).then(res => {
          if (res) {
            this.getData()
            this.newDocument = false
            this.$q.notify({
              message: 'Archivo agregado con éxito',
              color: 'positive'
            })
            this.$q.loading.hide()
          } else {
            this.$q.loading.hide()
          }
        })
      }
    },
    setExpense () {
      this.$v.formGasto.$touch()
      if (!this.$v.formGasto.$error) {
        this.$q.loading.show({
          message: 'Guardando datos...'
        })
        this.formGasto.contract_id = this.contrato._id
        this.$api.post('setExpense', this.formGasto).then(res => {
          if (res) {
            this.$q.notify({
              message: 'Gasto realizado con éxito',
              color: 'positive'
            })
            this.getData()
            this.$q.loading.hide()
            this.showGasto = false
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
    guardarCobro () {
      this.$q.loading.show({
        message: 'Guardando datos...'
      })
      var bool = false
      if (!this.formCobro.cuotas.find(v => v.listo === false)) {
        bool = true
      }
      this.$api.put('status_contrato/' + this.contrato._id, { cuotas: this.formCobro.cuotas, listo: bool }).then(v => {
        if (v) {
          this.getData()
          this.showCobro = false
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
    descargaHito (hito) {
      openURL(this.baseuHito + hito.adjunto)
    },
    descargaAdjunto (data) {
      openURL(this.baseuAdjunto + data)
    }
  }
}
</script>
