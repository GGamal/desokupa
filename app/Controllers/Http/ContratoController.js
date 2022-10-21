'use strict'

const User = use("App/Models/User")
const Cliente = use("App/Models/Cliente")
const Formas = use("App/Models/FormaPago")
const Provincia = use("App/Models/Provincia")
const Inmueble = use("App/Models/Inmueble")
const Income = use("App/Models/Income")
const Localidad = use("App/Models/Localidad")
const Expense = use("App/Models/Expense")
const FormaPago = use("App/Models/FormaPago")
const Contrato = use("App/Models/Contrato")
const Hitos = use("App/Models/Hito")
const Helpers = use('Helpers')
const mkdirp = use('mkdirp')
const moment = require('moment')
var randomize = require('randomatic')
const imageToBase64 = use("image-to-base64")
const PdfMake = use("pdfmake")
const fs = require('fs')
const path = require('path')
let numeral = require('numeral');
numeral.register('locale', 'fr', {
  delimiters: {
    thousands: '.'
  },
  currency: {
    symbol: '€'
  }
});
numeral.locale('fr');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with contratos
 */
class ContratoController {
  /**
   * Show a list of all contratos.
   * GET contratos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, auth }) {
    try {
      const user = (await auth.getUser()).toJSON()
      let contratos = []
      if (user.roles[0] === 0 || user.roles[0] === 1) {
        contratos = (await Contrato.query().where({admin: true}).fetch()).toJSON()
      } else if (user.roles[0] === 6) {
        contratos = (await Contrato.query().where({comercio_id: user._id, $or: [{status: 0}, {status: 1}, {status: 2}, {status: 3}]}).fetch()).toJSON()
      }
      for (let i = 0; i < contratos.length; i++) {
        contratos[i].date = moment(contratos[i].created_at).format('DD/MM/YYYY')
        var cliente = (await Cliente.find(contratos[i].cliente_id))
        contratos[i].pagoInfo = (await Formas.find(contratos[i].formaPago)).name
        if (cliente.type === 1) {
          contratos[i].cliente = cliente.name + ' ' + cliente.last_name
        } else {
          contratos[i].cliente = cliente.name
        }
        contratos[i].valor = numeral(contratos[i].valor).format('0,0€');
      }
      const send = {
        contracts: contratos,
        role: user.roles[0]
      }
      response.send(send)
    } catch (error) {
      console.error('index: ' + error.name + ':' + error.message)
    }
  }

  async contratosByUserId ({ params, response, auth }) {
    try {
      let contratos = (await Contrato.query().where({comercio_id: params.id}).fetch()).toJSON()
      for (let i = 0; i < contratos.length; i++) {
        contratos[i].pagoInfo = (await Formas.find(contratos[i].formaPago)).name
      }

      response.send(contratos)
    } catch (error) {
      console.error('contratos by user id: ' + error.name + ':' + error.message)
    }
  }

  async contratoById ({ params, response, auth }) {
    try {
      let contrato = await Contrato.find(params.id)
      let hitos = (await Hitos.query().where({contrato_id: params.id}).fetch()).toJSON()
      let hitosJuridicos = []
      let hitosOperativos = []
      let hitosGenerales = []
      contrato.expenses = (await Expense.query().where({contract_id: params.id}).fetch()).toJSON()
      contrato.comercio = await User.find(contrato.comercio_id)
      contrato.cliente = await Cliente.find(contrato.cliente_id)
      contrato.comercio.provincia = contrato.comercio.roles[0] === 0 ? '' : (await Provincia.find(contrato.comercio.provincia_id)).name
      contrato.comercio.localidad = contrato.comercio.roles[0] === 0 ? '' : (await Localidad.find(contrato.comercio.localidad_id)).name
      contrato.paidMethod = (await FormaPago.find(contrato.formaPago))
      for (let i = 0; i < hitos.length; i++) {
        hitos[i].fecha = moment(hitos[i].created_at).format('DD/MM/YYYY')
        if (hitos[i].userRole === 0 || hitos[i].userRole === 1) {
          hitosGenerales.push(hitos[i])
        }
        if (hitos[i].userRole === 3 || hitos[i].userRole === 5) {
          hitosOperativos.push(hitos[i])
        }
        if (hitos[i].userRole === 4) {
          hitosJuridicos.push(hitos[i])
        }
      }
      contrato.hitosGenerales = hitosGenerales
      contrato.hitosJuridicos = hitosJuridicos
      contrato.hitosOperativos = hitosOperativos
      contrato.inmueblesInfo = []
      for (let i = 0; i < contrato.inmuebles.length; i++) {
        let data = {}
        data = await Inmueble.find(contrato.inmuebles[i])
        data.provinciaName = (await Provincia.find(data.provincia_id)).name
        data.localidadName = (await Localidad.find(data.localidad_id)).name
        contrato.inmueblesInfo.push(data)
      }
      for (const i in contrato.cuotas) {
        contrato.cuotas[i].amount = numeral((contrato.cuotas[i].val * contrato.valor) / 100).format('0,0€');
      }
      contrato.valor = numeral(contrato.valor).format('0,0€');
      let expensesTotal = 0
      for (const i in contrato.expenses) {
        expensesTotal = expensesTotal + contrato.expenses[i].amount
        contrato.expenses[i].amount = numeral(contrato.expenses[i].amount).format('0,0€');
        contrato.expenses[i].userName 
        const user = (await User.find(contrato.expenses[i].user_id)).toJSON()
        if (user.roles[0] === 0) {
          contrato.expenses[i].userName = user.full_name
        } else {
          contrato.expenses[i].userName = user.name + ' ' +  user.last_name
        }
      }
      contrato.expensesTotal = expensesTotal
      response.send(contrato)
    } catch (error) {
      console.error('contrato by id: ' + error.name + ':' + error.message)
    }
  }

  async contratosByStatus ({ request, response, auth }) {
    try {
      let status = request.all()
      let allContratos = (await Contrato.query().where({}).fetch()).toJSON()
      let contratos = allContratos.filter(v => {
        if (status.status.find(x => x === v.status)) {
          return v
        } else {
          return false
        }
      })
      if (status.type) {
        contratos = contratos.filter(v => v.type === Number(status.type))
      }
      for (let i = 0; i < contratos.length; i++) {
        let comercial = (await User.find(contratos[i].comercio_id)).toJSON()
        let inmobiliaria = await User.find(comercial.inmobiliaria_id)
        contratos[i].pagoInfo = (await Formas.find(contratos[i].formaPago)).name
        contratos[i].date = moment(contratos[i].created_at).format('DD/MM/YYYY')
        contratos[i].pagoCuotas = (await Formas.find(contratos[i].formaPago))
        contratos[i].cliente = (await Cliente.find(contratos[i].cliente_id))
        contratos[i].clientName = contratos[i].cliente.type === 2 ? contratos[i].cliente.name : contratos[i].cliente.name + ' ' + contratos[i].cliente.last_name
        contratos[i].valor = numeral(contratos[i].valor).format('0,0€');
        if (comercial.roles[0] === 6) {
          contratos[i].comercial = comercial.name + ' ' + comercial.last_name
          contratos[i].adminName = comercial.name + ' ' + comercial.last_name
          contratos[i].inmobiliaria = contratos[i].admin ? '' : inmobiliaria.legalName + ' ' + inmobiliaria.fancyName
        }
        if (comercial.roles[0] === 0) {
          contratos[i].comercial = 'No Aplica'
          contratos[i].inmobiliaria = 'No Aplica'
          contratos[i].adminName = comercial.full_name
        } else if (comercial.roles[0] === 1) {
          contratos[i].comercial = 'No Aplica'
          contratos[i].adminName = comercial.name + ' ' + comercial.last_name
          contratos[i].inmobiliaria = 'No Aplica'
        }
      }
      
      response.send(contratos)
    } catch (error) {
      console.error('contratos by status: ' + error.name + ':' + error.message)
    }
  }
  async myContracts ({ request, response, auth }) {
    try {
      const user = (await auth.getUser()).toJSON()
      const id = String(user._id)
      let status = request.all()
      let allContratos = (await Contrato.query().where({}).fetch()).toJSON()
      let contratos = allContratos.filter(v => {
        if (status.status.find(x => x === v.status)) {
          return v
        } else {
          return false
        }
      })
      if (user.roles[0] === 5) {
        contratos = contratos.filter(v => v.operario_id === id)
      }
      if (user.roles[0] === 4) {
        contratos = contratos.filter(v => v.legal_id === id)
      }
      if (status.type) {
        contratos = contratos.filter(v => v.type === Number(status.type))
      }
      for (let i = 0; i < contratos.length; i++) {
        let comercial = (await User.find(contratos[i].comercio_id)).toJSON()
        let inmobiliaria = await User.find(comercial.inmobiliaria_id)
        contratos[i].pagoInfo = (await Formas.find(contratos[i].formaPago)).name
        contratos[i].date = moment(contratos[i].created_at).format('DD/MM/YYYY')
        contratos[i].pagoCuotas = (await Formas.find(contratos[i].formaPago))
        contratos[i].cliente = (await Cliente.find(contratos[i].cliente_id))
        contratos[i].clientName = contratos[i].cliente.type === 2 ? contratos[i].cliente.name : contratos[i].cliente.name + ' ' + contratos[i].cliente.last_name
        contratos[i].valor = numeral(contratos[i].valor).format('0,0€');
        if (comercial.roles[0] === 6) {
          contratos[i].comercial = comercial.name + ' ' + comercial.last_name
          contratos[i].adminName = comercial.name + ' ' + comercial.last_name
          contratos[i].inmobiliaria = contratos[i].admin ? '' : inmobiliaria.legalName + ' ' + inmobiliaria.fancyName
        }
        if (comercial.roles[0] === 0) {
          contratos[i].comercial = 'No Aplica'
          contratos[i].inmobiliaria = 'No Aplica'
          contratos[i].adminName = comercial.full_name
        } else if (comercial.roles[0] === 1) {
          contratos[i].comercial = 'No Aplica'
          contratos[i].adminName = comercial.name + ' ' + comercial.last_name
          contratos[i].inmobiliaria = 'No Aplica'
        }
      }
      
      response.send(contratos)
    } catch (error) {
      console.error('contratos by status: ' + error.name + ':' + error.message)
    }
  }
  
  async contratosByType ({ params, response, auth }) {
    try {
      const user = (await auth.getUser()).toJSON()
      let contratos = (await Contrato.query().where({comercio_id: user._id, type: Number(params.type)}).fetch()).toJSON()
      for (let i = 0; i < contratos.length; i++) {
        var cliente = (await Cliente.find(contratos[i].cliente_id))
        contratos[i].pagoInfo = (await Formas.find(contratos[i].formaPago)).name
        contratos[i].cliente = cliente.type === 2 ? cliente.name : cliente.name + ' ' + cliente.last_name
        contratos[i].date = moment(contratos[i].created_at).format('DD/MM/YYYY')
      }
      
      response.send(contratos)
    } catch (error) {
      console.error('contratos By Type: ' + error.name + ':' + error.message)
    }
  }
  
  async contratosByCuotas ({ request, response, auth }) {
    try {
      let allContratos = (await Contrato.query().where({}).fetch()).toJSON()
      const contratos = allContratos.filter(v => {
        if (v.status > 1 && v.status !== 3) {
          return v
        } else {
          return false
        }
      })
      for (let i = 0; i < contratos.length; i++) {
        var comercial = await User.find(contratos[i].comercio_id)
        var inmobiliaria = await User.find(comercial.inmobiliaria_id)
        contratos[i].pagoInfo = (await Formas.find(contratos[i].formaPago)).name
        contratos[i].pagoCuotas = (await Formas.find(contratos[i].formaPago))
        contratos[i].valor = numeral(contratos[i].valor).format('0,0€');
        contratos[i].cliente = (await Cliente.find(contratos[i].cliente_id))
        contratos[i].clientName = contratos[i].cliente.type === 2 ? contratos[i].cliente.name : contratos[i].cliente.name + ' ' + contratos[i].cliente.last_name
        contratos[i].date = moment(contratos[i].created_at).format('DD/MM/YYYY')
        /* contratos[i].comercial = comercial.full_name ? comercial.full_name : comercial.name + ' ' + comercial.last_name
        contratos[i].inmobiliaria = contratos[i].admin ? '' : inmobiliaria.name + ' ' + inmobiliaria.last_name */
        if (comercial.roles[0] === 6) {
          contratos[i].comercial = comercial.name + ' ' + comercial.last_name
          contratos[i].adminName = comercial.name + ' ' + comercial.last_name
          contratos[i].inmobiliaria = contratos[i].admin ? '' : inmobiliaria.legalName + ' ' + inmobiliaria.fancyName
        }
        if (comercial.roles[0] === 0) {
          contratos[i].comercial = 'No Aplica'
          contratos[i].inmobiliaria = 'No Aplica'
          contratos[i].adminName = comercial.full_name
        } else if (comercial.roles[0] === 1) {
          contratos[i].comercial = 'No Aplica'
          contratos[i].adminName = comercial.name + ' ' + comercial.last_name
          contratos[i].inmobiliaria = 'No Aplica'
        }
      }
      
      response.send(contratos)
    } catch (error) {
      console.error('contratos by status: ' + error.name + ':' + error.message)
    }
  }
  async contractsPayable ({ request, response, auth }) {
    try {
      let allContratos = (await Contrato.query().where({ listo: false }).fetch()).toJSON()
      const contratos = allContratos.filter(v => {
        if (v.status > 1 && v.status !== 3) {
          return v
        } else {
          return false
        }
      })
      for (let i = 0; i < contratos.length; i++) {
        var comercial = await User.find(contratos[i].comercio_id)
        var inmobiliaria = await User.find(comercial.inmobiliaria_id)
        contratos[i].pagoInfo = (await Formas.find(contratos[i].formaPago)).name
        contratos[i].pagoCuotas = (await Formas.find(contratos[i].formaPago))
        contratos[i].valor = numeral(contratos[i].valor).format('0,0€');
        contratos[i].cliente = (await Cliente.find(contratos[i].cliente_id))
        contratos[i].clientName = contratos[i].cliente.type === 2 ? contratos[i].cliente.name : contratos[i].cliente.name + ' ' + contratos[i].cliente.last_name
        contratos[i].date = moment(contratos[i].created_at).format('DD/MM/YYYY')
        /* contratos[i].comercial = comercial.full_name ? comercial.full_name : comercial.name + ' ' + comercial.last_name
        contratos[i].inmobiliaria = contratos[i].admin ? '' : inmobiliaria.name + ' ' + inmobiliaria.last_name */
        if (comercial.roles[0] === 6) {
          contratos[i].comercial = comercial.name + ' ' + comercial.last_name
          contratos[i].adminName = comercial.name + ' ' + comercial.last_name
          contratos[i].inmobiliaria = contratos[i].admin ? '' : inmobiliaria.legalName + ' ' + inmobiliaria.fancyName
        }
        if (comercial.roles[0] === 0) {
          contratos[i].comercial = 'No Aplica'
          contratos[i].inmobiliaria = 'No Aplica'
          contratos[i].adminName = comercial.full_name
        } else if (comercial.roles[0] === 1) {
          contratos[i].comercial = 'No Aplica'
          contratos[i].adminName = comercial.name + ' ' + comercial.last_name
          contratos[i].inmobiliaria = 'No Aplica'
        }
      }
      
      response.send(contratos)
    } catch (error) {
      console.error('contratos by status: ' + error.name + ':' + error.message)
    }
  }
  
  async formulario({ params, response }) {
    try {
      let formulario = (await Contrato.query().where({codigo: params.codigo}).first()).toJSON()
      if (formulario.status > 0) {
        formulario.formulario.provincia = await Provincia.find(formulario.formulario.provincia_id)
        formulario.formulario.localidad = await Localidad.find(formulario.formulario.localidad_id)
        formulario.formulario.provincia.localidades = (await Localidad.query().where({provincia_id: formulario.formulario.provincia.id}).fetch()).toJSON()
      }
      response.send(formulario)
    } catch (error) {
      console.error('formulario: ' + error.name + ':' + error.message)
    }
  }
  
  async contratosAsignadosOperario ({ request, response, auth }) {
    try {
      const user = (await auth.getUser()).toJSON()
      let contratos = (await Contrato.query().where({status: 5, operario_id: user._id}).fetch()).toJSON()
      for (let i = 0; i < contratos.length; i++) {
        var comercial = await User.find(contratos[i].comercio_id)
        var inmobiliaria = await User.find(comercial.inmobiliaria_id)
        // contratos[i].comercial = comercial.full_name ? comercial.full_name : comercial.name + ' ' + comercial.last_name
        // contratos[i].inmobiliaria = contratos[i].admin ? '' : inmobiliaria.name + ' ' + inmobiliaria.last_name
        contratos[i].cliente = (await Cliente.find(contratos[i].cliente_id))
        contratos[i].clientName = contratos[i].cliente.type === 2 ? contratos[i].cliente.name : contratos[i].cliente.name + ' ' + contratos[i].cliente.last_name
        contratos[i].date = moment(contratos[i].created_at).format('DD/MM/YYYY')
        if (comercial.roles[0] === 6) {
          contratos[i].comercial = comercial.name + ' ' + comercial.last_name
          contratos[i].adminName = comercial.name + ' ' + comercial.last_name
          contratos[i].inmobiliaria = contratos[i].admin ? '' : inmobiliaria.legalName + ' ' + inmobiliaria.fancyName
        }
        if (comercial.roles[0] === 0) {
          contratos[i].comercial = 'No Aplica'
          contratos[i].inmobiliaria = 'No Aplica'
          contratos[i].adminName = comercial.full_name
        } else if (comercial.roles[0] === 1) {
          contratos[i].comercial = 'No Aplica'
          contratos[i].adminName = comercial.name + ' ' + comercial.last_name
          contratos[i].inmobiliaria = 'No Aplica'
        }
      }
      
      response.send(contratos)
    } catch (error) {
      console.error('contratos asignados a operario: ' + error.name + ':' + error.message)
    }
  }
  
  async contratosAsignadosLegal ({ request, response, auth }) {
    try {
      const user = (await auth.getUser()).toJSON()
      let contratos = (await Contrato.query().where({status: 7, legal_id: user._id}).fetch()).toJSON()
      for (let i = 0; i < contratos.length; i++) {
        var comercial = await User.find(contratos[i].comercio_id)
        var inmobiliaria = await User.find(comercial.inmobiliaria_id)
        // contratos[i].comercial = comercial.full_name ? comercial.full_name : comercial.name + ' ' + comercial.last_name
        // contratos[i].inmobiliaria = contratos[i].admin ? '' : inmobiliaria.name + ' ' + inmobiliaria.last_name
        contratos[i].cliente = (await Cliente.find(contratos[i].cliente_id))
        contratos[i].clientName = contratos[i].cliente.type === 2 ? contratos[i].cliente.name : contratos[i].cliente.name + ' ' + contratos[i].cliente.last_name
        contratos[i].date = moment(contratos[i].created_at).format('DD/MM/YYYY')
        if (comercial.roles[0] === 6) {
          contratos[i].comercial = comercial.name + ' ' + comercial.last_name
          contratos[i].adminName = comercial.name + ' ' + comercial.last_name
          contratos[i].inmobiliaria = contratos[i].admin ? '' : inmobiliaria.legalName + ' ' + inmobiliaria.fancyName
        }
        if (comercial.roles[0] === 0) {
          contratos[i].comercial = 'No Aplica'
          contratos[i].inmobiliaria = 'No Aplica'
          contratos[i].adminName = comercial.full_name
        } else if (comercial.roles[0] === 1) {
          contratos[i].comercial = 'No Aplica'
          contratos[i].adminName = comercial.name + ' ' + comercial.last_name
          contratos[i].inmobiliaria = 'No Aplica'
        }
      }
      
      response.send(contratos)
    } catch (error) {
      console.error('contratos asignados a legal: ' + error.name + ':' + error.message)
    }
  }
  
  /**
   * Render a form to be used for creating a new contrato.
   * GET contratos/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }
  
  async generarHito ({ request, response, auth }) {
    try {
      const user = (await auth.getUser()).toJSON()
      let data = request.only(['dat'])
      data = JSON.parse(data.dat)
      if (data.img) {
        let codeFile = randomize('Aa0', 30)
        const profilePic = request.file('file', {})
        if (Helpers.appRoot('storage/uploads/hitos')) {
          await profilePic.move(Helpers.appRoot('storage/uploads/hitos'), {
            name: data.titulo + '-' + codeFile.substring(21, codeFile.length - 1) + '.pdf',
            overwrite: true
          })
        } else {
          mkdirp.sync(`${__dirname}/storage/Excel`)
        }
        data.adjunto = profilePic.fileName
      } else {
        data.adjunto = ''
      }
      delete data.img
      data.userRole = user.roles[0]
      const hito = await Hitos.create(data)
      response.send(hito)
    } catch (error) {
      console.error('generar hito: ' + error.name + ':' + error.message)
    }
  }
  
  async generarLink ({ request, response, auth }) {
    try {
      const user = (await auth.getUser()).toJSON()
      let data = request.all()
      data.comercio_id = user._id
      if (user.roles[0] === 0 || user.roles[0] === 1) {
        data.admin = true
      } else {
        data.admin = false
      }
      data.numero = (await Contrato.query().where({}).count()) + 1
      const contrato = await Contrato.create(data)
      response.send(contrato)
    } catch (error) {
      console.error('generar link: ' + error.name + ':' + error.message)
    }
  }
  
  async crearFormulario ({ request, response, params, auth }) {
    try {
      let data = request.all()
      let contrato = await Contrato.find(params.id)
      contrato.formulario = data.data
      contrato.status = data.status
      contrato.save()
      response.send(true)
    } catch (error) {
      console.error('crear formulario: ' + error.name + ':' + error.message)
    }
  }
  
  /**
   * Create/save a new contrato.
   * POST contratos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single contrato.
   * GET contratos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }
  
  /**
   * Render a form to update an existing contrato.
   * GET contratos/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }
  
  /**
   * Update contrato details.
   * PUT or PATCH contratos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async statusUpdate ({ params, request, response, auth }) {
    try {
      let body = request.all()
      const user = (await auth.getUser()).toJSON()
      let contract = (await Contrato.query().where('_id', params.id).first()).toJSON()
      if (body.cuotas) {
        body.paymentStatus = 0
      }
      for (let i in body.cuotas) {
        if (body.cuotas[i].listo === true && !body.cuotas[i].isChecked) {
          let income = {
            amount: (contract.valor * body.cuotas[i].val) / 100,
            user_id: user._id,
            contract_id: params.id
          }
          let newIncome = await Income.create(income)
          body.cuotas[i].isChecked = true
        }
        if (body.cuotas[i].listo === false) {
          body.paymentStatus = 1
        } else {
          body.paymentStatus = 2
        }
      }
      let editar = await Contrato.query().where('_id', params.id).update(body)
      response.send(editar)
    } catch (error) {
      console.error('status update: ' + error.name + ':' + error.message)
    }
  }
  
  /**
   * Delete a contrato with id.
   * DELETE contratos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
  async makeCommercialContractPdf ({ request, response }) {
    let bodyD = request.body
    let body = (await Contrato.query().find(bodyD._id)).toJSON()
    let igic = body.type === 1 ? (body.valor * 7) / 100 : 0
    let total = igic + body.valor
    let client = (await Cliente.query().find(body.cliente_id)).toJSON()
    let provincia = (await Provincia.query().find(client.provincia_id)).toJSON()
    let paidMethod = (await Formas.query().find(body.formaPago)).toJSON()
    let code = body._id.split('').slice(16).join('')
    body.date = moment(body.created_at).format('DD/MM/YYYY')
    body.valor = numeral(body.valor).format('0,0€');
    total = numeral(total).format('0,0€');
    igic = numeral(igic).format('0,0€');
    let header = Helpers.appRoot("public") + `/header.jpeg`;
    header = await imageToBase64(header).then(res => {
      return "data:image/jpeg;base64, " + res;
    })
    
    let footer = Helpers.appRoot("public") + `/footer.jpeg`;
    footer = await imageToBase64(footer).then(res => {
      return "data:image/jpeg;base64, " + res;
    })
    var fonts = {
      Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf'
      }
    }
    var printer = new PdfMake(fonts)
    let docDefinition = {
      pageSize: 'letter',
      // pageOrientation: 'landscape',
      pageMargins: [0, 165, 60, 0],
      header: {
        image: header,
        alignment: 'center',
        width: 620,
        margin: [0, 0, 0, 0],
      },
      footer: {
        image: footer,
        alignment: 'center',
        width: 100,
        margin: [0, 5, 0, 0],
      },
      content: [
        {
          style: 'tableExample',
          table: {
            widths: [320, 220],
            heights: [30, 30],
            body: [
              [
                {
                  alignment: 'left',
                  border: [false, true, false, true],
                  fillColor: '#f50707',
                  margin: [50, 5, 0, 0],
                  style: 'textnormal',
                  text: [
                    { style: 'header', text: `PRESUPUESTO #${code}` }
                  ]
                },
                {
                  alignment: 'right',
                  border: [false, true, false, true],
                  margin: [0, 5, 0, 0],
                  text: [
                    { style: 'header', text: `FECHA: ${body.date}` }
                  ]
                }
              ],
            ]
          },
          layout: {
            hLineColor: '#f50707'
          }
        },
        {
          alignment: 'left',
          style: 'textblack',
          margin: [54, 20, 0, 0],
          text: [
            { style: '', text: `CLIENTE: ${client.name} ${client.type === 1 ? client.last_name : ''}\n` },
          ]
        },
        {
          alignment: 'left',
          style: 'textblack',
          margin: [54, 10, 0, 0],
          text: [
            { style: '', text: `DNI: ${client.dni ? client.dni : ''}\n` },
          ]
        },
        {
          alignment: 'left',
          style: 'textblack',
          margin: [54, 10, 0, 0],
          text: [
            { style: '', text: `TELF.: ${client.phone1 ? client.phone1 : ''}\n` },
          ]
        },
        {
          alignment: 'left',
          style: 'textblack',
          margin: [54, 10, 0, 0],
          text: [
            { style: '', text: `DIRECCIÓN: ${client.direccion ? client.direccion : ''}\n` },
          ]
        },
        {
          alignment: 'left',
          style: 'textblack',
          margin: [54, 10, 0, 20],
          text: [
            { style: '', text: `PROVINCIA: ${provincia.name}\n` },
          ]
        },
        {
          style: 'tableExample',
          table: {
            widths: [320, 220],
            heights: [30, 30],
            body: [
              [
                {
                  alignment: 'left',
                  border: [false, true, false, true],
                  fillColor: '#565554',
                  margin: [50, 5, 0, 0],
                  style: 'textnormal',
                  text: [
                    { style: 'header', text: `DESCRIPCIÓN DE SERVICIO` }
                  ]
                },
                {
                  alignment: 'right',
                  border: [false, true, false, true],
                  margin: [0, 5, 0, 0],
                  text: [
                    { style: 'header', text: `${body.type === 1 ? 'Contrato Desokupa' : 'Contrato 365'}` }
                  ]
                }
              ],
            ]
          },
          layout: {
            hLineColor: '#565554'
          }
        },
        {
          style: 'tableDescription',
          table: {
            widths: [420, 70],
            heights: [30, 30],
            body: [
              [
                {
                  alignment: 'left',
                  border: [false, false, true, true],
                  margin: [0, 5, 0, 0],
                  style: 'textblack',
                  text: [
                    { style: '', text: `${'Contrato ' + body.numero}` }
                  ]
                },
                {
                  alignment: 'center',
                  border: [false, false, false, true],
                  style: 'textblack',
                  margin: [0, 5, 0, 0],
                  fillColor: '#CCC9C8',
                  text: [
                    { style: '', text: `${body.valor}€` }
                  ]
                }
              ],
              [
                {
                  alignment: 'left',
                  border: [false, false, true, true],
                  margin: [40, 5, 0, 0],
                  style: 'textnormal',
                  text: [
                    { style: 'header', text: `` }
                  ]
                },
                {
                  alignment: 'right',
                  border: [false, false, false, true],
                  style: 'textnormal',
                  fillColor: '#CCC9C8',
                  text: [
                    { style: 'header', text: `` }
                  ]
                }
              ],
            ]
          },
          layout: {
            hLineColor: '#999999',
            vLineColor: '#999999'
          }
        },
        {
          style: 'tableDescription',
          table: {
            widths: [420, 70],
            heights: [25, 25],
            body: [
              [
                {
                  alignment: 'left',
                  border: [false, false, true, true],
                  margin: [40, 5, 0, 0],
                  style: 'textnormal',
                  text: [
                    { style: 'header', text: `` }
                  ]
                },
                {
                  alignment: 'right',
                  border: [false, false, false, true],
                  style: 'textnormal',
                  fillColor: '#CCC9C8',
                  text: [
                    { style: 'header', text: `` }
                  ]
                }
              ],
              [
                {
                  alignment: 'left',
                  border: [false, false, true, true],
                  margin: [40, 5, 0, 0],
                  style: 'textnormal',
                  text: [
                    { style: 'header', text: `` }
                  ]
                },
                {
                  alignment: 'right',
                  border: [false, false, false, true],
                  style: 'textnormal',
                  fillColor: '#CCC9C8',
                  text: [
                    { style: 'header', text: `` }
                  ]
                }
              ],
            ]
          },
          layout: {
            hLineColor: '#999999',
            vLineColor: '#999999'
          }
        },
        {
          style: 'tableDescription',
          table: {
            widths: [230, 181, 70],
            heights: [25, 25, 25],
            body: [
              [
                {
                  alignment: 'left',
                  rowSpan: 3,
                  border: [false, false, true, true],
                  margin: [10, 10, 10, 10],
                  fillColor: '#CCC9C8',
                  text: [
                    { style: 'subtitle', text: `Formas de pago:\n` },
                    { style: 'text', text: `${paidMethod.name}\n\n` },
                    { style: 'subtitle', text: `Observaciones:\n` },
                    { style: 'text', text: `` },
                  ]
                },
                {
                  alignment: 'right',
                  border: [false, false, true, false],
                  style: 'textblack',
                  margin: [0, 5, 0, 0],
                  text: [
                    { style: '', text: `SUBTOTAL:` }
                  ]
                },
                {
                  alignment: 'center',
                  border: [false, false, false, true],
                  margin: [0, 5, 0, 0],
                  text: [
                    { style: 'textblack', text: `${body.valor}€` }
                  ]
                }
              ],
              [
                '',
                {
                  alignment: 'right',
                  border: [false, false, true, false],
                  style: 'textblack',
                  margin: [0, 5, 0, 0],
                  text: [
                    { style: '', text: `IGIC 7%:` }
                  ]
                },
                {
                  alignment: 'center',
                  border: [false, false, false, true],
                  margin: [0, 5, 0, 0],
                  text: [
                    { style: 'textblack', text: `${igic > 0 ? igic + '€' : ''}` }
                  ]
                }
              ],
              [
                '',
                {
                  alignment: 'right',
                  border: [false, false, true, false],
                  style: 'textblack',
                  margin: [0, 5, 0, 0],
                  text: [
                    { style: '', text: `TOTAL A COBRAR:` }
                  ]
                },
                {
                  alignment: 'center',
                  border: [false, false, false, true],
                  style: 'textblack',
                  margin: [0, 5, 0, 0],
                  fillColor: '#999999',
                  text: [
                    { style: 'textblack', text: `${total}€` }
                  ]
                }
              ],
            ]
          },
          layout: {
            hLineColor: '#999999',
            vLineColor: '#999999'
          }
        },
        {
          style: 'firma',
          alignment: 'center',
          table: {
            widths: [230],
            heights: [25],
            body: [
              [
                {
                  alignment: 'center',
                  border: [false, false, false, true],
                  margin: [0, 0, 0, 0],
                  text: [
                    { style: '', text: `` },
                  ]
                }
              ],
              [
                {
                  alignment: 'center',
                  border: [false, false, false, false],
                  margin: [0, 0, 0, 0],
                  text: [
                    { style: 'subtitle', text: `Firma Autorizada` },
                  ]
                }
              ]
            ]
          },
          layout: {
            hLineColor: '#999999',
            vLineColor: '#999999'
          }
        },
        {
          image: footer,
          width: 620
        },
      ],
      styles: {
        header: {
          bold: true,
          fontSize: 18,
          margin: [0, 0, 0, 0]
        },
        bigger: {
          bold: true,
          fontSize: 11,
          margin: [0, 0, 0, 0]
        },
        textnormal: {
          fontSize: 11,
          margin: [5, 0, 5, 0],
          color: '#FFFFFF'
        },
        textblack: {
          fontSize: 12,
          margin: [0, 0, 0, 0],
          color: '#000000'
        },
        subtitle: {
          bold: true,
          fontSize: 14,
          margin: [0, 0, 0, 0],
          color: '##666363'
        },
        text: {
          fontSize: 12,
          margin: [0, 0, 0, 0],
          color: '#888787'
        },
        textmargin: {
          fontSize: 11,
          margin: [40, 0, 5, 0]
        },
        tableExample: {
          margin: [0, 5, 0, 0],
        },
        tableDescription: {
          margin: [50, 0, 0, 0],
        },
        firma: {
          margin: [190, 48, 0, 0],
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      }
    }
    var pdfDoc = await printer.createPdfKitDocument(docDefinition)
    var fileName = `contrato.pdf`
    mkdirp.sync(`${Helpers.appRoot()}/storage/uploads/pdf`)
    var filePath = `${Helpers.appRoot("storage/uploads/pdf")}/${fileName}`;
    pdfDoc.pipe(fs.createWriteStream(filePath))
    pdfDoc.end()
    response.send(fileName)
    
  }

  async generarPdfDesokupa ({ params, request, response }) {
    try {
      let data = request.all().cliente
      let data2 = request.all()
      let valor = (await Contrato.query().find(data2._id)).valor
      let inmuebles = []
      for (const i in data2.inmuebles) {
        let inmueble = (await Inmueble.query().find(data2.inmuebles[i])).toJSON()
        let provincia = (await Provincia.query().find(inmueble.provincia_id)).toJSON()
        let localidad = (await Localidad.query().find(inmueble.localidad_id)).toJSON()
        inmueble.localidadName = localidad.name
        inmueble.provinciaName = provincia.name
        inmuebles.push(inmueble)
      }
      var fonts = {
        Roboto: {
          normal: 'fonts/Roboto-Regular.ttf',
          bold: 'fonts/Roboto-Medium.ttf',
          italics: 'fonts/Roboto-Italic.ttf',
          bolditalics: 'fonts/Roboto-MediumItalic.ttf'
        }
      }
      var inm = []
      var contenido = [
        {
          alignment: 'center',
          style: 'textnormal',
          text: [
            'En Las Palmas De Gran Canaria a 28 de Junio de 2021\n\n\n',
            { style: 'header', text: 'CONTRATO DE PRESTACIÓN DE SERVICIOS\n\n\n' }
          ]
        },
        {
          alignment: 'justify',
          style: 'textnormal',
          text: [
            'De una parte, D. JUAN MANUEL SÚAREZ MONTESDEOCA con DNI 54.073.009-D, que actúa como apoderado de la empresa INVERSIONES Y DESARROLLOS NTF S.L, (en adelante, ',
            { style: 'bigger', text: '“DESOKUPACANARIAS”' },
            '), conNIFB-76.362.219 y domicilio social sito Calle Antonio María Manrique No3, 5a Planta , Oficinas 8 y 10 del Edificio IBSA, CP 35011, Las Palmas De Gran Canaria.\n\n',
            'Y de otra parte, ',
            { style: 'bigger', text: `DON ${data.name.toUpperCase()} ${data.last_name.toUpperCase()}` },
            ` con D.N.I: ${data.dni}, que actúa en su propio nombre, con domicilio en la C/ ${data.direccion} y por lo tanto en adelante (en lo sucesivo, `,
            { style: 'bigger', text: 'EL CLIENTE).\n\n\n' },
          ]
        },
        { style: 'header', alignment: 'center', text: 'EXPONEN \n\n' },
        {
          alignment: 'justify',
          style: 'textnormal',
          text: [
            { style: 'bigger', text: 'PRIMERO.' },
            ' Que la mercantil DESOKUPACANARIAS, es una mercantil con amplia experiencia en la negociación e intermediación para la recuperación de la posesión de bienes inmuebles ilegítimamente ocupados. En el desarrollo de dicha actividad, DESOKUPACANARIAS actúa de conformidad con sus protocolos de actuación cuyos principios rectores se fundamentan en el respeto a la legalidad vigente, la inmediatez y la resolución en sus actuaciones fruto de su empatía y capacidad negociadora, evitando situaciones problemáticas.\n\n',
            { style: 'bigger', text: 'SEGUNDO. -' },
            'Que estando el Cliente interesado en contratar los servicios de DESOKUPACANARIAS, relativos a la intermediación inmobiliaria descritos en este contrato y en particular, los servicios de intermediación para la recuperación de la posesión del bien inmueble descrito en la Cláusula primera apartado (II),\n\n',
            'Las partes acuerdan otorgar el presente Contrato con arreglo a las siguientes, \n\n\n'
          ]
        },
        { style: 'header', alignment: 'center', text: 'CLÁUSULAS \n\n' },
        {
          alignment: 'justify',
          style: 'textnormal',
          margin: [5, 0, 5, 10],
          text: [
            { style: 'bigger', text: 'I. OBJETO DEL CONTRATO\n\n' },
            '(I.I). Descripción. - El objeto del presente Contrato es la prestación por parte de DESOKUPACANARIAS al Cliente, de sus servicios profesionales de asesoramiento y ayuda prácticos, destinados a la recuperación de la posesión de bienes inmuebles y/o locales de negocio que se encuentran en una o varias de las situaciones siguientes:(I). ocupados ilegalmente por terceras personas ajenas a la propiedad, al carecer de título alguno para ocupar el mismo; (II). Ocupados por personas físicas o personas jurídicas parte del contrato de arrendamiento del inmueble que, por motivos ajenos a la propiedad, han incurrido en uno o varios incumplimientos contractuales que han dado o pueden dar lugar a la resolución del contrato, talescomo impago de rentas; (III). Ocupados por personas físicas o personas jurídicas parte del contrato de arrendamiento el inmueble una vez extinguido el mismo; o (IV) cualesquiera situaciones que impidan la posesión pacífica y legítima al propietario de un bien inmueble. \n\n',
            'El servicio profesional objeto de este Contrato consiste en el asesoramiento e intermediación en la recuperación de la posesión de un bien inmueble que, no siendo objeto de una ejecución hipotecaria, sea poseído ilegítimamente por un tercero.\n\n',
            'DESOKUPACANARIAS, ofrece un método alternativo que tiene por objeto la resolución amistosa de la controversia existente y la evitación, en la medida de lo posible, de un procedimiento judicial para la recuperación de laposesión.\n\n',
            '(I.I.I). El Cliente contrata el servicio profesional de DESOKUPACANARIAS, en los siguientes términos: (I.I.I.I). Mediación, negociación, asesoramiento y ayuda destinados a la recuperación de la posesión de bienes inmuebles.\n\n',
            '(I.I.I.II). Control de acceso a la propiedad, previa notificación al cliente.\n\n',
            '(I.I.II). La prestación del servicio objeto de este Contrato requiere la concurrencia de las siguientes condiciones, sin cuya acreditación DESOKUPACANARIAS, no prestará el servicio al Cliente:\n\n',
            '(I.I.II.I). La acreditación documental y fehaciente, por parte del Cliente, de su condición de titular o legítimo propietario del bien inmueble objeto del presente Contrato, o legal representante de éste, en su caso.\n\n',
            'Dicha condición se acreditará por medio de Nota del Registro de la Propiedad correspondiente a la localidad en que radique el bien inmueble cuya posesión se pretende recuperar, la cual deberá ser de la misma fecha o posterior a la de este Contrato.\n\n',
            '(I.I.II.II). La acreditación fehaciente por parte del Cliente de las circunstancias que motiven la solicitud de intervención por parte de DESOKUPACANARIAS, para iniciar el procedimiento de negociación en los casos expresamente estipulados y, en concreto, la posesión ilegítima del bien inmueble por parte de untercero.\n\n',
            '(I.I.II.III). La acreditación de dicha circunstancia podrá efectuarse por diversos medios en función de las circunstancias concurrentes, de los cuales, en todo caso, deberá desprenderse, sin ningún género de duda, la posesión ilegítima del bien inmueble por parte de un tercero.\n\n',
            '(I.II). Identificación del inmueble donde se va a prestar el servicio contratado. –El Cliente interesa la recuperación de la posesión del bien inmueble sito en:\n\n',
          ]
        },
        {
          type: 'square',
          style: 'textlist',
          ul: []
        },
        {
          alignment: 'justify',
          style: 'textnormal',
          margin: [5, 20, 5, 0],
          text: [
            '(I.III). Subcontratación del servicio. –El servicio objeto del presente Contrato será dirigido y gestionado directamente por DESOKUPACANARIAS, No obstante, DESOKUPACANARIAS se reserva el derecho a subcontratar, total o parcialmente, con uno o varios terceros, los servicios objeto de contratación.\n\n',
            '(I.IV). De la efectividad de los servicios y del pago del precio.–DESOKUPACANARIAS se obliga a prestar los servicios objeto de este Contrato en su integridad y en los términos y condicionespactados.\n\n',
            'Las obligaciones contraídas por DESOKUPACANARIAS constituyen una obligación de resultado, teniendo derecho el cliente al reembolso íntegro de las cantidades entregadas a DESOKUPACANARIAS, si no se lograra el desalojo efectivo de las viviendas objeto de ocupación.\n\n'
          ]
        },
        {
          alignment: 'justify',
          style: 'textnormal',
          text: [
            { style: 'bigger', text: 'II CONDICIONES ECONÓMICAS\n\n' },
            '(II.I). Precio de los servicios contratados.\n\n'
          ]
        },
        {
          alignment: 'justify',
          style: 'textmargin',
          text: [
            'Por los servicios objeto de este Contrato, que DESOKUPACANARIAS, se obliga a prestar al Cliente, las partes acuerdan el Precio ',
            { style: 'bigger', text: `${valor}€` },
            ' + IGIC, que supone un total de ',
            { style: 'bigger', text: `${((valor * 7) / 100) + valor}€.\n\n` },
          ]
        },
        {
          alignment: 'justify',
          style: 'textnormal',
          text: [
            'Dicho Precio incluye única y exclusivamente la prestación de los servicios descritos en este Contrato, refiriéndose a la desocupación de la vivienda de la edificación. El Precio y/o coste de cuales quiera servicios adicionales a los descritos en este Contrato y en los que fuera aconsejable y/o necesario incurrir para la recuperación de la posesión del bien inmueble quedan excluidos del Precio descrito en el párrafo anterior.\n\n',
            '(II.II). Forma de pago. - El Cliente abonará a DESOKUPACANARIAS, el precio descrito en la Cláusula II.I de la siguiente forma.\n\n',
            `${data2.pagoCuotas.name}\n\n`,
          ]
        },
        {
          type: 'square',
          style: 'textlist',
          ul: []
        },
        {
          alignment: 'justify',
          style: 'textnormal',
          text: [
            '\n\nTodos los pagos, deberán realizarse a la cuenta corriente N.o ES64 3058 6100 9127 2006 9775, cuyo titular es DESOKUPACANARIAS\n\n',
            'Será la empresa DESOKUPACANARIAS la responsable de iniciar las actuaciones necesarias en pro de recuperar la posesión de la vivienda del cliente, utilizando los mecanismos legales que considere oportuno, e incluso iniciar los procedimientos judiciales que a su juicio convengan.\n\n'
          ]
        },
        {
          alignment: 'justify',
          style: 'textnormal',
          text: [
            { style: 'bigger', text: 'III. RESPONSABILIDAD YDILIGENCIA\n\n' },
            'DESOKUPACANARIAS, se obliga a prestar los servicios objeto de este Contrato con la diligencia y calidad debidas.\n\n',
            'Incurrirá en responsabilidad cualquiera de las Partes que actúe de forma negligente o culposa en el cumplimiento de las obligaciones establecidas en el presente Contrato y ocasionare con ello un daño o perjuicio a la otra Parte, pudiendo reclamarse las partes la indemnización correspondiente por dichos daños y perjuicios ocasionados, de conformidad con lo dispuesto por el Código Civil.\n\n'
          ]
        },
        {
          alignment: 'justify',
          style: 'textnormal',
          text: [
            { style: 'bigger', text: 'IV. CAUSAS DE RESOLUCIÓN DELCONTRATO\n\n' },
            'Las Partes acuerdan que el presente Contrato podrá resolverse por las siguientes causas: Por las causas generales de rescisión de los contratos.\n\n',
            '(IV.I). Por la falta de veracidad de la información proporcionada por el Cliente a DESOKUPACANARIAS\n\n',
            '(IV.II). Por la obstaculización, por parte del cliente, del procedimiento de desocupación en tanto en cuanto el presente Contrato se encuentre en vigor.\n\n',
            '(IV.III). El incumplimiento grave de las obligaciones pactadas por cualquiera de las Partes y, especialmente, el incumplimiento de pago del Precio expresamente estipulado y en las condiciones pactadas, dará derecho a la otra Parte a resolver el Contrato con efectos inmediatos, lo cual implicará el cese automático de la prestación del servicio acordado en el presente Contrato, sin que ello implique responsabilidad alguna para DESOKUPACANARIAS.\n\n',
            '(IV.IV). La extinción de la personalidad jurídica de cualquiera de las Partes.\n\n'
          ]
        },
        {
          alignment: 'justify',
          style: 'textnormal',
          text: [
            { style: 'bigger', text: 'V. CONFIDENCIALIDAD Y PROTECCIÓN DEDATOS\n\n' },
            'Para el cumplimiento del presente Contrato es necesario que DESOKUPACANARIAS, actuando como Encargado del tratamiento, acceda a datos personales de clientes, y realice tratamientos en nombre y por cuenta dela Sociedad (responsable deltratamiento).\n\n',
            'El acceso a datos personales por parte de DESOKUPACANARIAS, se somete a las previsiones legales que se contienen en el Reglamento General de Protección de Datos 679/2016 y la Ley Orgánica de Protección de Datos y garantía de Derechos Digitales 3/2018y cualesquiera otras normas vigentes o que en un futuro puedan promulgarse sobre esta materia, incluido, pues, el REGLAMENTO(UE)\n\n',
            'Porestemotivoyencumplimientodelartículoel artículo 28 del RGPD Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016, relativo a la protección de las personas físicas en lo que respecta al tratamiento de datos personales y a la libre circulación de estos datos y por el que se deroga la Directiva 95/46/CE (Reglamento general de protección de datos o RGPD) y el artículo 33 de la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales,ambas Partes definen las condiciones conforme a las cuales DESOKUPACANARIAS, tratará los datos personales a los que tiene acceso durante la prestación de los servicios contratados, estableciendo las obligaciones y responsabilidades derivadas de los tratamientos de datos que realice DESOKUPACANARIAS, exclusivamente para y con ocasión de la prestación de los servicios.\n\n',
            'DESOKUPACANARIAS, se compromete a tratar los datos personales a los que accede como consecuencia de los servicios contratados, según el procedimiento que se ajuste a las instrucciones que en cada momento indique el Cliente y la normativa legal aplicable, limitándose a realizar las actuaciones necesarias para desarrollar correctamente los servicios contratados, y a no aplicarlos o utilizarlos con fin distinto al estipulado en el presente Contrato, ni comunicarlos, ni siquiera para su conservación a otraspersonas.\n\n',
            '(V.I). Derechos y obligaciones del Cliente: \n\n Se obliga a comunicar a DESOKUPACANARIAS, cualquier variación que se produzca de los datos personales facilitados, para que ésta proceda a su actualización.\n\n',
            '(V.II). Derechos y obligaciones de DESOKUPA DESOKUPACANARIAS y todo su personal se obliga a: Llevar, por escrito, un registro de todas las categorías de actividades de tratamiento efectuadas por cuenta del Cliente, que contenga:\n\n',
            '(V.II.I). El nombre y los datos de contacto del encargado o encargados y de cada responsable por cuenta del cual actúe el encargado y, en su caso, del representante del responsable o del encargado y del delegado de protección dedatos.\n\n',
            '(V.II.II). Las categorías de tratamientos efectuados por cuenta del responsable. \n\n (V.II.III). Una descripción general de las medidas técnicas y organizativas de seguridad apropiadas que esté aplicando.\n\n',
            'Mantener a disposición del Cliente la documentación acreditativa del cumplimiento de la obligación establecida en el apartado anterior.\n\n',
            'Garantizar que únicamente accederán a los datos personales los empleados que tengan necesidad de acceder para llevar a cabo sus funciones en relación con los servicios. DESOKUPACANARIAS, dará a conocer y exigirá el cumplimiento al personal de su empresa que realice los servicios, de las obligaciones contenidas en este Contrato y advertirá a dichos empleados del carácter confidencial de la información y de su responsabilidad en caso dedivulgarla.\n\n',
            'En el caso de que los empleados realicen los servicios contratados en los bienes inmuebles del Cliente, dichos empleados se someterán a las normas, procedimientos y demás disposiciones contenidas en el documento de seguridad del Cliente. Asimismo, DESOKUPACANARIAS, llevará a cabo formación necesaria en materia de protección de datos personales a las personas autorizadas para tratar datos personales.\n\n',
            'Cuando las personas afectadas ejerzan los derechos de acceso, rectificación, supresión y oposición, limitación del tratamiento y portabilidad de datos ante DESOKUPACANARIAS, éste debe comunicarlo por correo electrónico a la dirección que indique el Cliente. La comunicación debe hacerse de forma inmediata y en ningún caso más allá del día laborable siguiente al de la recepción de la solicitud, juntamente, en su caso, con otras informaciones que puedan ser relevantes para resolver la solicitud.\n\n',
            'DESOKUPACANARIAS, notificará al responsable del tratamiento, sin dilación indebida antes del plazo máximo de 24 horas, y a través de la dirección de correo electrónico que le indique el Cliente, las violaciones de la seguridad de los datos personales a su cargo de las que tenga conocimiento, juntamente con toda la información relevante para la documentación y comunicación de la incidencia.\n\n',
            'Se facilitará, como mínimo, la información siguiente:\n\n',
            'Descripción de la naturaleza de la violación de la seguridad de los datos personales, inclusive, cuando sea posible, las categorías y el número aproximado de interesados afectados, y las categorías y el número aproximado de registros de datos personales afectados.\n\n',
            'Datos de la persona de contacto para obtener más información.\n\n',
            'Descripción de las posibles consecuencias de la violación de la seguridad de los datos personales. Descripción de las medidas adoptadas o propuestas para poner remedio a la violación de la seguridad de los datos personales, incluyendo, si procede, las medidas adoptadas para mitigar los posibles efectos negativos.\n\n',
            'Si no es posible facilitar la información simultáneamente, y en la medida en que no lo sea, la información se facilitará de manera gradual sin dilación indebida.\n\n',
            'Poner a disposición del Cliente toda la información necesaria para demostrar el cumplimiento de sus obligaciones, así como para la realización de las auditorías o las inspecciones que realicen la Sociedad u otro auditor autorizado por él.\n\n',
            'Implantar las medidas de seguridad técnicas y organizativas necesarias para garantizar la confidencialidad, integridad, disponibilidad y resiliencia permanentes de los sistemas y servicios detratamiento.\n\n',
            'Está obligado a implementar las medidas técnicas y organizativas necesarias que garanticen la seguridad e integridad de los datos de carácter personal a los que tiene acceso, que eviten su alteración, pérdida, tratamiento o acceso no autorizado, habida cuenta del estado de la tecnología, la naturaleza de los datos almacenados y los riesgos a que están expuestos, ya provengan de la acción humana, del medio físico o natural. Las medidas de seguridad mencionadas son las de nivel básico, determinadas en el por el Reglamento General de Protección de Datos 679/2016 y la Ley Orgánica de Protección de Datos y garantía de Derechos Digitales 3/2018 y las que se estipulen en la normativa vigente y de aplicación en cada momento.\n\n',
            'DESOKUPACANARIAS, deberá elaborar un documento de seguridad en los términos exigidos por la normativa aplicable o completar el que ya tuviese, identificando el tratamiento y a la Sociedad e incorporando las medidas de seguridad contempladas en la normativa vigente. Está obligado a guardar bajo su control y custodia los datos personales facilitados por el Cliente, y a no divulgarlos, transferirlos, ni siquiera para su conservación.\n\n',
            'EnelcasodeincumplimientoporpartedeDESOKUPACANARIAS,decualquieradelas estipulaciones de este Contrato, será considerado responsable del tratamiento, debiendo responder de las infracciones en que hubiese incurridopersonalmente.\n\n',
            'La rescisión, resolución o extinción de la relación contractual de prestación deservicios entre la Sociedad y DESOKUPACANARIAS, obligará a este último a cancelar losdatos de carácter personal facilitados por parte del Cliente. DESOKUPACANARIAS, deberá destruir o devolver los datos al Cliente, según manifieste éste, al igual que cualquier otro soporte o documento en que conste algún dato de carácter personal objeto del tratamiento. Sin perjuicio de lo anterior, DESOKUPACANARIAS, podrá conservar los datos a cuya conservación venga legalmente obligado, y únicamente por el plazo de tiempo y para los fines legalmente establecidos. Los datos de quienes suscriben y firman el presente Contrato, serán tratados por las partes con la exclusiva finalidad de gestionar su desarrollo y dar cumplimiento a las obligaciones legales derivadas del mismo. Dichos datos serán conservados durante el plazo necesario para atender las correspondientes responsabilidades legales. Se informa a las Partes y a los firmantes de la posibilidad de ejercer sus derechos de acceso, rectificación o supresión, oposición, limitación a su tratamiento, y portabilidad, en los términos previstos en la normativa de protección de datos, previa acreditación de suidentidad, dirigiéndose por escrito a las direcciones que figuran en el encabezado de este contrato.\n\n',
            'DESOKUPACANARIAS, se obliga a mantener estricta confidencialidad sobre aquellos datos, documentos y demás información que haya sido suministrada por el CLIENTE o en la ejecución del contrato, en cualquier caso, se debe de mantener la información del CLIENTE, con carácter confidencial de forma indefinida, sin poder utilizar la información sin permiso expreso y por escrito del mismo.\n\n',
          ]
        },
        {
          alignment: 'justify',
          style: 'textnormal',
          text: [
            { style: 'bigger', text: 'VI. JURISDICCIÓN\n\n' },
            'Ambas partes, con renuncia expresa de su fuero si lo tuvieren, se someten en forma expresa a la Jurisdicción y Competencia de los Juzgados y Tribunales de Las Palmas de Gran Canaria\n\n',
            'Y para que conste, se extiende este Contrato, por duplicado, enlugar y fecha indicados, firmando las partes interesadas después de haberlo leído, quedar enterado de su contenido y aceptar íntegramente sus consecuencias, en el lugar y fecha indicados en el encabezamiento.\n\n',
          ]
        },
        {
          fontSize: 9,
          margin: [5, 60, 5, 0],
          columns: [
            {
              alignment: 'center',
              text: [
                'LA EMPRESA.\n',
                'D. JUAN MANUEL SÚAREZ MONTESDEOCA'
              ]
            },
            {
              alignment: 'center',
              text: [
                'EL CLIENTE\n',
                `DON ${data.name.toUpperCase()} ${data.last_name.toUpperCase()}`
              ]
            }
          ]
        },
      ]
      for (let i in inmuebles) {
        let e = inmuebles[i].direccion + ' ubicado en la provincia: ' + inmuebles[i].provinciaName + ' en la localidad: ' + inmuebles[i].localidadName
        contenido[6].ul.push(e)
      }
      for (let i in data2.cuotas) {
        let e = data2.cuotas[i].val + '% Equivalente a ' + numeral((data2.cuotas[i].val * valor) / 100).format('0,0€');
        contenido[11].ul.push(e)
      }
      
      var printer = new PdfMake(fonts)
      let docDefinition = {
        pageSize: 'letter',
        // pageOrientation: 'landscape',
        pageMargins: [60, 60, 60, 60],
        content: contenido,
        styles: {
          header: {
            bold: true,
            fontSize: 12,
            margin: [5, 0, 5, 12]
          },
          bigger: {
            bold: true,
            fontSize: 11,
            margin: [0, 0, 0, 0]
          },
          textnormal: {
            fontSize: 11,
            margin: [5, 0, 5, 0]
          },
          textlist: {
            fontSize: 11,
            margin: [15, 0, 15, 0]
          },
          textmargin: {
            fontSize: 11,
            margin: [40, 0, 5, 0]
          }
        }
      }
      var pdfDoc = await printer.createPdfKitDocument(docDefinition)
      var fileName = `ContratoDesokupa.pdf`
      mkdirp.sync(`${Helpers.appRoot()}/storage/uploads/pdf`)
      var filePath = `${Helpers.appRoot("storage/uploads/pdf")}/${fileName}`;
      pdfDoc.pipe(fs.createWriteStream(filePath))
      pdfDoc.end()
      response.send(fileName)
    } catch (error) {
      console.error('generar pdf: ' + error.name + ':' + error.message)
    }
  }

  async generarPdf365 ({ params, request, response }) {
    try {
      let data = request.all().cliente
      let data2 = request.all()
      let inmuebles = []
      for (const i in data2.inmuebles) {
        let inmueble = (await Inmueble.query().find(data2.inmuebles[i])).toJSON()
        let provincia = inmueble.provincia_id ? (await Provincia.query().find(inmueble.provincia_id)).toJSON() : ''
        let localidad = inmueble.localidad_id ? (await Localidad.query().find(inmueble.localidad_id)).toJSON() : ''
        inmueble.localidadName = localidad ? localidad.name : ''
        inmueble.provinciaName = provincia ? provincia.name : ''
        inmuebles.push(inmueble)
      }
      let logo = Helpers.appRoot("public") + `/logo.png`;
      logo = await imageToBase64(logo).then(res => {
        return "data:image/png;base64, " + res;
      })
 
      var fonts = {
        Roboto: {
          normal: 'fonts/Roboto-Regular.ttf',
          bold: 'fonts/Roboto-Medium.ttf',
          italics: 'fonts/Roboto-Italic.ttf',
          bolditalics: 'fonts/Roboto-MediumItalic.ttf'
        }
      }
      var printer = new PdfMake(fonts)
      var contenido = [
        {
          alignment: 'justify',
          columns: [
            [// COLUMNA UNO
              // PAGINA UNO
              {
                style: 'header',
                text: [
                  'En Las Palmas De Gran Canaria a 1 de mayo de 2021 \n\n',
                  { alignment: 'center', text: 'CONTRATO DE ARRENDAMIENTO DE SERVICIOS' }
                ]
              },
              {
                style: 'textnormal',
                text: [
                  'De una parte,\n',
                  'D. JUAN MANUEL SÚAREZ MONTESDEOCA con DNI 54.073.009-D, que actúa como apoderado de la empresa INVERSIONES Y DESARROLLOS NTF s.l.(en adelante, “DESOKUPACANARIAS”), con NIF B-76.362.219 y domicilio social sito en la Calle Antonio María Manrique No3, 5a Planta, Oficinas 8 y 10 del Edificio IBSA, CP 35011, Las Palmas De Gran Canaria.\n\n',
                  'Y de otra parte,\n',
                  `D. ${data.name.toUpperCase()} ${data.type === 1  ? data.last_name.toUpperCase() : ''} con D.N.I ${data.dni}, con dirección en ${data.direccion}, Las Palmas de Gran Canaria, en adelante el cliente.\n\n`
                ]
              },
              { style: 'header', alignment: 'center', text: 'EXPONEN' },
              {
                style: 'textnormal',
                text: [
                  { style: 'bigger', text: 'PRIMERO.-' },
                  ' Que la mercantil ',
                  { style: 'bigger', text: 'DESOKUPACANARIAS,' },
                  ' es una mercantil con amplia experiencia en la negociación e intermediación para la recuperación de la posesión de bienes inmuebles que han sido ocupados ilegalmente o en su defecto, que están en posesión de arrendatarios con incumplimientos contractuales de diversa índole.\n',
                  'En el desarrollo de dicha actividad, ',
                  { style: 'bigger', text: 'DESOKUPACANARIAS' },
                  ' actúa de conformidad con sus protocolos, cuyos principios rectores se fundamentan en el respeto a la legalidad vigente, la inmediatez y el éxito en la resolución de conflictos relacionados con los inmuebles, fruto de su empatía y capacidad negociadora, evitando situaciones problemáticas, logrando acuerdos inmediatos que evitan el acudir a la vía judicial.\n\n',
                  { style: 'bigger', text: 'SEGUNDO.-' },
                  ' Que estando el Cliente interesado en contratar los servicios de ',
                  { style: 'bigger', text: 'DESOKUPACANARIAS' },
                  ' relativos a la intermediación inmobiliaria en lo descritos en este contrato y en particular, los servicios de intermediación para la recuperación de la posesión del bien inmueble descrito en la Cláusula primera.\n\n',
                  'Las partes acuerdan otorgar el presente Contrato con arreglo a las siguientes.\n\n'
                ]
              },
              { style: 'header', alignment: 'center', text: 'CLÁUSULAS' },
              {
                style: 'textnormal',
                text: [
                  { style: 'bigger', text: '1. OBJETO DEL CONTRATO Y SERVICIOS CONTRATADOS.\n\n' },
                  'El objeto del presente Contrato, es la prestación por parte de ',
                  { style: 'bigger', text: 'DESOKUPACANARIAS' },
                  ' al Cliente, de sus servicios profesionales de asesoramiento y ayuda prácticos, destinados a la recuperación de la posesión de bienes inmuebles y/o locales de negocio que se encuentran en una o varias de las situaciones siguientes:\n'
                ]
              },
              // PAGINA DOS
              {
                style: 'textitem',
                margin: [40, 30, 5, 0],
                text: [
                  'I. En el caso de que la vivienda del cliente haya sido ocupada de forma ilegal, éste deberá comunicarlo inmediatamente a la empresa ',
                  { style: 'bigger', text: 'DESOKUPACANARIAS,' },
                  ' por cualquiera de los medios establecidos para tal fin. Si dicha ocupación se hubiese producido con anterioridad a la firma del presente contrato, la empresa quedará exonerada de la prestación del servicio correspondiente.\n',
                  'II. En el caso de que el cliente tuviese una vivienda arrendada y el arrendador dejase de abonar las rentas, la empresa ',
                  { style: 'bigger', text: 'DESOKUPACANARIAS,' },
                  ' prestará los servicios contratados, si dichas rentas corresponden a los meses posteriores a la firma del presente contrato y con carácter general suman tres mensualidades sucesivas o alternativas. Si la empresa detectase que antes de la firma del presente contrato ya existiesen rentas impagadas,la empresa quedará exonerada de la prestación del servicio correspondiente.\n',
                  'III. Dentro del período de vigencia del presente contrato, el cliente tendrá derecho a que presten los servicios contratados por la empresa ',
                  { style: 'bigger', text: 'DESOKUPACANARIAS,' },
                  ' una sola vez; por tanto si la empresa interviniera en alguna desocupación o en la recuperación de la vivienda por impago de rentas o bien porque el contrato haya finalizado, y cualquiera de estos incidentes se produjesen de nuevo en el período anual de vigencia del contrato, la empresa ',
                  { style: 'bigger', text: 'DESOKUPACANARIAS' },
                  'quedará exonerada de la prestación del servicio correspondiente.\n'
                ]
              },
              {
                style: 'textnormal',
                text: [
                  { style: 'bigger', text: 'MEDIOS DE COMPROBACIÓN TRAS LA FORMALIZACIÓN DEL PRESENTE CONTRATO:' },
                  ' El cliente autoriza expresamente a la empresa ',
                  { style: 'bigger', text: 'DESOKUPACANARIAS,' },
                  ' o la persona que se designe para tal fin, a realizar las comprobaciones necesarias,que permitan determinar si en el momento del perfeccionamiento del presente contrato, el inmueble para el que se contrata el servicio, se encuentra libre de ocupantes, o por el contrario está ocupado por sus arrendatarios o en todo caso, por personas ajenas a la propiedad. Todo ello se hará durante las primeras 72 horas, tras la firma del presente contrato.\n\n'
                ]
              },
              {
                style: 'textnormal',
                text: [
                  { style: 'bigger', text: '5. CONFIDENCIALIDAD DE LOS DATOS.\n\n' },
                  { style: 'bigger', text: 'DESOKUPACANARIAS,' },
                  ' se obliga a tramitar confidencialmente todos aquellos datos, documentación y demás información que hayan sido suministrados por el Cliente durante la vigencia del presente contrato. El acuerdo de confidencialidad establecido en el presente pacto tendrá validez durante la vigencia del contrato y seguirá en vigor, durante 2 años más después de la extinción, por cualquier causa, del mismo. \n\n'
                ]
              },
              // PAGINA TRES
              {
                style: 'bigger',
                alignment: 'center',
                margin: [0, 40, 0, 0],
                text: [
                  'ES64 3058 6100 9127 2006 9775 \n',
                  'CONCEPTO: Servicio 365 (365PF2021002) \n\n'
                ]
              },
              {
                style: 'textnormal',
                text: [
                  { style: 'bigger', text: '9. DEFICIENCIAS EN LOS SERVICIOS CONTRATADOS.\n\n' },
                  'Si el CLIENTE encontrara defectos en los servicios contratados con el ',
                  { style: 'bigger', text: 'DESOKUPACANARIAS,' },
                  ' se lo hará saber por escrito o verbalmente, debiendo resolverse dichas deficiencias en el plazo de 30 días. Si no se solucionasen los problemas derivados de las prestaciones deficientes en el plazo establecido, el CLIENTE podrá resolver el contrato. En todo caso, ',
                  { style: 'bigger', text: 'DESOKUPACANARIAS,' },
                  ' establece y presta sus servicios de conformidad con la información y documentación proporcionada por el Cliente, no haciéndose responsable de la falta de veracidad o inexactitud de la misma y sin que el Cliente tenga derecho a la devolución del Precio para el supuesto de que la actuación de ',
                  { style: 'bigger', text: 'DESOKUPACANARIAS,' },
                  ' resulte estéril por dichos motivos.\n\n'
                ]
              },
              {
                style: 'textnormal',
                text: [
                  { style: 'bigger', text: '10. RESCISIÓN DEL CONTRATO.\n\n' },
                  'Además de las causas generales de rescisión de los contratos, el presente se considerará cancelado por las siguientes causas:\n\n',
                  'a)     Por la insolvencia definitiva o provisional, quiebra o suspensión de pagos de cualquiera de las  partes contratantes.\n',
                  'b)     Por el acuerdo de liquidación de cualquiera de los contratantes.\n',
                  'c)     Por cualquier causa legamente establecida.\n\n'
                ]
              },
              {
                style: 'textnormal',
                text: [
                  { style: 'bigger', text: '11. RÉGIMEN DEL CONTRATO.\n\n' },
                  'Este contrato tiene forma de arrendamiento de servicios configurando por tanto un contrato de carácter mercantil y se regirá por sus propias cláusulas o, en lo que en ellas no estuviera contemplado, por lo previsto en las disposiciones españolas contenidas en el Código de Comercio, Leyes especiales y usos mercantiles.\n\n'
                ]
              },
              {
                style: 'textnormal',
                text: [
                  { style: 'bigger', text: '12. DERECHO DE DESISTIMIENTO.\n\n' },
                  'Tal y como establece el artículo 71 de la Ley General para la Defensa de los Consumidores y Usuarios y otras leyes complementarias, aprobado por el Real Decreto Legislativo 1/2007, de 16 de noviembre, así como lo dispuesto en el Capítulo III del Título III de la Ley 3/2014, de 27 de marzo, por la que se modifica el texto refundido de la Ley antes mencionada, el Cliente dispondrá de un plazo de 14 días naturales para ejercer el derecho de desistimiento desde la celebración del contrato sin necesidad de justificación alguna (en este caso, desde la aceptación de la propuesta económica). Por tanto, el plazo de desistimiento expirará a los 14 días naturales desdeel día de la celebración del contrato.\n'
                ]
              },
              // PAGINA CUATRO
              {
                style: 'textnormal',
                italics: true,
                margin: [40, 40, 40, 0],
                text: 'resolución de conflictos, que conlleven a la puesta en disposición del arrendador de la finca arrendada, quedando autorizada también para el ejercicio de acciones judiciales que considere pertinentes, en defensa del cumplimiento íntegro de las cláusulas establecidas en el correspondiente contrato”\n\n'
              },
              {
                style: 'textnormal',
                margin: [0, 0, 0, 0],
                text: [
                  { style: 'bigger', text: '14. SOMETIMIENTO AL FUERO.\n\n' },
                  'Las partes, con renuncia al fuero propio si lo tuvieran, se someten a los Juzgados y Tribunales de Las Palmas de Gran Canaria y por ello, en la fecha y lugar al principio reseñados, se firma este contrato, en todas sus hojas, por duplicado y a un solo efecto.\n\n\n\n'
                ]
              },
              { style: 'bigger2', text: 'Inmuebles del contrato\n' },
              {
                type: 'square',
                style: 'textlist',
                ul: []
              },
              {
                style: 'textnormal',
                columns: [
                  { alignment: 'center', style: 'bigger', text: 'LA EMPRESA.' },
                  { alignment: 'center', style: 'bigger', text: 'EL CLIENTE' }
                ]
              },
              {
                style: 'textnormal',
                fontSize: 8,
                text: '\n\n\n D. JUAN MANUEL SÚAREZ MONTESDEOCA'
              }
            ],
            [// COLUMNA DOS
              {
                style: 'textitem',
                text: [
                  '(I) ocupados ilegalmente por terceras personas ajenas a la propiedad, al carecer de título alguno para ocupar el mismo;\n',
                  '(II)ocupados por personas físicas o personas jurídicas que forma parte del contrato de arrendamiento del inmueble que, por motivos ajenos a la propiedad, han incurrido en uno o varios incumplimientos contractuales que han dado o pueden dar lugar a la resolución del contrato, tales como impago de rentas;\n',
                  '(III) ocupados por personas físicas o personas jurídicas parte del contrato de arrendamiento del inmueble una vez extinguido el mismo; o\n',
                  '(IV) cualesquiera situaciones que impidan la posesión pacífica y legítima al propietario de un bien inmueble\n'
                ]
              },
              {
                style: 'textnormal',
                text: [
                  'El servicio profesional objeto de este Contrato consiste en el asesoramiento y mediación en la recuperaciónde la posesión de un bien inmueble que, no siendo objeto de una ejecución hipotecaria, sea poseído ilegítimamente por un tercero o que se encuentra en posesión de algún arrendatario, que por circunstancias ajenas al arrendador, ha dejado de abonar las cuotas arrendaticias o está en posesión de una vivienda con un contrato de arrendamiento vencido.\n',
                  'Adicionalmente a los servicios descritos, se incluyen todos los servicios jurídicos necesarios, hasta la recuperación del inmueble.\n\n'
                ]
              },
              {
                style: 'textnormal',
                text: [
                  { style: 'bigger', text: '2. BIEN INMUEBLE OBJETO DE PRESTACIÓN DE SERVICIO:\n\n' },
                  'El inmueble para el que se formaliza el presente contrato será el siguiente: \n\n',
                  { style: 'bigger', text: `C/ ${data.direccion}\n\n` }
                ]
              },
              {
                style: 'textnormal',
                text: [
                  { style: 'bigger', text: '3. DURACIÓN DEL CONTRATO.\n\n' },
                  'Los servicios y funciones descritos en la cláusula anterior, se prestarán por parte ',
                  { style: 'bigger', text: 'DESOKUPACANARIAS' },
                  ' por un plazo inicial de \n',
                  { style: 'bigger', text: '12 meses (desde la firma),' },
                  ' que se renovará tácitamente por periodos anuales, de no mediar preaviso, al menos con un mes de antelación a su término por cualquiera de las partes, siempre y cuando antes de su vencimiento, la ',
                  { style: 'bigger', text: 'DESOKUPACANARIAS' },
                  ' haya percibido el precio del servicio, estipulado en el presente contrato.\n\n'
                ]
              },
              {
                style: 'textnormal',
                text: [
                  { style: 'bigger', text: '4. CONDICIONES PREVIAS PARA LA INTERVENCIÓN DE DESOKUPACANARIAS.\n\n' },
                  'La empresa ',
                  { style: 'bigger', text: 'DESOKUPACANARIAS,' },
                  ' se compromete a realizar los servicios contratados en el presente contrato, siempre y cuando se cumplan las siguientes condiciones:\n'
                ]
              },
              // PAGINA DOS
              {
                style: 'textnormal',
                margin: [5, 50, 5, 0],
                text: [
                  { style: 'bigger', text: '6. PROTECCIÓN DE DATOS PERSONALES.\n\n' },
                  { style: 'bigger', text: 'DESOKUPACANARIAS' },
                  ' informa al CLIENTE de que los datos personales contenidos en el presente contrato y los generados durante la vigencia de esta relación contractual, todos ellos relativos al CLIENTE, serán incorporados a un fichero cuyo responsable es el Asesor, con la finalidad de gestionar dicha relación contractual y de prestar al CLIENTE aquellos servicios de asesoramiento que se especifiquen en el presente contrato. \n',
                  'El CLIENTE tiene la posibilidad de ejercitar los derechos de acceso, rectificación, cancelación y oposición, en relación a sus datos personales, dirigiendo un escrito a la dirección del ',
                  { style: 'bigger', text: 'DESOKUPACANARIAS,' },
                  ' indicada en el encabezamiento del presente contrato.\n',
                  'Respecto de los datos personales a los que el ',
                  { style: 'bigger', text: 'DESOKUPACANARIAS' },
                  ' tenga acceso de acuerdo con su condición de “Encargado de Tratamiento”(*), se entenderán facilitados de forma voluntaria por el CLIENTE, siguiendo en todo momento el ',
                  { style: 'bigger', text: 'DESOKUPACANARIAS' },
                  ' sus instrucciones, comprometiéndose a no aplicarlos ni utilizarlos para finalidad distinta de la pactada y a no comunicarlos a otras personas, así como a destruir los soportes y/o documentos donde se contengan dichos datos al finalizar el presente contrato, salvaguardando en todo caso las pruebas necesarias respecto a las actuaciones realizadas. En todo caso, los documentos de trabajo y el diseño o sistema de análisis serán propiedad del ',
                  { style: 'bigger', text: 'DESOKUPACANARIAS.\n' },
                  'Asimismo, ambas partes se comprometen a adoptar las necesarias medidas de seguridad para la protección de dichos datos en el nivel que les corresponda, de acuerdo a la regulación legal.\n\n'
                ]
              },
              {
                style: 'textnormal',
                text: [
                  { style: 'bigger', text: '7. PRECIO DEL SERVICIO.\n\n' },
                  'El Servicio contratado tiene un coste de ',
                  { style: 'bigger', text: 'TRESCIENTOS SESENTA Y CINCO EUROS ANUALES (365 €) IGIC incluido.\n' },
                  'En dicho importe estarán incluidos todos los gastos necesarios hasta lograr la posesión del inmueble ocupado ilegalmente, o en su defecto ocupado por arrendatarios, que han incurrido en incumplimientos contractuales de diversa índole, que permiten al arrendador resolver la relación contractual.\n',
                  'En todos los casos en el que el arrendatario o la persona que ocupa la vivienda sea condenado en el pago de las costas judiciales, y las mismas pudieran ser cobradas por el cliente, este último deberá reintegrar las mismas a la empresa ',
                  { style: 'bigger', text: 'DESOKUPACANARIAS,' },
                  ' en la cuenta corriente que designe para tal fin.\n\n'
                ]
              },
              {
                style: 'textnormal',
                text: [
                  { style: 'bigger', text: '8. FORMA DE PAGO:\n\n' },
                  'El pago correspondiente al servicio contratado, deberá formalizarse desde el momento de la contratación, mediante transferencia bancaria en el siguiente número de cuenta corriente, con el concepto que se indica: \n\n'
                ]
              },
              // PAGINA TRES
              {
                style: 'textnormal',
                text: [
                  'Para ejercer el derecho de desistimiento, deberá notificarnos su decisión de desistir del contrato a través de una declaración inequívoca (por ejemplo, una carta enviada por correo postal, fax o correo electrónico). Tiene usted la opción de cumplimentar y enviarnos electrónicamente el modelo de formulario de desistimiento publicado en el BOE (',
                  { color: 'blue', text: 'https://www.boe.es/diario_boe/' },
                  'txt.php?id=BOE-A-2014-3329) o cualquier otra declaración inequívoca a través de un e-mail a:lopd@sudespacho.net. Si recurre a esa opción, le comunicaremos a la mayor brevedad posible y en un soporte duradero (por ejemplo, por correo electrónico) la recepción de dicho desistimiento.\n',
                  'Para cumplir el plazo de desistimiento, basta con que la comunicación relativa al ejercicio por su parte de este derecho sea enviada antes de que venza el plazo correspondiente.\n',
                  'Consecuencias del desistimiento: En caso de desistimiento por su parte, le devolveremos todos los pagos recibidos de usted (en caso de que ya los hubiese efectuado), sin ninguna demora indebida y, en todo caso, a más tardar 14 días naturales a partir de la fecha en la que se nos informe de su decisión de desistir del presente contrato. Procederemos a efectuar dicho reembolso utilizando el mismo medio de pago empleado por usted para la transacción inicial, a no ser que haya usted dispuesto expresamente lo contrario; en todo caso, no incurrirá en ningún gasto como consecuencia del reembolso.\n',
                  'Si usted ha solicitado que la prestación de servicios dé comienzo durante el período de desistimiento, nos abonará un importe proporcional a la parte ya prestada del servicio en el momento en que nos haya comunicado su desistimiento, en relación con el objeto total del contrato.\n',
                  'Puede descargar los modelos de formulario de desistimiento en la Ley 3/2014, de 27 de marzo, publicado en el BOE no 76 de 28 de marzo de 2014 (págs. 26995 a 26996): ',
                  { color: 'blue', text: 'https://www.boe.es/' },
                  'buscar/act.php?id=BOE-A-2007-20555\n\n'
                ]
              },
              {
                style: 'textnormal',
                text: [
                  { style: 'bigger', text: '13. ADICIÓN DE CLÁUSULA EN CONTRATO DE ARRENDAMIENTO.\n\n' },
                  'Al objeto de informar a los arrendatarios sobre la intervención de ',
                  { style: 'bigger', text: 'DESOKUPACANARIAS,' },
                  ' en cualquier gestión relacionada con la mediación para la resolución de conflictos derivados de cualquier contrato de arrendamiento, se recomienda añadir como cláusula adicional en el contrato de arrendamiento suscrito entre las partes, el siguiente literal:\n\n',
                ]
              },
              {
                style: 'textnormal',
                italics: true,
                margin: [40, 0, 40, 0],
                text: '“Las partes intervinientes en el presente contrato, acuerdan la designación de la empresa DESOKUPACANARIAS como interlocutora con la parte arrendataria, quedando autorizada la misma, para ejercer labores de mediación, intermediación e incluso transacción de acuerdos económicos, encaminados a la'
              }
            ]
          ]
        },
      ]
      let docDefinition = {
        pageSize: 'letter',
        // pageOrientation: 'landscape',
        pageMargins: [40, 40, 40, 40],
        header: {
          image: logo,
          alignment: 'center',
          width: 100,
          margin: [0, 5, 0, 10],
        },
        content: contenido,
        styles: {
          header: {
            bold: true,
            fontSize: 11,
            margin: [5, 0, 5, 12]
          },
          bigger: {
            bold: true,
            fontSize: 10,
            margin: [0, 0, 0, 0]
          },
          bigger2: {
            bold: true,
            fontSize: 10,
            margin: [0, 0, 0, 10]
          },
          textnormal: {
            fontSize: 10,
            margin: [5, 0, 5, 0]
          },
          textitem: {
            fontSize: 10,
            margin: [40, 0, 5, 0]
          },
          textlist: {
            fontSize: 11,
            margin: [15, 0, 15, 40]
          }
        }
      }

      for (let i in inmuebles) {
        let e = inmuebles[i].direccion + ' ubicado en la provincia: ' + inmuebles[i].provinciaName + ' en la localidad: ' + inmuebles[i].localidadName
        contenido[0].columns[0][17].ul.push(e)
      }
 
      var pdfDoc = await printer.createPdfKitDocument(docDefinition)
      var fileName = `Contrato365.pdf`
      mkdirp.sync(`${Helpers.appRoot()}/storage/uploads/pdf`)
      var filePath = `${Helpers.appRoot("storage/uploads/pdf")}/${fileName}`;
      pdfDoc.pipe(fs.createWriteStream(filePath))
      pdfDoc.end()
      response.send(fileName)
    } catch (error) {
      console.error('generar pdf: ' + error.name + ':' + error.message)
    }
  }
}

module.exports = ContratoController
