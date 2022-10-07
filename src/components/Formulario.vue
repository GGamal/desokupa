<template>
  <div>
    <div class="row justify-center">
      <img src="logo.png" style="width:260px" />
    </div>
    <div class="q-my-lg text-center text-h5 text-bold text-grey-8">FORMULARIO</div>

    <q-card class="q-pa-md q-mb-lg">
      <div class="text-grey-8 text-subtitle1 text-bold">INFORMACIÓN DEL CLIENTE</div>
      <div class="row items-center">
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            <q-field label="Nombre" outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{form.name}}</div>
              </template>
            </q-field>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            <q-field label="DNI" outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{form.dni}}</div>
              </template>
            </q-field>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            <q-field label="Teléfono" outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{form.phone}}</div>
              </template>
            </q-field>
          </div>
           <!-- <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            <q-field label="Teléfono" outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{form.pais}}</div>
              </template>
            </q-field>
          </div> -->
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            <q-field label="Pais" outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{form.provincia_name}}</div>
              </template>
            </q-field>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            <q-field label="Moneda" outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{form.localidad_name}}</div>
              </template>
            </q-field>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            <q-field label="Ciudad" outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{form.direccion}}</div>
              </template>
            </q-field>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-grey-9 q-mt-sm q-px-xs">
            <q-field label="Email" outlined dense stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">{{form.email}}</div>
              </template>
            </q-field>
          </div>
      </div>
    </q-card>

    <q-card class="q-pa-md">
      <div class="text-grey-8 text-subtitle1 text-bold">SITUACIÓN DEL INMUEBLE</div>
      <div class="row">
          <q-radio disable v-model="form.demencia" label="Sin demencia" :val="false" color="primary" />
          <q-radio disable v-model="form.demencia" label="Con demencia" :val="true" color="primary" />
      </div>
      <div class="row items-center q-my-sm">
          <q-radio disable v-model="form.ocupado_no_contrato" label="Ocupado sin contrato" :val="true" color="primary" class="col-xs-12 col-sm-3" />
          <q-field label="Tiempo estimado" outlined dense stack-label class="col-xs-12 col-sm-9">
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">{{form.tiempo}}</div>
            </template>
          </q-field>
      </div>
      <div class="row items-center justify-between">
          <q-radio disable v-model="form.alquiler_impago" label="Alquiler Impago" :val="true" color="primary" class="col-xs-12 col-sm-3" />
          <q-field label="Nueva de cuotas" outlined dense stack-label class="col-xs-12 col-sm-3 q-pr-xs q-mt-sm">
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">{{form.nueva_cuota}}</div>
            </template>
          </q-field>
          <q-field label="Importe de la deuda" outlined dense stack-label class="col-xs-12 col-sm-3 q-pr-xs q-mt-sm">
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">{{form.importe_deuda}}</div>
            </template>
          </q-field>
          <q-field label="Cuando finaliza la deuda" outlined dense stack-label class="col-xs-12 col-sm-3 q-pr-xs q-mt-sm">
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">{{form.fin_deuda}}</div>
            </template>
          </q-field>
      </div>
      <div class="row justify-between q-mt-md">
        <div class="col-xs-12 col-sm-4 q-pr-xs column justify-between">
          <div class="text-grey-8 q-mt-sm">CONTRATO ARRENDAMIENTO FINALIZADO</div>
          <q-radio disable v-model="form.contrato_finalizado" label="Si" :val="true" color="primary" />
          <q-radio disable v-model="form.contrato_finalizado" label="No" :val="false" color="primary" />
          <q-field label="Fecha de finalización" outlined dense stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">{{form.fecha_fin_contrato}}</div>
            </template>
          </q-field>
        </div>
        <div class="col-xs-12 col-sm-4 q-pr-xs column justify-between">
          <div class="text-grey-8 q-mt-sm">SUMINISTROS AL DÍA (AGUA/LUZ)</div>
          <q-radio disable v-model="form.suministros" label="Si" :val="true" color="primary" />
          <q-radio disable v-model="form.suministros" label="No" :val="false" color="primary" />
          <q-field label="Número de personas en el inmueble" outlined dense stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">{{form.personas}}</div>
            </template>
          </q-field>
        </div>
        <div class="col-xs-12 col-sm-4 q-pr-xs column justify-between">
          <div class="text-grey-8 q-mt-sm">A NOMBRE DEL INQUILINO</div>
          <q-radio disable v-model="form.inquilino" label="Si" :val="true" color="primary" />
          <q-radio disable v-model="form.inquilino" label="No" :val="false" color="primary" />
          <q-field label="Edad" outlined dense stack-label>
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">{{form.inquilino_edad}}</div>
            </template>
          </q-field>
        </div>
      </div>
      <div class="row justify-between q-mt-md">
        <div class="col-xs-12 col-sm-4 q-pr-xs column justify-between">
          <div class="text-grey-8">INQUILINOS/OCUPAS PROBLEMÁTICOS</div>
          <q-radio disable v-model="form.problematico" label="Si" :val="true" color="primary" />
          <q-radio disable v-model="form.problematico" label="No" :val="false" color="primary" />
        </div>
        <div class="col-xs-12 col-sm-4 q-pr-xs column justify-between">
          <div class="text-grey-8">MOBILIARIOS DEL INMUEBLE</div>
          <q-radio disable v-model="form.mobiliarios_inmueble" label="Si" :val="true" color="primary" />
          <q-radio disable v-model="form.mobiliarios_inmueble" label="No" :val="false" color="primary" />
        </div>
        <div class="col-xs-12 col-sm-4 q-pr-xs column justify-between">
          <div class="text-grey-8">MOBILIARIOS DEL INQUILINO/OCUPA</div>
          <q-radio disable v-model="form.mobiliarios_inquilino" label="Si" :val="true" color="primary" />
          <q-radio disable v-model="form.mobiliarios_inquilino" label="No" :val="false" color="primary" />
        </div>
      </div>
      <div class="row justify-between q-mt-md">
        <div class="col-xs-12 col-sm-5 column justify-between">
          <div class="text-grey-8">SI QUIERO QUE ABANDONEN EL INMUEBLE ¿PERDONO DEUDA?</div>
          <q-radio disable v-model="form.perdon_deuda" label="Si" :val="true" color="primary" />
          <q-radio disable v-model="form.perdon_deuda" label="No" :val="false" color="primary" />
        </div>
        <div class="col-xs-12 col-sm-5 column justify-between">
          <div class="text-grey-8">POSIBILIDAD DE PAGO Y CONTINUAR CONTRATO DE ARRENDAMIENTO</div>
          <q-radio disable v-model="form.continuar_contrato" label="Si" :val="true" color="primary" />
          <q-radio disable v-model="form.continuar_contrato" label="No" :val="false" color="primary" />
        </div>
      </div>
      <div>
        <div class="text-grey-8">DATOS DEL INQUILINO/OCUPA</div>
        <q-field outlined dense stack-label>
          <template v-slot:control>
            <div class="self-center full-width no-outline" tabindex="0">{{form.detalle_inquilino}}</div>
          </template>
        </q-field>
      </div>
      <div class="row justify-between q-mt-md">
        <div class="col-xs-12 col-sm-4 q-pr-xs column justify-between">
          <div class="text-grey-8">ISLA DE ACTUACIÓN</div>
          <q-radio disable v-model="form.isla_actuacion" label="Gran Canarias" val="Gran Canarias" color="primary" />
          <q-radio disable v-model="form.isla_actuacion" label="Tenerife" val="Tenerife" color="primary" />
          <q-radio disable v-model="form.isla_actuacion" label="Fuerteventura" val="Fuerteventura" color="primary" />
          <q-radio disable v-model="form.isla_actuacion" label="Lanzarote" val="Lanzarote" color="primary" />
          <q-radio disable v-model="form.isla_actuacion" label="La Palma" val="La Palma" color="primary" />
          <q-radio disable v-model="form.isla_actuacion" label="La Gomera" val="La Gomera" color="primary" />
          <q-radio disable v-model="form.isla_actuacion" label="El Hierro" val="El Hierro" color="primary" />
        </div>
        <div class="col-xs-12 col-sm-4 q-pr-xs column justify-between">
          <div class="text-grey-8">¿CÓMO NOS CONOCIÓ?</div>
          <q-radio disable v-model="form.conocio" label="Medios de comunicación" val="Medios de comunicación" color="primary" />
          <q-radio disable v-model="form.conocio" label="Amigos/Familiares" val="Amigos/Familiares" color="primary" />
          <q-radio disable v-model="form.conocio" label="Internet" val="Internet" color="primary" />
          <q-radio disable v-model="form.conocio" label="Inmobiliaria" val="Inmobiliaria" color="primary" />
          <q-radio disable v-model="form.conocio" label="Folletos" val="Folletos" color="primary" />
          <q-radio disable v-model="form.conocio" label="Pancartas" val="Pancartas" color="primary" />
          <q-radio disable v-model="form.conocio" label="Otros" val="Otros" color="primary" />
        </div>
        <div class="col-xs-12 col-sm-4 q-pr-xs column">
          <div class="text-grey-8">AUTORIZO A DESOKUPA CANARIAS HACER UNA COMPROBACIÓN DE DATOS</div>
          <q-radio disable v-model="form.comprobar_datos" label="Si" :val="true" color="primary" />
          <q-radio disable v-model="form.comprobar_datos" label="No" :val="false" color="primary" />
        </div>
      </div>
    </q-card>
  </div>
</template>

<script>
export default {
  props: ['data'],
  data () {
    return {
      comercial: {},
      form: {}
    }
  },
  mounted () {
    this.getComercio()
  },
  methods: {
    async getComercio () {
      this.$q.loading.show({})
      this.form = this.data.formulario
      await this.$api.get('user_by_id/' + this.data.comercio_id).then(res => {
        if (res) {
          this.comercial = res
          this.comercial.provincia = this.comercial.provincia.name
          this.comercial.localidad = this.comercial.localidad.name
          this.$q.loading.hide()
        }
      })
    }
  }
}
</script>

<style>

</style>
