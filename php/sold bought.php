<?php
	session_start();
	include 'connection bd.php';

	$postData = file_get_contents('php://input');
	$data = json_decode($postData, true);
	$article = $data['article'];
	$action = $data['action'];
	$id_buyer = $_SESSION['id']; //Получаем id покупателя

	$arr_error = [];
	$answerServer = [];

	$sql = "SELECT product.id, product.title, product.price, product.display, product.id_user, users.user, users.phone, users.src_avatar, users.rating_user, photo_product.src FROM product JOIN users ON users.id = product.id_user JOIN photo_product ON photo_product.article = product.article WHERE product.article = $article AND photo_product.photo_sign = 1";
	$response = mysqli_query($conn, $sql);
	[$id_goods, $title, $price, $display, $id_seller, $user, $phone, $src_avatar, $rating, $src] = mysqli_fetch_row($response);

	if ($display == 'show') {
		$query = "INSERT INTO sales (article, id_seller, seller_sign, id_buyer, buyer_sign) VALUES ('$article', '$id_seller', 'show', '$id_buyer', 'show')";
		$arr_error['Insert data into table sales'] = ( mysqli_query($conn, $query) )? 'success': 'fiasco';

		$ask = "UPDATE product SET display = 'purchase' WHERE article = $article";
		$arr_error['Update table product'] = ( mysqli_query($conn, $ask) )? 'success': 'fiasco';

		$request = "UPDATE chat SET seller_token = 'sold' WHERE article = '$article' AND id_buyer != '$id_buyer'";
		$arr_error['Update table chat'] = ( mysqli_query($conn, $request) )? 'success': 'fiasco';

		if ( !in_array('fiasco', array_values($arr_error) ) ) {
			$answerServer['dataPurchaseGoods']['data_goods']['article'] = $article;
			$answerServer['dataPurchaseGoods']['data_goods']['title'] = $title;
			$answerServer['dataPurchaseGoods']['data_goods']['price'] = $price;
			$answerServer['dataPurchaseGoods']['data_goods']['src'] = $src;
			$answerServer['dataPurchaseGoods']['data_partner']['id'] = $id_seller;
			$answerServer['dataPurchaseGoods']['data_partner']['user'] = $user;
			$answerServer['dataPurchaseGoods']['data_partner']['phone'] = $phone;
			$answerServer['dataPurchaseGoods']['data_partner']['src_avatar'] = $src_avatar;
			$answerServer['dataPurchaseGoods']['data_partner']['status'] = 'seller';
			$answerServer['dataPurchaseGoods']['data_partner']['rating_user'] = $rating;
		}
	}

	if ( in_array('fiasco', array_values($arr_error) ) ) {
		$answerServer['status'] = 'fiasco';
		$answerServer['error'] = $arr_error;
	} else {
		$answerServer['status'] = 'success';
	}
	
	$answerServer['action'] = $action;
	echo json_encode($answerServer);
?>