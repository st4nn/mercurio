<?php
    date_default_timezone_set('America/Bogota');

    include("../conectar.php");
    
    
    $link=Conectar();

    $archivo = addslashes($_POST['archivo']);
    $extension = addslashes($_POST['extension']);
    $Usuario = addslashes($_POST['Usuario']);
    $idObra = addslashes($_POST['idObra']);
    $Elemento = addslashes($_POST['Elemento']);
    $Coordenadas = addslashes($_POST['Coordenadas']);
    $idObj = addslashes($_POST['idObj']);

    $sql = "INSERT INTO 
                obras_Auditoria_Soportes 
                (idObra, idUsuario, codigo, nomArchivo, extension, coordenadas, idObjeto) 
            VALUES 
                (
                    '" . $idObra . "',
                    '" . $Usuario . "',
                    '" . $Elemento . "',
                    '" . $archivo . "',
                    '" . $extension . "',
                    '" . $Coordenadas . "',
                    '" . $idObj . "'
                ) ON DUPLICATE KEY UPDATE 
                    idObra = VALUES(idObra),
                    idUsuario = VALUES(idUsuario),
                    codigo = VALUES(codigo),
                    nomArchivo = VALUES(nomArchivo),
                    idObjeto = VALUES(idObjeto),
                    coordenadas = VALUES(coordenadas),
                    extension = VALUES(extension);";

    $result = $link->query($sql);

    if ($link->insert_id > 0)
    {
        echo $link->insert_id;
    } else
    {
        echo 0;
    }
?>
