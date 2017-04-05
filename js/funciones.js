var Usuario = null;

jQuery.expr[':'].Contains = function(a, i, m) { 
    return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0; 
  };
  jQuery.expr[':'].contains = function(a, i, m) { 
    return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0; 
  };

$(document).ready(function() {
	aplicacion();
  Usuario = JSON.parse(localStorage.getItem('wsp_Horus'));

  if (Usuario == null || Usuario == undefined)
  {
    cerrarSesion();
  }

  document.addEventListener("backbutton", function(e)
    { 
          e.preventDefault(); 
    }, false);

  Inicio();
});

function aplicacion()
{
  $("#lblCerrarSesion").on("click", cerrarSesion);
    
	$(".lnkMenuBar_Item").on("click", function(evento)
    {
      evento.preventDefault();
      var titulo = $(this).find('span').text();
      var vinculo = $(this).attr("vinculo");

      if (vinculo != undefined)
      {
       	cargarModulo(vinculo, titulo);
        if ($(window).width() < 767)
          {
            $("#btnInicio_OcultarMenu").trigger('click');
          }
      }
    });
  
  $(document).delegate(".inputControl", "change" ,function()
    {
      var contenedor = $(this).parent("span").parent("span").parent("div");
      var texto = $(contenedor).find(".inputText");
      var archivo = $(this).val();
      archivo = archivo.split("\\");
      archivo = archivo[(archivo.length - 1)];
      $(texto).val(archivo);
      var barra = $(contenedor).parent("form").find(".progress-bar");
      var percentVal = '0%';
      $(barra).width(percentVal);
      $(barra).text(percentVal);
    });

  $('[data-plugin="datepicker"]').datepicker();

}

function cargarModulo(vinculo, titulo, callback)
{
	$("#txtCrearProyecto_idProyecto").val("");
  
  titulo = titulo || null;

  if (callback === undefined)
    {callback = function(){};}


	$(".Modulo").hide();
        var tds = "";
        var nomModulo = "modulo_" + vinculo.replace(/\s/g, "_");
        nomModulo = nomModulo.replace(/\./g, "_");
        nomModulo = nomModulo.replace(/\//g, "_");

        if ($('#' + nomModulo).length)
        {
          $('#' + nomModulo).show();
          if (titulo != null)
          {
            $('#' + nomModulo).find('.page-header').find(".page-title").text(titulo);
          }
          callback();
        } else
        {
          tds += '<div id="' + nomModulo + '" class="page Modulo">';
            tds += '<div class="cntModulo page-content container-fluid">';
                tds += '<p>No tiene permiso para acceder a este modulo...</p>';
            tds += '</div>';
          tds += '</div>';

          $("#contenedorDeModulos").append(tds);
          $.get(vinculo + "?tmpId=" + obtenerPrefijo(), function(data) 
          {
            $("#" + nomModulo + " .cntModulo").html(data);
            callback();
          });
        }
        $("#lblUbicacionModulo").text(titulo);
}
$.fn.generarDatosEnvio = function(restricciones, callback)
{
  if (callback === undefined)
    {callback = function(){};}

    var obj = $(this).find(".guardar");
  var datos = {};
  datos['Usuario'] = Usuario.id;

  $.each(obj, function(index, val) 
  {
    if ($(val).attr("id") != undefined)
    {
      if (!$(val).hasClass('tt-hint'))
      {
        datos[$(val).attr("id").replace(restricciones, "")] = $(val).val();
      }
    }
  });
  datos = JSON.stringify(datos);  

  callback(datos);
}
function Mensaje(Titulo, Mensaje, Tipo)
{
  if (Tipo == undefined)
  {
    Tipo = "success";
  }
  switch (Tipo)
  {
    case "success":
        alertify.success(Mensaje);
      break;
    case "danger":
        alertify.error(Mensaje);
      break;
    default:
        alertify.log(Mensaje);
  }
}

function cerrarSesion()
{
  delete localStorage.wsp_Horus;
  window.location.replace("../index.html");
}
function readURL(input, idObj) 
{
  var Nombre = input.value.replace("C:\\fakepath\\", "");
  
  if (input.files && input.files[0]) 
  {
      var reader = new FileReader();

      var tds = "";
      var tds2 = "";

      reader.onload = function (e) 
      {
        auditoria_AgregarSoporte(idObj, e.target.result, Nombre, 0);       
      }
      reader.readAsDataURL(input.files[0]);
  }
}

function textObtenerCoordenadas(callback, sierror)
{
  if (callback === undefined)
    {callback = function(){};}

if (sierror === undefined)
    {sierror = function(){};}


  var objCoordenadas ="";
  navigator.geolocation.getCurrentPosition(
    function(datos)
    {
      var lat = datos.coords.latitude;
      var lon = datos.coords.longitude;
      var accu = datos.coords.accuracy;

      objCoordenadas =  lat + "," + lon + "#" + accu;
      callback(lat, lon, accu);
    }, 
    function ()
    {
      objCoordenadas ="No hay precision en el dato";
      if (pMensaje != false)
      {
        Mensaje("Ubicación", objCoordenadas);
      }
      sierror(objCoordenadas);
    });
  return objCoordenadas;
}

 function obtenerCoordenadas()
{
  if ($("#modulo_obras_auditoria_html").is(":visible"))
  {
    navigator.geolocation.getCurrentPosition(devCoordenads, errorMapa);
  } 
}

function devCoordenads(datos)
{
  var lat = datos.coords.latitude;
  var lon = datos.coords.longitude;
  $("#txtCoordenadas").val(lat + "," + lon);
}
function errorMapa()
{
  
}
function abrirURL(url)
{
  var win = window.open(url, "_blank", "directories=no, location=no, menubar=no, resizable=yes, scrollbars=yes, statusbar=no, tittlebar=no");
  win.focus();
}
function obtenerFecha()
{
  var f = new Date();
  return f.getFullYear() + "-" + CompletarConCero(f.getMonth() +1, 2) + "-" + CompletarConCero(f.getDate(), 2) + " " + CompletarConCero(f.getHours(), 2) + ":" + CompletarConCero(f.getMinutes(), 2) + ":" + CompletarConCero(f.getSeconds(), 2);
}
function obtenerPrefijo()
{
  var f = new Date();
  return f.getFullYear() + CompletarConCero(f.getMonth() +1, 2) + CompletarConCero(f.getDate(), 2) + CompletarConCero(f.getHours(), 2) + CompletarConCero(f.getMinutes(), 2) + CompletarConCero(f.getSeconds(), 2) + CompletarConCero(Usuario.id, 3);
}
function CompletarConCero(n, length)
{
   n = n.toString();
   while(n.length < length) n = "0" + n;
   return n;
}


function abrirCamara(tipo, callback, sierror)
{
  tipo = tipo || 1;

  if (callback == undefined)
  {    callback = function(){};  }

  if (sierror == undefined)
  {    sierror = cameraFail;  }
  
  navigator.camera.getPicture(callback, sierror, 
    { quality: 80,
      sourceType: tipo,
    destinationType: Camera.DestinationType.FILE_URI,
    saveToPhotoAlbum : true });
}
function cameraFail(message) 
{
  Mensaje("Error", 'Failed because: ' + message, "danger");
}
/*
function cameraSuccess(imageURI) 
{
    var pPrefijo = obtenerPrefijo();
    var publicPrefijo = $("#txtPrefijo").val();
    var publicProceso = $("#txtProceso").val();

    var tds = '<div class="span4">';
      tds += '<div class="thumbnail">';
        tds += '<div class="item">';
              tds += '<img src="" alt="Photo" id="image_' + pPrefijo + '"/>';
        tds += '</div>';
      tds += '</div>';
    tds += '</div>';

    var Objeto = "";
    if (publicProceso == "Ipales")
    {
      Objeto = "frmIpal";
    }
    if (publicProceso == "Comercial")
    {
      Objeto = "frmComercial";
    }
    if (publicProceso == "Alumbrado")
    {
      Objeto = "frmAlumbrado";
    }
    if (publicProceso == "Tecnica")
    {
      Objeto = "frmTecnica";
    }
    $("#" + Objeto + " .contenedorImagenesTomadas").append(tds);

    ejecutarInsert("INSERT INTO Fotos (idFoto, Ruta, Proceso, Prefijo) VALUES (?, ?, ?, ?)", [pPrefijo, imageURI, publicProceso, publicPrefijo]);
    
    var image = document.getElementById('image_' + pPrefijo);

    image.src = imageURI;
}
*/

$.fn.crearDataTable = function(tds, callback)
{
  if (callback === undefined)
    {callback = function(){};}

  var dtSpanish = {
    "sProcessing":     "Procesando...",
    "sLengthMenu":     "Mostrar _MENU_ registros",
    "sZeroRecords":    "No se encontraron resultados",
    "sEmptyTable":     "Ningún dato disponible en esta tabla",
    "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
    "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
    "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
    "sInfoPostFix":    "",
    "sSearch":         "Filtrar:",
    "sUrl":            "",
    "sInfoThousands":  ",",
    "sLoadingRecords": "Cargando...",
    "oPaginate": {
        "sFirst":    "Primero",
        "sLast":     "Último",
        "sNext":     "Siguiente",
        "sPrevious": "Anterior"
    },
    "oAria": {
        "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    }
  };

  var options = {
        "aoColumnDefs": [{
          'bSortable': false,
          'aTargets': [-1]
        }],
        "iDisplayLength": 10,
        "aLengthMenu": [
          [10, 25, 50, -1],
          [10, 25, 50, "Todos"]
        ],
        responsive: true,
        "sDom": 'lBfrtip',
        buttons: [
        'copy', 'excel', 'pdf'
        ],
        "language" : dtSpanish
      };

  var idObj = $(this).attr("id");
  if ($("#" + idObj + "_wrapper").length == 1)
    {
        $(this).dataTable().fnDestroy();
    } 

    if (tds != undefined && tds != "")
    {
      $(this).find("tbody").find("tr").remove();
      $("#" + idObj + " tbody").append(tds);
    }

  $(this).DataTable(options);
  
  callback();
}

function sumarFecha(fecha, days)
{
    milisegundos=parseInt(35*24*60*60*1000);
 
    fecha=new Date(fecha);
    day=fecha.getDate();
    month=fecha.getMonth()+1;
    year=fecha.getFullYear();
 
    tiempo=fecha.getTime();
    milisegundos=parseInt(days*24*60*60*1000);
    total=fecha.setTime(tiempo+milisegundos);
    day=fecha.getDate();
    month=fecha.getMonth()+1;
    year=fecha.getFullYear();
 
    return year + "-" + CompletarConCero(month, 2)  + "-" + CompletarConCero(day, 2);   
}