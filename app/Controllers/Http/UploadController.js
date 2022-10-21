'use strict'

const Helpers = use('Helpers')
const mkdirp = use('mkdirp')
const User = use("App/Models/User")
const Localidad = use("App/Models/Localidad")
const Contrato = use("App/Models/Contrato")
const FormaPago = use("App/Models/FormaPago")
const Hito = use("App/Models/Hito")
const Permission = use("App/Models/Permission")
const Provincia = use("App/Models/Provincia")
const Role = use("App/Models/Role")
const moment = require('moment')
const Status = use("App/Models/Status")
const { validate } = use("Validator")
const fs = require('fs')
var randomize = require('randomatic');

// const UserSeeder = require('database/seeds/UserSeeder.js')
var cp = require('child_process')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with uploads
 */
class UploadController {
  /**
   * Show a list of all uploads.
   * GET uploads
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({
    request,
    response,
    view
  }) {}

  async getFileByDirectoryHitos ({ params, request, response }) {
    const dir = params.file
    response.download(Helpers.appRoot('storage/uploads/hitos') + `/${dir}`)
  }

  async getFileByDirectoryAdjuntos ({ params, request, response }) {
    const dir = params.file
    response.download(Helpers.appRoot('storage/uploads/adjuntos') + `/${dir}`)
  }

  async getFileByDirectoryPdf ({ params, request, response }) {
    const dir = params.file
    response.download(Helpers.appRoot('storage/uploads/pdf') + `/${dir}`)
  }

  /**
   * Render a form to be used for creating a new upload.
   * GET uploads/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({
    request,
    response,
    view
  }) {}

  async subirArchivo ({ request, response, params }) {
    let data = request.only(['dat'])
    data = JSON.parse(data.dat)
    let codeFile = randomize('Aa0', 30)
    let id = params.id
    var profilePic = request.file('file', {})
    if (profilePic) {
      if (Helpers.appRoot('storage/uploads/adjuntos')) {
        await profilePic.move(Helpers.appRoot('storage/uploads/adjuntos'), {
          name: data + '-' + codeFile.substring(21, codeFile.length - 1) + '.pdf',
          overwrite: true
        })
      } else {
        mkdirp.sync(`${__dirname}/storage/Excel`)
      }

      if (!profilePic.moved()) {
        return profilePic.error()
      } else {
        var obj = {
          name: data,
          file: profilePic.fileName 
        }
        let contrato = await Contrato.find(id)
        if (contrato.adjuntos.length === 0) {
          contrato.fechaFirma = moment().format('DD/MM/YYYY')
        }
        contrato.adjuntos.push(obj)
        await contrato.save()
        response.send(contrato)
      }
    }
  }

  /**
   * Create/save a new upload.
   * POST uploads
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({
    request,
    response
  }) {}

  /**
   * Display a single upload.
   * GET uploads/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({
    params,
    request,
    response,
    view
  }) {}

  /**
   * Render a form to update an existing upload.
   * GET uploads/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({
    params,
    request,
    response,
    view
  }) {}

  /**
   * Update upload details.
   * PUT or PATCH uploads/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({
    params,
    request,
    response
  }) {}

  /**
   * Delete a upload with id.
   * DELETE uploads/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({
    params,
    request,
    response
  }) {}

  async eliminarArchivo ({ auth, response, params }) {
    let user = (await auth.getUser()).toJSON()
    let contrato = await User.find(user._id)
    fs.unlink(`storage/uploads/adjuntos/${params.id}`, (err) => {
      if (err) throw err;
    })
    let buscarInd = contrato.adjuntos.findIndex(v => v === params.id)
    contrato.adjuntos.splice(buscarInd, 1)
    await contrato.save()
    response.send(contrato)
  }
  async runSeeds ({ response }) {
    var ls = cp.exec('adonis seed');

    ls.stdout.on('data', function (data) {
    });

    ls.on('close', function (code, signal) {
      console.log('ls finished...');
    });
    response.send(true)
  }
  async dropDB ({ response }) {
    const rmLocalidad = await Localidad.query().delete()
    const rmContrato = await Contrato.query().delete()
    const rmFormaPago = await FormaPago.query().delete()
    const rmHito = await Hito.query().delete()
    const rmPermission = Permission.query().delete()
    const rmProvincia = await Provincia.query().delete()
    const rmRole = await Role.query().delete()
    const rmStatus = await Status.query().delete()
    const rmUser = await User.query().delete()
    response.send(true)
  }

}

module.exports = UploadController
