<?php
   include("../conectar.php"); 
   include("../../../assets/mensajes/correo.php");
   include("datosUsuario.php");

   date_default_timezone_set('America/Bogota');

   $link = Conectar();

   $datos = json_decode($_POST['datos']);

   $idUsuario = $_POST['Usuario'];
   $Usuario = datosUsuario($idUsuario);

   $idTabla = addslashes($datos->id);
   $idProyecto = addslashes($datos->idProyecto);

   $Empresa = addslashes($datos->Empresa);
   $Zona = addslashes($datos->Zona);
   $TipoDeArea = addslashes($datos->TipoDeArea);
   $Responsable = addslashes($datos->Responsable);
   $FechaRecepcion = addslashes($datos->FechaRecepcion);
   $FechaEntregaLevantamiento = addslashes($datos->FechaEntregaLevantamiento);
   $Codigo = addslashes($datos->Codigo);
   $Nombre = addslashes($datos->Nombre);
   $Descripcion = addslashes($datos->Descripcion);
   $Item = addslashes($datos->Item);
   
   if ($idTabla > 0)
   {} else
   {
      $idTabla = "NULL"  ;
   }

   $Duplicado = false;
   
   if ($idTabla == "NULL")
   {
      $sql = "SELECT COUNT(*) AS Cantidad FROM Proyectos WHERE Nombre = '$Nombre' AND idEmpresa = '$Empresa';";
      $result = $link->query($sql);
      $fila =  $result->fetch_array(MYSQLI_ASSOC);
      
      if ($fila['Cantidad'] > 0)
      {
         $Duplicado = true;
      }
   }

   /*
   if ($Duplicado)
   {
      echo "El Proyecto ya existe, por favor intente crearlo con otro nombre";
   } else
   {
      */
      $sql = "SELECT datosUsuarios.Correo, datosUsuarios.Nombre FROM datosUsuarios WHERE idLogin = '$Responsable';";
      $result = $link->query($sql);

      $fila =  $result->fetch_array(MYSQLI_ASSOC);
      $responsableCorreo = $fila['Correo'];
      $responsableNombre = $fila['Nombre'];

      $fecha = date('Y-m-d H:i:s');

      
      $sql = "INSERT INTO Proyectos(id, IdProyecto, idZona, Nombre, Descripcion, Creador, idEstado, Fecha, Codigo, idEmpresa, tipoArea, Item, Responsable, fechaRecepcion, fechaPrevEntrega) VALUES 
      (
         $idTabla,
         '" . $idProyecto. "',
         '" . $Zona. "',
         '" . $Nombre. "',
         '" . $Descripcion. "',
         '" . $idUsuario. "',
         '2',
         '" . $fecha. "',
         '" . $Codigo. "',
         '" . $Empresa. "',
         '" . $TipoDeArea. "',
         '" . $Item. "',
         '" . $Responsable. "',
         '" . $FechaRecepcion. "',
         '" . $FechaEntregaLevantamiento. "'
      ) ON DUPLICATE KEY UPDATE 
         IdProyecto = VALUES(IdProyecto),
         idZona = VALUES(idZona),
         Nombre = VALUES(Nombre),
         Descripcion = VALUES(Descripcion),
         Creador = VALUES(Creador),
         Fecha = VALUES(Fecha),
         Codigo = VALUES(Codigo),
         idEmpresa = VALUES(idEmpresa),
         tipoArea = VALUES(tipoArea),
         Item = VALUES(Item),
         Responsable = VALUES(Responsable),
         fechaRecepcion = VALUES(fechaRecepcion),
         fechaPrevEntrega = VALUES(fechaPrevEntrega),
         fechaCargue = '" . $fecha . "';";

      $link->query(utf8_decode($sql));
         if ( $link->affected_rows > 0)
         {
            $nuevoId = $link->insert_id;
            if ($nuevoId > 0)
            {
               $mensaje = "Buen Día, $responsableNombre
               <br><br>" . $Usuario['Nombre'] ." le ha asignado un Proyecto en el sistema Horus,
               <br>
               Los datos del proyecto son:
               <br><br>
               <table style='border:none;'>
                  <tr>
                     <small><strong>Codigo Interno: </strong></small></td><td>$idProyecto</td>
                  </tr>
                  <tr>
                     <td><small><strong>Codigo de la Obra: </strong></small></td><td>$Codigo</td>
                  </tr>
                  <tr>
                     <td><small><strong>Nombre: </strong></small></td><td>$Nombre</td>
                  </tr>
                  <tr>
                     <td><small><strong>Descripción: </strong></small></td><td>$Descripcion</td>
                  </tr>
                  <tr>
                     <td><small><strong>Fecha de Recepción: </strong></small></td><td>$FechaRecepcion</td>
                  </tr>
                  <tr>
                     <td><small><strong>Fecha Prevista de Entrega:</strong></small></td><td style='color:red;'>$FechaEntregaLevantamiento</td>
                  </tr>
                     <td><small><strong>Tipo de Area:</strong></small></td><td>$TipoDeArea</td>
                  <tr>
               </table>
               <br><br> Por favor <a href='http://orion.wsppb-latam.com/'>ingrese al Sistema</a> a su panel de Diligenciamiento para ubicarlo con los datos anteriores</a>";

               $obj = EnviarCorreo($responsableCorreo, "Asignación de Orden " . $Nombre, $mensaje) ;
               echo 1;
            } else
            {
               echo "Hubo un error desconocido " . $link->error;
            }
         } else
         {
            echo "Hubo un error desconocido" . $link->error;
         }
   //}

?>