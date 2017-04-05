<?php
    date_default_timezone_set('America/Bogota');

    include("../conectar.php");
    include("../phpExcel/excel_reader2.php"); 
    
    $link=Conectar();

    $archivo = $_POST['archivo'];
    $idObra = $_POST['idObra'];
    //$archivo = "../../archivos/Postes/6_Cuadro de Presupuesto Membrillal 1 y 5.xls";
    //$idObra = 19;

    /********************************************************/

    $data = new Spreadsheet_Excel_Reader($archivo, true, "ISO-8859-1");

$bandera = 0;
$banderaItem = 0;
$postes = "";
$manoObra = "";
$material = "";
$arrPostes = array();
$idx = 0;


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
        if (strtolower($datosHoja['name']) == "mano de obra")
        {
            //echo $hoja['cells'][fila][columna];

            for ($j=1; $j < $numRows; $j++) 
            {
                if ($banderaItem == 1)
                {
                    if (isset($hoja['cells'][$j][4]))
                    {
                        for ($i=7; $i < $numCols; $i++)
                        {
                            if ($hoja['cells'][$j][$i] <> "")
                            {
                                $valor = $hoja['cells'][$j][4];
                                $valor = str_replace("* ", "", $valor);
                                $valor = str_replace(",", "", $valor);

                                $manoObra .= "(" . $idObra . ", '" . $hoja['cells'][9][$i] . "', " .
                                "'" . $hoja['cells'][$j][2] . "', " .
                                "" . $valor . ", " .
                                "" . $hoja['cells'][$j][$i] . "), ";
                            }
                        }
                    }
                } else
                {
                    if (strtolower($hoja['cells'][$j][1]) == "item")
                    {
                        for ($i=1; $i < $numCols; $i++) 
                        { 
                            if ($hoja['cells'][$j][$i] == "")
                            {
                                break 1;
                            } else
                            {
                                if ($bandera == 1)
                                {
                                    $postes .= "(" . $idObra . ", '" . $hoja['cells'][$j][$i] . "'), ";
                                    $arrPostes[$idx] = $hoja['cells'][$j][$i];
                                    $idx++;
                                }
                                if ($hoja['cells'][$j][$i] == "CANTIDAD TOTAL")
                                {
                                    $bandera = 1;
                                }
                            }
                        }
                        $postes = substr($postes, 0, -2);
                    }
                }
            }
            $manoObra = substr($manoObra, 0, -2);
            $banderaItem = 0;
            
        }

        if (strtolower($datosHoja['name']) == "resumen mat")
        {
            //echo $hoja['cells'][fila][columna];
            
            for ($j=10; $j < $numRows; $j++) 
            {
                    if (isset($hoja['cells'][$j][6]))
                    {
                        for ($i=11; $i < $numCols; $i++)
                        {
                            if ($hoja['cells'][$j][$i] <> "")
                            {
                                $valor = $hoja['cells'][$j][6];
                                $valor = str_replace("* ", "", $valor);
                                $valor = str_replace(",", "", $valor);

                                $material .= "($idObra, '" . $hoja['cells'][9][$i] . "', " .
                                "'" . $hoja['cells'][$j][2] . "', " .
                                "'" . $hoja['cells'][$j][5] . "', " .
                                "" . $valor . ", " .
                                "" . $hoja['cells'][$j][$i] . "), ";
                            }
                        }
                    }
            }
            $material = substr($material, 0, -2);
            $banderaItem = 0;
        }
    }
}
if ($postes <> "")
{
    $sql = "INSERT INTO postes (idObra, Codigo) VALUES " . $postes . " ON DUPLICATE KEY UPDATE Codigo = VALUES(Codigo);";
    $result = $link->query($sql);
    $sql = "INSERT INTO presupuesto (idObra, codigoPoste, codigoMaterial, valorUnitario, cantidad) VALUES  " . $manoObra . " ON DUPLICATE KEY UPDATE valorUnitario = VALUES(valorUnitario), cantidad = values(cantidad);";
    $result = $link->query($sql);
    $sql = "INSERT INTO presupuesto (idObra, codigoPoste, codigoMaterial, aportacionMaterial, valorUnitario, cantidad) VALUES  " . $material . " ON DUPLICATE KEY UPDATE valorUnitario = VALUES(valorUnitario), cantidad = values(cantidad);";
    $result = $link->query($sql);
    echo 1;//json_encode($arrPostes);
    //echo $sql;
} else
{
    echo 0;
}
?>
