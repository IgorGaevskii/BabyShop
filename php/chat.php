<?php
	session_start();
	include 'connection bd.php';

	$action = $_POST['action'];
	$json_product = $_POST['product'];
	$product = json_decode($json_product);
	$id_user = $_SESSION['id'];
	
	$answerServer = [];

	function getDataPartner($conn, $id_partner) {
		$sql ="SELECT id, user, phone, src_avatar FROM users WHERE id = $id_partner";
		$response = mysqli_query($conn, $sql);
		return mysqli_fetch_assoc($response);
	}

	if ( isset($_POST['is_read']) ) {
		$article = $_POST['article'];
		$id_interlocutor = $_POST['id_interlocutor'];
		$request = "UPDATE message SET is_read = true WHERE article = $article AND to_whom = $id_user AND from_whom = $id_interlocutor";
		mysqli_query($conn, $request);
	}

	$arr_all_articles_comp = array_map(function($item) {
		return $item[0];
	}, $product);

	$arr_temp = [];
	$sql = "SELECT DISTINCT article FROM chat WHERE (id_seller = $id_user and seller_token = 'show') OR (id_buyer = $id_user and buyer_token = 'show')";
	// $sql = "SELECT DISTINCT chat.article FROM chat JOIN product ON product.article = chat.article WHERE (chat.to_whom = '$id_user' OR chat.from_whom = '$id_user') AND product.display != 'hide'";
	$response = mysqli_query($conn, $sql);

	while ( [$article_table_chat] = mysqli_fetch_row($response) ) {

		if (!in_array($article_table_chat, $arr_all_articles_comp)) {
			$query = "SELECT product.article, product.title, product.price, product.id_user, photo_product.src FROM product JOIN photo_product ON photo_product.article = product.article WHERE product.article = $article_table_chat AND photo_product.photo_sign = 1";
			$outcome = mysqli_query($conn, $query);
			$answer = mysqli_fetch_assoc($outcome);
			$arr_temp['data_goods'] = $answer;

			if ($answer['id_user'] == $_SESSION['id']) {

				$sql = "SELECT DISTINCT from_whom FROM message WHERE article = $article_table_chat";
				$answer = mysqli_query($conn, $sql);
				$arr_temp['data_partner'] = [];
				
				$x = 0;
				while($reply = mysqli_fetch_assoc($answer)) {

					if ($_SESSION['id'] == $reply['from_whom']) continue;
					
					$arr_temp['data_partner'][$x] = getDataPartner($conn, $reply['from_whom']);
					$x++;
				}

			} else {
				$arr_temp['data_partner'] = getDataPartner($conn, $answer['id_user']);
			}

			$answerServer['new_chat'][] = $arr_temp;
		} else {
			// $arr_partners_comp = array_find($product, function ($elem) use ($article_table_chat) {
    		// 	return $elem[0] == $article_table_chat;
			// });
			$ask = "SELECT id_user FROM product WHERE article = $article_table_chat";
			$answer = mysqli_query($conn, $ask);
			[$id] = mysqli_fetch_row($answer);

			if ($id == $_SESSION['id']) {
				$elem_arr = array_find($product, fn($elem) => $elem[0] == $article_table_chat);
				$id_partners_comp = $elem_arr[1];

				$query = "SELECT id_buyer FROM chat WHERE article = $article_table_chat AND seller_token = 'show' AND buyer_token = 'show'";
				$outcome = mysqli_query($conn, $query);

				$tmp_arr = [];
				$y = 0;

				while ( [$id_new_partner] = mysqli_fetch_row($outcome) ) {

					if ( in_array($id_new_partner, $id_partners_comp) ) {
						continue;
					} else if ($id_new_partner == $_SESSION['id']) {
						continue;
					} else {
						$tmp_arr[$y]['article'] = $article_table_chat;
						$tmp_arr[$y]['data_partner'] = getDataPartner($conn, $id_new_partner);
					}
				}

				if ( count($tmp_arr) ) $answerServer['new_partner'] = $tmp_arr;
			}
		}
	}

	$i = 0;
	foreach ($product as $item) {
		$article = $item[0];
		$answerServer['number_new_message'][$i][0] = $item[0];

		$j = 0;
		$answerServer['number_new_message'][$i][1] = [];
		foreach ($item[1] as $point) {
			$request = "SELECT * FROM message WHERE article = $article AND from_whom = $point AND is_read = false";
			$reply = mysqli_query($conn, $request);
			$rows = mysqli_num_rows($reply);
			$answerServer['number_new_message'][$i][1][$j]['id_user'] = $point;
			$answerServer['number_new_message'][$i][1][$j]['num_message'] = $rows;

			$sql = "SELECT active FROM users WHERE id = '$point'";
			$response = mysqli_query($conn, $sql);
			[$active] = mysqli_fetch_row($response);
			$answerServer['number_new_message'][$i][1][$j]['active'] = $active;
			$j++;
		}
		$i++;
	}

	if ( isset($_POST['id_interlocutor']) ) {
		$article = $_POST['article'];
		$id_interlocutor = $_POST['id_interlocutor'];
		$query = "SELECT * FROM message WHERE article = $article 
		AND ((from_whom = $id_user AND to_whom = $id_interlocutor) OR (from_whom = $id_interlocutor AND to_whom = $id_user))";

		$answer = mysqli_query($conn, $query);
		$answerServer['correspondence'] = [];

		while ( $result = mysqli_fetch_assoc($answer) ) {
			$answerServer['correspondence'][] = $result;
		}
	}

	$answerServer['action'] = $action;
	$answerServer['status'] = 'success';
	
	// print_r($answerServer);
	echo json_encode($answerServer);
?>