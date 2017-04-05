<?php
  include("../conectar.php"); 
   $link = Conectar();

   $fechaIni = "";
   $fechaFin = "";
   $fecha = "";

   if (isset($_POST['fechaIni']))
   {
    if ($_POST['fechaIni'] <> "")
    {
      $fechaIni = $_POST['fechaIni'] . " 00:00:00";
    }
   }

   if (isset($_POST['fechaFin']))
   {
    if ($_POST['fechaFin'] <> "")
    {
      $fechaFin = $_POST['fechaFin'] . " 23:59:59";
    }
   }

   if ($fechaIni <> "")
   {
    $fecha = " AND Proyectos.fechaCargue >= '$fechaIni'";
   }

   if ($fechaFin <> "")
   {
    $fecha .= " AND Proyectos.fechaCargue <= '$fechaFin'";
   }


   $sql = "SELECT    
                Proyectos.IdProyecto AS idProyecto,
                Proyectos.idZona,
                Proyectos.Codigo,
                Proyectos.Nombre,
                Proyectos.Descripcion,
                Proyectos.Creador,
                Proyectos.idEstado,
                Proyectos.Fecha,
                Proyectos.totPostes,
                Proyectos.totFotos,
                Proyectos.idEstado,
                confEstados.Nombre AS Estado,
               datosUsuarios.Nombre AS NomCreador,
               Responsable.Nombre AS NomResponsable,
                COUNT(DISTINCT Levantamiento.Prefijo) AS Postes,
                COUNT(DISTINCT levArchivos.id) AS Fotos
            FROM 
               Proyectos
               INNER JOIN datosUsuarios ON datosUsuarios.idLogin = Proyectos.Creador
               LEFT JOIN datosUsuarios Responsable ON Responsable.idLogin = Proyectos.Responsable
               LEFT JOIN confEstados ON Proyectos.idEstado = confEstados.id
               LEFT JOIN Levantamiento ON Levantamiento.idProyecto = Proyectos.IdProyecto
               LEFT JOIN levArchivos ON levArchivos.IdProyecto = Proyectos.IdProyecto
            WHERE
              Proyectos.idEstado <> 8
              AND Proyectos.Item = 1
              $fecha
            GROUP BY 
              Proyectos.IdProyecto
            ORDER BY Proyectos.fechaCargue DESC;";

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