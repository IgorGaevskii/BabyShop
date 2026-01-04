<?php
	session_start();
	include 'connection bd.php';

	$answerServer= [];
	$arr_error = [];
	$n = 0;

	$action = $_POST['action'];
	$id_user = $_POST['id_review'];
	$review = $_POST['review-comment'];
	$new_value = [
		filter_has_var(INPUT_POST, 'payment') ? $_POST['payment'] : 0,
		filter_has_var(INPUT_POST, 'analogy') ? $_POST['analogy'] : 0,
		filter_has_var(INPUT_POST, 'sending') ? $_POST['sending'] : 0,
		filter_has_var(INPUT_POST, 'dialog') ? $_POST['dialog'] : 0
	];

	$sql = "SELECT rating_payment, rating_analogy, rating_sending, rating_dialog FROM users WHERE id = $id_user";

	if (!$response = mysqli_query($conn, $sql)) {
		$arr_error['Get old value rating'] = 'fiasco';
	} else {
		$old_value = mysqli_fetch_row($response);

		for ($i = 0; $i < count($new_value); $i++) {
			if ($new_value[$i] == 0 && $old_value[$i] > 0) {
				$replace_value[$i] = $old_value[$i];
			} else if ($old_value[$i] == 0 && $new_value > 0) {
				$replace_value[$i] = $new_value[$i];
			} else {
				$replace_value[$i] = round( ($old_value[$i] + $new_value[$i]) / 2, 1);
			}

			if ($replace_value[$i] > 0) $n++;
		}


		$rating_user = round(array_sum($replace_value)/$n, 1);

		$query = "UPDATE users SET rating_payment = '$replace_value[0]', rating_analogy = '$replace_value[1]', rating_sending = '$replace_value[2]', rating_dialog = '$replace_value[3]', rating_user = '$rating_user' WHERE id = '$id_user'";

		if ( !mysqli_query($conn, $query) ) $arr_error['Update data rating'] = 'fiasco';
	}

	$answerServer['action'] = $_POST['action'];

	if ( in_array('fiasco', array_values($arr_error)) ) {
		$answerServer['error'] = array_keys($arr_error);
	} else {
		$answerServer['status'] = 'success';
	}

	echo json_encode($answerServer);
		/* закрытие соединения */
	mysqli_close($conn);
?>