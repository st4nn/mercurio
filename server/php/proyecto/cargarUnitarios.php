<?php
  include("../conectar.php"); 
  include("datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = $_POST['Usuario'];
   $Usuario = datosUsuario($idUsuario);

   $Perfil = "";
   $Nombre = "";

   if ($Usuario['idPerfil'] <> 1)
   {
      $Perfil = " WHERE confUnitarios.idEmpresa = '" . $Usuario['idEmpresa'] . "'";
      $Nombre = " CONCAT('(', confUnitarios.Item, ') ', confUnitarios.Descripcion) AS Nombre ";
   } else
   {
      $Nombre = " CONCAT('(', confEmpresas.Nombre, ') ', ' (', confUnitarios.Item, ') ', confUnitarios.Descripcion) AS Nombre ";
   }

   $sql = "SELECT    
                confUnitarios.id AS id,
                $Nombre
            FROM 
               confUnitarios 
               INNER JOIN confEmpresas ON confEmpresas.id = confUnitarios.idEmpresa $Perfil ORDER BY id;";


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