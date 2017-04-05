<?php
  include("../conectar.php"); 
  include("datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = $_POST['Usuario'];
   $Usuario = datosUsuario($idUsuario);

   $empresa = "";

   if ($Usuario['idPerfil'] <> 1)
   {
      $empresa = " AND Login.idEmpresa = '" . $Usuario['idEmpresa'] . "'";
   }

   $sql = "SELECT    
                datosUsuarios.idLogin AS id,
                CONCAT(datosUsuarios.Nombre, ' (', datosUsuarios.Cargo, ')') AS Nombre
            FROM 
               datosUsuarios
               INNER JOIN Login ON datosUsuarios.idLogin = Login.idLogin
            WHERE Login.Estado = 'Activo'
            AND datosUsuarios.idPerfil >= '" . $Usuario['idPerfil'] . "' " . $empresa . ";";

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