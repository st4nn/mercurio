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

$.fn.iniciarObjArchivos = function(parametros)
{
  var idObj = $(this).attr("id").replace("cnt", "");
  var tds = "";
  
    tds += '<div id="cnt' + idObj + '_DivArchivo" class="col-md-12 form-group">';
      tds += '<div class="input-group input-group-file">';
        tds += '<span class="input-group-btn">';
            tds += '<span class="btn btn-success col-md-12 btn-file">';
              tds += '<i class="icon wb-upload" aria-hidden="true"></i>';
              tds += 'Agregar Archivos';
              tds += '<input id="txt' + idObj + '_Archivo" type="file" name="...">';
            tds += '</span>'; 
        tds += '</span>';
      tds += '</div>';
    tds += '</div>';
    tds += '<div class="row">';
            tds += '<h4>Archivos Cargados</h4>';
        tds += '<div class="margin-top-20">';
            tds += '<div id="cnt' + idObj + '_DivArchivo_Listado" class="list-group-dividered list-group-full">';
            tds += '</div>';
        tds += '</div>';
    tds += '</div>';

    $(this).append(tds);
    tds = "";

    if ($("#cntModal_Archivos").length == 0)
  {
      tds += '<div class="modal fade" id="cntModal_Archivos" tabindex="-1" role="dialog" aria-hidden="true">';
            tds += '<div class="modal-dialog">';
                tds += '<div class="modal-content">';
                    tds += '<form id="frmModal_Archivo" class="form-horizontal" role="form">';
                        tds += '<div class="modal-header">';
                            tds += '<h4 class="modal-title">Guardar Archivo <span id="lblModal_Archivo_Nombre"></span></h4>';
                        tds += '</div>';
                        tds += '<div class="modal-body">';
                            tds += '<div class="form-group">';
                                tds += '<div class="fg-line">';
                                    tds += '<textarea id="txtModal_ArchivoDescripcion" class="form-control" rows="5" placeholder="Observaciones, Comentarios o Descripción del Archivo..."></textarea>';
                                tds += '</div>';
                            tds += '</div>';
                        tds += '</div>';
                        tds += '<div class="modal-footer">';
                            tds += '<button type="button" id="btnModal_Archivo_Cancelar" data-dismiss="modal" class="btn btn-warning">Cancelar</button>';
                            tds += '<button type="submit" class="btn btn-success">Enviar</button>';
                        tds += '</div>';
                    tds += '</form>';
                tds += '</div>';
            tds += '</div>';
        tds += '</div>';

        $("body").append(tds);

         $("#btnModal_Archivo_Cancelar").on("click", function(evento)
        {
          evento.preventDefault();
          $("#cntIngresar_Archivo").modal("hide");
        });

      $('#txt' + idObj + '_Archivo').on("change", function(event)
      {
        $("#txtModal_ArchivoDescripcion").val("");
        $("#cntModal_Archivos").modal("show");
        $("#lblModal_Archivo_Nombre").text($(this).val().replace("C:\\fakepath\\", ""));
        $("#txtModal_ArchivoDescripcion").focus();

        files = event.target.files;
      });

      $("#frmModal_Archivo").on("submit", function(evento)
      {
        evento.preventDefault();
        $("#cntModal_Archivos").modal("hide");

        var data = new FormData();

        $.each(files, function(key, value)
        {
            data.append(key, value);
        });

        parametros.Prefijo = $(parametros.objPrefijo).val();

        if (parametros != undefined && parametros != null)
        {
          $.each(parametros, function(index, val) 
          {
            if (index != 'objPrefijo')
            {
              data.append(index, val);
            }
          });
        }


        data.append("Observaciones", $("#txtModal_ArchivoDescripcion").val());
        var nomArchivo = files[0].name;

        $.ajax({
              url: '../server/php/subirArchivos.php',
              type: 'POST',
              data: data,
              cache: false,
              dataType: 'html',
              processData: false, // Don't process the files
              contentType: false, // Set content type to false as jQuery will tell the server its a query string request
              success: function(data, textStatus, jqXHR)
              {
                  if( parseInt(data) >= 1)
                  {
                    var extension = nomArchivo.split('.');
                    if (extension.length > 0)
                    {
                      extension = extension[extension.length - 1];
                    } else
                    {
                      extension = "obj";
                    }

                    var tds = "";
                    tds += '<li class="list-group-item">';
                      tds += '<small><time class="pull-right" datetime="' + obtenerFecha() + '">Hace un momento</time></small>';
                      tds += '<p><a class="hightlight" href="../server/php/Archivos/' + parametros.Prefijo + '/' + nomArchivo + '" target="_blank">' + nomArchivo + '</a></p>';
                      tds += '<p>' + $("#txtModal_ArchivoDescripcion").val() + '</p>';
                      tds += '<small>Cargado por';
                        tds += '<a class="hightlight" href="javascript:void(0)">';
                          tds += '<span>' + Usuario.nombre + '</span>';
                        tds += '</a>';
                      tds += '</small>';
                    tds += '</li>';
                    
                    $('#cnt' + idObj + '_DivArchivo_Listado').prepend(tds);
                  }
                  else
                  {
                      Mensaje('Error:', data);
                  }
              },
              error: function(jqXHR, textStatus, errorThrown)
              {
                  // Handle errors here
                  Mensaje('Error:', textStatus);
                  $("#cntIngresar_Archivo").modal("show");
              }
          });
      });
    }
}

var tiempoPublicacion = function (fecha)
{
  fecha = new Date(fecha.replace(" ", "T") + "Z");
  var fechaActual = new Date();
  
  var tiempo = fecha.getTime();
  var tiempoActual = fechaActual.getTime();

  var diferencia = tiempoActual-tiempo;

  diferencia = parseInt(((diferencia/1000)/60)-300);

  var respuesta = "";
  if (diferencia < 2)
  {
    respuesta = "hace un momento";
  } else
  {
    if (diferencia < 60)
    {
      respuesta = "hace " + diferencia + " minutos";
    } else
    {
        if (diferencia < 120)
        {
          respuesta = "hace " + 1 + " hora";
        } else
        {
          if (diferencia < 1440)
          {
            respuesta = "hace " + parseInt(diferencia/60) + " horas";
          } else
          {
            if (diferencia < 43200)
            {
              respuesta = "hace " + parseInt(diferencia/60/24) + " dias";
            } else
            {
              respuesta = "hace " + parseInt(diferencia/60/24/30) + " meses";
            }
          }
        }
    }
  }

  return respuesta;
}