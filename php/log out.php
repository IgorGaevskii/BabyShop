<?php
	session_start();
	include 'connection bd.php';

	$action = file_get_contents('php://input');
	$answerServer = [];
	$answerServer['action'] = $action;

	$id_user = $_SESSION['id'];
	// $exit_date = date("Y-m-d H:i:s");

	// $sql = "UPDATE users SET exit_date = '$exit_date', active = false WHERE id = '$id_user'";
	$sql = "UPDATE users SET active = false WHERE id = '$id_user'";

	if ( mysqli_query($conn, $sql) ) {
		$answerServer['status'] = 'success';
	} else {
		$answerServer['error'] = 'Error: '.mysqli_error($conn);
	}

	unset($_SESSION['id']);
	unset($_SESSION['user']);
	session_destroy();

	echo json_encode($answerServer);
?>