<?php
	session_start();
	include 'connection bd.php';

	/*$postData = file_get_contents('php://input');
	$data = json_decode($postData, true);
	$article = $data['article'];
	$userOne = $data['userOne'];
	$userTwo = $data['userTwo'];
	echo $article;*/

	$article = $_POST['article'];
	$id_partner = $_POST['id_partner'];//получатель
	$id_user = $_SESSION['id'];//отправитель

	// print_r($_SESSION);

	$arr_error = [];
	$answerServer = [];

	if ( isset($_POST['is_read']) ) {
		$request = "UPDATE message SET is_read = true WHERE article = $article AND to_whom = $id_user AND from_whom = $id_partner";
		mysqli_query($conn, $request);
	}

	$sql = "SELECT * FROM message 
			WHERE article = $article 
			AND ((from_whom = $id_user AND to_whom = $id_partner) OR (from_whom = $id_partner AND to_whom = $id_user))";

	if ( $response = mysqli_query($conn, $sql) ) {
		$arr_correspondence = [];

		while ( $result = mysqli_fetch_assoc($response) ) {
			$arr_correspondence[] = $result;
		}

	} else {
		$arr_error['Get correspondence'] = 'fiasco';
	}

	$answerServer['action'] = $_POST['action'];

	if ( in_array('fiasco', array_values($arr_error) ) ) {
		$answerServer['status'] = 'fiasco';
		$answerServer['error'] = $arr_error;
	} else {
		$answerServer['status'] = 'success';
		$answerServer['correspondence'] = $arr_correspondence;
	}

	echo json_encode($answerServer);//кодируем массив с карточками в jcon;
?>