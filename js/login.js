$(document).on("ready", ready_login);

function ready_login()
{
  abrirWebSQL();

  $("#btnEntrar").on("click", frmLogin_submit);
  $("#frmLogin").on("submit", frmLogin_submit);

  /**
   * Fragmento para controlar si la sesión está activa
  **/

  if (localStorage.wsp_Horus != null)
  {
    window.location.replace("aplicacion/index.html");
  } 
}
/**
 * Evento que se llama cuando el usuario hace submit para Iniciar Sesión
**/
function frmLogin_submit(event)
{
  event.preventDefault();
  var cDate = new Date();

    var pUsuario = $("#txtLogin_Usuario").val();
    var pClave = md5(md5(md5($("#txtLogin_Clave").val())));

    $.post('server/php/proyecto/validarUsuario.php', {pUsuario: pUsuario, pClave : pClave, pFecha : cDate}, function(data, textStatus, xhr) 
    {
      if (data != 0)
      {
        if (typeof data == "object")
        {
          data.cDate = cDate;
          localStorage.setItem("wsp_Horus", JSON.stringify(data));  

          window.location.replace("aplicacion/index.html");
        } else
        {
          $(".alert").html("<strong>Hey!</strong> " + data);
          $(".alert").fadeIn(300).delay(2600).fadeOut(600);
          
        }
      } else
      {
        $(".alert").html("<strong>Error!</strong> Acceso denegado.");
        $(".alert").fadeIn(300).delay(2600).fadeOut(600);
      }
    }, "json");
}