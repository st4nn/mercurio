<?php

   require_once("../conectar.php");
   require_once("../../../assets/mensajes/correo.php");
   require_once("datosUsuario.php");

   function trasladarProyecto($idProyecto, $idEstadoNuevo, $idUsuarioNuevo, $Usuario)
   {
      $link = Conectar();

      $sql = "SELECT Codigo, Nombre, Descripcion, fechaRecepcion, fechaPrevEntrega, Responsable, idEstado FROM Proyectos WHERE IdProyecto = '$idProyecto'";
      $result = $link->query($sql);
      $fila =  $result->fetch_array(MYSQLI_ASSOC);

      $idEstadoAnterior = $fila['idEstado'];
      $idUsuarioAnterior = $fila['Responsable'];
      $Codigo = $fila['Codigo'];
      $Nombre = $fila['Nombre'];
      $Descripcion = $fila['Descripcion'];
      $fechaRecepcion = $fila['fechaRecepcion'];
      $fechaPrevEntrega = $fila['fechaPrevEntrega'];

      if ($idEstadoAnterior <> $idEstadoNuevo OR $idUsuarioAnterior <> $idUsuarioNuevo)
      {
         $respuesta = array();

         $sql = "INSERT INTO Asignaciones(idProyecto, estadoAnterior, estadoNuevo, responsableAnterior, responsableNuevo) VALUES 
         (
            '$idProyecto',
            '$idEstadoAnterior',
            '$idEstadoNuevo',
            '$idUsuarioAnterior',
            '$idUsuarioNuevo'
         )";



         $link->query(utf8_decode($sql));

         if ($link->error == "")
         {
            $rta = $link->insert_id;

            $sql = "UPDATE Proyectos SET Responsable = '$idUsuarioNuevo', idEstado = '$idEstadoNuevo' WHERE IdProyecto = '$idProyecto';";
            $link->query(utf8_decode($sql));

            $arrUsuario = datosUsuario($Usuario);
            $arrEntrega = datosUsuario($idUsuarioAnterior);
            $arrResponsable = datosUsuario($idUsuarioNuevo);

            $sql = "SELECT Nombre FROM confEstados WHERE id = '$idEstadoAnterior'";
            $result = $link->query($sql);
            $fila =  $result->fetch_array(MYSQLI_ASSOC);
            $Estado = $fila['Nombre'];

             
            $mensaje = "Buen Día, " . $arrResponsable['Nombre'] . "
                  <br><br>" . $arrUsuario['Nombre'] ." le ha trasladado un Proyecto en el sistema Orion,
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
                        <td><small><strong>Fecha de Recepción: </strong></small></td><td>$fechaRecepcion</td>
                     </tr>
                     <tr>
                        <td><small><strong>Fecha Prevista de Entrega:</strong></small></td><td style='color:red;'>$fechaPrevEntrega</td>
                     </tr>
                     <tr>
                        <td><small><strong>Estado:</strong></small></td><td>$Estado</td>
                     </tr>
                  </table>
                  <br><br>";

            //$obj = EnviarCorreo($arrResponsable['Correo'], "Traslado de Orden " . $Nombre, $mensaje);
            $respuesta['idUsuarioAnterior'] = utf8_encode($idUsuarioAnterior);
            $respuesta['UsuarioAnterior'] = utf8_encode($arrEntrega['Nombre']);
            $respuesta['idUsuarioNuevo'] = utf8_encode($idUsuarioNuevo);
            $respuesta['UsuarioNuevo'] = utf8_encode($arrResponsable['Nombre']);
            $respuesta['idEstadoAnterior'] = utf8_encode($idEstadoAnterior);
            $respuesta['idEstadoNuevo'] = utf8_encode($idEstadoNuevo);
            $respuesta['EstadoAnterior'] = utf8_encode($Estado);

            return $respuesta;
         } else
         {
            return $link->error;
         }
      }

      //return false;
   }
?>