<?php
	session_start();
	include 'connection bd.php';

	$arr_error = [];
	$answerServer = [];

	function insertMessage($conn) {
		$article = $_POST['article'];
		$to_whom = $_POST['id_partner']; //получатель
		$from_whom = $_SESSION['id']; //отправитель
		$word = $_POST['typing_area'];

		//insert message into chat table
		$sql ="INSERT INTO message (article, to_whom, word, from_whom, is_read) VALUES ('$article', '$to_whom', '$word', '$from_whom', false)";
		mysqli_query($conn, $sql);
	}

	function createNewChat($conn)	{
		$query = "INSERT INTO chat (article, id_seller, seller_token, seller_ratio, id_buyer, buyer_token, buyer_ratio) 
					 VALUES (".$_POST['article'].", ".$_POST['id_partner'].", 'show', false, ".$_SESSION['id'].", 'show', false)";
		mysqli_query($conn, $query);
	}

	$sql = "SELECT * FROM `chat` WHERE article = ".$_POST['article']." AND ((`id_seller`= ".$_POST['id_partner']." AND `id_buyer`= ".$_SESSION['id'].") OR (`id_seller`= ".$_SESSION['id']." AND `id_buyer`= ".$_POST['id_partner']."))";
	$response = mysqli_query($conn, $sql);
	$num_rows = mysqli_num_rows($response);
	// echo $num_rows;

		if ($num_rows) {
			['id_seller' => $id_seller, 'seller_token' => $seller_token, 'seller_ratio' => $seller_ratio, 'id_buyer' => $id_buyer, 'buyer_token' => $buyer_token, 'buyer_ratio' => $buyer_ratio] = mysqli_fetch_assoc($response);

			if ($_SESSION['id'] == $id_seller and $buyer_token == 'remove') {
				$answerServer['status goods'] = 'Товар видалено покупцем';
			} else if ($_SESSION['id'] == $id_buyer and $seller_token == 'hide') {
				$answerServer['status goods'] = 'Товар знятий продавцем з продажу';
			} else if ($_SESSION['id'] == $id_buyer and $seller_token == 'remove') {
				$answerServer['status goods'] = 'Товар видалено продавцем';
			} else if ($_SESSION['id'] == $id_seller and $buyer_token == 'delete') {
				$answerServer['status goods'] = 'Чат видалено продавцем';
			} else if ($_SESSION['id'] == $id_buyer and $seller_token == 'delete') {
				$answerServer['status goods'] = 'Чат видалено покупцем';
			} else if ($_SESSION['id'] == $id_seller and $buyer_ratio) {
				$answerServer['status goods'] = 'Покупець Вас заблокував';
			} else if ($_SESSION['id'] == $id_buyer and $seller_ratio) {
				$answerServer['status goods'] = 'Продавець Вас заблокував';
			} else if ($_SESSION['id'] == $id_buyer and $seller_token == 'sold') {
				$answerServer['status goods'] = 'Товар вже продано';
			} else {
				insertMessage($conn);
			}
		} else {
			$request = "SELECT seller_sign, buyer_sign FROM sales WHERE article = ".$_POST['article'];
			$answer = mysqli_query($conn, $request);
			$num_rows = mysqli_num_rows($answer);

			if ($num_rows) {
				[$seller_sign, $buyer_sing] = mysqli_fetch_row($answer);

				if ($seller_sign == 'remove') {
					$answerServer['status goods'] = 'Товар видалено продавцем';
				} else if ($buyer_sing == 'remove') {
					$answerServer['status goods'] = 'Товар видалено покупцем';
				} else {
					createNewChat($conn);
					insertMessage($conn);
				}

			} else {
				createNewChat($conn);
				insertMessage($conn);
			}	
		}

	$answerServer['action'] = $_POST['action'];

	if ( in_array('fiasco', array_values($arr_error) ) ) {
		$answerServer['status'] = 'fiasco';
		$answerServer['error'] = $arr_error;
	} else {
		$answerServer['status'] = 'success';
	}

	echo json_encode($answerServer);//кодируем массив с карточками в jcon;
?>