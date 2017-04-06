<?php
  include("../conectar.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $idProyecto = addslashes($_POST['idProyecto']);


   $sql = " SELECT    
              permisos_Tareas.*,
              datosUsuarios.Nombre AS Usuario,
              datosCierre.Nombre AS UsuarioCumplimiento,
              datosResponsable.Nombre AS UsuarioResponsable
            FROM 
              permisos_Tareas
              LEFT JOIN datosUsuarios  ON datosUsuarios.idLogin = permisos_Tareas.idUsuario
              LEFT JOIN datosUsuarios AS datosCierre  ON datosCierre.idLogin = permisos_Tareas.idUsuarioCumplimiento
              LEFT JOIN datosUsuarios AS datosResponsable  ON datosResponsable.idLogin = permisos_Tareas.idUsuarioResponsable
            WHERE 
              permisos_Tareas.idProyecto = '$idProyecto';";

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
         mysqli_free_result($result);  
         echo json_encode($Resultado);
   } else
   {
      echo 0;
   }
?>