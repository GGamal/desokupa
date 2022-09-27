<template>
  <div class="q-py-lg q-px-lg">
    <div v-if="listo === false">
      <div class="row justify-center">
        <img src="logo.png" style="width:260px" />
      </div>
      <div class="q-my-lg text-center text-h5 text-bold text-grey-8">FORMULARIO</div>

      <q-card class="q-pa-md q-mb-lg">
        <div class="text-grey-8 text-subtitle1 text-bold">INFORMACIÓN PERSONAL</div>
        <div class="row items-center">
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
              <q-input outlined v-model="form.name" label="Nombre" dense
              error-message="Este campo es requerido" :error="$v.form.name.$error" @blur="$v.form.name.$touch()"/>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
              <q-input outlined v-model="form.dni" label="DNI" dense
              error-message="Este campo es requerido" :error="$v.form.dni.$error" @blur="$v.form.dni.$touch()"/>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
              <q-input outlined v-model.number="form.phone" type="number" label="Teléfono" dense
              error-message="Este campo es requerido" :error="$v.form.phone.$error" @blur="$v.form.phone.$touch()"/>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
              <q-select outlined dense color="black" v-model="provincia" :options="provincias" label="Selecciona una provincia" map-options
                error-message="Este campo es requerido" :error="$v.provincia.$error" @blur="$v.provincia.$touch()" @input="localidades = provincia.localidades, localidad = null, $v.localidad.$reset()"
                option-label="name" >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey text-italic">No hay Resultados</q-item-section>
                    </q-item>
                  </template>
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
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
              <q-select outlined dense color="black" v-model="localidad" :options="localidades" label="Selecciona una localidad" map-options
                error-message="Este campo es requerido" :error="$v.localidad.$error" @blur="$v.localidad.$touch()"
                option-label="name" >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey text-italic">Selecciona una provincia</q-item-section>
                    </q-item>
                  </template>
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
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
              <q-input outlined v-model="form.direccion" label="Dirección" dense
              error-message="Este campo es requerido" :error="$v.form.direccion.$error" @blur="$v.form.direccion.$touch()"/>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
              <q-input outlined v-model="form.email" label="Email" dense
              error-message="Este campo es requerido" :error="$v.form.email.$error" @blur="$v.form.email.$touch()"/>
            </div>
        </div>
      </q-card>

      <q-card class="q-pa-md">
        <div class="text-grey-8 text-subtitle1 text-bold">SITUACIÓN DEL INMUEBLE</div>
        <div class="row">
            <q-radio v-model="form.demencia" label="Sin demencia" :val="false" color="primary" />
            <q-radio v-model="form.demencia" label="Con demencia" :val="true" color="primary" />
        </div>
        <div class="row items-center">
            <q-radio v-model="form.ocupado_no_contrato" label="Ocupado sin contrato" :val="true" color="primary" class="col-xs-12 col-sm-3" />
            <q-input outlined v-model.number="form.tiempo" label="Tiempo estimado" type="number" dense class="col-xs-12 col-sm-9"
            error-message="Este campo es requerido" :error="$v.form.tiempo.$error" @blur="$v.form.tiempo.$touch()"/>
        </div>
        <div class="row items-center justify-between">
            <q-radio v-model="form.alquiler_impago" label="Alquiler Impago" :val="true" color="primary" class="col-xs-12 col-sm-3" />
            <q-input outlined v-model="form.nueva_cuota" label="Nueva de cuotas" dense class="col-xs-12 col-sm-3 q-pr-xs"
            error-message="Este campo es requerido" :error="$v.form.nueva_cuota.$error" @blur="$v.form.nueva_cuota.$touch()"/>
            <q-input outlined v-model="form.importe_deuda" label="Importe de la deuda" dense class="col-xs-12 col-sm-3 q-pr-xs"
            error-message="Este campo es requerido" :error="$v.form.importe_deuda.$error" @blur="$v.form.importe_deuda.$touch()"/>
            <q-input outlined dense v-model="form.fin_deuda" readonly label="Cuando finaliza la deuda" class="col-xs-12 col-sm-3 q-pr-xs" @click="$refs.qDateProxy1.show()"
            error-message="Este campo es requerido" :error="$v.form.fin_deuda.$error" @blur="$v.form.fin_deuda.$touch()">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy1" transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.fin_deuda">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
        </div>
        <div class="row justify-between q-mt-md">
          <div class="col-xs-12 col-sm-4 q-pr-xs column justify-between">
            <div class="text-grey-8">CONTRATO ARRENDAMIENTO FINALIZADO</div>
            <q-radio v-model="form.contrato_finalizado" label="Si" :val="true" color="primary" />
            <q-radio v-model="form.contrato_finalizado" label="No" :val="false" color="primary" />
            <q-input outlined dense v-model="form.fecha_fin_contrato" readonly label="Fecha de finalización" @click="$refs.qDateProxy2.show()"
            error-message="Este campo es requerido" :error="$v.form.fecha_fin_contrato.$error" @blur="$v.form.fecha_fin_contrato.$touch()">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy2" transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.fecha_fin_contrato">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-xs-12 col-sm-4 q-pr-xs column justify-between">
            <div class="text-grey-8">SUMINISTROS AL DÍA (AGUA/LUZ)</div>
            <q-radio v-model="form.suministros" label="Si" :val="true" color="primary" />
            <q-radio v-model="form.suministros" label="No" :val="false" color="primary" />
            <q-input outlined v-model.number="form.personas" type="number" label="Número de personas en el inmueble" dense
            error-message="Este campo es requerido" :error="$v.form.personas.$error" @blur="$v.form.personas.$touch()"/>
          </div>
          <div class="col-xs-12 col-sm-4 q-pr-xs column justify-between">
            <div class="text-grey-8">A NOMBRE DEL INQUILINO</div>
            <q-radio v-model="form.inquilino" label="Si" :val="true" color="primary" />
            <q-radio v-model="form.inquilino" label="No" :val="false" color="primary" />
            <q-input outlined v-model.number="form.inquilino_edad" type="number" label="Edad" dense
            error-message="Este campo es requerido" :error="$v.form.inquilino_edad.$error" @blur="$v.form.inquilino_edad.$touch()"/>
          </div>
        </div>
        <div class="row justify-between q-mt-md">
          <div class="col-xs-12 col-sm-4 q-pr-xs column justify-between">
            <div class="text-grey-8">INQUILINOS/OCUPAS PROBLEMÁTICOS</div>
            <q-radio v-model="form.problematico" label="Si" :val="true" color="primary" />
            <q-radio v-model="form.problematico" label="No" :val="false" color="primary" />
          </div>
          <div class="col-xs-12 col-sm-4 q-pr-xs column justify-between">
            <div class="text-grey-8">MOBILIARIOS DEL INMUEBLE</div>
            <q-radio v-model="form.mobiliarios_inmueble" label="Si" :val="true" color="primary" />
            <q-radio v-model="form.mobiliarios_inmueble" label="No" :val="false" color="primary" />
          </div>
          <div class="col-xs-12 col-sm-4 q-pr-xs column justify-between">
            <div class="text-grey-8">MOBILIARIOS DEL INQUILINO/OCUPA</div>
            <q-radio v-model="form.mobiliarios_inquilino" label="Si" :val="true" color="primary" />
            <q-radio v-model="form.mobiliarios_inquilino" label="No" :val="false" color="primary" />
          </div>
        </div>
        <div class="row justify-between q-mt-md">
          <div class="col-xs-12 col-sm-5 column justify-between">
            <div class="text-grey-8">SI QUIERO QUE ABANDONEN EL INMUEBLE ¿PERDONO DEUDA?</div>
            <q-radio v-model="form.perdon_deuda" label="Si" :val="true" color="primary" />
            <q-radio v-model="form.perdon_deuda" label="No" :val="false" color="primary" />
          </div>
          <div class="col-xs-12 col-sm-5 column justify-between">
            <div class="text-grey-8">POSIBILIDAD DE PAGO Y CONTINUAR CONTRATO DE ARRENDAMIENTO</div>
            <q-radio v-model="form.continuar_contrato" label="Si" :val="true" color="primary" />
            <q-radio v-model="form.continuar_contrato" label="No" :val="false" color="primary" />
          </div>
        </div>
        <div>
          <div class="text-grey-8">DATOS DEL INQUILINO/OCUPA</div>
          <q-input
            v-model="form.detalle_inquilino"
            outlined
            type="textarea"
            error-message="Este campo es requerido"
            :error="$v.form.detalle_inquilino.$error"
            @blur="$v.form.detalle_inquilino.$touch()"
          />
        </div>
        <div class="row justify-between q-mt-md">
          <div class="col-xs-12 col-sm-4 q-pr-xs column justify-between">
            <div class="text-grey-8">ISLA DE ACTUACIÓN</div>
            <q-radio v-model="form.isla_actuacion" label="Gran Canarias" val="Gran Canarias" color="primary" />
            <q-radio v-model="form.isla_actuacion" label="Tenerife" val="Tenerife" color="primary" />
            <q-radio v-model="form.isla_actuacion" label="Fuerteventura" val="Fuerteventura" color="primary" />
            <q-radio v-model="form.isla_actuacion" label="Lanzarote" val="Lanzarote" color="primary" />
            <q-radio v-model="form.isla_actuacion" label="La Palma" val="La Palma" color="primary" />
            <q-radio v-model="form.isla_actuacion" label="La Gomera" val="La Gomera" color="primary" />
            <q-radio v-model="form.isla_actuacion" label="El Hierro" val="El Hierro" color="primary" />
          </div>
          <div class="col-xs-12 col-sm-4 q-pr-xs column justify-between">
            <div class="text-grey-8">¿CÓMO NOS CONOCIÓ?</div>
            <q-radio v-model="form.conocio" label="Medios de comunicación" val="Medios de comunicación" color="primary" />
            <q-radio v-model="form.conocio" label="Amigos/Familiares" val="Amigos/Familiares" color="primary" />
            <q-radio v-model="form.conocio" label="Internet" val="Internet" color="primary" />
            <q-radio v-model="form.conocio" label="Inmobiliaria" val="Inmobiliaria" color="primary" />
            <q-radio v-model="form.conocio" label="Folletos" val="Folletos" color="primary" />
            <q-radio v-model="form.conocio" label="Pancartas" val="Pancartas" color="primary" />
            <q-radio v-model="form.conocio" label="Otros" val="Otros" color="primary" />
          </div>
          <div class="col-xs-12 col-sm-4 q-pr-xs column">
            <div class="text-grey-8">AUTORIZO A DESOKUPA CANARIAS HACER UNA COMPROBACIÓN DE DATOS</div>
            <q-radio v-model="form.comprobar_datos" label="Si" :val="true" color="primary" />
            <q-radio v-model="form.comprobar_datos" label="No" :val="false" color="primary" />
          </div>
        </div>
        <q-checkbox v-model="form.politicas" label="He leido y acepto la política de protección de datos" color="primary" :class="color" class="text-bold cursor-pointer q-mt-md"
        @input="form.politicas ? color = 'text-black' : color = 'text-red'" />

        <div class="row justify-center q-mt-lg">
          <q-btn v-if="!listo" color="primary" label="Enviar formulario" size="lg" style="width: 100%;"
            @click="enviar()"/>
          </div>
          <div class="text-caption q-mt-sm">(LA EMPRESA DESOKUPA CANARIAS, NO SE HACE RESPONSABLE DE LA VERACIDAD DE LOS HECHOS DESCRITOS EN ESTE DOCUMENTO, SIENDO RESPONSABLE DE CUALQUIER DATO ERRÓNEO O INCORRECTO EN EL CLIENTE)</div>
          <div class="text-center q-mt-md">En incumplimiento de lo dispuesto en la <b>Ley Orgánica 15/1999, de Diciembre, de Protección de Datos de Carácter Personal (LOPD) y el RD 1720/2007</b> incluido pues el <b>REGLAMENTO (UE) 2016/679 EUROPEO</b> se informa al usuario que todos los datos que nos proporcione serán incorporados a un fichero, creado y mantenido bajo la responsabilidad de Desokupacanarias</div>
      </q-card>
    </div>

    <q-dialog v-model="listo" maximized persistent>
      <q-card>
        <div class="absolute-center full-width">
          <div class="row justify-center">
            <img src="logo.png" style="width:300px" />
          </div>
          <div class="q-mt-lg text-center text-h5 text-bold text-grey-8">Formulario enviado con éxito</div>
          <div class="q-mt-lg text-center text-grey-8">Para más información comuníquese con el comercial</div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { required, email } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      provincia: null,
      localidad: null,
      listo: null,
      idContrato: '',
      color: 'text-black',
      form: {
        demencia: false,
        ocupado_no_contrato: false,
        alquiler_impago: false,
        contrato_finalizado: false,
        suministros: false,
        inquilino: false,
        problematico: false,
        mobiliarios_inmueble: false,
        mobiliarios_inquilino: false,
        perdon_deuda: false,
        continuar_contrato: false,
        isla_actuacion: 'Gran Canarias',
        conocio: 'Medios de comunicación',
        comprobar_datos: true,
        politicas: false
      },
      provincias: [],
      localidades: []
    }
  },
  validations: {
    form: {
      name: { required },
      dni: { required },
      phone: { required },
      direccion: { required },
      email: { required, email },
      tiempo: { required },
      nueva_cuota: { required },
      importe_deuda: { required },
      fin_deuda: { required },
      fecha_fin_contrato: { required },
      personas: { required },
      inquilino_edad: { required },
      detalle_inquilino: { required }
    },
    provincia: { required },
    localidad: { required }
  },
  mounted () {
    this.getProvincias()
    this.getData(this.$route.params.codigo)
  },
  methods: {
    async getData (id) {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      await this.$api.get('formulario/' + id).then(res => {
        if (res) {
          this.idContrato = res._id
          if (res.status > 0) {
            this.form = res.formulario
            this.provincia = res.formulario.provincia
            this.localidades = res.formulario.provincia.localidades
            this.localidad = res.formulario.localidad
            this.listo = true
          } else {
            this.listo = false
          }
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
        }
      })
    },
    getProvincias () {
      this.$q.loading.show({
        message: 'Cargando datos...'
      })
      this.$api.get('provincias').then(res => {
        if (res) {
          this.provincias = res
          this.$q.loading.hide()
        } else {
          this.$q.loading.hide()
        }
      })
    },
    enviar () {
      this.$v.form.$touch()
      this.$v.provincia.$touch()
      this.$v.localidad.$touch()
      if (!this.form.politicas) {
        this.color = 'text-red'
      }
      if (!this.$v.provincia.$error && !this.$v.localidad.$error && !this.$v.form.$error && this.form.politicas) {
        this.$q.loading.show({
          message: 'Enviando formulario...'
        })
        this.form.provincia_id = this.provincia._id
        this.form.localidad_id = this.localidad._id
        this.form.provincia_name = this.provincia.name
        this.form.localidad_name = this.localidad.name
        this.$api.post('formulario/' + this.idContrato, { data: this.form, status: 1 }).then(res => {
          if (res) {
            this.listo = true
            this.$q.notify({
              message: 'Formulario enviado con éxito',
              color: 'positive'
            })
            this.$q.loading.hide()
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
    }
  }
}
</script>
