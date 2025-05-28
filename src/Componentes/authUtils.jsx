// Función para cerrar sesión con confirmación
export const logoutWithConfirmation = () => {
  const confirmLogout = window.confirm("¿Estás seguro de que deseas cerrar sesión?");
  if (!confirmLogout) return;

  localStorage.clear();
  window.location.href = "/";
};
