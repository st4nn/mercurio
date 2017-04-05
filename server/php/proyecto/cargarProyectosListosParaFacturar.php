<?php
  include("../conectar.php"); 
   $link = Conectar();

   $sql = "SELECT    
                Proyectos.IdProyecto AS idProyecto,
                Proyectos.idZona,
                Proyectos.Codigo,
                Proyectos.Nombre,
                Proyectos.Descripcion AS DescProyecto,
                Proyectos.fechaPrevEntrega,
                Proyectos.fechaEntrega,
                Proyectos.cantidadEntregada,
                confUnitarios.*
            FROM 
               Proyectos
               LEFT JOIN confUnitarios ON confUnitarios.Item = Proyectos.Item AND confUnitarios.idEmpresa = Proyectos.idEmpresa
            WHERE
              Proyectos.idEstado = '6';";

   $result = $link->query($sql);

   $idx = 0;
   if ( $result->num_rows > 0)
   {
      $Resultado = array();
      while ($row = mysqli_fetch_assoc($result))
      {
         $Resultado[$idx] = array();
         foreach ($row as $key => $value) 
         {
            $Resultado[$idx][$key] = utf8_encode($value);
         }
         $idx++;
      }

      $sql = "SELECT 
                confUnitarios.Item,
                confUnitarios.Descripcion,
                confUnitarios.Unidad,
                confUnitarios.Valor2015,
                SUM(Proyectos.cantidadEntregada) AS Cantidad,
                confUnitarios.Valor2015 * SUM(Proyectos.cantidadEntregada) AS ValorTotal
              FROM Proyectos
                LEFT JOIN confUnitarios ON confUnitarios.Item = Proyectos.Item AND confUnitarios.idEmpresa = Proyectos.idEmpresa
              WHERE
                Proyectos.idEstado = '6'
              GROUP BY
                confUnitarios.Item;";

        $result = $link->query($sql);

        $Resultado['Agrupados'] = array();
        $idx = 0;
       while ($row = mysqli_fetch_assoc($result))
        {
          $Resultado['Agrupados'][$idx] = array();
           foreach ($row as $key => $value) 
           {
              $Resultado['Agrupados'][$idx][$key] = utf8_encode($value);
           }
           $idx++;
        }

         mysqli_free_result($result);  
         echo json_encode($Resultado);
   } else
   {
      echo 0;
   }
?>