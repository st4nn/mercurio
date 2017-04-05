<?php

$Carpeta = $_GET['Ruta'];
$targetDir = "../../archivos/" . $Carpeta;

// Create target dir
if (!file_exists($targetDir)) {
	@mkdir($targetDir);
}
$status = "___";
if ($_FILES["archivo"]['name'] <> "") 
{
	$fileName =	$_FILES["archivo"]['name'];
	$filePath = $fileName;
	$idx = 2;
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
				$filePath .= "" . $tmpfilePath[$key];
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
}
	echo $status;
?>