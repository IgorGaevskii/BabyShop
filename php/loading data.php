<?php
	session_start();
	include 'connection bd.php';

	$article = $_POST['data'];
	$name_temp_table = 'tmp_table_'.$_SESSION['id'];
	$name_temp_folder = 'tmp_folder_'.$_SESSION['id'];

	$arr_error = [];
	$arr_dataGoods = [];
	$answerServer  = [];

	/*get data goods*/
	$query = "SELECT product.id, product.article, product.article, product.title, product.price, product.description, product.state, product.stock, product.time_display, product.top, photo_product.src 
	FROM product JOIN photo_product ON photo_product.article = product.article
	WHERE product.article = '$article'";

	if ($response = mysqli_query($conn, $query)) {
		$arr_error['Get data goods'] = 'success';
		
		/* извлечение ассоциативного массива */
		while ($result = mysqli_fetch_assoc($response)) {
			$arr_dataGoods['id_goods'] = $result['id'];
			$arr_dataGoods['article'] = $result['article'];
			$arr_dataGoods['title'] = $result['title'];
			$arr_dataGoods['price'] = $result['price'];
			$arr_dataGoods['description'] = $result['description'];
			$arr_dataGoods['state_goods'] = $result['state'];
			$arr_dataGoods['stock_goods'] = $result['stock'];
			$arr_dataGoods['src'][] = $result['src'];
			$arr_dataGoods['time_display'] = $result['time_display'];
			$arr_dataGoods['top'] = $result['top'];
		}

		// print_r($arr_dataGoods);

		$request = "CREATE TABLE ".$name_temp_table." (
			id TINYINT PRIMARY KEY AUTO_INCREMENT,
			src_photo VARCHAR(50) NUll
		)";

		if ( mysqli_query($conn, $request) ) {
			$arr_error['Create temp table'] = 'success';
			/*Create temp folder for save photo*/
			if ( mkdir('../pictures/'.$name_temp_folder) ) {
				$arr_error['Create temp folder'] = 'success';

				for ($i = 0; $i <= 7; $i++) {

					if ( $i + 1 <= count($arr_dataGoods['src']) ) {
						$src = $arr_dataGoods['src'][$i];
						$name_file = substr(strrchr($src, "/"), 1);
						$new_src = "../pictures/".$name_temp_folder."/".$name_file;
						$query = "INSERT INTO ".$name_temp_table."(src_photo) VALUES ('$new_src')";
						
						if ( rename("..".$src, $new_src) ) {
							mysqli_query($conn, "DELETE FROM photo_product WHERE src = '$src'");	
						} else {
							$arr_error['Moving product icon'] = 'fiasco';
						}
						$arr_dataGoods['src'][$i] = $new_src;
					} else {
						$query = "INSERT INTO ".$name_temp_table."(src_photo) VALUES ('')";
					}
					$response = mysqli_query($conn, $query);
				}
			} else {
				$arr_error['Create temp folder'] = 'fiasco';
			}
		} else {
			$arr_error['Create temp table'] = 'fiasco';
		}

	} else {
		$arr_error['Get data goods'] = 'fiasco';
	}
	// mysqli_free_result($response);

	if ( in_array('fiasco', array_values($arr_error) ) ) {
		$answerServer['status'] = 'fiasco';
		$answerServer['error'] = $arr_error;
	} else {
		$answerServer['status'] = 'success';
		$answerServer['dataGoods'] = $arr_dataGoods;
	}

	$answerServer['action'] = $_POST['action'];
	echo json_encode($answerServer);//кодируем массив с карточками в jcon;

	/* закрытие соединения */
	mysqli_close($conn);
?>