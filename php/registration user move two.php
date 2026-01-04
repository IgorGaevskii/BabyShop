<?php
	// https://babyshop.local/index.php?token=5N2X9dfsBWHGd9B3qU5g
	session_start();
	$name = trim($_POST['first_name']);
	$surname = trim($_POST['surname']);
	$phone = trim($_POST['phone']);
	$token = $_POST['token'];
	$uploaded_file = $_FILES['user-avatar'];

	$answerServer = [];
	$arr_error = [];

	include 'connection bd.php';

	if ($uploaded_file['size'] > 0) {
		$tmp_dir = $uploaded_file['tmp_name'];
		$uploads_dir = $_SERVER['DOCUMENT_ROOT']."/pictures/user avatars/".$uploaded_file['name'];
		$path_file = '';
		$allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
		$extension = pathinfo($uploaded_file['name'], PATHINFO_EXTENSION);

		if ($_FILES['user-avatar']['error'] !== 0) {//проверка на ошибки при загрузке файла на сервер
			$arr_error['Ошибка при загрузке файла.'] = 'problem';
		} else if ( !in_array($extension, $allowedExtensions) ) {//проверка расширения файла
			$arr_error['Загрузка файлов с таким расширением запрещена!'] = 'problem';
		}

		if ( in_array('problem', array_values($arr_error) ) ) {
			$path_file = "/pictures/user avatars/empty avatar.jpg";
		} else if ( move_uploaded_file($tmp_dir, $uploads_dir) ) {//move the downloaded file from the server's temporary folder to the folder with avatars
			$old_name = $uploads_dir;
			$new_name = $_SERVER['DOCUMENT_ROOT']."/pictures/user avatars/".$token.".jpg";
			
			if ( rename($old_name, $new_name) ) {//rename file avatar
				$path_file = "/pictures/user avatars/".$token.".jpg";
			} else {
				$arr_error['Ошибка при переименовании файла'] = 'fiasco';
			}

		} else {
			$arr_error['Ошибка при перемещении файла'] = 'fiasco';
		}

	} else {
		$path_file = "/pictures/user avatars/empty avatar.jpg";
	}

	if ( !empty($name) && !empty($surname) && !empty($phone) ) {
		$full_name = $name." ".$surname;
		$query = "UPDATE users SET confirmed = true, user = '$full_name', phone = '$phone', src_avatar = '$path_file', active = false, rating_payment = 0, rating_analogy = 0, rating_sending = 0, rating_dialog = 0, rating_user = 0 WHERE keyEmail = '$token'";
		
		if ( !mysqli_query($conn, $query) ) $arr_error['adding user data'] = 'fiasco';
	}

		$answerServer['action'] = $_POST['action'];

		if ( in_array('problem', array_values($arr_error) ) ) {
			$answerServer['problem'] = key($arr_error);
		} else if ( in_array('fiasco', array_values($arr_error) ) ) {
			$answerServer['error'] = key($arr_error);
		} else {
			$answerServer['status'] = 'success';
		}

		echo json_encode($answerServer);
		mysqli_close($conn);
?>