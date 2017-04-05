<?php 
function Conectar() 
{ 

   $link = new mysqli("localhost", "root", "", "wspcolom_mercurio");
   if ($link->connect_errno) 
   {
      echo "Error: (" . $link->connect_errno . ") " . $link->connect_error;
      exit(); 
   }

   return $link; 
} 

?>
