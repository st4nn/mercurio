<?php
   function datosUsuario($idUsuario)
   {
      $link = Conectar();
    
      $sql = "SELECT 
               Login.idLogin AS 'idLogin',
               Login.Usuario AS 'Usuario',
               Login.Estado AS 'Estado',
               Datos.Nombre AS 'Nombre',
               Datos.Correo AS 'Correo',
               Datos.Cargo AS 'Cargo',
               Empresa.id AS 'idEmpresa',
               Empresa.Nombre AS 'Empresa',
               Datos.idPerfil AS 'idPerfil'
            FROM 
               Login AS Login
               INNER JOIN datosUsuarios AS Datos ON Datos.idLogin = Login.idLogin
               INNER JOIN confEmpresas AS Empresa ON Login.idEmpresa = Empresa.id
            WHERE 
               Login.idLogin = $idUsuario";
      
      $result = $link->query($sql);

      if ( $result->num_rows > 0)
      {
         $Resultado = array();
         while ($row = mysqli_fetch_assoc($result))
         {
            foreach ($row as $key => $value) 
            {
               $Resultado[$key] = utf8_encode($value);
            }
         }
         
         mysqli_free_result($result);  
         return $Resultado;
      } else
      {
         return 0;
      }
   }
?>