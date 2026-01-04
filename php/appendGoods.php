<?php
	session_start();
	$action = $_POST['action'];//get from advert.js
	
	//Имя временной таблицы в которой хранятся пути к иконкам товара.
	// $name_temp_table = 'tmp_table_'.$_POST['idUser'];
	//имя временной папки с которой удаляем изображение
	// $name_temp_folder = 'tmp_folder_'.$_POST['idUser'];

	include 'connection bd.php';
	include 'selectUserAdverts.php';
	include 'selectTopGoods.php';

	function getTempData() {
		$arr = [];
		$arr[] = 'tmp_table_'.$_SESSION['id'];//Имя временной таблицы в которой хранятся пути к иконкам товара.
		$arr[] = 'tmp_folder_'.$_SESSION['id'];//Имя временной папки с которой удаляем изображение.
		return $arr;
	}

	function deleteTempData($conn) {
		[$name_temp_table, $name_temp_folder] = getTempData();

		if ( checkExistTempTable($conn) ) {
				$request = "SELECT src_photo FROM ".$name_temp_table;
				$answer = mysqli_query($conn, $request);

				while ( $result = mysqli_fetch_assoc($answer) ) {
					$path_photo = $result['src_photo'];

					if ($path_photo) {
						unlink($path_photo);
					} else {
						break;
					}
				}

				$query = "DROP TABLE ".$name_temp_table;
				$response = mysqli_query($conn, $query);

				rmdir($_SERVER["DOCUMENT_ROOT"]."/pictures/".$name_temp_folder);
			}
	}

	function deleteAdvert($conn) {
		$arr_articles = explode(",", $_POST['data']);
		$arr_error = [];
		$answerServer = [];

		foreach ($arr_articles as $article) {
			/*проверяем есть записи по данному товару в чате:
				yes: ставлю в таблице product property display "remove"
				no: goods remove
			*/
			$response = mysqli_query($conn, "SELECT * FROM message WHERE article = '$article'");
			$num_rows = mysqli_num_rows($response);

			if ($num_rows) {
				mysqli_query($conn, "UPDATE chat SET seller_token = 'remove' WHERE article = '$article'");
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

	function updateAdvert($conn) {
		$id_user = $_POST['idUser']; //get from advert.js
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

		$arr_error = [];
		$answerServer = [];

		[$name_temp_table, $name_temp_folder] = getTempData();

		if ( strlen($id_subcategory) == 1 ) {
			$codeSubcategoryProduct = '0'.$id_subcategory;
		} else {
			$codeSubcategoryProduct = $id_subcategory;
		}

		$product_id = substr($old_article, 3);
		$answerServer['product_id'] = $product_id;

		$articleProduct = $id_category.''.$codeSubcategoryProduct.''.$product_id;
		//Конец формирования кода товара
		$query = "UPDATE product SET article='$articleProduct', title='$titleProduct', price='$priceProduct', description='$descriptionProduct', state='$state_goods', stock='$stock_goods', time_display='$timeDisplayProduct', top='$topProduct' WHERE article='$old_article'";

		if ( mysqli_query($conn, $query) ) {
			//remove all records about goods from the table photo_product
			$request = "DELETE FROM photo_product WHERE article = '$old_article'";
			$arr_error[] = ( mysqli_query($conn, $request) ) ? 'success': 'fiasco';

			$query = "SELECT id, src_photo FROM ".$name_temp_table;
			$response = mysqli_query($conn, $query);

			while($result = mysqli_fetch_assoc($response)) {
				$nameFile = substr(strrchr($result['src_photo'], '/'), 1);

				if ($nameFile) {
					//переносим изображения товара из временной папки в постоянную
					rename($result['src_photo'], "../pictures/icon goods/".$nameFile);
					//
					$src = "/pictures/icon goods/".$nameFile;

					if ($result['id'] == 1) {
						$photo_sign = 1;
					} else {
						$photo_sign = 0;
					}
					//insert updated goods records in the table
					$query1 = "INSERT INTO photo_product (article, photo_sign, src) 
							VALUES ('$articleProduct', '$photo_sign', '$src')";
					$arr_error[] = ( mysqli_query($conn, $query1) ) ? 'success': 'fiasco';

				} else {
					break;
				}
			}
			//remove temp table
			$query = "DROP TABLE ".$name_temp_table;
			$response = mysqli_query($conn, $query);
			//remove temp folder 
			rmdir($_SERVER["DOCUMENT_ROOT"]."/pictures/".$name_temp_folder);

		} else {
			$arr_error[] = 'fiasco';
		}

		//select adverts user
		$arr = selectUserAdverts($conn);
		$answerServer['advertsUser'] = $arr;

		$sampleTopGoods = selectTopGoods($conn);
		$arr_error['Get top goods'] = $sampleTopGoods['error'];
		$answerServer['topGoods'] = $sampleTopGoods['topGoods'];

		if (in_array('fiasco', $arr_error)) {
			$answerServer['status'] = 'fiasco';
		} else {
			$answerServer['status'] = 'success';
			$answerServer['action'] = $_POST['action'];
			echo json_encode($answerServer);
		}
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

		$arr_error = [];
		$answerServer = [];
		[$name_temp_table, $name_temp_folder] = getTempData();

		function getId($conn) {
			$request = "SELECT id, article FROM product";
		
			if ( $response = mysqli_query($conn, $request) ) {
				$arr_error['Number rows'] = 'success';
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
			} else {
				$arr_error['Number rows'] = 'fiasco';
			}

			mysqli_free_result($response);
		}

		// Формируем код товара на основе id таблиц бд
    	if ( strlen($id_subcategory) == 1 ) {
			$codeSubcategoryProduct = '0'.$id_subcategory;
		} else {
			$codeSubcategoryProduct = $id_subcategory;
		}

		[$id, $type_query] = getId($conn);
		$article_goods = $id_category.''.$codeSubcategoryProduct.''.$id;

		if ($type_query === 'update') {
			$request = "UPDATE product SET article = '$article_goods', title = '$titleProduct', price = '$priceProduct', description = '$descriptionProduct', state = '$state_goods', stock = '$stock_goods', display = '$display', top = '$topProduct', id_user = ".$_SESSION['id'].", time_display = '$timeDisplayProduct', id_category = '$id_category', id_subcategory = '$id_subcategory' WHERE id = '$id'";
		} else {
			$request = "INSERT INTO product (id, article, title, price, description, state, stock, display, top, id_user, time_display, id_category, id_subcategory) VALUES ('$id', '$article_goods', '$titleProduct', '$priceProduct', '$descriptionProduct', '$state_goods', '$stock_goods', '$display', '$topProduct', ".$_SESSION['id'].", '$timeDisplayProduct', '$id_category', '$id_subcategory')";
		}

		if (mysqli_query($conn, $request)) {
			$arr_error['Insert or update goods'] = 'success';
			//choose all src from temp table
			$query ="SELECT id, src_photo FROM ".$name_temp_table;
			$response = mysqli_query($conn, $query);
		
			while($result = mysqli_fetch_assoc($response)) {
				$nameFile = substr(strrchr($result['src_photo'], '/'), 1);

				if ($nameFile) {
					//переносим изображения товара из временной папки в постоянную
					// rename( $_SERVER["DOCUMENT_ROOT"]."/".$result['src_photo'], $_SERVER["DOCUMENT_ROOT"]."/pictures/icon goods/".$nameFile);
					rename($result['src_photo'], "../pictures/icon goods/".$nameFile);
					//
					$src = "/pictures/icon goods/".$nameFile;

					if ($result['id'] == 1) {
						$photo_sign = 1;
					} else {
						$photo_sign = 0;
					}
					//insert product image data into a permanent table
					$query1 = "INSERT INTO photo_product (article, photo_sign, src) 
							VALUES ('$article_goods', '$photo_sign', '$src')";

					if (!mysqli_query($conn, $query1)) echo 'Код ошибка' .mysqli_errno($conn);

				} else {
					break;
				}
			}
			//remove temp table
			$query = "DROP TABLE ".$name_temp_table;
			$response = mysqli_query($conn, $query);
			//remove temp folder 
			rmdir($_SERVER["DOCUMENT_ROOT"]."/pictures/".$name_temp_folder);

		} else {
			$arr_error['Insert or update goods'] = 'fiasco';
		}

		//select adverts user
		$arr = selectUserAdverts($conn);
		$answerServer['advertsUser'] = $arr;

		if ((bool) $topProduct) {
			$sampleTopGoods = selectTopGoods($conn);
			$arr_error['Get top goods'] = $sampleTopGoods['error'];
			$answerServer['topGoods'] = $sampleTopGoods['topGoods'];
		}

		if ( in_array('fiasco', array_values($arr_error)) ) {
			$answerServer['status'] = 'fiasco';
			print_r($arr_error);
		} else {
			$answerServer['status'] = 'success';
			$answerServer['action'] = $_POST['action'];
			echo json_encode($answerServer);
		}
		/* закрытие соединения */
		mysqli_close($conn);
	}
/*-----end-----*/

	function chooseTempSrc($conn) {
		[$name_temp_table] = getTempData();
		//выбираем все ссылки и передаем в браузер клиенту
		$arr = [];
		$query = "SELECT src_photo FROM ".$name_temp_table;
		$response = mysqli_query($conn, $query);
		
		while ( $result = mysqli_fetch_assoc($response) ) {
			$arr[] = $result['src_photo'];
		}

		return $arr;
	}

	function createTempDirectory() {
		[, $name_temp_folder] = getTempData();
		if (mkdir('../pictures/'.$name_temp_folder)) {
		}
	}

	function appendPhoto($src_photo, $conn, $num_but) {
		[$name_temp_table] = getTempData();
		//Вставляем путь к изображению в image_table
		$query = "UPDATE ".$name_temp_table." SET src_photo = '$src_photo' WHERE id = '$num_but'";

		if (!mysqli_query($conn, $query)) {
			echo "Error: Image not added to table". mysqli_error($conn);
		}
	}

	function checkExistTempTable($conn) {
		[$name_temp_table] = getTempData();
		//проверяю существование таблицы?
		$query = "SHOW TABLES LIKE '$name_temp_table'";
		$response = mysqli_query($conn, $query);
		$num_row = mysqli_num_rows($response);
		return $num_row;
	}

	function removeTempData($conn) {
		[$name_temp_table, $name_temp_folder] = getTempData();
		$arr_error = [];

		if ($_POST['status'] == 'newAdvert') {
			if ( checkExistTempTable($conn)) {
				$request = "SELECT src_photo FROM ".$name_temp_table;
				$answer = mysqli_query($conn, $request);

				while ($result = mysqli_fetch_assoc($answer)) {
					$path_photo = $result['src_photo'];
					if ($path_photo) {
						$query = "UPDATE ".$name_temp_table." SET src_photo = '' WHERE src_photo ='$path_photo'";
						$response = mysqli_query($conn, $query);
						unlink($path_photo);
					}
				}

				$array = chooseTempSrc($conn);
				$query = "DROP TABLE ".$name_temp_table;
				$response = mysqli_query($conn, $query);

				rmdir($_SERVER["DOCUMENT_ROOT"]."/pictures/".$name_temp_folder);

				echo json_encode($array);
			}
		} else {
			$article = $_POST['article'];
			$query = "SELECT id, src_photo FROM ".$name_temp_table;

			if ( $response = mysqli_query($conn, $query) ) {
				$arr_error['Get id and src file'] = 'success';

				while($result = mysqli_fetch_assoc($response)) {
					$nameFile = substr(strrchr($result['src_photo'], '/'), 1);
					$path_photo = $result['src_photo'];

					if ($nameFile) {
						//переносим изображения товара из временной папки в постоянную
						if (!rename($result['src_photo'], "../pictures/icon goods/".$nameFile)) {
							$arr_error['Move file'] = 'false';
						}
						//
						$src = "/pictures/icon goods/".$nameFile;

						if ($result['id'] == 1) {
							$photo_sign = 1;
						} else {
							$photo_sign = 0;
						}
						
						$query1 = "INSERT INTO photo_product (article, photo_sign, src) 
								VALUES ('$article', '$photo_sign', '$src')";
						mysqli_query($conn, $query1);

						$query = "UPDATE ".$name_temp_table." SET src_photo = '' WHERE src_photo ='$path_photo'";
						mysqli_query($conn, $query);

					} else {
						break;
					}
				}
				$array = chooseTempSrc($conn);
				//remove temp table
				$query = "DROP TABLE ".$name_temp_table;
				$response = mysqli_query($conn, $query);
				//remove temp folder 
				rmdir($_SERVER["DOCUMENT_ROOT"]."/pictures/".$name_temp_folder);
				// echo var_export($arr_error);
				echo json_encode($array);
			} else {
				$arr_error['Get id and src file'] = 'fiasco';
			}
		}
	}

	function deletePhoto($conn) {
		[$name_temp_table, $name_temp_folder] = getTempData();
		$num_but = $_POST['numBut']; //get from advert.js

		$query = "SELECT src_photo FROM ".$name_temp_table." WHERE id='$num_but'";
		$response = mysqli_query($conn, $query);
		$result = mysqli_fetch_assoc($response);
		$path_file = $result['src_photo'];

		$query = "UPDATE ".$name_temp_table." SET src_photo = '' WHERE id='$num_but'";
		$response = mysqli_query($conn, $query);

		unlink($path_file);

		echo json_encode( chooseTempSrc($conn) );
	}

	function addPhoto($conn) {
		[$name_temp_table, $name_temp_folder] = getTempData();
		$num_but = $_POST['numBut']; //get from new advert.js

	   if ( !checkExistTempTable($conn) ) {//check for existence of temporary table
	    	//if table does not exists
	    	//1 create table
	    	$query = "CREATE TABLE ".$name_temp_table." (
				id TINYINT PRIMARY KEY AUTO_INCREMENT,
				src_photo VARCHAR(50) NUll )";

			if ( mysqli_query($conn, $query) ){
				
				for ($i = 1; $i <= 8; $i++) {
					$query = "INSERT INTO ".$name_temp_table."(src_photo) VALUES ('')";
					$response = mysqli_query($conn, $query);
				}
			//2 create folder where will move upload image
			createTempDirectory();

			} else {  
				echo "Table is not created successfully\n";
			}

	   }
	   //move image in folder
		$whence_move = $_FILES['photo']['tmp_name'];
		$where_move = '../pictures/'.$name_temp_folder.'/'.$num_but.'_'.$_FILES['photo']['name'];

		if ( move_uploaded_file($whence_move, $where_move) ) {
			//append image in temp table
			$path_file = $where_move;
			appendPhoto($path_file, $conn, $num_but);
		} else {
			echo "Error move uploaded file\n";
		}

		echo json_encode( chooseTempSrc($conn) );
	}

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
		case 'appendPhoto':
			addPhoto($conn);
			break;
		case 'removePhoto':
			deletePhoto($conn);
			break;
		case 'removeTempData':
			removeTempData($conn);
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
		case 'pageReload':
			deleteTempData($conn);
			break;
	}
?>