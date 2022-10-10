const routes = [
  {
    path: '/index',
    component: () => import('layouts/MainLayout.vue'),
    meta: { botonchat: true },
    children: [
      // Root y Administrador
      { path: '/inicio/administrador', component: () => import('pages/admin/Inicio.vue') },
      { path: '/usuarios', component: () => import('pages/admin/Usuarios.vue') },
      { path: '/contratos_aprobados', component: () => import('pages/admin/Contratos.vue') },
      { path: '/formas_de_pago', component: () => import('pages/admin/FormaPago.vue') },
      { path: '/contabilidad', component: () => import('pages/admin/Contabilidad.vue') },
      { path: '/cobros', component: () => import('pages/admin/CostsReceivable.vue') },
      { path: '/ingresos', component: () => import('pages/admin/Incomes.vue') },
      { path: '/analiticas/ventas', component: () => import('pages/admin/Sales.vue') },
      { path: '/gastos', component: () => import('pages/admin/Expenses.vue') },
      { path: '/analiticas/gastos', component: () => import('pages/admin/Expenses.vue') },
      { path: '/operativos', component: () => import('pages/admin/Operatives.vue') },
      { path: '/juridicos', component: () => import('pages/admin/Legal.vue') },
      // Inmobiliaria
      { path: '/inicio/inmobiliaria', component: () => import('pages/admin/Inicio.vue') },
      { path: '/registro/comercial', component: () => import('pages/registro/RegistroComercio.vue') },
      { path: '/editar/comercial/:id', component: () => import('pages/registro/RegistroComercio.vue') },
      { path: '/comerciales', component: () => import('pages/inmobiliaria/Comercios.vue') },
      { path: '/comercial/:id', component: () => import('pages/inmobiliaria/Comercial.vue') },
      // Comercial
      { path: '/presupuestos', component: () => import('pages/comercio/Contratos.vue') },
      { path: '/Crear/presupuestos', component: () => import('pages/comercio/CrearPresupuesto.vue') },
      { path: '/NuevoServicio', component: () => import('pages/comercio/NuevoServicio.vue') },
      { path: '/presupuestos/desokupa', component: () => import('pages/comercio/Desokupa.vue') },
      { path: '/presupuestos/365', component: () => import('pages/comercio/Contrato365.vue') },
      { path: '/clientes', component: () => import('pages/comercio/Clientes.vue') },
      { path: '/inmuebles', component: () => import('pages/comercio/Inmuebles.vue') },
      { path: '/registro/cliente', component: () => import('pages/registro/RegistroCliente.vue') },
      { path: '/editar/cliente/:id', component: () => import('pages/registro/RegistroCliente.vue') },
      { path: '/registro/inmueble', component: () => import('pages/registro/RegistroInmueble.vue') },
      { path: '/editar/inmueble/:id', component: () => import('pages/registro/RegistroInmueble.vue') },
      // Legal
      { path: '/legal/contratos_disponibles', component: () => import('pages/legal/Contratos.vue') },
      { path: '/contratos_tomados', component: () => import('pages/legal/Asignados.vue') },
      { path: '/legal_mis_contratos', component: () => import('pages/legal/Historial.vue') },
      // Operarios
      { path: '/operarios', component: () => import('pages/operarios/Operarios.vue') },
      { path: '/contratos_disponibles', component: () => import('pages/operarios/Contratos.vue') },
      { path: '/lider_contratos_asignados', component: () => import('pages/operarios/ContratosAsignados.vue') },
      { path: '/contratos_asignados', component: () => import('pages/operarios/Asignados.vue') },
      { path: '/operario_mis_contratos', component: () => import('pages/operarios/Historial.vue') },
      { path: '/registro/operario', component: () => import('pages/registro/RegistroOperario.vue') },
      { path: '/editar/operario/:id', component: () => import('pages/registro/RegistroOperario.vue') },
      // Generales
      { path: '/contrato/:id', component: () => import('pages/Contrato.vue') },
      { path: '/registro/usuario', component: () => import('pages/registro/RegistroUsuario.vue') },
      { path: '/editar/usuario/:id', component: () => import('pages/registro/RegistroUsuario.vue') }
    ]
  },
  { path: '/login', component: () => import('pages/Login.vue') },
  { path: '/recuperacion/:code', component: () => import('pages/Reestablecer.vue') },
  { path: '/formulario/:codigo', component: () => import('pages/comercio/Formulario.vue') },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '*',
    redirect: '/login'
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
