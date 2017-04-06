<?php
  include("../conectar.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $Prefijo = addslashes($_POST['Prefijo']);


   $sql = " SELECT    
              Archivos.*,
              datosUsuarios.Nombre AS Usuario
            FROM 
              Archivos
              LEFT JOIN datosUsuarios  ON datosUsuarios.idLogin = Archivos.idLogin
            WHERE 
              Archivos.Prefijo = '$Prefijo'
            ORDER BY Archivos.fechaCargue ASC;";

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