<?php
	session_start();
	$action = $_POST['action'];//get from advert.js
	
	include 'connection bd.php';
	include 'selectUserAdverts.php';
	include 'selectTopGoods.php';

	function readPhotoSlots() {
		$slots = json_decode($_POST['photo_slots'] ?? '', true);
		if (!is_array($slots) || count($slots) > 8) return false;
		return array_pad(array_slice($slots, 0, 8), 8, null);
	}

	function getPhotoSources($conn, $article) {
		$sources = [];
		$stmt = mysqli_prepare($conn, "SELECT src FROM photo_product WHERE article = ? ORDER BY photo_sign DESC");
		if (!$stmt) return false;
		mysqli_stmt_bind_param($stmt, 's', $article);
		mysqli_stmt_execute($stmt);
		$result = mysqli_stmt_get_result($stmt);
		while ($row = mysqli_fetch_assoc($result)) $sources[] = $row['src'];
		mysqli_stmt_close($stmt);
		return $sources;
	}

	function savePhotoFiles($slots, $existingSources, &$newFilePaths) {
		$sources = [];
		$seenExisting = [];
		$firstPhoto = true;
		$upload = $_FILES['photo_files'] ?? null;
		$allowedTypes = [
			'image/jpeg' => 'jpg',
			'image/png' => 'png',
			'image/gif' => 'gif',
			'image/webp' => 'webp'
		];
		$targetDirectory = __DIR__.'/../pictures/icon goods/';

		if (!is_dir($targetDirectory) || !is_writable($targetDirectory)) return false;
		$finfo = new finfo(FILEINFO_MIME_TYPE);

		foreach ($slots as $index => $slot) {
			if ($slot === null) continue;
			if (!is_array($slot) || empty($slot['type'])) return false;

			if ($slot['type'] === 'existing') {
				$src = $slot['src'] ?? '';
				if (!in_array($src, $existingSources, true) || in_array($src, $seenExisting, true)) return false;
				$seenExisting[] = $src;
				$sources[] = ['src' => $src, 'photo_sign' => $firstPhoto ? 1 : 0];
				$firstPhoto = false;
				continue;
			}

			if ($slot['type'] !== 'new' || (int)($slot['index'] ?? -1) !== $index ||
				!$upload || !isset($upload['error'][$index]) || $upload['error'][$index] !== UPLOAD_ERR_OK ||
				$upload['size'][$index] > 10 * 1024 * 1024 || !is_uploaded_file($upload['tmp_name'][$index])) {
				return false;
			}

			$mimeType = $finfo->file($upload['tmp_name'][$index]);
			if (!isset($allowedTypes[$mimeType])) return false;

			$fileName = bin2hex(random_bytes(10)).'.'.$allowedTypes[$mimeType];
			$destination = $targetDirectory.$fileName;
			if (!move_uploaded_file($upload['tmp_name'][$index], $destination)) return false;

			$newFilePaths[] = $destination;
			$sources[] = [
				'src' => '/pictures/icon goods/'.$fileName,
				'photo_sign' => $firstPhoto ? 1 : 0
			];
			$firstPhoto = false;
		}

		return count($sources) ? $sources : false;
	}

	function replacePhotoRecords($conn, $article, $sources, $deleteArticle = null) {
		$delete = mysqli_prepare($conn, "DELETE FROM photo_product WHERE article = ?");
		if (!$delete) return false;
		$articleToDelete = $deleteArticle ?? $article;
		mysqli_stmt_bind_param($delete, 's', $articleToDelete);
		$ok = mysqli_stmt_execute($delete);
		mysqli_stmt_close($delete);
		if (!$ok) return false;

		$insert = mysqli_prepare($conn, "INSERT INTO photo_product (article, photo_sign, src) VALUES (?, ?, ?)");
		if (!$insert) return false;
		foreach ($sources as $photo) {
			mysqli_stmt_bind_param($insert, 'sis', $article, $photo['photo_sign'], $photo['src']);
			if (!mysqli_stmt_execute($insert)) {
				mysqli_stmt_close($insert);
				return false;
			}
		}
		mysqli_stmt_close($insert);
		return true;
	}

//удаление товара из базы данных продавцем
	function deleteAdvert($conn) {
		$arr_articles = explode(",", $_POST['data']);
		$arr_error = [];
		$answerServer = [];

		function checkChat($conn, $article) {
			$response = mysqli_query($conn, "SELECT * FROM message WHERE article = '$article'");

			if ( mysqli_num_rows($response) ) {
				mysqli_query($conn, "UPDATE chat SET seller_token = 'remove' WHERE article = '$article'");
				return true;
			}
		}

		function checkFavorite($conn, $article) {
			$response = mysqli_query($conn, "SELECT * FROM user_favorites WHERE article = '$article'");

			if ( mysqli_num_rows($response) ) return true;
		}

		foreach ($arr_articles as $article) {
			/*проверяем есть записи по товару в чате или в избранном:
				yes: ставлю в таблице product property display "remove"
				no: удаляем товар из базы
			*/

			if ( checkChat($conn, $article) || checkFavorite($conn, $article) ) {
				mysqli_query($conn, "UPDATE product SET display = 'remove' WHERE article = '$article'");
			} else {
				$answerServer['sing'] = 'exists chat';

				$request = "UPDATE product SET article=null, title=null, price=null, description=null, state=null, stock=null, display=null, time_display=null, top=null, id_user=null, id_category=null, id_subcategory=null WHERE article = '$article'";

				If ( mysqli_query($conn, $request) ) {
					//Getting src photos
					$question = "SELECT src FROM photo_product WHERE article = '$article'";

					if ( $answer = mysqli_query($conn, $question) ) {
						//Delete photo file
						while ( $result = mysqli_fetch_assoc($answer) ) {

							if ( !unlink("..".$result['src']) ) $arr_error['Delete photo file'] = 'fiasco';
						}
						//
						mysqli_free_result($answer);
					} else {
						$arr_error['Get SRC photo'] = 'fiasco';
					}
					//
				} else {
					$arr_error['Delete product'] = 'fiasco';
				}
				//
				//Delete all records from table photo_product
				$query ="DELETE FROM photo_product WHERE article = '$article'";
				
				If ( !mysqli_query($conn, $query) ) $arr_error['Delete SRC photo'] ='fiasco';
			}
		}

		// echo var_export($arr_error);

		if ( in_array('fiasco', array_values($arr_error)) ) {
			$answerServer['status'] = 'fiasco';
		} else {
			$answerServer['status'] = 'success';
			$answerServer['action'] = $_POST['action'];
		}
		// print_r($arr_error);
		echo json_encode($answerServer);
		/* закрытие соединения */
		mysqli_close($conn);
	}
//конец удаления

	function updateAdvert($conn) {
		$id_category = $_POST['id_category'];
		$id_subcategory = $_POST['id_subcategory'];
		$titleProduct = $_POST['name_goods'];
		$priceProduct = $_POST['price_goods'];
		$descriptionProduct = $_POST['description_goods'];
		$state_goods = $_POST['state_goods'];
		$stock_goods = $_POST['stock_goods'];
		$timeDisplayProduct = $_POST['time_display'];
		$topProduct = $_POST['radio_goods'];
		$old_article = $_POST['article'];
		$slots = readPhotoSlots();
		$answerServer = [];
		$newFilePaths = [];
		$oldSources = getPhotoSources($conn, $old_article);

		if ($slots === false || $oldSources === false || !count(array_filter($slots))) {
			echo json_encode(['status' => 'fiasco']);
			return;
		}

		if ( strlen($id_subcategory) == 1 ) {
			$codeSubcategoryProduct = '0'.$id_subcategory;
		} else {
			$codeSubcategoryProduct = $id_subcategory;
		}

		$product_id = substr($old_article, 3);
		$answerServer['product_id'] = $product_id;

		$articleProduct = $id_category.''.$codeSubcategoryProduct.''.$product_id;
		mysqli_begin_transaction($conn);
		$query = "UPDATE product SET article=?, title=?, price=?, description=?, state=?, stock=?, time_display=?, top=? WHERE article=? AND id_user=?";
		$stmt = mysqli_prepare($conn, $query);
		$userId = (int)$_SESSION['id'];
		$updated = false;
		if ($stmt) {
			mysqli_stmt_bind_param($stmt, 'sssssssssi', $articleProduct, $titleProduct, $priceProduct,
				$descriptionProduct, $state_goods, $stock_goods, $timeDisplayProduct, $topProduct, $old_article, $userId);
			$updated = mysqli_stmt_execute($stmt);
			mysqli_stmt_close($stmt);
		}

		$photos = $updated ? savePhotoFiles($slots, $oldSources, $newFilePaths) : false;
		$photosSaved = $photos !== false && replacePhotoRecords($conn, $articleProduct, $photos, $old_article);
		if (!$photosSaved) {
			mysqli_rollback($conn);
			foreach ($newFilePaths as $path) if (is_file($path)) unlink($path);
			echo json_encode(['status' => 'fiasco']);
			return;
		}
		mysqli_commit($conn);

		$keptSources = array_column($photos, 'src');
		foreach ($oldSources as $src) {
			$filePath = __DIR__.'/..'.$src;
			if (!in_array($src, $keptSources, true) && is_file($filePath)) unlink($filePath);
		}

		//select adverts user
		$arr = selectUserAdverts($conn);
		$answerServer['advertsUser'] = $arr;

		$sampleTopGoods = selectTopGoods($conn);
		$answerServer['topGoods'] = $sampleTopGoods['topGoods'];
		$answerServer['status'] = 'success';
		$answerServer['action'] = $_POST['action'];
		echo json_encode($answerServer);
		/* закрытие соединения */
		mysqli_close($conn);
	}
	
/*-----start-----*/
	function placeAdvert($conn) {
		$id_category = $_POST['id_category'];
		$id_subcategory = $_POST['id_subcategory'];
		$titleProduct = $_POST['name_goods'];
		$priceProduct = $_POST['price_goods'];
		$descriptionProduct = $_POST['description_goods'];
		$state_goods = $_POST['state_goods'];
		$stock_goods = $_POST['stock_goods'];
		$timeDisplayProduct = $_POST['time_display'];
		$topProduct = $_POST['radio_goods'];
		$display = 'show';

		$answerServer = [];
		$newFilePaths = [];
		$slots = readPhotoSlots();
		if ($slots === false || !count(array_filter($slots))) {
			echo json_encode(['status' => 'fiasco']);
			return;
		}

		function getId($conn) {
			$request = "SELECT id, article FROM product";
		
			if ( $response = mysqli_query($conn, $request) ) {
				$number_rows = mysqli_num_rows($response);

				if ($number_rows != 0) {

					while( $result = mysqli_fetch_assoc($response) ) {

						if (!$result['article']) {
							$obj[] = $result['id'];
							$obj[] = 'update';
							return $obj;
						}
					}
					$obj[] = $number_rows + 1;
					$obj[] = 'insert';
					return $obj;
				} else {
					$obj[] = $number_rows + 1;
					$obj[] = 'insert';
					return $obj;
				}
			} else return false;

			mysqli_free_result($response);
		}

		// Формируем код товара на основе id таблиц бд
    	if ( strlen($id_subcategory) == 1 ) {
			$codeSubcategoryProduct = '0'.$id_subcategory;
		} else {
			$codeSubcategoryProduct = $id_subcategory;
		}

		$idData = getId($conn);
		if (!$idData) {
			echo json_encode(['status' => 'fiasco']);
			return;
		}
		[$id, $type_query] = $idData;
		$article_goods = $id_category.''.$codeSubcategoryProduct.''.$id;

		if ($type_query === 'update') {
			$request = "UPDATE product SET article = '$article_goods', title = '$titleProduct', price = '$priceProduct', description = '$descriptionProduct', state = '$state_goods', stock = '$stock_goods', display = '$display', top = '$topProduct', id_user = ".$_SESSION['id'].", time_display = '$timeDisplayProduct', id_category = '$id_category', id_subcategory = '$id_subcategory' WHERE id = '$id'";
		} else {
			$request = "INSERT INTO product (id, article, title, price, description, state, stock, display, top, id_user, time_display, id_category, id_subcategory) VALUES ('$id', '$article_goods', '$titleProduct', '$priceProduct', '$descriptionProduct', '$state_goods', '$stock_goods', '$display', '$topProduct', ".$_SESSION['id'].", '$timeDisplayProduct', '$id_category', '$id_subcategory')";
		}

		mysqli_begin_transaction($conn);
		$productSaved = mysqli_query($conn, $request);
		$photos = $productSaved ? savePhotoFiles($slots, [], $newFilePaths) : false;
		$photosSaved = $photos !== false && replacePhotoRecords($conn, $article_goods, $photos);
		if (!$photosSaved) {
			mysqli_rollback($conn);
			foreach ($newFilePaths as $path) if (is_file($path)) unlink($path);
			echo json_encode(['status' => 'fiasco']);
			return;
		}
		mysqli_commit($conn);

		//select adverts user
		$arr = selectUserAdverts($conn);
		$answerServer['advertsUser'] = $arr;

		if ((bool) $topProduct) {
			$sampleTopGoods = selectTopGoods($conn);
			$answerServer['topGoods'] = $sampleTopGoods['topGoods'];
		}

		$answerServer['status'] = 'success';
		$answerServer['action'] = $_POST['action'];
		echo json_encode($answerServer);
		/* закрытие соединения */
		mysqli_close($conn);
	}
/*-----end-----*/

	function changeDisplayAdvert($conn) {
		$array = explode(",", $_POST['data']);
		$controlUpdate = [];

		if ($_POST['action'] == 'deactivate') {
			$display = 'hide';
		} else {
			$display = 'show';
		}
		
		foreach ($array as $article) {
			/*проверяю есть записи по данному товару в таблице чат:
				yes: 
					-ставлю в таблице product свойству display значение "hide"
						("hide" товар переходит из вкладки активный в неактивный)
						("show" обратный переход товара)
					-ставлю в таблице chat свойству seller_token значение "hide"
						(убираю товар из чата продовца и блокирую отсылку новых сообщений продавцу)
				no: goods remove
			*/
			$request = "SELECT * FROM chat WHERE article = '$article'";
			$response = mysqli_query($conn, $request);
			$num_rows = mysqli_num_rows($response);

			if ($num_rows) {
				//изменяю значение в таблице chat
				$sql = "UPDATE chat SET seller_token = '$display' WHERE article = '$article'";
				mysqli_query($conn, $sql);
				//посылаю признак для удаления чата у продовца
				if ($display == 'hide') $controlUpdate['sing'] = $display;
			}

			//изменяю значение в таблице product (для перехода товара из вкладки активный в неактивный и обратно)
			$query = "UPDATE product SET display = '$display' WHERE article = '$article'";
			if (mysqli_query($conn, $query)) {
				$controlUpdate[] = 'success';
			} else {
				$controlUpdate[] = 'fiasco';
			}
		}

		if (in_array('fiasco', $controlUpdate)) {
			echo 'fiasco';
		} else {
			// $controlUpdate = array();
			$controlUpdate['action'] = $_POST['action'];
			$controlUpdate['status'] = 'success';
		}
		
		$json = json_encode($controlUpdate);
		echo $json;
	}

	switch ($_POST['action']) {
		case 'deactivate':
			changeDisplayAdvert($conn);
			break;
		case 'activate':
			changeDisplayAdvert($conn);
			break;
		case 'submitAdvert':
			placeAdvert($conn);
			break;
		case 'updateAdvert':
			updateAdvert($conn,);
			break;
		case 'delete':
			deleteAdvert($conn);
			break;
	}
?>