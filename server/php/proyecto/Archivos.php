<?php
   $idx = 0;
   $contador = 0;
   
   include_once("../conectar.php"); 
   $link = Conectar();

   $sql = array();
   $sql[0] = "";

   $sql2 = array();
   $sql2[0] = "";


   listar_directorios_ruta("../Archivos/Panama/");
   InsertarRegistros();
   //clasificarArchivos();
   
function listar_directorios_ruta($ruta)
{ 
   // abrir un directorio y listarlo recursivo 
   global $idx, $contador, $sql, $sql2, $link;
   if (is_dir($ruta)) 
   { 
      if ($dh = opendir($ruta)) 
      { 
         while (($file = readdir($dh)) !== false) 
         { 
            if ( $file!="." && $file!="..")
            {
               if (is_dir($ruta . $file))
               { 
                  listar_directorios_ruta($ruta .  $file . "/"); 
               }
               else
               {
                  if (strpos($ruta, "comprimidos"))
                  {
                     
                  } else
                  {
                     $sql[$idx] .= "('" . substr($ruta, 19, -1) . "', '" . $file . "', '" . filesize($ruta . $file) . "', '" .  substr($file, -3) . "'), "; 
                     
                     $contador++;
                     if ($contador == 999)
                     {
                        $contador = 0;
                        $idx++;
                        $sql[$idx] = "";
                     }
                  }

               }
            }
         } 
      closedir($dh); 

      } 
   }else 
   {
      echo "<br>No es ruta valida";       
   }
   
} 
function InsertarRegistros()
{
   global $idx, $contador, $sql, $sql2, $link;
   if ($contador > 0 OR $idx > 0)
   {
      $values2 = "";
      foreach ($sql as $key => $value) 
      {
         $strSql = "INSERT INTO Archivos (Ruta, Nombre, peso, extension) VALUES ";
         $strSql .= substr($value, 0, -2);
         $strSql .= " ON DUPLICATE KEY UPDATE 
         peso = VALUES(peso),
         extension = VALUES(extension);";

         
         $result = $link->query(utf8_decode($strSql));
      }
   }
}
function limpiarCaracteresEspeciales($string )
{
 $string = htmlentities($string);
 $string = preg_replace('/\&(.)[^;]*;/', '\\1', $string);
 return $string;
}
?>
