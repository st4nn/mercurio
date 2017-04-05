<?php

	$Carpeta = $_GET['Ruta'];

	$targetDir = "Archivos/" . $Carpeta;

	// Create target dir
	if (!file_exists($targetDir)) 
	{
		$arrTargetDir = explode("/", $targetDir);
		$tmpTargetDir = "";
		foreach ($arrTargetDir as $key => $value) 
		{
			if ($tmpTargetDir <> "")
			{
				$tmpTargetDir .= "/";
			}
			$tmpTargetDir .= $value;
			
			if (!file_exists($tmpTargetDir))
			{
				@mkdir($tmpTargetDir);
			}
		}
	} 

	$status = "___";

	$archivosProhibidos = array("php", ".sh", "run", "exe", ".js", "tml");

	if ($_FILES["archivo"]['name'] <> "") 
	{
		$fileName =	$_FILES["archivo"]['name'];

		$prohibido = false;
		$extension = substr($fileName, -3);
		foreach ($archivosProhibidos as $key => $value) 
		{
			if ($value == $extension)
			{
				$prohibido = true;
			}
		}
		if ($prohibido == false)
		{
			$filePath = $fileName;
			$idx = 1;
			while (file_exists($targetDir . DIRECTORY_SEPARATOR . $filePath))
			{
				$tmpfilePath = explode(".", $fileName);
				$obj = count($tmpfilePath) - 1;
				$filePath = "";
				foreach ($tmpfilePath as $key => $value) 
				{
					
					if ($key == $obj)
					{
						$filePath .= "_$idx." . $tmpfilePath[$key];
					} else
					{
						$filePath .= "_" . $tmpfilePath[$key];
					}
				}
				$idx++;
			}
			$filePath = $targetDir . DIRECTORY_SEPARATOR . $filePath;
			if ($fileName != "") 
			{
		        if (copy($_FILES['archivo']['tmp_name'],$filePath)) 
		        {
		            $status = "$filePath";
		        } 
		    } 
		} else
		{
			$status = "El archivo que intenta subir al servidor no es seguro";
		}
	}
	echo $status;

?>