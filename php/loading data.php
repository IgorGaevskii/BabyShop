<?php
	session_start();
	include 'connection bd.php';

	$article = $_POST['data'];
	$arr_dataGoods = [];
	$answerServer  = [];

	$query = "SELECT product.id, product.article, product.title, product.price, product.description,
		product.state, product.stock, product.time_display, product.top, photo_product.src
		FROM product JOIN photo_product ON photo_product.article = product.article
		WHERE product.article = ? AND product.id_user = ?
		ORDER BY photo_product.photo_sign DESC";
	$stmt = mysqli_prepare($conn, $query);
	$userId = (int)$_SESSION['id'];

	if ($stmt) {
		mysqli_stmt_bind_param($stmt, 'si', $article, $userId);
		mysqli_stmt_execute($stmt);
		$response = mysqli_stmt_get_result($stmt);

		while ($result = mysqli_fetch_assoc($response)) {
			if (!$arr_dataGoods) {
				$arr_dataGoods = [
					'id_goods' => $result['id'],
					'article' => $result['article'],
					'title' => $result['title'],
					'price' => $result['price'],
					'description' => $result['description'],
					'state_goods' => $result['state'],
					'stock_goods' => $result['stock'],
					'src' => [],
					'time_display' => $result['time_display'],
					'top' => $result['top']
				];
			}
			$arr_dataGoods['src'][] = $result['src'];
		}
		mysqli_stmt_close($stmt);
	}

	if ($arr_dataGoods) {
		$answerServer['status'] = 'success';
		$answerServer['dataGoods'] = $arr_dataGoods;
	} else {
		$answerServer['status'] = 'fiasco';
	}

	$answerServer['action'] = $_POST['action'];
	echo json_encode($answerServer);//кодируем массив с карточками в jcon;

	/* закрытие соединения */
	mysqli_close($conn);
?>