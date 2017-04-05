<?php

date_default_timezone_set("America/Bogota");

require("class.phpmailer.php");
include_once "../../php/conectar.php"; 
include "../../php/ipal/v2/ipalEEC_TXT_Ipal.php";
include "../../php/ipal/v2/ipalEEC_TXT_IpalUni.php";
include "../../php/ipal/v2/ipalEEC_TXT_IpalTrabajador.php";
	/*$varname = $_FILES['archivo']['name'];
    $vartemp = $_FILES['archivo']['tmp_name'];*/
    
	/*$Asunto = $_POST['Asunto'];
	$Remitente = $_POST['Remitente'];
	$Destinatario = $_POST['Destinatario'];
	$Mensaje = utf8_decode($_POST['Mensaje']);*/

	//$fp = 
	$fecha = date('Y-m-d');
	$nuevafecha = strtotime ( '-2 day' , strtotime ( $fecha ) );
	
	$Desde = date ( 'Y-m-d 00:00:00' , $nuevafecha );
	$Hasta = date ( 'Y-m-d 23:59:59' , $nuevafecha );
	$fecha = date ( 'Y-m-d' , $nuevafecha );

	$Asunto = utf8_decode("Envío de Ipales de $fecha");
	$Remitente = "fenix@wspcolombia.com";
	$Destinatario = "jhonathan.espinosa@wspgroup.com";

	$mail = new PHPMailer();

	$mail->SMTPAuth = true;
	$mail->Username = "fenix@wspcolombia.com";
	$mail->Password = "holamundo"; 
	$mail->Host = "localhost";
	$mail->From = $Remitente;
	$mail->FromName = utf8_decode("Sistema de Información Fenix");
	$mail->Subject = $Asunto;
	$mail->AddAddress($Destinatario);
	
	$Ipal = Ipal($Desde, $Hasta);

	if ($Ipal <> "0")
	{
		$IpalUni = IpalUni($Desde, $Hasta);
		$IpalTrabajador = IpalTrabajador($Desde, $Hasta);

		$mail->AddAttachment($Ipal, str_replace("IpalesEnviados", "", $Ipal));
		$mail->AddAttachment($IpalUni, str_replace("IpalesEnviados", "", $IpalUni));
		$mail->AddAttachment($IpalTrabajador, str_replace("IpalesEnviados", "", $IpalTrabajador));

		$Mensaje = "Buen Día, <br> Se adjuntan los Ipales registrados el día $fecha <br>Por favor cualquier inquietud comunicarla directamente con el <a href='mailto:alejandro.lopez@wspgroup.com'>coordinador</a> del proyecto";
		$Mensaje .= "<br /><br /><span style='font-size:1.5em; color:white;background:black;'><strong>Este mensaje ha sido generado de forma automática, y las respuestas a esta cuenta no serán revisadas.</strong></span>";
	} else
	{
		$Mensaje = "Buen Día <br>Para el día " . $fecha . " no se registraron Ipales";
		$Mensaje .=" <br>Por favor cualquier inquietud comunicarla directamente con el <a href='mailto:alejandro.lopez@wspgroup.com'>coordinador</a> del proyecto";
		$Mensaje .= "<br /><br /><span style='font-size:1.5em; color:white;background:black;'><strong>Este mensaje ha sido generado de forma automática, y las respuestas a esta cuenta no serán revisadas.</strong></span>";
	}
		
		//echo $Ipal;
	
	
	$mail->Body = utf8_decode($Mensaje);
	$mail->IsHTML(true);
	$mail->Send();
	$msg = "Mensaje enviado correctamente";
	//Header ("Location: index.html");*/
?>
