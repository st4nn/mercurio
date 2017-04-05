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
      $fechaIni = addslashes($_POST['fechaIni']) . " 00:00:00";
    }
   }

   if (isset($_POST['fechaFin']))
   {
    if ($_POST['fechaFin'] <> "")
    {
      $fechaFin = addslashes($_POST['fechaFin']) . " 23:59:59";
    }
   }

   if ($fechaIni <> "")
  {
    $fecha = " AND (Proyectos.fechaCargue >= '$fechaIni' OR Asignaciones.fechaCargue >= '$fechaIni')";
  }
    
  if ($fechaFin <> "")
  {
    $fecha = " AND (Proyectos.fechaCargue <= '$fechaFin' OR Asignaciones.fechaCargue >= '$fechaIni')";
  }
   


   $sql = "SELECT    
                Proyectos.IdProyecto AS idProyecto,
                Proyectos.Codigo,
                Proyectos.Nombre,
                Proyectos.Descripcion,
                datosUsuarios.idLogin AS idResponsable,
               datosUsuarios.Nombre AS NomResponsable,
               Asignaciones.fechaCargue AS fechaAnulacion
            FROM 
               Proyectos
               INNER JOIN Asignaciones ON Asignaciones.idProyecto = Proyectos.IdProyecto AND Asignaciones.estadoNuevo = 8
               INNER JOIN datosUsuarios ON datosUsuarios.idLogin = Asignaciones.responsableAnterior
            WHERE
              Proyectos.idEstado = 8
              $fecha
            GROUP BY 
              Proyectos.IdProyecto
            ORDER BY Asignaciones.fechaCargue DESC;";

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