<?php
  include("../conectar.php"); 
   $link = Conectar();

   $fecha = "";
   $fecha2 = "";

   if (isset($_POST['Fecha']))
   {
    $fecha = $_POST['Fecha'] . " 00:00:00";
    $fecha = date('Y-m-d H:i:s', strtotime ( '-7 days' , strtotime ( $fecha ) ) );
   }

   if ($fecha <> "")
   {
    $fecha2 = " WHERE Levantamiento.fechaCargue >= '$fecha'";
    $fecha = " WHERE (Levantamiento.fechaCargue >= '$fecha') OR (levArchivos.fechaCargue >= '$fecha')";
   }

   $sql = "SELECT COUNT(DISTINCT Proyectos.id) AS Proyectos FROM Proyectos INNER JOIN Levantamiento ON Levantamiento.idProyecto = Proyectos.IdProyecto " . $fecha2 . ";";
   $result = $link->query($sql);

   $fila =  $result->fetch_array(MYSQLI_ASSOC);
   $Proyectos = $fila['Proyectos'];

   $sql = "SELECT    
                date_format(Levantamiento.fechaCargue, '%m-%d') as Dia,
                $Proyectos AS Proyectos,                
                COUNT(DISTINCT Levantamiento.Prefijo) AS Postes,
                COUNT(DISTINCT levArchivos.id) AS Fotos
            FROM 
               Proyectos
               INNER JOIN Levantamiento ON Levantamiento.idProyecto = Proyectos.IdProyecto
               INNER JOIN levArchivos ON levArchivos.IdProyecto = Proyectos.IdProyecto AND date_format(levArchivos.fechaCargue, '%m-%d') = date_format(Levantamiento.fechaCargue, '%m-%d')
            $fecha
            GROUP BY 
              Dia
            ORDER BY Dia ASC;";

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