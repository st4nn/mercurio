<?php
    date_default_timezone_set('America/Bogota');

    include("../conectar.php");
    include("../phpExcel/excel_reader2.php"); 
    include("../../../assets/mensajes/enviarCorreo.php");  
    
    $link=Conectar();

    $archivo = $_POST['archivo'];

    //$archivo = "../../archivos/Obras/BASE DE DATOS 2015.xls";
    //$idObra = 1;

    /********************************************************/

    $data = new Spreadsheet_Excel_Reader($archivo, false, "ISO-8859-1");

$bandera = 0;
$contadorDeBlancos = 0;
$fValidadorHoja = false;
$obras = "";
$arrobras = array();
$idx = 0;

$sql = "SELECT * FROM delegaciones";
$result = $link->query(($sql));
$Delegaciones = array();
while ($row = mysqli_fetch_assoc($result))
      {
         $Resultado[$idx] = array();
         $Delegaciones[utf8_encode($row['Nombre'])] = $row['idDelegacion'];
      }

foreach($data->sheets as $numeroHoja => $hoja)
{
    $datosHoja = $data->boundsheets[$numeroHoja];

   $numCols = $hoja['numCols'];
   $numRows = $hoja['numRows'];
   
   if ($datosHoja['name'] == "")
    {
        break 1;
    }else
    {
        if (strtolower($datosHoja['name']) <> "")
        {
            for ($j=2; $j < $numRows; $j++) 
            {
                if (strtolower($hoja['cells'][$j-1][1]) == utf8_decode("delegaciÓn") OR $fValidadorHoja)
                {
                    $fValidadorHoja = true;
                    if (strtolower($hoja['cells'][$j][1]) <> utf8_decode("delegaciÓn"))
                    {
                        if ($hoja['cells'][$j][1] <> "")
                        {
                            if (!isset($Delegaciones[trim($hoja['cells'][$j][1])]))
                            {
                                $sql = "INSERT INTO delegaciones (Nombre) VALUES ('" . trim($hoja['cells'][$j][1]) . "');";
                                $link->query(($sql));
                                $nuevoId = $link->insert_id;
                                $Delegaciones[trim($hoja['cells'][$j][1])] = $nuevoId;
                                //echo "Enviar correo de Creación de Delgación " . trim($hoja['cells'][$j][1]) . "<br>";
                            }

                            $contadorDeBlancos = 0;
                            $obras .= "(NULL, '" . $hoja['cells'][$j][8] . "', " .
                                "'" . $hoja['cells'][$j][9] . "', " .
                                "'" . $hoja['cells'][$j][4] . "', " .
                                "'" . $Delegaciones[trim($hoja['cells'][$j][1])] . "', " .
                                "'" . $hoja['cells'][$j][10] . "'), ";
                            $arrobras[$j] = array();
                            $arrobras[$j]['codigoObra'] = $hoja['cells'][$j][8];
                            $arrobras[$j]['Nombre'] = $hoja['cells'][$j][9];
                            $arrobras[$j]['tipoObra'] = $hoja['cells'][$j][4];
                            $arrobras[$j]['Delegacion'] = $hoja['cells'][$j][1];
                            $arrobras[$j]['mesInfo'] = $hoja['cells'][$j][10];
                        } else
                        {
                            $contadorDeBlancos++;
                        }
                    }
                }
                else
                {
                    $contadorDeBlancos++;
                }
                if ($contadorDeBlancos > 300)
                {
                    break 1;
                }
            }
            $obras = substr($obras, 0, -2);            
        }
    }
   
   
}
if ($obras <> "")
{
    $sql = "INSERT INTO obras (idObra, codigoObra, Nombre, tipoObra, idDelegacion, mesInfo) VALUES " . $obras . " ON DUPLICATE KEY UPDATE Nombre = Nombre;";
    $result = $link->query($sql);

    $numCreadas = $link->affected_rows;
    
    $sql = "INSERT INTO obras (idObra, codigoObra, Nombre, tipoObra, idDelegacion, mesInfo) VALUES " . $obras . " 
                ON DUPLICATE KEY UPDATE 
                    codigoObra = VALUES(codigoObra),
                    Nombre = VALUES(Nombre),
                    tipoObra = VALUES(tipoObra),
                    idDelegacion = VALUES(idDelegacion),
                    mesInfo = VALUES(mesInfo);";

    $result = $link->query($sql);
    $numActualizadas = $link->affected_rows;

    $Respuesta = array();

    $Respuesta['Creadas'] = $numCreadas;
    $Respuesta['Actualizadas'] = $numActualizadas;
    $Respuesta['Identificadas'] = count($arrobras);

    echo json_encode($Respuesta);

	
} else
{
    echo 0;
}
?>
