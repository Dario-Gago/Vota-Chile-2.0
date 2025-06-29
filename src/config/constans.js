export const URLBASE = 'https://vota-chile-2-0-back.onrender.com'
export const ENDPOINT = {
  login: `${URLBASE}/login`,
  presidentes: `${URLBASE}/presidentes`,
  users: `${URLBASE}/usuarios`,
  obtenerStatus: `${URLBASE}/status`, // GET
  actualizarStatus: `${URLBASE}/status`, // PUT
  totalUsuariosConectados: `${URLBASE}/status/total`,
  votar: `${URLBASE}/votar`,
  misVotos: (rut) => `${URLBASE}/votar/${rut}`,
  logoutAuto: `${URLBASE}/logout-auto`,
  titulo: `${URLBASE}/api/titulo`,
  fecha: `${URLBASE}/fecha`
}
