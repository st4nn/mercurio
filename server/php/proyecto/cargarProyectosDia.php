<?php
  include("../conectar.php"); 
   $link = Conectar();

   $fecha = "";

   if (isset($_POST['Fecha']))
   {
    $fecha = $_POST['Fecha'] . " 00:00:00";
    $fechaFin = $_POST['Fecha'] . " 23:59:59";
   }

   if ($fecha <> "")
   {
    $fecha2 = " WHERE Levantamiento.fechaCargue >= '$fecha'";
    $fecha = " WHERE ((Levantamiento.fechaCargue >= '$fecha') OR (levArchivos.fechaCargue >= '$fecha'))";
   }

   $sql = "SELECT COUNT(DISTINCT Proyectos.id) AS Proyectos FROM Proyectos INNER JOIN Levantamiento ON Levantamiento.idProyecto = Proyectos.IdProyecto " . $fecha2 . " AND Proyectos.Item = 1;";
   $result = $link->query($sql);

   $fila =  $result->fetch_array(MYSQLI_ASSOC);
   $Proyectos = $fila['Proyectos'];

   $sql = "SELECT    
                Proyectos.IdProyecto AS idProyecto,
                $Proyectos AS Proyectos,
                COUNT(DISTINCT Levantamiento.Prefijo) AS Postes,
                COUNT(DISTINCT levArchivos.id) AS Fotos
            FROM 
               Proyectos
               INNER JOIN Levantamiento ON Levantamiento.idProyecto = Proyectos.IdProyecto
               INNER JOIN levArchivos ON levArchivos.IdProyecto = Proyectos.IdProyecto AND date_format(levArchivos.fechaCargue, '%m-%d') = date_format(Levantamiento.fechaCargue, '%m-%d')
            $fecha AND Proyectos.Item = 1
            GROUP BY 
              Proyectos.IdProyecto
            ORDER BY Proyectos.fechaCargue ASC;";

   $result = $link->query($sql);

   $idx = 0;
   if ( $result->num_rows > 0)
   {
      $Resultado = array();
      while ($row = mysqli_fetch_assoc($result))
      {
         $Resultado[$idx] = array();
         foreach ($row as $key => $value) 
         {
            $Resultado[$idx][$key] = utf8_encode($value);
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