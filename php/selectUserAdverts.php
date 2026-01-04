<?php
session_start();

	function selectUserAdverts($conn) {
		$arr = [];
		//выбираем все товары продавца у которых свойство display = 'show' or 'hide'
		$query = "SELECT product.article, product.title, product.price, product.display, product.top, product.time_display, photo_product.src FROM product JOIN photo_product ON photo_product.article = product.article WHERE product.id_user = ".$_SESSION['id']." AND (product.display = 'show' OR product.display = 'hide') AND photo_product.photo_sign = 1";
		$response = mysqli_query($conn, $query);

		$i = 0;
		while ( $result = mysqli_fetch_assoc($response) ) {
			$arr[$i]['data_goods'] = $result;

			if ($result['display'] == 'show') {
				$arr[$i]['data_partner'] = [];
				$sql = "SELECT seller_ratio, id_buyer FROM chat WHERE article = ".$result['article']." AND seller_token = 'show'";
				$answer = mysqli_query($conn, $sql);
				
				$x = 0;
				while($reply = mysqli_fetch_assoc($answer)) {
					$ask = "SELECT id, user, src_avatar FROM users WHERE id = ".$reply['id_buyer'];
					$report = mysqli_query($conn, $ask);
					$total = mysqli_fetch_assoc($report);
					$arr[$i]['data_partner'][$x] = $total;
					$arr[$i]['data_partner'][$x]['seller_ratio'] = $reply['seller_ratio'];
					$x++;
				}
			}
			$i++;
		}

		mysqli_free_result($response);
		return $arr;
	}

	function selectTradingUser($conn) {
		$arr = [];

		$sql = "SELECT * FROM sales WHERE (id_seller = ".$_SESSION['id']." AND seller_sign = 'show') OR (id_buyer = ".$_SESSION['id']." AND buyer_sign = 'show')";
		$response = mysqli_query($conn, $sql);

		$i = 0;
		while ( $result = mysqli_fetch_assoc($response) ) {
			['article' => $article, 'id_seller' => $id_seller, 'seller_sign' => $seller_sign, 'id_buyer' => $id_buyer, 'buyer_sign' => $buyer_sign] = $result;
			
			//Add data about goods
			$query = "SELECT product.article, product.title, product.price, photo_product.src FROM product JOIN photo_product ON photo_product.article = product.article WHERE product.article = '$article' AND photo_product.photo_sign = 1";
			$request = mysqli_query($conn, $query);
			$answer = mysqli_fetch_assoc($request);

			if ($answer) $arr[$i]['data_goods'] = $answer;

			//
			if ($_SESSION['id'] == $id_seller and $buyer_sign == 'remove') $arr[$i]['data_goods']['status']= 'видалено покупцем';

			if ($_SESSION['id'] == $id_buyer and $seller_sign == 'remove') $arr[$i]['data_goods']['status']= 'видалено продавцем';
			
			//Add data about seller and buyer
			$id_trader = $id_seller != $_SESSION['id']? $id_seller: $id_buyer;
			$ask ="SELECT id, user, phone, src_avatar, rating_user FROM users WHERE id = $id_trader";
			$refund = mysqli_query($conn, $ask);
			$reply = mysqli_fetch_assoc($refund);
			$arr[$i]['data_partner'] = $reply;

			if ($id_seller != $_SESSION['id']) {
				$arr[$i]['data_partner']['status'] = 'seller';
			} else {
				$arr[$i]['data_partner']['status'] = 'buyer';
			}
			++$i;
		}

		mysqli_free_result($response);
		return $arr;
	}
?>