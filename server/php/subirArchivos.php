<?php

	date_default_timezone_set("America/Bogota");
	include("conectar.php"); 

	$link = Conectar();

	$Prefijo = addslashes($_POST['Prefijo']);
	$Proceso = addslashes($_POST['Proceso']);
	$Observaciones = addslashes($_POST['Observaciones']);
	$Usuario = addslashes($_POST['Usuario']);

	$targetDir = 'Archivos/' . $Prefijo;

	$arrRuta = explode("/", $targetDir);

	$tmpRuta = "";
	foreach ($arrRuta as $key => $value) 
	{
		$tmpRuta .= $value . "/";
		if (!file_exists($tmpRuta))
		{
			mkdir($tmpRuta);
		}
	}

	if (isset($_REQUEST["name"])) 
	{
		$fileName = $_REQUEST["name"];
	} elseif (!empty($_FILES)) {
		$fileName = $_FILES[0]["name"];
	} else {
		$fileName = uniqid("file_");
	}

	if (!file_exists($targetDir . "/" . $fileName))
	{
		if (move_uploaded_file($_FILES[0]["tmp_name"],  $targetDir . "/" . $fileName))
	  	{
	  		$sql = "INSERT INTO Archivos(idlogin, Prefijo, Ruta, Nombre, Observaciones, Proceso) VALUES (
	  					'" . $Usuario . "',
	  					'" . $Prefijo . "',
	  					'" . str_replace("../../../", "", $targetDir) . "',
	  					'" . $fileName . "',
	  					'" . $Observaciones . "',
	  					'" . $Proceso . "');";
	  					
	  		$link->query(utf8_decode($sql));
	  		$nuevoId = $link->insert_id;

	  		echo $nuevoId;
	  	} else
	  	{
	  		echo 0;
	  	}
	} else
	{
		echo 1;
	}

?>
