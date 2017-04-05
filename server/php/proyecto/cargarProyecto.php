<?php
  include("../conectar.php"); 
   $link = Conectar();

   $idProyecto = $_POST['idProyecto'];

   $sql = "SELECT    
                Proyectos.IdProyecto AS idProyecto,
                Proyectos.idZona,
                Proyectos.Codigo,
                Proyectos.Nombre,
                Proyectos.Descripcion,
                Proyectos.Creador,
                Proyectos.idEstado,
                Proyectos.Fecha,
                Proyectos.fechaPrevEntrega,
                Proyectos.fechaEntrega,
                confUnitarios.Unidad,
               datosUsuarios.Nombre AS NomCreador,
               Responsable.idLogin AS idResponsable,
               Responsable.Nombre AS NomResponsable,
               confUnitarios.Descripcion AS Unitario,
               COUNT(DISTINCT Levantamiento.id) AS Postes,
               COUNT(DISTINCT levArchivos.id) AS Fotos
            FROM 
               Proyectos
               INNER JOIN datosUsuarios ON datosUsuarios.idLogin = Proyectos.Creador
               LEFT JOIN datosUsuarios Responsable ON Responsable.idLogin = Proyectos.Responsable
               LEFT JOIN confUnitarios ON confUnitarios.Item = Proyectos.Item AND confUnitarios.idEmpresa = Proyectos.idEmpresa
               LEFT JOIN Levantamiento ON Levantamiento.idProyecto = Proyectos.IdProyecto
               LEFT JOIN levArchivos ON levArchivos.IdProyecto = Proyectos.IdProyecto
            WHERE
              Proyectos.IdProyecto = '$idProyecto';";

   $result = $link->query($sql);

   $idx = 0;
   if ( $result->num_rows > 0)
   {
      $Resultado = array();
      while ($row = mysqli_fetch_assoc($result))
      {
         $Resultado = array();
         foreach ($row as $key => $value) 
         {
            $Resultado[$key] = utf8_encode($value);
         }
         $idx++;
      }
         mysqli_free_result($result);  
         echo json_encode($Resultado);
   } else
   {
      echo 0;
   }
?>