<?php
  include("../conectar.php"); 
  include("datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $idProyecto = addslashes($_POST['idProyecto']);
   $Usuario = datosUsuario($idUsuario);

   $Perfil = "";

   if ($Usuario['idPerfil'] <> 1)
   {
      $Perfil = " AND confEmpresas.id = '" . $Usuario['idEmpresa'] . "' ";
   }

   $sql = " SELECT    
              estadoAnterior.Nombre AS EstadoAnterior,
              estadoNuevo.Nombre AS EstadoNuevo,
              datosAnterior.Nombre AS UsuarioAnterior,
              datosNuevo.Nombre AS UsuarioNuevo,
              Asignaciones.fechaCargue
            FROM 
              Asignaciones
              LEFT JOIN datosUsuarios AS datosAnterior ON datosAnterior.idLogin = Asignaciones.responsableAnterior
              LEFT JOIN datosUsuarios AS datosNuevo ON datosNuevo.idLogin = Asignaciones.responsableNuevo
              LEFT JOIN confEstados AS estadoAnterior ON estadoAnterior.id = Asignaciones.estadoAnterior
              LEFT JOIN confEstados AS estadoNuevo ON estadoNuevo.id = Asignaciones.estadoNuevo
            WHERE 
              Asignaciones.idProyecto = '$idProyecto' $Perfil
            ORDER BY Asignaciones.fechaCargue ASC;";

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