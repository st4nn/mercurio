<?php

   require_once("../conectar.php");
   require_once("funTrasladar.php");

   $idProyecto = addslashes($_POST['idProyecto']);
   $idUsuarioNuevo = addslashes($_POST['idUsuarioNuevo']);
   $idEstadoNuevo = addslashes($_POST['idEstadoNuevo']);
   $Usuario = addslashes($_POST['Usuario']);

   echo json_encode(trasladarProyecto($idProyecto, $idEstadoNuevo, $idUsuarioNuevo, $Usuario));

   /*$arrUsuario = datosUsuario($idUsuarioNuevo);

   echo $arrUsuario['Nombre'];*/
?>