'use strict'

/*
|--------------------------------------------------------------------------
| RoleSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Role = use("App/Models/Role")
const roleData = [
  {
    id: 0,
    name: 'Super Admin',
    description: 'Rol de Súper Administrador de DESOKUPA',
    permissions: [1]
  },
  {
    id: 1,
    name: 'Admin',
    description: 'Rol de Administrador de DESOKUPA',
    permissions: [1]
  },
  {
    id: 2,
    name: 'Inmobiliaria',
    description: 'Rol de Inmobiliaria de DESOKUPA',
    permissions: [1]
  },
  {
    id: 3,
    name: 'Lider OP',
    description: 'Rol de Lider Operario de DESOKUPA',
    permissions: [1]
  },
  {
    id: 4,
    name: 'Legal',
    description: 'Rol de Legal de DESOKUPA',
    permissions: [1]
  },
  {
    id: 5,
    name: 'Operario',
    description: 'Rol de Operario de DESOKUPA',
    permissions: [1]
  },
  {
    id: 6,
    name: 'Comercial',
    description: 'Rol de Comercial de DESOKUPA',
    permissions: [1]
  }
  
]

class RoleSeeder {
  async run() {
    for (let i in roleData) {
      let role = await Role.findBy('id', roleData[i].id)
      if (!role) {
        await Role.create(roleData[i])
      } else {
        role.name = roleData[i].name
        role.id = roleData[i].id
        role.description = roleData[i].description
        role.permissions = roleData[i].permissions
        await role.save()
      }
    }
    console.log('Finished Role')
  }
}

module.exports = RoleSeeder
