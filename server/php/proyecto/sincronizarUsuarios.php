<?
  include("../conectar.php"); 
  $link = Conectar();

  $sql = "SELECT 
            Login.idLogin AS 'id', 
            Login.Usuario AS 'username', 
            Login.Clave AS 'password', 
            datosUsuarios.Nombre AS 'nombre', 
            datosUsuarios.Correo AS 'email', 
            'WSP PB' AS 'empresa' 
          FROM Login 
            INNER JOIN datosUsuarios ON datosUsuarios.idLogin = Login.idLogin
          WHERE  Login.Estado = 'Activo';";

  $result = $link->query($sql);

  class User
      {
         public $id;
         public $username;
         public $password;
         public $nombre;
         public $email;
         public $empresa;
      }

      $idx = 0;
         while ($row = mysqli_fetch_assoc($result))
         {
             $Users[$idx] = new User();
             $Users[$idx]->id = utf8_encode($row['id']);
             $Users[$idx]->username = utf8_encode($row['username']);
             $Users[$idx]->password = utf8_encode($row['password']);
             $Users[$idx]->nombre = utf8_encode($row['nombre']);
             $Users[$idx]->email = utf8_encode($row['email']);
             $Users[$idx]->empresa = utf8_encode($row['empresa']);
            $idx++;
         }

        mysqli_free_result($result);  
        echo json_encode($Users);
?>