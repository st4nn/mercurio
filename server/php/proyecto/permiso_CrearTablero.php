<?php
   include("../conectar.php"); 

   date_default_timezone_set('America/Bogota');

   $link = Conectar();

   $idProyecto = addslashes($_POST['idProyecto']);
   $Usuario = addslashes($_POST['Usuario']);
   $Nombre = addslashes($_POST['Nombre']);
   $Ans = addslashes($_POST['Ans']);

   $idTabla = 0;
   if ($idTabla > 0)
   {} else
   {
      $idTabla = "NULL"  ;
   }

   $Duplicado = false;
   
   $Resultado = array("Error" => '');

   if ($Duplicado)
   {
      $Resultado['Error'] = "La Zona ya existe, por favor intente crearla con otro nombre";
   } else
   {
      $sql = "INSERT INTO permisos_Tableros(idProyecto, Nombre, idAns, idUsuario) VALUES 
      (
         '$idProyecto',
         '$Nombre',
         '$Ans',
         '$Usuario'
      ) ON DUPLICATE KEY UPDATE 
         Nombre = VALUES(Nombre),
         idAns = VALUES(idAns),
         idUsuario = VALUES(idUsuario),
         fechaCargue = '" . date('Y-m-d H:i:s'). "';";

      $link->query(utf8_decode($sql));
      $Resultado['id'] = 0;

      if ( $link->affected_rows > 0)
      {
         $nuevoId = $link->insert_id;
         $Resultado['id'] = $nuevoId;

      } else
      {
         $Resultado['Error'] = $link->error;
      }
   }

      echo json_encode($Resultado);
?>