<?php
// include 'connection bd.php';

function selectTopGoods($conn) {
		$arr = [];
		$query = "SELECT product.article, product.title, product.price, photo_product.src 
		FROM product JOIN photo_product ON photo_product.article = product.article
		WHERE product.top = 1 AND product.display = 'show' AND photo_product.photo_sign = 1";

		if ($response = mysqli_query($conn, $query)) {
			$arr['error'] = 'success';
			$arr['topGoods'] = [];
			/* извлечение ассоциативного массива */
			while ($result = mysqli_fetch_assoc($response)) {
				$arr['topGoods'][] = $result;
			}
			/* удаление выборки */
			mysqli_free_result($response);
		} else {
			$arr['error'] = 'fiasco';
		}
		return $arr;
	}
?>