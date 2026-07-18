<?php
	include 'connection bd.php';
	
	$email = trim($_POST['email']);
	$password = trim($_POST['password_user']);
	$repeatPassword = trim($_POST['repeatPassword']);
	$address_site = $_SERVER['HTTP_HOST'];
	$date_creation = date("Y-m-d H:i:s");

	function checkRepeatEmail() {
		global $conn, $email;

		$query = "SELECT * FROM users WHERE email = '$email'";
		$response = mysqli_query($conn, $query);
		$num_rows = mysqli_num_rows($response);
		mysqli_free_result($response);
		// echo "Количество совпадений ".$num_rows."\n";
		return $num_rows;
	}

	function generationRandomString($numSymbol) {
		$strSymbol = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
		$generatedStr = "";

			for ($i = 0; $i < $numSymbol; $i++) {
				$generatedStr .= $strSymbol[mt_rand(0, ( strlen($strSymbol) - 1) )];
			}

		return $generatedStr;
	}

	function changePassword() {
		global $conn, $email, $password, $repeatPassword;
		$answerServer = [];

		if (checkRepeatEmail() && $password === $repeatPassword) {
			$request = "UPDATE users SET password='$password' WHERE email='$email'";
			
			if ( mysqli_query($conn, $request) ) {
				$status = "success";
				$message = "Пароль успішно змінено";
			} else {
				$status = "error";
				$message = "Під час зміни пароля виникла помилка спробуйте пізніше";
			}
		} else {
			$status = "not found";
			$message = "Користувача із зазначеним Email-ом не знайдено.<br><br>Будь ласка, вкажіть правильний Email або пройдіть реєстрацію.";
		}

		$answerServer['status'] = $status;
		$answerServer['action'] = $_POST['action'];
		$answerServer['bodyAnswer'] = $message;
		echo json_encode($answerServer);
		mysqli_close($conn);
	}

	function registrationUser() {
		global $conn, $email, $password, $repeatPassword, $date_creation, $address_site;
		$answerServer = [];

		if ( !empty($email) && !empty($password) && !empty($repeatPassword) && $password === $repeatPassword && !checkRepeatEmail($email) ) {

			//generate an activation key E-mail
			$keyEmail = generationRandomString(20);

			$sql = "INSERT INTO users (email, password, keyEmail, confirmed, created) VALUES ('$email', '$password', '$keyEmail', false, '$date_creation')";

			if (mysqli_query($conn, $sql)) {
				$status = 'success';
				$message = "Ваш профіль вдало створено.<br><br>На вказаний Вами Email було надіслано листа. Тепер необхідно підтвердити введену адресу електронної пошти. Для цього відкрийте лист і перейдіть за посиланням, зазначеним у ньому.";
			} else {
				$status = "error";
				$message = "Під час реєстрації виникла помилка спробуйте пізніше.";
			}

			$to      = "".$email."";
			$subject = "Підтвердження пошти на сайті ".$address_site;
			$textLetter = 'Привіт! <br/> <br/> Сьогодні '.date("d.m.Y", time()).', якимсь користувачем була зроблена реєстрація на сайті <a href="'.$address_site.'">'.$_SERVER['HTTP_HOST'].'</a> використовуючи Ваш email. Якщо це були Ви, то, будь ласка, підтвердьте адресу вашої електронної пошти, перейшовши за цим посиланням: <a href="'.$address_site.'/pages/move_two.html?token='.$keyEmail.'">'.$address_site.'/activation email</a> <br/> <br/> В іншому випадку, якщо це були не Ви, просто ігноруйте цей лист. <br/> <br/> <strong>Увага!</strong> Посилання дійсне 24 години. Після чого Ваш обліковий запис буде видалено з бази.';
			$headers  = "MIME-Version: 1.0\r\n";
			$headers .= "Content-type: text/html; charset=UTF-8\r\n";
			$headers .= "From: babystore@babystore.website\r\n";
			$headers .= "Reply-To: babystore@babystore.website\r\n";
			$headers .= "X-Mailer: PHP/" . phpversion();


			mail($to, $subject, $textLetter, $headers);
		} else {
			$status = 'match';
			$message = "Користувача із таким Email-ом вже зареєстровано.<br><br>Скористайтеся іншим Email-ом.";
		}

		$answerServer['status'] = $status;
		$answerServer['action'] = $_POST['action'];
		$answerServer['bodyAnswer'] = $message;
		echo json_encode($answerServer);
		mysqli_close($conn);
	}

	switch ($_POST['action']) {
		case "forgotPassword":
			changePassword();
			break;
		case "registrationMoveOne":
			registrationUser();
			break;
	}
?>