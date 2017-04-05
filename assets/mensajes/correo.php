<?php
require("class.phpmailer.php");

function EnviarCorreo($Destinatario, $Asunto, $Mensaje)
{
	/*$mail = new PHPMailer();
	$mail->IsSMTP();

	$mail->SMTPDebug = 0;

	// Configuración del servidor en modo seguro
	$mail->SMTPAuth = 'True';
	//$mail->SMTPSecure = "ssl";
	$mail->Host = "mail.wspcolombia.com";
	$mail->Port = 26;

	// Datos de autenticación
	$mail->Username = "horus@wspcolombia.com";
	$mail->Password = "******";

	$mail->From = "horus@wspcolombia.com";
	$mail->FromName = utf8_decode("Sistema de Información Horus");

	$mail->Subject = utf8_decode($Asunto);
	$mail->ContentType = 'html';
	$mail->IsHTML(true);
	
	$mail->AddEmbeddedImage('../../../img/logo.png', 'logo', 'logo.png', 'base64', 'image/png');
	$mail->AddEmbeddedImage('../../../img/WSP.png', 'logoWSP', 'logoWSP.png', 'base64', 'image/png');

	$mensaje = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
		$mensaje .= '<html xmlns="http://www.w3.org/1999/xhtml">';
		$mensaje .= '<head>';
    		$mensaje .= '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />';
    		$mensaje .= '<title>Horus</title>';
    		$mensaje .= '<style type="text/css">';
        		$mensaje .= 'body{width:100% !important; color: #636363; margin:0; font-family: "Shanti", sans-serif;}';
        		$mensaje .= 'body{-webkit-text-size-adjust:none;}';
        		$mensaje .= 'body{margin:0; padding:0;}';
        		$mensaje .= 'img{border:0; height:auto; line-height:100%; outline:none; text-decoration:none;}';
        		$mensaje .= 'table td{border-collapse:collapse;}';
        		$mensaje .= "<link href='http://fonts.googleapis.com/css?family=Shanti' rel='stylesheet' type='text/css'>";
        		
            $mensaje .= '</style>';
		$mensaje .= '</head>';
		$mensaje .= '<body>';
			$mensaje .= '<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#176faa; height:80px;">';
			    $mensaje .= '<tr>';
			        $mensaje .= '<td align="center">';
			            $mensaje .= '<center>';
			                $mensaje .= '<table border="0" cellpadding="0" cellspacing="0" width="600px" style="height:100%;">';
			                    $mensaje .= '<tr>';
			                        $mensaje .= '<td align="left" valign="middle" style="padding-left:20px;">';
			                                $mensaje .= utf8_decode('<h1 style="color:white; font-family:Shanti,sans-serif"><br>Sistema de Información Horus<br></h1>');
			                        $mensaje .= '</td>';
			                        $mensaje .= '<td align="right" valign="middle" style="padding-right:20px;">';
			                            $mensaje .= '<table border="0" cellpadding="0" cellspacing="0" width="130px" style="height:100%;">';
			                                $mensaje .= '<tr>';
			                                    $mensaje .= '<td>';
			                                    $mensaje .= '</td>';
			                                    $mensaje .= '<td>';
			                                        $mensaje .= '<a href="http://Horus.wspcolombia.com">';
			                                            $mensaje .= '<img src="cid:logo.png"  width="60" height="60" />';
			                                        $mensaje .= '</a>';
			                                    $mensaje .= '</td>';
			                                $mensaje .= '</tr>';
			                            $mensaje .= '</table>';
			                        $mensaje .= '</td>';
			                    $mensaje .= '</tr>';
			                $mensaje .= '</table>';
			            $mensaje .= '</center>';
			        $mensaje .= '</td>';
			    $mensaje .= '</tr>';
			$mensaje .= '</table>';
			$mensaje .= '<br>';
		$mensaje .= utf8_decode($Mensaje);
		$mensaje .= "<br><br><br><img src='cid:logoWSP.png' width='275' height='41' border='0' boder='0' />";
		$mensaje .= '</body>';
		$mensaje .= '</html>';

	$mail->Body = $mensaje;


	// Destinatario del mensaje
	$Destinatario = explode(", ", $Destinatario);
	foreach ($Destinatario as $key => $value) 
	{
		if (trim($value) <> "")
		{
			$mail->AddAddress ($value);
		}
	}
	$mail->AddReplyTo("jhonathan.espinosa@wspgroup.com");
	$mail->AddBCC("horus@wspcolombia.com");

	// Envío del mensaje
	if(!$mail->Send()){
	    $error_message = "Error en el envío: " . $mail->ErrorInfo;
	}else{
	    $error_message = 1;
	}
	return $error_message; */
	return 1;
}	
?>