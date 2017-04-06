<?php
   include("../../conectar.php"); 

   date_default_timezone_set('America/Bogota');

   $link = Conectar();

   $Nombre = addslashes($_POST['Nombre']);

   $idTabla = 0;
   if ($idTabla > 0)
   {} else
   {
      $idTabla = "NULL"  ;
   }

   $Duplicado = false;
   
   if ($idTabla == "NULL")
   {
      $sql = "SELECT COUNT(*) AS Cantidad FROM confZonas WHERE Nombre = '$Nombre';";
      $result = $link->query($sql);
      $fila =  $result->fetch_array(MYSQLI_ASSOC);
      
      if ($fila['Cantidad'] > 0)
      {
         $Duplicado = true;
      }
   }

   $Resultado = array("Error" => '');

   if ($Duplicado)
   {
      $Resultado['Error'] = "La Zona ya existe, por favor intente crearla con otro nombre";
   } else
   {
      $sql = "INSERT INTO confZonas(Nombre) VALUES 
      (
         '$Nombre'
      ) ON DUPLICATE KEY UPDATE 
         Nombre = VALUES(Nombre);";

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