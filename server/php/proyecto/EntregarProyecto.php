<?php

   require_once("../conectar.php");
   require_once("funTrasladar.php");

   $idProyecto = addslashes($_POST['idProyecto']);
   $idUsuarioNuevo = addslashes($_POST['idUsuarioNuevo']);
   $idEstadoNuevo = addslashes($_POST['idEstadoNuevo']);
   $Usuario = addslashes($_POST['Usuario']);
   $Cantidad = addslashes($_POST['Cantidad']);

   date_default_timezone_set('America/Bogota');
   $fecha = date('Y-m-d H:i:s');

   $link = Conectar();

   $sql = "UPDATE Proyectos SET fechaEntrega = '$fecha', cantidadEntregada = '$Cantidad' WHERE IdProyecto = '$idProyecto';";
   $link->query(utf8_decode($sql));

   if ($link->error == "")
   {
	   echo json_encode(trasladarProyecto($idProyecto, $idEstadoNuevo, $idUsuarioNuevo, $Usuario));
   } else
   {
   	echo $link->error;
   }


?>