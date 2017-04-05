<?php
   include("../conectar.php"); 
   include("../../../assets/mensajes/correo.php");
   $link = Conectar();

   date_default_timezone_set("America/Bogota");

   $datos = $_POST['datos'];

  if (array_key_exists("Fecha", $datos))
  {
    $fecha = $datos['Fecha'];

    $totPostes = 0;
    $totFotos = 0;

    if (array_key_exists("Fotos", $datos))
    {
      $totFotos = $datos['Fotos'];
    }

    if (array_key_exists("Postes", $datos))
    {
      $totPostes = $datos['Postes']; 
    }

    if ($fecha == "")
    {
      $fecha = date('Y-m-d H:i:s');
    }

    $sql = "INSERT INTO Proyectos(IdProyecto, idZona, Nombre, Descripcion, Creador, idEstado, totPostes, totFotos, Fecha)  
    VALUES (
    '" . addslashes($datos['idProyecto']) . "', 
    '" . addslashes($datos['idZona']) . "', 
    '" . addslashes($datos['Nombre']) . "', 
    '" . addslashes($datos['Descripcion']) . "', 
    '" . addslashes($datos['Creador']) . "', 
    '" . addslashes($datos['idEstado']) . "', 
    '" . $totPostes . "', 
    '" . $totFotos . "', 
    '" . $fecha . "')
    ON DUPLICATE KEY UPDATE
    idEstado = VALUES(idEstado), 
    totFotos = VALUES(totFotos), 
    totPostes = VALUES(totPostes), 
    Fecha = VALUES(Fecha);";

    $result = $link->query(utf8_decode($sql));

    if ( $result <> false)
    {
      echo 1;

      $sql = "SELECT 
                  datosUsuarios.idLogin,
                  datosUsuarios.Nombre,
                  Proyectos.fechaPrevEntrega,
                  Proyectos.Codigo
                FROM 
                  datosUsuarios 
                  INNER JOIN Proyectos ON Proyectos.Responsable = datosUsuarios.idLogin 
                WHERE 
                  Proyectos.IdProyecto = '" . $datos['idProyecto'] . "';";

      $result = $link->query($sql);
      $fila =  $result->fetch_array(MYSQLI_ASSOC);

      $idResponsable = $fila['idLogin'];
      $nomResponsable = $fila['Nombre'];
      $fechaPrevEntrega = $fila['fechaPrevEntrega'];
      $Codigo = $fila['Codigo'];


      if ($datos['idEstado'] == 4)
      {
        $sql = "SELECT 
                  datosUsuarios.idLogin,
                  datosUsuarios.Nombre,
                  datosUsuarios.Correo
                FROM 
                  datosUsuarios 
                  INNER JOIN Login ON datosUsuarios.idLogin = Login.idLogin
                  INNER JOIN Proyectos ON Login.idEmpresa = Proyectos.idEmpresa
                WHERE 
                  datosUsuarios.Cargo LIKE '%dib%'
                  AND datosUsuarios.idPerfil < 3
                  AND Proyectos.IdProyecto = '" . $datos['idProyecto'] . "';";

        $result = $link->query($sql);
        
        $Nombres = "";
        $Correos = "";
        $idLogin = 1;
        while ($row = mysqli_fetch_assoc($result))
        {
          $Nombres .= $row['Nombre'] . ", ";
          $Correos .= $row['Correo']. ", ";
          $idLogin = 17;//$row['idLogin'];
        }
        $Correos = " jhonathan.espinosa@wspgroup.com ";

        $mensaje = "Buen Día 
               <br><br>Se ha terminado el Levantamiento en un Proyecto en el sistema Orion,
               <br>
               Los datos del proyecto son:
               <br><br>
               <table style='border:none;'>
                  <tr>
                     <small><strong>Codigo Interno: </strong></small></td><td>" . $datos['idProyecto'] . "</td>
                  </tr>
                  <tr>
                     <td><small><strong>Codigo de la Obra: </strong></small></td><td>" . $Codigo . "</td>
                  </tr>
                  <tr>
                     <td><small><strong>Nombre: </strong></small></td><td>" . $datos['Nombre'] . "</td>
                  </tr>
                  <tr>
                     <td><small><strong>Descripción: </strong></small></td><td>" . $datos['Descripcion'] . "</td>
                  </tr>
               </table>
               <br>La fecha prevista de entrega es: <strong>" . $fechaPrevEntrega . "</strong>
               <br><br> Por favor <a href='http://orion.wsppb-latam.com/'>ingrese al Sistema</a> al  panel de Reporte para ubicarlo con los datos anteriores</a>";

               $obj = EnviarCorreo($Correos, "Asignación de Orden " . $datos['Nombre'], $mensaje);

        $sql = "UPDATE Proyectos SET Responsable = '$idLogin' WHERE IdProyecto = '" . $datos['idProyecto'] . "';";
        $result = $link->query($sql);

        $sql = "INSERT INTO Asignaciones (idProyecto, estadoAnterior, estadoNuevo, responsableAnterior, responsableNuevo) VALUES 
        ('" . $datos['idProyecto'] . "',
        '3',
        '4',
        '" . $idResponsable . "',
        '" . $idLogin . "');";
        $result = $link->query($sql);
      } else
      {
        $sql = "INSERT INTO Asignaciones (idProyecto, estadoAnterior, estadoNuevo, responsableAnterior, responsableNuevo) VALUES 
        ('" . $datos['idProyecto'] . "',
        '3',
        '" . $datos['idEstado'] . "',
        '" . $idResponsable . "',
        '" . $idLogin . "');";
        $result = $link->query($sql);
      }
    } else
    {
      echo 0;
    }
  } else
  {
    echo 0;
  }


?>