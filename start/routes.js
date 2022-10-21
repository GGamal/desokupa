'use strict'

const { route } = require('@adonisjs/framework/src/Route/Manager');

/*
|--------------------------------------------------------------------------
| Routes
  Existen 2 grupos de rutas: Las que necesitan autenticación del usuario y las que no. TOMAR MUY EN CUENTA ESTO
  Dentro del grupo de las que necesitan autenticación se debe especificar el middleware para verificar si el
  usuario(autenticado) tiene el permiso para acceder a esa ruta. Ejemplo: .middleware('verifyPermission:1')
  El número 1 indica el permiso que debe tener para acceder a esa ruta
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return {
    greeting: 'Hello world in JSON'
  }
})

const addPrefixToGroup = group => {
  // Grupo para rutas con prefijo /api/
  group.prefix("api");
  return group;
};


addPrefixToGroup(
  Route.group(() => {
    // Insertar rutas sin protección de autenticación aquí
    Route.post('runSeeds', 'UploadController.runSeeds')
    Route.delete('dropDB', 'UploadController.dropDB')

    Route.post("login", "UserController.login");
    Route.post("register", "UserController.register")
    Route.get("validate_email/:email", "UserController.validateEmail")
    Route.get("email_send_app/:email", "UserController.recuperacionapp")

    Route.get('adjunto_file/:file', 'UploadController.getFileByDirectoryAdjuntos')
    Route.get('hito_file/:file', 'UploadController.getFileByDirectoryHitos')
    Route.get('pdf_file/:file', 'UploadController.getFileByDirectoryPdf')
    
    Route.post("user_by_rol", "UserController.userByRol") // metodo para obtener usuarios segun el rol
    Route.get("user_by_id/:id", "UserController.userById") // metodo para obtener informacion del usuario por id del mismo
  })
  );
  addPrefixToGroup(
    Route.group(() => {
      // Insertar rutas con protección de autenticación aquí
      Route.get("user_info", "UserController.userInfo") // metodo para obtener informacion del usuario que esta logueado
      Route.get("user_logueado", "UserController.userLogueado") // metodo para obtener informacion del usuario que esta logueado
      Route.get("all_user", "UserController.allUser")
      Route.put('eliminar_user/:id', 'UserController.delete')
      Route.post("user_by_status", "UserController.userByStatus") // metodo para obtener proveedores pendientes
      Route.put("update_status/:id", "UserController.updateStatus")
      Route.put('new_password/:id', 'UserController.cambiarPasword')
      Route.post("edit_user/:id", "UserController.editUser")
      
      Route.get("operarios_by_user" ,'UserController.operariosByUser')
    Route.get("comercios_by_user" ,'UserController.comerciosByUser')
    
    Route.get("provincias" ,'UserController.provincias')
    Route.get("localidadesPorId/:id" ,'UserController.localidadesPorId')
    
    Route.post("subir_archivo/:id" ,'UploadController.subirArchivo')
    Route.get("eliminar_archivo/:id" ,'UploadController.eliminarArchivo')

    Route.get("formas_pagos" ,'FormaPagoController.index')
    Route.post("nueva_forma_pago" ,'FormaPagoController.create')
    Route.put("editar_forma_pago/:id" ,'FormaPagoController.update')
    Route.put('eliminar_forma_pago/:id', 'FormaPagoController.destroy')
    
    Route.get("contratos" ,'ContratoController.index')
    Route.get("contratos/:type" ,'ContratoController.contratosByType')
    Route.get("contrato_by_id/:id" ,'ContratoController.contratoById')
    Route.get("contratos_by_user/:id" ,'ContratoController.contratosByUserId')
    Route.get("contratos_by_cuotas" ,'ContratoController.contratosByCuotas')
    Route.post("contratos_by_status" ,'ContratoController.contratosByStatus')
    Route.post("my_contracts",'ContratoController.myContracts')
    Route.put("status_contrato/:id" ,'ContratoController.statusUpdate')
    Route.get("formulario/:codigo" ,'ContratoController.formulario')
    Route.post("formulario/:id" ,'ContratoController.crearFormulario')
    Route.post("generar_link" ,'ContratoController.generarLink')
    Route.get("contractsPayable",'ContratoController.contractsPayable')

    Route.get("contratos_asignados" ,'ContratoController.contratosAsignadosOperario')
    Route.get("contratos_asignados_legal" ,'ContratoController.contratosAsignadosLegal')
    
    Route.post("generar_hito" ,'ContratoController.generarHito')
    
    Route.post("generar_pdf_365" ,'ContratoController.generarPdf365')
    Route.post("generar_pdf_desokupa" ,'ContratoController.generarPdfDesokupa')
    Route.post("makeCommercialContractPdf",'ContratoController.makeCommercialContractPdf')
    

    Route.get("clientes" ,'ClienteController.index')
    Route.get("cliente_by_id/:id" ,'ClienteController.clientById')
    Route.post("register_cliente" ,'ClienteController.create')
    Route.put("edit_cliente/:id" ,'ClienteController.update')
    Route.put('eliminar_cliente/:id', 'ClienteController.delete')

    Route.get("inmuebles" ,'ClienteController.indexInmueble')
    Route.get("inmueble_by_id/:id" ,'ClienteController.inmuebleById')
    Route.post("register_inmueble" ,'ClienteController.createInmueble')
    Route.put("edit_inmueble/:id" ,'ClienteController.updateInmueble')
    Route.put('eliminar_inmueble/:id', 'ClienteController.destroyInmueble')

    Route.get('getIncomes', 'IncomeController.index')
    Route.get('getExpenses', 'ExpenseController.index')
    Route.post('setExpense', 'ExpenseController.store')

  }).middleware("auth")
  );
  