"use strict";

const Helpers = use('Helpers')
const mkdirp = use('mkdirp')
const fs = require('fs')
var randomize = require('randomatic');
const User = use("App/Models/User")
const Role = use("App/Models/Role")
const Provincia = use("App/Models/Provincia")
const Localidad = use("App/Models/Localidad")
const { validate } = use("Validator")
const Email = use("App/Functions/Email")

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Show a list of all users.
   * GET users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async allUser({ request, response, auth }) {
    let allUsers = (await User.query().where({}).fetch()).toJSON()
    let users = allUsers.filter(v => v.email !== 'root@desokupa.com')

    users = users.filter(v => v.isDeleted !== true)

    for (let i = 0; i < users.length; i++) {
      users[i].full_name = users[i].name + ' ' + users[i].last_name
      users[i].provincia = (await Provincia.find(users[i].provincia_id)).name
      users[i].localidad = (await Localidad.find(users[i].localidad_id)).name
    }

    response.send(users)
  }

  async userLogueado({ request, response, auth }) {
    const user = (await auth.getUser()).toJSON()
    if (user.roles[0] !== 0) {
      user.full_name = user.name + ' ' + user.last_name
    }
    response.send(user)
  }

  async userInfo({ request, response, auth }) {
    const user = (await auth.getUser()).toJSON()
    response.send(user)
  }

  async userById({ params, response }) {
    try {
      const user = await User.find(params.id)
      user.provincia = await Provincia.find(user.provincia_id)
      user.localidad = await Localidad.find(user.localidad_id)
      user.provincia.localidades = (await Localidad.query().where({provincia_id: user.provincia.id}).fetch()).toJSON()
      response.send(user)
    } catch (error) {
      console.error('user by id: ' + error.name + ':' + error.message)
    }
  }

  async userByRol({ request, auth, response }) {
    try {
      let rol = request.all()
      let allUser = (await User.query().where({}).fetch()).toJSON()
      let user = allUser.filter(v => {
        if (rol.rol.find(x => x === v.roles[0])) {
          return v
        } else {
          return false
        }
      })

      user = user.filter(v => v.isDeleted !== true)

      for (let i = 0; i < user.length; i++) {
        if (user[i].roles[0] === 2) {
          user[i].full_name = user[i].legalName + ' ' + user[i].fancyName
        } else {
          user[i].full_name = user[i].name + ' ' + user[i].last_name
        }
        user[i].provincia = (await Provincia.find(user[i].provincia_id)).name
        user[i].localidad = (await Localidad.find(user[i].localidad_id)).name
      }

      response.send(user)
    } catch (error) {
      console.error('user by rol: ' + error.name + ':' + error.message)
    }
  }

  async operariosByUser ({ request, response, auth }) {
    try {
      const user = (await auth.getUser()).toJSON()
      let operarios = (await User.query().where({roles: [5], lider_id: user._id}).fetch()).toJSON()

      operarios = operarios.filter(v => v.isDeleted !== true)

      for (let i = 0; i < operarios.length; i++) {
        operarios[i].full_name = operarios[i].name + ' ' + operarios[i].last_name
        operarios[i].provincia = (await Provincia.find(operarios[i].provincia_id)).name
        operarios[i].localidad = (await Localidad.find(operarios[i].localidad_id)).name
      }

      response.send(operarios)
    } catch (error) {
      console.error('operarios by user: ' + error.name + ':' + error.message)
    }
  }

  async comerciosByUser ({ request, response, auth }) {
    try {
      const user = (await auth.getUser()).toJSON()
      let comercios = (await User.query().where({roles: [6], inmobiliaria_id: user._id}).fetch()).toJSON()

      comercios = comercios.filter(v => v.isDeleted !== true)

      for (let i = 0; i < comercios.length; i++) {
        comercios[i].full_name = comercios[i].name + ' ' + comercios[i].last_name
        comercios[i].provincia = (await Provincia.find(comercios[i].provincia_id)).name
        comercios[i].localidad = (await Localidad.find(comercios[i].localidad_id)).name
      }

      response.send(comercios)
    } catch (error) {
      console.error('comercios by user: ' + error.name + ':' + error.message)
    }
  }

  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async register({ request, response }) {
      var dat = request.all()
      const validation = await validate(dat, User.fieldValidationRules())
      if (validation.fails()) {
        response.unprocessableEntity(validation.messages())
      } else if (((await User.where({email: dat.email}).fetch()).toJSON()).length) {
        response.unprocessableEntity([{
          message: 'Correo ya registrado en el sistema!'
        }])
      } else {
        let body = dat
        body.estatus = 0
        const user = await User.create(body)
        response.send(user)
      }
  }

  async editUser({ request, response, params }) {
    let user_id = params.id
    let body = request.all()
    delete body.provincia
    delete body.localidad
    let editar = await User.query().where('_id', user_id).update(body)
    response.send(editar)
  }

  async validateEmail({ request, response, params }) {
    if (((await User.where({email: params.email}).fetch()).toJSON()).length) {
      response.unprocessableEntity([{
        message: 'Correo ya registrado en el sistema!',
        error: true
      }])
    } else {
      response.send({error: false})
    }
  }

  async provincias({ request, params, response }) {
    const provincias = (await Provincia.query().where({}).fetch()).toJSON()
    response.send(provincias)
  }
  async localidadesPorId({ params, response }) {
    const id = Number(params.id)
    const localidades = (await Localidad.query().where({ provincia_id: id }).fetch()).toJSON()
    for (const i in localidades) {
      localidades[i].nameFull = localidades[i].name + ' ' + localidades[i].cp
    }
    response.send(localidades)
  }

  async userByStatus({ request, params, response }) {
    let rol = request.all()
    let user = (await User.query().where({roles: rol.rol, estatus: 0}).fetch()).toJSON()
    user = user.filter(v => v.isDeleted !== true)
    response.send(user)
  }

  async updateStatus({ params, request, response }) {
    let dat = request.all()
    let modificar = await User.query().where('_id', params.id).update({estatus: dat.estatus})
    response.send(modificar)
  }
  
  async delete ({ params, request, response }) {
    const { id } = params;
    const user = await User.find(id);
    let userDeleted = await User.query().where('_id', id).update({ isDeleted: true })
    // await user.delete();
    response.send(true)
  }

  async login({ auth, request }) {
    const { email, password } = request.all();
    let token = await auth.attempt(email, password)
    const user = (await User.findBy('email', email)).toJSON()
    let isUser = false
    token.roles = user.roles.map(roleMap => {
      if (roleMap === 3) {
        isUser = true
      }
      return roleMap
    })
    let userRoles = await Role.whereIn('id', token.roles).fetch()
    let permissions = userRoles.toJSON()
    token.permissions = []
    permissions.forEach(element => {
      element.permissions.forEach(element2 => {
        token.permissions.push(element2)
      })
    })

    token.email = user.email
    token.estatus = user.estatus
    token.full_name = user.full_name ? user.full_name : null
    token.last_name = user.last_name
    let data = {}
    data.TRI_SESSION_INFO = token
    return data
  }

    async cambiarPasword ({ params, request, response }) {
      let body = request.all()
      const editarcontraseña = await User.find(params.id)
      editarcontraseña.password = body.password
      await editarcontraseña.save()
      response.send(editarcontraseña)
    }

    async recuperacionapp ({ request, response, params }) {
      if (((await User.where({email: params.email}).fetch()).toJSON()).length) {
        let codigo = randomize('Aa0', 30)
        await User.query().where({email: params.email}).update({codigoRecuperacion: codigo})
        let mail = await Email.sendMail(params.email, 'Recuperacion de Correo', `
            <center>
              <img src="https://petfriendly.eichechile.com/api/obtener_logo" alt="logo" />
            </center>
            <h2 style="text-align:center">
              Haz solicitado restablecer tu contraseña
            </h2>
            <div style="text-align:center">
              Ingrese al link https://app.petfriendlyrecuperacion.com/recuperacion?codigo=${codigo} para restablecer su contraseña
            </div>
            `)
          response.send(mail)
      } else {
        response.unprocessableEntity([{
          message: 'Correo no registrado en el sistema!',
          error: true
        }])
      }
    }

}

module.exports = UserController;
