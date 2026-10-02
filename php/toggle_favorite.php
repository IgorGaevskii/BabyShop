<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
include 'connection bd.php';

$uid = (int)$_SESSION['id'];
$arr_articles = isset($_POST['articles']) ? explode(",", $_POST['articles']) : null;

foreach ($arr_articles as $article) {

	// check exists
	$stmt = $conn->prepare("SELECT id FROM user_favorites WHERE id_user = ? AND article = ?");
	$stmt->bind_param("is", $uid, $article);
	$stmt->execute();
	$result = $stmt->get_result();
	$exists = $result && $result->num_rows > 0;
	$stmt->close();

	if ($exists) {
		$stmt = $conn->prepare("DELETE FROM user_favorites WHERE id_user = ? AND article = ?");
		$stmt->bind_param("is", $uid, $article);
		$ok = $stmt->execute();
		$stmt->close();

		if ($ok) {
			$answer['success'] = true;
			$answer['action'] = 'removed';

			$response = $conn->prepare("SELECT display FROM product WHERE article = ?");
			$response->bind_param("s", $article);
			$response->execute();
			$result = $response->get_result();
			[$display] = $result->fetch_row();
			$response->close();
			// echo $display;

			if ($display == 'remove' || $display == 'purchase') {
				$checkStmt = $conn->prepare("SELECT * FROM user_favorites WHERE article = ? LIMIT 1");
				$checkStmt->bind_param("s", $article);
				$checkStmt->execute();
				$checkResult = $checkStmt->get_result();
				$hasOtherFavorites = $checkResult && $checkResult->num_rows > 0;
				$checkStmt->close();

				if (!$hasOtherFavorites) {
					$clearStmt = $conn->prepare("UPDATE product SET article = NULL, title = NULL, price = NULL, description = NULL, state = NULL, stock = NULL, display = NULL, time_display = NULL, top = NULL, id_user = NULL, id_category = NULL, id_subcategory = NULL WHERE article = ?");
					$clearStmt->bind_param("s", $article);
					$clearOk = $clearStmt->execute();
					$clearStmt->close();

					if (!$clearOk) {
						http_response_code(500);
						$answer['success'] = false;
						$answer['error'] = 'db_error_clear_product';
					}

					//Delete photo file
					$question = "SELECT src FROM photo_product WHERE article = '$article'";

					if ( $excerpt = mysqli_query($conn, $question) ) {
						
						while ( $result = mysqli_fetch_assoc($excerpt) ) {
				   		unlink("..".$result['src']);
				   	}
				   } else {
				   	$answer['success'] = false;
				   	$answer['error'] = 'bd_error_get_src';
				   }

			 		$result = mysqli_query($conn, "DELETE FROM photo_product WHERE article = '$article'");

			 		if ($result) {
			 			$answer['action'] = 'removed';
			 			$answer['success'] = true;
			 		} else {
			 			$answer['action'] = 'remove from favorites';
			 			$answer['success'] = false;
			 			$answer['error'] = 'delete icon goods';
			 		}
				}
			}
		} else {
			http_response_code(500);
			$answer['error'] = 'db_error_delete';
		}
	} else {
		$stmt = $conn->prepare("INSERT INTO user_favorites (id_user, article) VALUES (?, ?)");
		$stmt->bind_param("is", $uid, $article);
		$ok = $stmt->execute();
		$stmt->close();

		if ($ok) {
			$answer['success'] = true;
			$answer['action'] = 'added';

			$pstmt = $conn->prepare("SELECT p.title, p.price, ph.src FROM product p LEFT JOIN photo_product ph ON ph.article = p.article AND ph.photo_sign = 1 WHERE p.article = ? LIMIT 1");
			$pstmt->bind_param("s", $article);
			$pstmt->execute();
			$pres = $pstmt->get_result();
			if ($pres && $row = $pres->fetch_assoc()) {
				$answer['product'] = $row;
			}
			$pstmt->close();
		} else {
			http_response_code(500);
			$answer['error'] = 'db_error_insert';
		}
	}
}

echo json_encode($answer);

?>