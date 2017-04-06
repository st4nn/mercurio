<?php
  include("../conectar.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $idProyecto = addslashes($_POST['idProyecto']);


   $sql = " SELECT    
              permisos_Tableros.*,
              datosUsuarios.Nombre AS Usuario
            FROM 
              permisos_Tableros
              LEFT JOIN datosUsuarios  ON datosUsuarios.idLogin = permisos_Tableros.idUsuario
            WHERE 
              permisos_Tableros.idProyecto = '$idProyecto'
            ORDER BY permisos_Tableros.fechaCargue ASC;";

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