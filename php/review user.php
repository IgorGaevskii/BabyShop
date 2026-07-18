<?php
session_start();
// include DB connection (may set $conn)
@include 'connection bd.php';

$answerServer = [];
$arr_error = [];

// Basic input validation
$from_whom = isset($_SESSION['id']) ? (int)$_SESSION['id'] : null;
$action = isset($_POST['action']) ? $_POST['action'] : null;
$id_user = isset($_POST['id_review']) ? (int)$_POST['id_review'] : null;
$review = isset($_POST['review-comment']) ? $_POST['review-comment'] : '';
$new_value = [
	isset($_POST['payment']) ? (int)$_POST['payment'] : 0,
	isset($_POST['analogy']) ? (int)$_POST['analogy'] : 0,
	isset($_POST['sending']) ? (int)$_POST['sending'] : 0,
	isset($_POST['dialog']) ? (int)$_POST['dialog'] : 0
];

// Ensure DB connection exists
if (!isset($conn) || !$conn) {
	$answerServer['status'] = 'error';
	$answerServer['error'] = ['db_connection_missing'];
	echo json_encode($answerServer);
	exit;
}

// Update ratings only if we have a target user id
if ($id_user) {
	$replace_value = [0,0,0,0];

	$sql = "SELECT rating_payment, rating_analogy, rating_sending, rating_dialog FROM users WHERE id = ?";
	if ($stmt = $conn->prepare($sql)) {
		$stmt->bind_param('i', $id_user);
		$stmt->execute();
		$res = $stmt->get_result();
		$old_value = $res->fetch_row();
		$stmt->close();

		if ($old_value) {
			for ($i = 0; $i < count($new_value); $i++) {
				$nv = (int)$new_value[$i];
				$ov = isset($old_value[$i]) ? (float)$old_value[$i] : 0;

				if ($nv == 0 && $ov > 0) {
					$replace_value[$i] = $ov;
				} else if ($ov == 0 && $nv > 0) {
					$replace_value[$i] = $nv;
				} else {
					$replace_value[$i] = round((($ov + $nv) / 2), 1);
				}
			}

			$countNonZero = count(array_filter($replace_value, function($v){ return $v > 0; }));
			$rating_user = $countNonZero > 0 ? round(array_sum($replace_value) / $countNonZero, 1) : 0;

			// Update user ratings
			$updateSql = "UPDATE users SET rating_payment = ?, rating_analogy = ?, rating_sending = ?, rating_dialog = ?, rating_user = ? WHERE id = ?";
			if ($ust = $conn->prepare($updateSql)) {
				$ust->bind_param('dddddi', $replace_value[0], $replace_value[1], $replace_value[2], $replace_value[3], $rating_user, $id_user);
				if (!$ust->execute()) {
					$arr_error['Update data rating'] = 'fiasco';
				}
				$ust->close();
			} else {
				$arr_error['Update prepare'] = 'fiasco';
			}
		}
	} else {
		$arr_error['Get old value rating'] = 'fiasco';
	}
}

// Ensure reviews table exists (safe to run)
$ask = "CREATE TABLE IF NOT EXISTS reviews (
	from_whom VARCHAR(10),
	about_whom VARCHAR(10),
	text_review TEXT
)";
$conn->query($ask);

// Insert review using prepared statement
if ($id_user) {
	$ins = $conn->prepare("INSERT INTO reviews (from_whom, about_whom, text_review) VALUES (?, ?, ?)");
	if ($ins) {
		$from_val = $from_whom !== null ? (string)$from_whom : '';
		$about_val = (string)$id_user;
		$ins->bind_param('sss', $from_val, $about_val, $review);
		if (!$ins->execute()) {
			$arr_error['Insert review'] = 'fiasco';
		}
		$ins->close();
	} else {
		$arr_error['Insert prepare'] = 'fiasco';
	}
}

$answerServer['action'] = $action;
if (in_array('fiasco', array_values($arr_error))) {
	$answerServer['error'] = array_keys($arr_error);
	$answerServer['status'] = 'error';
} else {
	$answerServer['status'] = 'success';
}

echo json_encode($answerServer);

// close connection if available
if (isset($conn) && $conn) $conn->close();
?>