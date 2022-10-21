'use strict'

/*
|--------------------------------------------------------------------------
| StatusSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Status = use("App/Models/Status")
const statusData = [
  {
    id: 0,
    name: 'Generado',
    description: 'Contrato generado por el comercial'
  },
  {
    id: 1,
    name: 'Llenado',
    description: 'Formulario del contrato completado por el cliente'
  },
  {
    id: 2,
    name: 'Aprobado',
    description: 'Contrato aprobado por el comercial'
  },
  {
    id: 3,
    name: 'Rechazado',
    description: 'Contrato rechazado por el comercial'
  },
  {
    id: 4,
    name: 'Disponible para Operario',
    description: 'Contrato disponible para ser asignado por el Lider OP a uno de sus Operarios'
  },
  {
    id: 5,
    name: 'Asignado a un Operario',
    description: 'Contrato asignado a un Operario'
  },
  {
    id: 6,
    name: 'Disponible para Legal',
    description: 'Contrato disponible para ser asignado a un representante legal'
  },
  {
    id: 7,
    name: 'Asignado a un Legal',
    description: 'Contrato finalizado'
  },
  {
    id: 8,
    name: 'Finalizado',
    description: 'Contrato finalizado'
  }
  
]

class StatusSeeder {
  async run () {
    for (let i in statusData) {
      let status = await Status.findBy('id', statusData[i].id)
      if (!status) {
        await Status.create(statusData[i])
      } else {
        status.name = statusData[i].name
        status.id = statusData[i].id
        status.description = statusData[i].description
        await status.save()
      }
    }
    console.log('Finished Status')
  }
}

module.exports = StatusSeeder
