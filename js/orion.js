var repMap = null;
var Markers = null;
var tmpLastMarker = null;

function Inicio()
{
  cargarModulo("Inicio.html", "Trabajo Programado");
  $("#lblNombreUsuario").text(Usuario.nombre);
}

$.fn.llenarCombo = function(data, callback)
{
  if (callback === undefined)
    {callback = function(){};}

  var elemento = $(this);
      var tds = "";
      $.each(data, function(index, val) 
      {
         tds += '<option value="' + val.id + '">' + val.Nombre + '</option>';
      });
  elemento.append(tds);
  callback();
}

cargarDatosConf = function(Pagina, callback, datos)
{
  if (callback === undefined)
    {callback = function(){};}

  datos = datos || {Usuario: Usuario.id};

  $.post('../server/php/proyecto/' + Pagina + '.php', datos, function(data, textStatus, xhr) 
  {
    if (data != 0)
    {
      callback(data);
    }
  }, "json").fail(function()
  {
    Mensaje("Error", "No hay conexión al Servidor, por favor actualice la página", "danger");
  });
}


function Levantamiento()
{
  $("#btnFormLevantamiento_TomarCoordenadas").on("click", function(evento)
  {
    evento.preventDefault();
    textObtenerCoordenadas(function(lat, lon, calidad)
    {
      $("#txtLevantamiento_CoordX").val(lat);
      $("#txtLevantamiento_CoordY").val(lon);
      $("#txtLevantamiento_CoordQ").val(calidad);

      if (calidad > 5)
      {
        Mensaje("Hey", calidad + " no es una muy buena calidad, es recomendable intentarlo nuevamente" ,"danger");
      }

    })
  });

  $("#btnLevantamiento_Foto").on("click", function()
  {
    abrirCamara();
  });

  $("#btnLevantamiento_Galeria").on("click", function()
  {
    abrirCamara(0, function(uri)
      {
        console.log("uri");
      });
  });

  $("#frmLevantamiento").on("submit", function(evento)
  {
    evento.preventDefault();
    levantamiento_Guardar();
  });

  $("#btnLevantamiento_NuevoProducto").on("click", function(evento)
    {
      evento.preventDefault();
      levantamiento_Guardar(function()
      {
        $("#frmLevantamiento")[0].reset();
        $("#lblLevantamiento_TramoAnterior").text("");
        $("#txtLevantamiento_Tramo").val("");
        levantamiento_NuevoCodigo();
        window.scrollTo(0, 0);
      });
    });

  $("#btnLevantamiento_Tramo").on("click", function(evento)
        {
          evento.preventDefault();
          var dato = parseInt($("#lblLevantamiento_CodPunto").text()) - 1;
          var r = prompt("Ingrese el codigo del Punto anterior", CompletarConCero(dato, 3));
          $("#lblLevantamiento_TramoAnterior").text(r);
          $("#txtLevantamiento_Tramo").val(r);
        });
}

function crearProyecto()
{
  $("#frmCrearProyecto").on("submit", function(evento)
  {
    evento.preventDefault();
    $("#txtCrearProyecto_idProyecto").val(obtenerPrefijo());
    $("#frmCrearProyecto").generarDatosEnvio("txtCrearProyecto_", function(datos)
      {
        //datos = JSON.parse(datos);
        
        $.post('../server/php/proyecto/crearProyecto.php', {datos: datos, Usuario: Usuario.id}, function(data, textStatus, xhr) 
        {
          if (parseInt(data) == 1)
          {
            Mensaje("", "El proyecto ha sido guardado");
            $("#frmCrearProyecto")[0].reset();
          } else
          {
            Mensaje("", data);
          }
        }).fail(function()
        {
          Mensaje("Error", "No se puede guardar el proyecto, No hay conexión al servidor", "danger");
        });
      });
  });

  if ($(window).width() > 767)
  {
    $("#frmCrearProyecto .datepicker").datepicker({'autoclose' : true});
  }

  cargarDatosConf("cargarUsuarios", function(data)
    {
      $("#txtCrearProyecto_Responsable").llenarCombo(data, function()
        {
          $("#txtCrearProyecto_Responsable").val(Usuario.id) ;
        });
    });

  cargarDatosConf("cargarZonas", function(data)
    {
      $("#txtCrearProyecto_Zona").llenarCombo(data);  
    });

  cargarDatosConf("cargarEmpresas", function(data)
    {
      $("#txtCrearProyecto_Empresa").llenarCombo(data);  
    });

  /*cargarDatosConf("cargarUnitarios", function(data)
    {
      $("#txtCrearProyecto_Item").llenarCombo(data);  
    });*/

  
}

function modInicio()
{
  modInicio_CargarGraficas();
  $("#btnInicio_Actualizar").on("click", function()
  {
    modInicio_CargarGraficas();
  });

}
function modInicio_CargarGraficas()
{
  $("#imgInicio_Cargando").show();
  var fecha = obtenerFecha().substr(0, 10);
  $.post('../server/php/proyecto/cargarProyectosDia.php', {Usuario : Usuario.id, Fecha:fecha}, function(data, textStatus, xhr) 
  {
    var Postes = 0;
    var Fotos = 0;
    var arrObj = [];
    var arrLabels = [];
    $.each(data, function(index, val) 
    {
       Postes += parseInt(val.Postes);
      Fotos += parseInt(val.Fotos);

       arrLabels.push(index + 1);
       arrObj.push(parseInt(val.Postes));

       $("#lblInicio_Proyectos").text(val.Proyectos);
    });

       new Chartist.Line("#widgetLinepoint .ct-chart", {
      labels: arrLabels,
      series: [
        arrObj
        ]
      }, {
          low: 0,
          showArea: true,
          showPoint: true,
          showLine: true,
          fullWidth: true,
          lineSmooth: true,
          chartPadding: {
            top: 10,
            right: 0,
            bottom: 10,
            left: 0
          },
          axisX: {
            showLabel: false,
            showGrid: false,
            offset: 0
          },
          axisY: {
            showLabel: false,
            showGrid: false,
            offset: 0
          },
          plugins: [
            Chartist.plugins.tooltip()
          ]
        });


    $("#lblInicio_Postes").text(Postes);
  }, "json");

  $.post('../server/php/proyecto/cargarProyectosSemana.php', {Usuario : Usuario.id, Fecha:fecha}, function(data, textStatus, xhr) 
  {
    var Postes = 0;
    var Fotos = 0;
    var Proyectos = 0;
    var arrObj = [];
    var arrLabels = [];
    $.each(data, function(index, val) 
    {
       Postes += parseInt(val.Postes);
        Fotos += parseInt(val.Fotos);

       arrLabels.push(val.Dia);
       arrObj.push(parseInt(val.Postes));

       $("#lblInicio_ProyectosM").text(val.Proyectos);
    });

       new Chartist.Bar("#widgetSaleBar .ct-chart", {
          labels: arrLabels,
          series: [
            arrObj
          ]
        }, {
          low: 0,
          fullWidth: true,
          chartPadding: {
            top: 0,
            right: 20,
            bottom: 30,
            left: 20
          },
          axisX: {
            showLabel: false,
            showGrid: false,
            offset: 0
          },
          axisY: {
            showLabel: false,
            showGrid: false,
            offset: 0
          },
          plugins: [
            Chartist.plugins.tooltip()
          ]
        });
    

    $("#lblInicio_PostesM").text(Postes);
    $("#imgInicio_Cargando").hide();
  }, "json");
}

function levantamiento_Guardar(callback)
{
  if (callback === undefined)
  { callback = function(){};}

  if ($("#txtLevantamiento_CoordX").val() == "")
  {
    Mensaje("Error", "Las coordenadas no pueden estar vacías", "danger");
    $("#txtLevantamiento_CoordX").focus();
  } else
  {
    $("#frmLevantamiento").generarDatosEnvio("txtLevantamiento_", function(datos)
      {
        var idProyecto = $("#txtLevantamiento_idProyecto").val();
        var CodPoste = $("#txtLevantamiento_CodPoste").val();
        var Coordenadas = $("#txtLevantamiento_CoordX").val() + "#" + $("#txtLevantamiento_CoordY").val() + "#" + $("#txtLevantamiento_CoordQ").val()
          var jDatos = JSON.parse(datos);
          ejecutarSQL("SELECT * FROM Levantamiento WHERE idProyecto = ? AND codPoste = ?", [idProyecto, CodPoste], 
            function(Levantamientos)
            {
              var Prefijo = obtenerPrefijo();
              var Fecha = obtenerFecha();

              if (Levantamientos.length > 0)
              {
                ejecutarInsert("UPDATE Levantamiento SET coordenadas = ?, Usuario = ?, fecha = ?, Sincronizacion = ?, Datos = ? WHERE idProyecto = ? AND codPoste = ?", 
                  [Coordenadas, Usuario.id, Fecha, "Enviar", datos, idProyecto, CodPoste], function()
                  {
                    Mensaje("Hey", "Registro Actualizado", "success");
                    callback();
                  });
              } else
              {
                ejecutarInsert("INSERT INTO Levantamiento (Prefijo, idProyecto, codPoste, coordenadas, Usuario, fecha, Sincronizacion, Datos) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
                  [Prefijo, idProyecto, CodPoste, Coordenadas, Usuario.id, Fecha, "Enviar", datos], function()
                  {
                    Mensaje("Hey", "Registro ingresado", "success");
                    callback();
                  });
              }
            });
      });
  }
}

function levantamiento_NuevoCodigo()
{
  ejecutarSQL("SELECT COUNT(*) AS Cantidad FROM Levantamiento WHERE idProyecto = ?", [$("#txtLevantamiento_idProyecto").val()], function(dato)
    {
      dato = dato[0].Cantidad;
      $("#lblLevantamiento_CodPunto").text( CompletarConCero((dato + 1), 3));
      $("#txtLevantamiento_CodPoste").val( CompletarConCero((dato + 1), 3));
    });
}



function sincronizarRecoleccion()
{
  ejecutarSQL("SELECT * FROM Levantamiento WHERE Sincronizacion = ?", ["Enviar"], function(Lev)
    {
      if (Lev.length > 0)
      {
        $.each(Lev, function(index, val) 
        {
          $.post("http://orion.wsppb-latam.com/server/php/movil/crearLevantamiento.php", {datos: val}, function(data, textStatus, xhr) 
          {
            if (data == 1)
            {
              ejecutarInsert("UPDATE Levantamiento SET Sincronizacion = ? WHERE Prefijo = ?", ["Enviado", val.Prefijo]);
            }
          }).fail(function()
          {

          });
        });
      }
    });

  ejecutarSQL("SELECT * FROM Proyectos WHERE Sincronizacion = ?", ["Enviar"], function(Lev)
    {
      if (Lev.length > 0)
      {
        $.each(Lev, function(index, val) 
        {
          $.post("http://orion.wsppb-latam.com/server/php/movil/crearProyecto.php", {datos: val}, function(data, textStatus, xhr) 
          {
            if (data == 1)
            {
              ejecutarInsert("UPDATE Proyectos SET Sincronizacion = ? WHERE idProyecto = ?", ["Enviado", val.idProyecto]);
            }
          }).fail(function()
          {
            
          });
        });
      }
    });
}

function reportes_Basico()
{
  $("#txtReportes_Desde").val(sumarFecha(obtenerFecha().replace(" ", "T") + "Z", -3));
  $("#txtReportes_Desde, #txtReportes_Hasta").datepicker({'autoclose' : true});
  reportes_Basico_cargarProyectos();

  $("#btnReportes_Actualizar").on("click", function(evento)
  {
    evento.preventDefault();
    reportes_Basico_cargarProyectos();
  });

  $("#txtReportes_Filtrar").on("change keyup paste", function()
  {
    var valor = $("#txtReportes_Filtrar").val().replace(/ /gi, "\\ ");
    $(".btnReporte_Proyecto").addClass('hide');
    if (valor != "")
    {
      var obj = $(".btnReporte_Proyecto[filtro*=" + valor.toLowerCase() + "]");
      $(obj).removeClass('hide');

    } else
    {
      $(".btnReporte_Proyecto").removeClass('hide');
    }
  });

  $(document).delegate('.btnReporte_Proyecto', 'click', function(event) 
  {
    var titulo = $(this).find("nombre").text();
    var idProyecto = $(this).attr("id");
    var NomProyecto = $(this).attr("Filtro");
    
    cargarModulo("reportes/repLevantamiento.html", titulo, function()
      {
        $("#lblNomProyecto").text(NomProyecto);
        $("#lblReporte_NomProyecto").text(titulo);
        $("#txtReporte_idProyecto").val(idProyecto);

        $.post('../server/php/proyecto/cargarProyecto.php', {idProyecto: idProyecto, Usuario : Usuario.id}, function(data, textStatus, xhr) 
        {
          $("#lblReporte_ProyectoNombre").text(data.Nombre);
          $("#lblReporte_ProyectoCodigo").text(data.Codigo);
          $("#lblReporte_ProyectoDescripcion").text(data.Descripcion);
          $("#lblReporte_ProyectoUnitario").text(data.Unitario);

          $("#lblReporte_ProyectoCreador").text(data.NomCreador);
          $("#lblReporte_ProyectoResponsable").text(data.NomResponsable);

          $("#lblReporte_ProyectoPostes").text(data.Postes);
          $("#lblReporte_ProyectoFotos").text(data.Fotos);

          $("#lblReporte_ProyectoFechaCreacion").text(data.Fecha);
          if (data.fechaEntrega == "")
          {
            $("#lblReporte_ProyectoFechaEntrega").text("(Prevista): " + data.fechaPrevEntrega);
          } else
          {
            $("#lblReporte_ProyectoFechaEntrega").text(": " + data.fechaEntrega);
          }

          $("#lblReporte_ProyectoResponsableActual").text(data.NomResponsable);
          $("#lbltxtReporte_ProyectoIdResponsableNuevo").val(data.idResponsable);
          $("#txtReporte_ProyectoResponsableNuevo").val(data.idResponsable);

          $("#txtReporte_ProyectoEstadoNuevo").val(data.idEstado);

          if (data.idEstado > 5)
          {
            $("#cntReporte_Asignaciones_Trasladar").hide();
          } else
          {
            $("#cntReporte_Asignaciones_Trasladar").show();
          }

          $("#lblReporte_Asignaciones_Entregar_Unidad").text(data.Unidad);

        }, "json");

        $("#tblProyecto_Asignaciones tbody tr").remove();

        $.post('../server/php/proyecto/cargarAsignaciones.php', {idProyecto: idProyecto, Usuario : Usuario.id}, function(data, textStatus, xhr) 
        {
          if (data != 0)
          {
            var tds = "";
            $.each(data, function(index, val) 
            {
              tds += '<tr>'
                tds += '<td></td>';
                tds += '<td>' + val.UsuarioAnterior + '</td>';
                tds += '<td>' + val.EstadoAnterior + '</td>';
                tds += '<td>' + val.UsuarioNuevo + '</td>';
                tds += '<td>' + val.EstadoNuevo + '</td>';
                tds += '<td>' + val.fechaCargue + '</td>';
              tds += '</tr>'
            });

            $("#tblProyecto_Asignaciones tbody").append(tds);
          }
        }, 'json');
        repLevantamiento();
      });  
  });

  $(document).delegate('.btnReporte_Volver', 'click', function(event) 
  {
    $("#bntReporte_AbrirMapa").trigger('click');
    cargarModulo("reportes/basico.html", "Reporte");
  });

}

function reportes_Basico_cargarProyectos()
{
  $("#imgReportes_Cargando").show();
  $("#cntReportes_Proyectos div").remove();
  
  fechaIni = $("#txtReportes_Desde").val();
  fechaFin = $("#txtReportes_Hasta").val();

  $.post('../server/php/proyecto/cargarProyectos.php', {Usuario : Usuario.id, fechaIni : fechaIni, fechaFin : fechaFin}, function(data, textStatus, xhr) 
  {
    if (data.length > 0)
    {
      var tds = "";

      var rojoPostes = "";
      var rojoFotos = "";
      var par = "";

      var lblTotPostes = ""
      var lblTotFotos = ""

      var claseEstado = ["", "warning", "warning", "warning", "primary", "info", "success", "success", "danger"];
      $.each(data, function(index, val) 
      {
        lblTotPostes = " cargados";
        lblTotFotos = " cargadas";
        par = "";
        rojoFotos = "";
        rojoPostes = "";

        if (index%2 > 0)
        {
          par = "par";
        }

        if (val.Postes == 0)
        {
          rojoPostes = "red-600";
        }

        if (val.Fotos == 0)
        {
          rojoFotos = "red-600";
        }
        if (val.idEstado > 3)
        {
           lblTotPostes = 'de <span class="font-size-30">' + val.totPostes + '</span>';
           lblTotFotos = 'de <span class="font-size-30">' + val.totFotos + '</span>';
        }

        tds += '<div class="col-md-5 btnReporte_Proyecto row text-left ' + par + '" Filtro="' + val.Codigo.toLowerCase() + ' ' + val.Nombre.toLowerCase() + ' ' + val.Descripcion.toLowerCase() + '" id="' + val.idProyecto + '">';
          tds += '<div class="col-xs-12 col-md-12 btnReporte_Proyecto_Titulo"';
            tds += '<span class=""><i class="icon wb-chevron-right-mini white" aria-hidden="true"></i></span><strong>' + val.Codigo + '</strong>'
            tds += '<br><strong><nombre>' + val.Nombre + '</nombre></strong>';
          tds += '</div>';
          tds += '<div class="btnReporte_Proyecto_Contenido">';
            tds += '<br><br><br><i>' + val.Descripcion + '</i>';
            tds += '<br><b> ' + val.NomCreador + ' </b><small><i> (' + val.Fecha + ') </i></small>';
            tds += '<br><small>Responsable Actual: </small><b> ' + val.NomResponsable + ' </b>';
          tds += '</div>';
          tds += '<div class="col-xs-12 col-md-12 btnReporte_Proyecto_Widgets">';
            tds += '<div class="col-xs-6 col-md-6">';
              tds += '<div class="widget">';
                tds += '<div class="widget-content padding-25 bg-white">';
                  tds += '<div class="counter counter-lg">';
                    tds += '<span class="counter-number ' + rojoPostes + '">' + val.Postes + '</span>';
                    tds += '<div class="counter-label text-uppercase">Postes</div><div>' + lblTotPostes +  '</div>';
                  tds += '</div>';
                tds += '</div>';
              tds += '</div>';
            tds += '</div>';
            tds += '<div class="col-xs-6 col-md-6">';
              tds += '<div class="widget">';
                tds += '<div class="widget-content padding-25 bg-white">';
                  tds += '<div class="counter counter-lg">';
                    tds += '<span class="counter-number ' + rojoFotos + '">' + val.Fotos + '</span>';
                    tds += '<div class="counter-label text-uppercase">Fotos</div><div>' + lblTotFotos +  '</div>';
                  tds += '</div>';
                tds += '</div>';
              tds += '</div>';
            tds += '</div>';
          tds += '</div>';
                tds += '<div class="col-md-12 alert alert-alt dark alert-' + claseEstado[val.idEstado] + ' alert-dismissible">' + val.Estado + '</div>';
          tds += '<div class="col-md-12">';
          tds += '</div>';
        tds += '</div>';
      });
      $("#cntReportes_Proyectos").append(tds);
      $("#txtReportes_Filtrar").trigger('change');
      $("#imgReportes_Cargando").hide();
    } else
    {
      $("#imgReportes_Cargando").hide();
      Mensaje("Hey", "No hay datos para mostrar", "danger");
      
    }
  }, "json");
}
function modRepLevantamiento()
{
  $('#bntReporte_AbrirTabla').on("click", function()
  {
    $("#cntReporte_Tabla table").crearDataTable("");
    
  });

  cargarDatosConf("cargarUsuarios", function(data)
  {
    $("#txtReporte_ProyectoResponsableNuevo").llenarCombo(data, function()
    {
      $("#txtReporte_ProyectoResponsableNuevo").val($("#lbltxtReporte_ProyectoIdResponsableNuevo").val()) ;
    });
  });

  $("#btnReporte_Trasladar").on("click", function(evento)
    {
      evento.preventDefault();
      alertify.set({"labels" : {"ok" : "Si, Trasladar", "cancel" : "No, Volver"}});
      alertify.confirm("Confirma que desea Trasladar este proyecto?, se enviará un mensaje al nuevo responsable", function (ev) 
      {
        if (ev)
        {
          $.post('../server/php/proyecto/trasladarProyecto.php', 
            {
              Usuario: Usuario.id, 
              idUsuarioNuevo : $("#txtReporte_ProyectoResponsableNuevo").val(), 
              idProyecto : $("#txtReporte_idProyecto").val(), 
              idEstadoNuevo: $("#txtReporte_ProyectoEstadoNuevo").val()
            }, function(data, textStatus, xhr) 
            {
              $("#lblReporte_ProyectoResponsable").text(data.UsuarioNuevo);
              $("#lblReporte_ProyectoResponsableActual").text(data.UsuarioNuevo);
              Mensaje("Hey", "El Responsable ha sido cambiado", "success");

              var tds = '';
              tds += '<tr>';
                tds += '<td></td>';
                tds += '<td>' + data.UsuarioAnterior + '</td>';
                tds += '<td>' + data.EstadoAnterior + '</td>';
                tds += '<td>' + data.UsuarioNuevo + '</td>';
                tds += '<td>' + $("#txtReporte_ProyectoEstadoNuevo option:selected").text() + '</td>';
                tds += '<td>' + obtenerFecha() + '</td>';
              tds += '</tr>';

              $("#tblProyecto_Asignaciones tbody").append(tds);
            }, 'json');
        } 
      });
    });

  $("#btnReporte_Anular").on("click", function(evento)
    {
      evento.preventDefault();
      alertify.set({"labels" : {"ok" : "Si, Anular", "cancel" : "No, Volver"}});
      alertify.confirm("Confirma que desea Anular este proyecto?", function (ev) 
      {
        if (ev)
        {
          $.post('../server/php/proyecto/trasladarProyecto.php', 
            {
              Usuario: Usuario.id, 
              idUsuarioNuevo : 23, 
              idProyecto : $("#txtReporte_idProyecto").val(), 
              idEstadoNuevo: 8
            }, function(data, textStatus, xhr) 
            {
              $("#lblReporte_ProyectoResponsable").text(data.UsuarioNuevo);
              $("#lblReporte_ProyectoResponsableActual").text(data.UsuarioNuevo);
              Mensaje("Hey", "El Proyecto ha sido anulado", "success");

              var tds = '';
              tds += '<tr>';
                tds += '<td></td>';
                tds += '<td>' + data.UsuarioAnterior + '</td>';
                tds += '<td>' + data.EstadoAnterior + '</td>';
                tds += '<td>' + data.UsuarioNuevo + '</td>';
                tds += '<td>Proyecto Anulado</td>';
                tds += '<td>' + obtenerFecha() + '</td>';
              tds += '</tr>';

              $("#tblProyecto_Asignaciones tbody").append(tds);
            }, 'json');
        } 
      });
    });

  $("#btnReporte_Entregar").on("click", function(evento)
    {
      evento.preventDefault();
      $("#cntReporte_Asignaciones_Entregar").modal('show');
    });

  $("#frmReporte_Asignaciones_Entregar").on("submit", function(evento)
    {
      evento.preventDefault();
      if ($("#txtReporte_Asignaciones_Entregar_Cantidad").val() > 0)
      {
        $.post('../server/php/proyecto/EntregarProyecto.php', 
            {
              Usuario: Usuario.id, 
              idUsuarioNuevo : 22, 
              idProyecto : $("#txtReporte_idProyecto").val(), 
              idEstadoNuevo: 6,
              Cantidad : $("#txtReporte_Asignaciones_Entregar_Cantidad").val()
            }, function(data, textStatus, xhr) 
            {
              $("#lblReporte_ProyectoResponsable").text(data.UsuarioNuevo);
              $("#lblReporte_ProyectoResponsableActual").text(data.UsuarioNuevo);
              Mensaje("Hey", "El Proyecto ha quedado Listo para Facturar", "success");

              var tds = '';
              tds += '<tr>';
                tds += '<td></td>';
                tds += '<td>' + data.UsuarioAnterior + '</td>';
                tds += '<td>' + data.EstadoAnterior + '</td>';
                tds += '<td>' + data.UsuarioNuevo + '</td>';
                tds += '<td>Listo Para Facturar</td>';
                tds += '<td>' + obtenerFecha() + '</td>';
              tds += '</tr>';

              $("#tblProyecto_Asignaciones tbody").append(tds);

              $("#cntReporte_Asignaciones_Entregar").modal('hide');
            }, 'json');
      } else
      {
        Mensaje("Error", "Debe ingresar un número válido", "danger");
      }
    });



  $("#btnReporte_Archivos_DescargarTodos").on("click", function(evento)
  {
     evento.preventDefault();
     $("#imgReporte_Archivos_Cargando").show();
    $.post('../server/php/proyecto/crearZIP.php', {idProyecto: $("#txtReporte_idProyecto").val()}, function(data, textStatus, xhr) 
    {
      $("#imgReporte_Archivos_Cargando").hide();
      if (data != 0)
      {
        document.location=data;
      } else
      {
        Mensaje("Error", "Hubo un error en la descarga: " + data, "danger");
      }
    }).fail(function()
    {
      $("#imgReporte_Archivos_Cargando").hide();
    });
  });

  $("#btnReporte_DescargarKML").on("click", function(evento)
  {
    evento.preventDefault();
    $.post('../server/php/proyecto/crearKML.php', {idProyecto: $("#txtReporte_idProyecto").val()}, function(data, textStatus, xhr) 
    {
      if (data != 0)
      {
        //abrirURL(data);
        document.location=data;
      } else
      {
        Mensaje("Error", "Hubo un error en la descarga", "danger");
      }
    });
  });

  $(document).delegate('.btnReporte_ArchivosEliminar', 'click', function(event) 
  {
    event.preventDefault();

    var obj = this;

    alertify.set({"labels" : {"ok" : "Si, Borrar", "cancel" : "No, Volver"}});
    alertify.confirm("Confirma que desea borrar este elemento?", function (ev) 
    {
      if (ev)
      {
        var ruta = $(obj).parent("h4").find("[href]");
        ruta = $(ruta).attr("href");
        
        $.post("../server/php/eliminarArchivo.php", {ruta: ruta}, function(data)
        {
          if (data == 1)
          {
            $(obj).parent("h4").parent("div").parent("div").parent("li").remove();
          } else
          {
            Mensaje("Error", data);
          }

        })
      } 
    });
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

  $("#frmReporte_Archivos").ajaxForm(
  {
    beforeSend: function() 
    {
        var percentVal = '0%';
        $("#txtReporte_ArchivoProgreso").width(percentVal);
        $("#txtReporte_ArchivoProgreso").text(percentVal);
    },
    uploadProgress: function(event, position, total, percentComplete) {
        
        var percentVal = percentComplete + '%';
        $("#txtReporte_ArchivoProgreso").width(percentVal);
        $("#txtReporte_ArchivoProgreso").text(percentVal);
    },
    success: function() {
        var percentVal = '100%';
        $("#txtReporte_ArchivoProgreso").width(percentVal);
        $("#txtReporte_ArchivoProgreso").text(percentVal);
    },
    complete: function(xhr) {
      var respuesta = xhr.responseText;
      if (respuesta.substring(0, 8) == "Archivos")
          {
            var tds = "";
            var arrArchivo = respuesta.split("/");
            var arrExt = arrArchivo[arrArchivo.length - 1].split(".");
            var nomArchivo = arrArchivo[arrArchivo.length - 1];
            var ext = arrExt[arrExt.length - 1];

              tds += '<li class="list-group-item">';
                tds += '<div class="media">';
                  tds += '<div class="media-left">';
                    tds += '<a class="avatar" href="javascript:void(0)">';
                      tds += '<img src="../assets/images/fileIcons/' + ext.toLowerCase() + '.png" alt=""></a>';
                  tds += '</div>';
                  tds += '<div class="media-body">';
                    tds += '<h4 class="media-heading">';
                      tds += '<a class="name" href="../server/php/' + respuesta + '" target="_blank">' + nomArchivo + '</a>';
                      tds += '<a class="btn btn-danger pull-right btnReporte_ArchivosEliminar"><i class="icon wb-trash"> </i></a>';
                    tds += '</h4>';
                  tds += '</div>';
                tds += '</div>';
              tds += '</li>';

            $("#cntReporte_Archivos").prepend(tds);
          } else
          {
            Mensaje("Error","Hubo un Error, " + respuesta, "danger");
          }
     }
  }); 

}
function repLevantamiento()
{
  
  if (repMap != null)
  {
    repMap.removeMarkers();
  }

  $("#cntReporte_Tabla table").remove();
  $("#cntReporte_Tabla div").remove();
  $("#cntReporte_btnPostes div").remove();
  $("#cntReporte_Fotos li").remove();

  iniciarMapa();

  var tmpContador = "";

  $.post('../server/php/proyecto/cargarFotos.php', {Usuario : Usuario.id, idProyecto : $("#txtReporte_idProyecto").val(), codPoste :  ""}, 
    function(fotos, textStatus, xhr) 
    {
      tds = "";
      var idx = 0;

      if (fotos != 0)
      {
        $.each(fotos, function(index, val) 
        {
          if (tmpContador != val.idRecurso)
          {
            $("#cntReporte_Fotos_" + tmpContador).magnificPopup(
            {
              delegate: 'a', 
              type: 'image', 
              gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0, 1] 
            }});

            tmpContador = val.idRecurso;
            idx = 0;

            tds = '<li class="list-group-item">';
              tds += '<div class="media">';
                tds += '<div class="media-body">';
                  tds += '<h4 class="media-heading">' + val.nomUsuario;
                    tds += '<span> <span id="lblReporte_CantFotos_' + val.idRecurso + '" class="badge badge-radius badge-info">0</span> fotos del ' + val.idRecurso + '</span>';
                  tds += '</h4>';
                  tds += '<small id="id="lblReporte_Fecha_' + val.idRecurso + '">' + val.fechaCargue + '</small>';
                  tds += '<div id="cntReporte_Fotos_' + val.idRecurso + '" class="col-md-12">';
                  tds += '</div>';
                tds += '</div>';
              tds += '</div>';
            tds += '</li>';

            $("#cntReporte_Fotos").append(tds);
          }
          idx++;

          $("#lblReporte_CantFotos_" + val.idRecurso).text(idx);
          $("#lblReporte_Fecha_" + val.idRecurso).text(val.fechaCargue);
            tds = '<a class="inline-block margin-5" href="../server/php/Archivos/' + val.Ruta + '">';
              tds += '<img class="img-responsive margin-top-5 imgReporte_FotoZoomIn" style="border-radius: 5px;" src="../server/php/Archivos/' + val.Ruta.replace("Panama", "Panama/thumbnails") + '" alt="...">';
            tds += '</a>';
          $("#cntReporte_Fotos_"  + val.idRecurso).append(tds);
        });

        $("#cntReporte_Fotos_" + tmpContador).magnificPopup(
            {
              delegate: 'a', 
              type: 'image', 
              gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0, 1] 
            }});

        //$(".mfp-img").pinchzoomer({ imageOptions:{ preloaderUrl:"../assets/preloader.gif"} });
      }
    }, "json");

  $.post('../server/php/proyecto/cargarLevantamiento.php', {Usuario : Usuario.id, idProyecto : $("#txtReporte_idProyecto").val()}, function(data, textStatus, xhr) 
  {
    Markers = {};
    tmpLastMarker = null;
    if (data.length > 0)
    {
      var arrCoord = {};
      var tds = "";
      var tds2 = "";
      var idx = -1;
      var idTabla = obtenerPrefijo();
      var tmpData = {};

      var objPostes = {};
      var tmpJSON = {};
      var tmpPath = {};

      var filas = {};
      var encabezados = [];

      tds = '<table id="tblReporte_' + idTabla + '" class="table table-hover" style="display: block;overflow-x: auto;">';
      var idy = 0;
      tds += '<thead><tr><th></th><th></th>';
      $.each(data, function(index, val) 
      {
        val.Datos = JSON.parse(val.Datos);
        encabezados[idy] = val.Datos.CodPoste;
        tds += '<th>' + val.Datos.CodPoste + '</th>';

        $.each(val.Datos, function(indexD, valD) 
        {
          if (typeof(filas[indexD]) == "undefined")
          {
           filas[indexD] = [];
          }
          filas[indexD][val.Datos.CodPoste] = valD;          
        });

        idy++;

        if (val.Datos.CoordX != "")
        {
          if (!isNaN(val.Datos.CoordX))
          {
            idx++;
            objPostes[val.Datos.CodPoste] = [val.Datos.CoordX, val.Datos.CoordY];
            repMapa_AgregarMarcador(val.Datos);
          }
        }
        if (val.Datos.Tramo != null && val.Datos.Tramo != "" && val.Datos != "null")
        {
          if (objPostes[val.Datos.Tramo] != undefined)
          {
            tmpPath = [objPostes[val.Datos.Tramo], objPostes[val.Datos.CodPoste]];
          
            repMapa_AgregarLinea(tmpPath);
          }
        }
      });

      tds += '</tr></thead>';
      tds += '<tbody>';
      
      $.each(filas, function(index, val) 
      {
        tds += '<tr><td></td>';

        tds += '<td>' + index + '</td>';

        $.each(encabezados, function(indice, codPoste) 
        {
           if (typeof(val[codPoste]) == "undefined")
           {
              tds += '<td>No Aplica</td>';
           } else
           {
              tds += '<td>' + val[codPoste] + '</td>';
           }
        });

        tds += '</tr>';
      });

      tds += '</tbody>';

      /*
      $.each(data, function(index, val) 
      {
        if (index == 0)
        {
          tds += '<table id="tblReporte_' + idTabla + '" class="table table-hover" style="display: block;overflow-x: auto;"><thead><tr>';
            $.each(val, function(indexI, valI) 
            {
               if (indexI == "Datos")
               {
                  tmpData = JSON.parse(valI);
                $.each(tmpData, function(indexK, valK) 
                {
                    tds += '<th>' + indexK + '</th>';
                });
               } else
               {
                  tds += '<th>' + indexI + '</th>';
               }
            });
          tds += '</tr></thead><tbody>';
        }

        tmpJSON = JSON.parse(val['Datos']);

        tds2 += '<div class="col-md-4 col-xs-6"><div class="margin-5"><button class="btn btn-outline btnReporte_Marker btn-block btn-warning ">' + tmpJSON.CodPoste + '</button></div></div>';

        tds += '<tr class="rowLevantamiento" codPoste="' + tmpJSON.CodPoste + '">';
        $.each(val, function(indexO, valO) 
        {
           if (indexO == "Datos")
               {
                  tmpData = JSON.parse(valO);
                $.each(tmpData, function(indexK, valK) 
                {
                    tds += '<td>' + valK.replace("'", '"') + '</td>';
                });
               } else
               {
                  tds += '<td>' + valO.replace("'", '"') + '</td>';
               }
        });
        tds += '</tr>';
        */
        
        /*
        
        if (val.coordenadas != "" && val.coordenadas.length > 7)
        {
          var vArrCoord = val.coordenadas.split("#");
          if (!isNaN(vArrCoord[0]))
          {
            idx++;
            objPostes[tmpJSON.CodPoste] = [tmpJSON.CoordX, tmpJSON.CoordY];
            repMapa_AgregarMarcador(val);
          }
        }
        if (tmpJSON.Tramo != null && tmpJSON.Tramo != "" && tmpJSON != "null")
        {
          tmpPath = [objPostes[tmpJSON.Tramo], objPostes[tmpJSON.CodPoste]];
          
          repMapa_AgregarLinea(tmpPath);
        }
      });*/

      tds += '</table>';
      $("#cntReporte_Tabla").append(tds);

      if (idx >= 0)
      {
        var arrCoord = data[idx].coordenadas.split("#");

        repMap.setCenter(arrCoord[0].replace(",", "."), arrCoord[1].replace(",", "."));
        repMap.setZoom(15);
      } else
      {
        Mensaje("Error", "No se encontró niguna coordenada Válida en el Proyecto", "danger");
      }
    }
  }, "json");

  $.post('../server/php/listarArchivos.php', {ruta: 'Panama/' + $("#txtReporte_idProyecto").val()}, function(archivos) 
      {
        $("#cntReporte_Archivos li").remove();
        $("#btnReporte_Archivos_DescargarTodos").attr("idProyecto", $("#txtReporte_idProyecto").val());
        $("#frmReporte_Archivos").attr("action", "../server/php/subirArchivo.php?Ruta=Panama/" + $("#txtReporte_idProyecto").val());
        if (archivos.error === undefined)
        {
          var ext = "";
          var arrExt;
          var tmpDirectorio = "";
          var regDirectorio = "";
          var tds2 = "";
          $.each(archivos, function(nomDirectorio, cntDirectorio) 
          {
            if (regDirectorio != nomDirectorio)
            {
              regDirectorio = nomDirectorio;
              tds2 += '<li class="list-group-item">';
              if (regDirectorio != "raiz")
              {

                      tds2 += '<h4 class="example-title">' + regDirectorio + '</h4>';
              } else
              {
                tds2 += '<h4 class="example-title"></h4>';
              }
                    tds2 += '</li>';
            }

            
            $.each(cntDirectorio, function(idx, Archivo) 
            {
              arrExt = Archivo.nomArchivo.split(".");
              ext = arrExt[arrExt.length - 1];

              tds2 += '<li class="list-group-item">';
                      tds2 += '<div class="media">';
                        tds2 += '<div class="media-left">';
                          tds2 += '<a class="avatar" href="javascript:void(0)">';
                            tds2 += '<img src="../assets/images/fileIcons/' + ext.toLowerCase() + '.png" alt=""></a>';
                        tds2 += '</div>';
                        tds2 += '<div class="media-body">';
                          tds2 += '<h4 class="media-heading">';
                            tds2 += '<a class="name" href="../server/php/' + Archivo.ruta + "/" + Archivo.nomArchivo + '" target="_blank">' + Archivo.nomArchivo + '</a>';
                            tds2 += '<a class="btn btn-danger pull-right btnReporte_ArchivosEliminar"><i class="icon wb-trash"> </i></a>';
                          tds2 += '</h4>';
                          tds2 += '<p class="list-group-item-text">';
                            tds2 +='<small><i>' + Archivo.fecha + '</i></small>';
                          tds2 += '</p>';
                        tds2 += '</div>';
                      tds2 += '</div>';
                    tds2 += '</li>';
            });
          });
          
          $("#cntReporte_Archivos").append(tds2);
        } 
      }, "json");
}
function seleccionarMarker(codPoste, callback)
{
  if (callback === undefined)
  {    callback = function(){};  }

  if (tmpLastMarker != null)
  {
    Markers[tmpLastMarker].setIcon({url : "../assets/images/icons/poste.png"});
  }
  tmpLastMarker = codPoste;
  repMap.setCenter({lat : Markers[codPoste].getPosition().lat(), lng : Markers[codPoste].getPosition().lng()});
  repMap.setZoom(19);
  Markers[codPoste].setIcon({url : "../assets/images/icons/poste_selected.png"});
  callback();
}

function iniciarMapa(Lat, Lon, contenedor)
{
  if (typeof GMaps == "undefined")
  {
    
  } else
  {
    Lat = 10.97575;
    Lon = -74.7893333333333;

    if (contenedor === undefined)
    {
      contenedor = '#cntReporte_Mapa';
    }
    if (Lat != undefined && Lon != undefined)
    {
      repMap = new GMaps({
        el: contenedor,
        lat : Lat,
        lng : Lon,
        zoomControl: true,
        zoomControlOpt: {
          style: "SMALL",
          position: "TOP_LEFT"
        },
        panControl: true,
        streetViewControl: true,
        mapTypeControl: true,
        overviewMapControl: true

      });

      repMap.addStyle({
        styledMapName: "Styled Map",
        styles: $.components.get('gmaps', 'styles'),
        mapTypeId: "map_style"
      });

      repMap.setStyle("map_style");
      
    }
  }
}

function repMapa_AgregarMarcador(datos)
  {
    if (datos === undefined)
    {
      datos = {};
    }
    /*
    var arrCoord = datos.coordenadas.split("#");
    var lat = arrCoord[0];
    var lon = arrCoord[1];
    */
   
   var lat = datos.CoordX;
   var lon = datos.CoordY;

    if (lat != "" && lon != "")
    {
      lat = lat.replace(",", ".");
      lon = lon.replace(",", ".");
      
      var contenido = "";
      //datos.Datos = JSON.parse(datos.Datos);
      
      contenido += '<div>';
        contenido += '<h4><strong>' + datos.CodPoste + '</strong></h4>';
        contenido += '<div class="col-md-12">';
        
        $.each(datos, function(index, val) 
        {
          contenido += '<div class="col-md-6">';
            contenido += '<h6><small>' + index + ':</small> <strong>' + val + '</strong></h6>';
          contenido += '</div>';
        });
        contenido += '</div>';
      contenido += '</div>';

      var tIcono = '../assets/images/icons/poste.png';
      if (datos.TipoElemento == "Tapia")
      {
        tIcono = '../assets/images/icons/tapia.png'
      }
      Markers[datos.CodPoste] = repMap.addMarker({
          lat: lat,
          lng: lon,
          title : datos.CodPoste,
          icon : tIcono,
          infoWindow: {
            content: contenido
          },
          click : function(e)
          {
            seleccionarMarker(datos.CodPoste);
          }
        });

      repMap.drawOverlay({
        lat: lat,
        lng: lon,
        content: '<div class="badge badge-info badge-sm">' + datos.CodPoste + '</div>'
      });
        
    }
  }
function repMapa_AgregarLinea(path)
{
  repMap.drawPolyline({
  path: path,
  strokeColor: '#715146',
  strokeOpacity: 0.6,
  strokeWeight: 5
});
}

function SQL()
{

}

function SQL_armarTabla(data)
{
  $.each(data, function(index, val) 
  {
    if (index == 0)
    {
      tds += '<table id="tblSQL_' + idTabla + '" class="table" style="display: block;overflow-x: auto;"><thead><tr>';
        $.each(val, function(indexI, valI) 
        {
           if (indexI == "Datos")
           {
              tmpData = JSON.parse(valI);
            $.each(tmpData, function(indexK, valK) 
            {
                tds += '<th>' + indexK + '</th>';
            });
           } else
           {
              tds += '<th>' + indexI + '</th>';
           }
        });
      tds += '</tr></thead><tbody classs="table-hover">';
    }
    tds += '<tr>';
    $.each(val, function(indexO, valO) 
    {
       if (indexO == "Datos")
           {
              tmpData = JSON.parse(valO);
            $.each(tmpData, function(indexK, valK) 
            {
                tds += '<td>' + valK + '</td>';
            });
           } else
           {
              tds += '<td>' + valO + '</td>';
           }
    });
    tds += '</tr>';
  });

        tds += '</tbody></table>';

        $("#cntReporte_Tabla").append(tds);

        $("#tblReporte_" + idTabla).crearDataTable("");
}

function reportes_ProyectosAnulados()
{
  $("#txtProyectosAnulados_Desde, #txtProyectosAnulados_Hasta").val(obtenerFecha().substr(0, 10));
  $("#txtProyectosAnulados_Desde, #txtProyectosAnulados_Hasta").datepicker({
    clearBtn: true,
    language: "es",
    orientation: "top auto",
    daysOfWeekHighlighted: "0",
    autoclose: true,
    todayHighlight: true
  });

  $("#btnProyectosAnulados_Actualizar").on("click", function()
  {
    $("#tblProyectosAnulados_Tabla tbody tr").remove();
    $.post('../server/php/proyecto/cargarProyectosAnulados.php', {fechaIni: $('#txtProyectosAnulados_Desde').val(), fechaFin : $("#txtProyectosAnulados_Hasta").val()}, function(data, textStatus, xhr) 
    {
      if (data != 0)
      {
        var tds = '';
        $.each(data, function(index, val) 
        {
           tds += '<tr>';
              tds += '<td></td>';
              tds += '<td><button idProyecto="' + val.idProyecto + '" class="btn btn-warning btnProyectosAnulados_Reactivar"><i class="icon fa-refresh"></i>Reactivar</button></td>';
              tds += '<td>' + val.Codigo + '</td>';
              tds += '<td>' + val.Nombre + '</td>';
              tds += '<td>' + val.Nombre + '</td>';
              tds += '<td>' + val.NomResponsable + '</td>';
              tds += '<td>' + val.fechaAnulacion + '</td>';
            tds += '</tr>';
        });

        $("#tblProyectosAnulados_Tabla").crearDataTable(tds);
      }
    
    }, 'json');
  });

  $(document).delegate('.btnProyectosAnulados_Reactivar', 'click', function(evento) 
  {
    evento.preventDefault();
    var idProyecto = $(this).attr("idProyecto");

    var objFila = $(this).parent("td").parent("tr");

    alertify.set({"labels" : {"ok" : "Si, Reactivar", "cancel" : "No, Volver"}});
    alertify.confirm("Confirma que desea Reactivar este proyecto?, se enviará un mensaje al Antiguo responsable", function (ev) 
    {
      if (ev)
      {
        $.post('../server/php/proyecto/reactivarProyecto.php', 
          {
            Usuario: Usuario.id, 
            idProyecto : idProyecto
          }, function(data, textStatus, xhr) 
          {
            var table1 = $('#tblProyectosAnulados_Tabla').DataTable();           
            var row = table1.row( objFila );
            row.remove().draw();
          }, 'json');
      } 
    });
  });
}

function reportes_ProyectosListosParaFacturar()
{
  $("#btnListosParaFacturar_Actualizar").on("click", function(evento)
  {
    evento.preventDefault();

    $("#tblProyectosAnulados_Tabla tbody tr").remove();
    $("#cntListosParaFacturar_Consolidados div").remove();
      $.post('../server/php/proyecto/cargarProyectosListosParaFacturar.php', {Usuario : Usuario.id}, function(data, textStatus, xhr) 
      {
        if (data != 0)
        {
          var tds = '';
          var tds2 = '';
          $.each(data, function(index, val) 
          {
            if (index != 'Agrupados')
            {
               tds += '<tr>';
                  tds += '<td></td>';
                  tds += '<td><button idProyecto="' + val.idProyecto + '" class="btn btn-success btnListosParaFacturar_Facturado"><i class="icon fa-money"></i> </button></td>';
                  tds += '<td>' + val.fechaPrevEntrega + '</td>';
                  tds += '<td>' + val.fechaEntrega + '</td>';
                  tds += '<td>' + val.Codigo + '</td>';
                  tds += '<td>' + val.Nombre + '</td>';
                  tds += '<td>' + val.DescProyecto + '</td>';
                  tds += '<td>' + val.Item + '</td>';
                  tds += '<td>' + val.Descripcion + '</td>';
                  tds += '<td>' + val.cantidadEntregada + '</td>';
                  tds += '<td>' + parseFloat(val.Valor2015).toFixed(2) + '</td>';
                  tds += '<td>' + (parseFloat(val.Valor2015) * parseFloat(val.cantidadEntregada)).toFixed(2) + '</td>';
                tds += '</tr>';
            } else
            {
              $.each(val, function(index2, val2) 
              {
                tds2 += '<div class="col-sm-4">';
                  tds2 += '<div class="widget">';
                    tds2 += '<div class="widget-content padding-30 bg-white">';
                      tds2 += '<div class="counter counter-lg">';
                        tds2 += '<small>' + val2.Item + ' </small><div class="counter-label text-uppercase">' + val2.Descripcion+ '</div>';
                        tds2 += '<div class="counter-number-group">';
                          tds2 += '<span class="counter-icon margin-right-10 blue-600">';
                            tds2 += '<i class="wb-stats-bars"></i>';
                          tds2 += '</span>';
                          tds2 += '<span class="counter-number">' + val2.Cantidad + '</span>';
                          tds2 += '<span class="counter-number-related"> ' + val2.Unidad + '</span>';
                        tds2 += '</div>';
                        tds2 += '<div class="counter-number-group">';
                          tds2 += '<span class="counter-icon margin-right-10 green-600">';
                            tds2 += '<i class="fa-money"></i>';
                          tds2 += '</span>';
                          tds2 += '<span class="counter-number">$ ' + parseFloat(val2.ValorTotal).toFixed(2) + '</span>';
                        tds2 += '</div>';
                      tds2 += '</div>';
                    tds2 += '</div>';
                  tds2 += '</div>';
                tds2 += '</div>';
              });
            }
          });

          $("#tblProyectosAnulados_Tabla").crearDataTable(tds);
          $("#cntListosParaFacturar_Consolidados").append(tds2);
        } else
        {
          $("#tblProyectosAnulados_Tabla").dataTable().fnDestroy();
          var tds = '<tr><td colspan="10">No hay proyectos disponibles para Facturar</td></tr>';
          $("#tblProyectosAnulados_Tabla tbody tr").remove();
          $("#tblProyectosAnulados_Tabla tbody").append(tds);
        }
      
      }, 'json');

      $(document).delegate('.btnListosParaFacturar_Facturado', 'click', function(event) 
      {
        var objFila = $(this).parent("td").parent("tr");
        alertify.set({"labels" : {"ok" : "Si, ya está facturado", "cancel" : "No, Volver"}});
        alertify.confirm("Confirma que este proyecto ya está Facturado?", function (ev) 
        {
          if (ev)
          {
            $.post('../server/php/proyecto/facturarProyecto.php', 
              {
                Usuario: Usuario.id, 
                idUsuarioNuevo : $("#txtReporte_ProyectoResponsableNuevo").val(), 
                idProyecto : $("#txtReporte_idProyecto").val(), 
                idEstadoNuevo: $("#txtReporte_ProyectoEstadoNuevo").val()
              }, function(data, textStatus, xhr) 
              {
                Mensaje("Hey", "El Proyecto ha sido Facturado", "success");

                var table1 = $('#tblProyectosAnulados_Tabla').DataTable();           
                var row = table1.row( objFila );
                row.remove().draw();
              }, 'json');
          } 
        });
        
      });
  });

  $("#btnListosParaFacturar_Actualizar").trigger('click');
}




function modalCrearZona(callbackOk, callbackError, callbackUpdate)
{
  if (callbackOk === undefined)   {    callbackOk = function(){};  }
  if (callbackError === undefined)   {    callbackError = function(){};  }
  if (callbackUpdate === undefined)   {    callbackUpdate = function(){};  }

  if ($("#cntCrearZona").length == 0)
  {
    var tds = "";
    tds += '<div class="modal fade" id="cntCrearZona" aria-hidden="false" aria-labelledby="cntCrearZona_Label" role="dialog" tabindex="-1">';
        tds += '<div class="modal-dialog">';
          tds += '<form id="frmModalCrearZona" class="modal-content">';
            tds += '<div class="modal-header">';
              tds += '<button type="button" class="close" data-dismiss="modal" aria-label="Close">';
                tds += '<span aria-hidden="true">×</span>';
              tds += '</button>';
              tds += '<h4 class="modal-title">Crear Zona</h4>';
            tds += '</div>';
            tds += '<div class="modal-body">';
              tds += '<div class="row">';
                tds += '<div class="col-sm-12 form-group">';
                  tds += '<label for="txtCrearZona_Nombre" class="form-label">Nombre</label>';
                  tds += '<input id="txtCrearZona_Nombre" type="text" class="form-control" placeholder="Nombre" required>';
                tds += '</div>';
                tds += '<div class="col-sm-12 pull-right">';
                  tds += '<button class="btn btn-success btn-outline" type="submit">Crear</button>';
                  tds += '<button class="btn btn-danger btn-outline margin-left-20" data-dismiss="modal" type="button">Cancelar</button>';
                tds += '</div>';
              tds += '</div>';
            tds += '</div>';
          tds += '</form>';
        tds += '</div>';
      tds += '</div>';
    
    $("body").append(tds);

    $("#frmModalCrearZona").on("submit", function(evento)
    {
      evento.preventDefault();
      if ($("#txtCrearZona_Nombre").val() == "")
      {
        Mensaje("Error", "No es posible crear una Zona sin Nombre");
      } else
      {
        $.post('../server/php/proyecto/modals/CrearZona.php', 
        {
          Nombre : $("#txtCrearZona_Nombre").val(),
          Usuario : Usuario.id
        }, function(data, textStatus, xhr) 
        {
          if (data['Error'] != "")
          {
            Mensaje("Error", data['Error'], 'danger');
            callbackError();
          } else
          {
            $("#cntCrearZona").modal("hide");
            if (data['id'] >= 0)
            {
              callbackOk(data['id']);
              Mensaje("Ok", "La Zona ha sido ingresada");
            } else
            {
              callbackUpdate();                
            }
          }
        }, "json").fail(function()
        {
          Mensaje("Error", "No hay conexión con el servidor");
        });        
      }
    });
  }

  $("#txtCrearZona_Nombre").val("");
  $("#cntCrearZona").modal("show");
}