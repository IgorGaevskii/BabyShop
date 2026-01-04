<?php
session_start();

$email = $_POST['email'];
$password = $_POST['password'];
$action = $_POST['action'];

include 'connection bd.php';
include 'selectUserAdverts.php';

$answerServer = [];
$arr_error = [];
$arr_data = [];
$arr_articles_chat = [];

$query = "SELECT id, user, password, confirmed FROM users WHERE email = '$email'";

if ( $response = mysqli_query($conn, $query) ) {
	$arr_error['Get data user'] = 'success';
	
	if ( mysqli_num_rows($response) ) {
		[$id, $user, $password_bd, $confirmed] = mysqli_fetch_row($response);

		if ($confirmed) {

			if ($password_bd === $password) {
				$arr_data['dataUser']['id'] = $id;
				$arr_data['dataUser']['user'] = $user;
				$_SESSION['id'] = $id;
				$_SESSION['user'] = $user;

				//обновляю стату пользователя
				$query = "UPDATE users SET active = true WHERE id = $id";
				mysqli_query($conn, $query);

				//select all user ads
				$arr = selectUserAdverts($conn);

				if ($arr != []) {
					$arr_data['advertsUser'] = $arr;

					foreach ($arr as $elem_arr) {
						$arr_articles_chat[] = $elem_arr['data_goods']['article'];	
					}
				}
				
				//select all user trading
				$arr = selectTradingUser($conn);
				
				if ($arr != []) {
					$arr_data['tradingUser'] = $arr;

					foreach ($arr as $elem_arr) {
						$arr_articles_chat[] = $elem_arr['data_goods']['article'];	
					}
				}

				$arr_temp = [];

				// $sql = "SELECT DISTINCT article FROM chat WHERE to_whom = $id OR from_whom = $id";
				$sql = "SELECT DISTINCT article FROM chat WHERE id_buyer = $id AND buyer_token = 'show'";
				$response = mysqli_query($conn, $sql);

				$i = 0;
				while ( [$article] = mysqli_fetch_row($response) ) {

					// if (!in_array($article, $arr_articles_chat)) {

						// $question = "SELECT * FROM sales WHERE article = '$article' AND id_seller = $id AND seller_sign = 'hide'";
						// $report = mysqli_query($conn, $question);
						// $total = mysqli_num_rows($report);

						// if ($total != 0) continue;

						$query = "SELECT product.article, product.title, product.price, product.id_user, photo_product.src FROM product JOIN photo_product ON photo_product.article = product.article 
							WHERE product.article = '$article' AND photo_product.photo_sign = 1";
						$outcome = mysqli_query($conn, $query);
						$answer = mysqli_fetch_assoc($outcome);
						$id_partner = $answer['id_user'];
						$arr_temp[$i]['data_goods'] = $answer;
						mysqli_free_result($outcome);

						$ask ="SELECT id, user, phone, src_avatar FROM users WHERE id = '$id_partner'";
						$refund = mysqli_query($conn, $ask);
						$reply = mysqli_fetch_assoc($refund);
						$arr_temp[$i]['data_partner'][] = $reply;
						mysqli_free_result($refund);
						$arr_articles_chat[] = $article;
						$i++;
					// }
				}

				if ($arr_temp != []) $arr_data['chatUser'] = $arr_temp;

			} else {
				$answerServer['status'] = 'not match';
			}
		} else {
			$answerServer['status'] = 'not confirmed';	
		}
	} else {
		$answerServer['status'] = 'not found';
	}
} else {
	$arr_error['Get data user'] = 'fiasco';
}

mysqli_free_result($response);

if ( !in_array('status', array_keys($answerServer) ) ) {

	if ( in_array('fiasco', array_values($arr_error) ) ) {
		$answerServer['status'] = 'fiasco';
		$answerServer['error'] = $arr_error;
	} else {
		$answerServer = $arr_data;
		$answerServer['status'] = 'success';
	}
}

$answerServer['action'] = $action;
echo json_encode($answerServer);
mysqli_close($conn);
?>