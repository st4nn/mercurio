<?php
   include("../conectar.php"); 
   include("../../../assets/mensajes/correo.php");  
   $link = Conectar();

   $datos = json_decode($_POST['datos']);

   $nombre = $datos->nombre;
   $correo = $datos->correo;
   $cargo = $datos->cargo;
   $perfil = $datos->perfil;
   $usuario = $datos->usuario;
   $clave = $datos->clave;
   $clave2 = $datos->clave2;
   $empresa = $datos->empresa;
   
   $pClave = $datos->clave;

/*
   if (stripos($correo, "@wspgroup.com") == 0)
   {
      $correo = $correo . "@wspgroup.com";
   }
*/
   $correo = strtolower($correo);
   
 
   $sql = "SELECT COUNT(*) AS 'Cantidad' FROM Login WHERE Usuario = '$usuario';";
   $result = $link->query($sql);

   $fila =  $result->fetch_array(MYSQLI_ASSOC);

   if ($fila['Cantidad'] > 0)
   {
      echo "El Usuario ya existe, por favor selecciona otro.";
   } else
   {
      $sql = "SELECT COUNT(*) AS 'Cantidad' FROM datosUsuarios WHERE Correo = '$correo';";
      $result = $link->query($sql);

      $fila =  $result->fetch_array(MYSQLI_ASSOC);

      if ($fila['Cantidad'] > 0)
      {
         echo "El Correo ya tiene un usuario asignado, por favor selecciona otro.";
      } else
      {
         if ($clave <> $clave2)
         {
            echo "Las claves no coinciden.";
         } else
         {
            $sql = "INSERT INTO Login 
                        (Usuario, Clave, Estado, idEmpresa) 
                     VALUES 
                        (
                           '$usuario', 
                           '" . md5(md5(md5($clave))) . "', 
                           'Activo',
                           '1');";

            $link->query(utf8_decode($sql));
               if ( $link->affected_rows > 0)
               {
                  $nuevoId = $link->insert_id;
                  if ($nuevoId > 0)
                  {
                     
                     $sql = "INSERT INTO datosUsuarios (idLogin, Nombre, Cargo, Correo, idPerfil) 
                              VALUES 
                              (
                                 '$nuevoId', 
                                 '$nombre', 
                                 '$cargo', 
                                 '$correo',
                                 '$perfil');";
                        
                        $link->query(utf8_decode($sql));

                        echo 1;

                        //echo $link->error . " " .$link->affected_rows;   
                        

                        $mensaje = "Buen Día, $nombre
                        <br>Se ha creado un usuario de acceso para el sistema Horus,
                        <br><br>
                        Los datos de autenticación son:
                        <br><br>
                        <br>Url de Acceso: http://horus.wspcolombia.com
                        <br>Usuario: $usuario
                        <br>Clave: $pClave";

                        $obj = EnviarCorreo($correo, "Creación de Usuario " . $nombre, $mensaje) ;
                        //echo 1;
                  } else
                  {
                     echo "Hubo un error desconocido " . $link->error;
                  }
               } else
               {
                  echo "Hubo un error desconocido" . $link->error;
               }
         }
      }
   }

?>