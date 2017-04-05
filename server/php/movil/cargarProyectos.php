<?php
  include("../conectar.php"); 
  //include("datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = $_POST['Usuario'];
   $fecha = $_POST['fecha'];
   
   $sql = "SELECT    
                *
            FROM 
               Proyectos
            WHERE
              Responsable = '$idUsuario'
              AND fechaCargue > '$fecha'
              AND idEstado < 3
            ORDER BY Proyectos.id DESC;";

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