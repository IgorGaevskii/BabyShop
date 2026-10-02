<?php
	$action = $_POST['action'];
	$arr_articles = explode(",", $_POST['data']);

	$arr_error = [];
	$answerServer = [];
	$answerServer['action'] = $action;
	// $answerServer['removed'] = [];

	include 'connection bd.php';

	for ($i = 0; $i < count($arr_articles); ++$i) {
		$article = $arr_articles[$i];

		if ($action == 'removeSale') {
			$query = "SELECT id_seller, id_buyer, buyer_sign FROM sales WHERE article = '$article'";
			$response = mysqli_query($conn, $query);
			[$id_seller, $id_buyer, $value_sign] = mysqli_fetch_row($response);
		} else {
			$query = "SELECT id_seller, seller_sign, id_buyer FROM sales WHERE article = '$article'";
			$response = mysqli_query($conn, $query);
			[$id_seller, $value_sign, $id_buyer] = mysqli_fetch_row($response);
		}

		if ($value_sign == 'show') {

			if ($action == 'removeSale') {
				$sql = "UPDATE sales SET seller_sign = 'remove' WHERE article = '$article'";
				$ask = "UPDATE chat SET seller_token = 'remove' WHERE article = '$article'";
				mysqli_query($conn, $ask);
			} else {
				$sql = "UPDATE sales SET buyer_sign = 'remove' WHERE article = '$article'";
				$ask = "UPDATE chat SET buyer_token = 'remove' WHERE article = '$article'";
				mysqli_query($conn, $ask);
			}

			if ( !mysqli_query($conn, $sql) ) $arr_error['Change value sign'] = 'fiasco';

		} else {
			//Deleting a record from a table "sales"
			$sql = "DELETE FROM sales WHERE article = '$article'";
			$arr_error['Deleting a record from a table sales'] = mysqli_query($conn, $sql)? 'success': 'fiasco';

			//Deleting a record from a table chat
			$request = "DELETE FROM chat WHERE article = $article AND id_seller = $id_seller AND id_buyer = $id_buyer";
			$arr_error['Deleting a record from a table chat'] = mysqli_query($conn, $request)? 'success': 'fiasco';

			//Deleting a records from a table message
			$question = "DELETE FROM message WHERE article = $article AND ((to_whom = $id_seller AND from_whom = $id_buyer) OR (to_whom = $id_buyer AND from_whom = $id_seller))";
			$arr_error['Deleting a records from a table message'] = mysqli_query($conn, $question)? 'success': 'fiasco';

			$answerServer['removed chad'][] = $article;

			//Checking for the existence of other chats regarding this product.
			$chats = "SELECT * FROM chat WHERE article = $article";
			$reply = mysqli_query($conn, $chats);
			$num_rows_chat = mysqli_num_rows($reply);

			//Checking if the product exists in other users' favorites.
			$query_favorite = "SELECT * FROM user_favorites WHERE article = $article LIMIT 1";
			$excerpt = mysqli_query($conn, $query_favorite);
			$num_rows_favorite = mysqli_num_rows($excerpt);

			if (!$num_rows_chat && !$num_rows_favorite) {
				$request = "UPDATE product SET article = null, title = null, price = null, description = null, state = null, stock = null, display = null, time_display = null, top = null, id_user = null, id_category = null, id_subcategory = null WHERE article = '$article'";
				
				if ( mysqli_query($conn, $request) ) {

					$question = "SELECT src FROM photo_product WHERE article = '$article'";

					if ( $answer = mysqli_query($conn, $question) ) {
						//Delete photo file
						while ( $result = mysqli_fetch_assoc($answer) ) {

							if ( !unlink("..".$result['src']) ) $arr_error['Delete photo file'] = 'fiasco';
						}
						//
						mysqli_free_result($answer);
					} else {
						$arr_error['Getting SRC photo'] = 'fiasco';
					}

					$query = "DELETE FROM photo_product WHERE article = '$article'";
					
					if ( !mysqli_query($conn, $query) ) $arr_error['Remove SRC'] = 'fiasco';
					
				} else {
					$arr_error['Remove goods from table product'] = 'fiasco';
				}
			} else if ($num_rows_favorite) {
				// $request = "UPDATE product SET display = 'remove' WHERE article = '$article'";
				// mysqli_query($conn, $request);
				$arr_error['Remove goods from table sales'] = 'fiasco';
			}
		}

		if ( in_array('fiasco', array_values($arr_error)) ) {
			$answerServer['article'] = $article;
			break;
		} else {
			$arr_error = [];
		}
	}

	if ( in_array('fiasco', array_values($arr_error)) ) {
		$answerServer['error'] = $arr_error;
	} else {
		$answerServer['status'] = 'success';
	}

	echo json_encode($answerServer);
		/* закрытие соединения */
	mysqli_close($conn);
?>