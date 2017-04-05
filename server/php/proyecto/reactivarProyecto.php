<?php

   require_once("../conectar.php");
   require_once("funTrasladar.php");

   $idProyecto = addslashes($_POST['idProyecto']);
   $Usuario = addslashes($_POST['Usuario']);

   date_default_timezone_set('America/Bogota');
   $fecha = date('Y-m-d H:i:s');

   $link = Conectar();

   $sql = "SELECT * FROM Asignaciones WHERE idProyecto = '$idProyecto' ORDER BY fechaCargue DESC LIMIT 0 , 1;";
   $result = $link->query($sql);
   $fila =  $result->fetch_array(MYSQLI_ASSOC);

   $idEstadoNuevo = $fila['estadoAnterior'];
   $idUsuarioNuevo = $fila['responsableAnterior'];

   if ($link->error == "")
   {
	   echo json_encode(trasladarProyecto($idProyecto, $idEstadoNuevo, $idUsuarioNuevo, $Usuario));
   } else
   {
   	echo $link->error;
   }


?>