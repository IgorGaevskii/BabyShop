<?php
session_start();
$arr_previous_articles = explode(",", $_POST['articles']);
$id_user = $_SESSION['id'];
$answerServer = [];

include 'connection bd.php';

$sql = "SELECT article, id_buyer FROM sales WHERE id_seller = $id_user AND seller_sign = 'show'";
$response = mysqli_query($conn, $sql);

$tmp_arr = [];
$i = 0;

while ( [$current_article, $id_buyer] = mysqli_fetch_row($response) ) {
	
	if ( !in_array($current_article, $arr_previous_articles) ) {
		$query = "SELECT product.article, product.title, product.price, photo_product.src FROM product JOIN photo_product ON photo_product.article = product.article WHERE product.article = $current_article AND photo_product.photo_sign = 1";
		$request = mysqli_query($conn, $query);
		$answer = mysqli_fetch_assoc($request);
		$tmp_arr[$i]['data_goods'] = $answer;
		mysqli_free_result($request);

		$ask ="SELECT id, user, phone, src_avatar, rating_user FROM users WHERE id = $id_buyer";
		$refund = mysqli_query($conn, $ask);
		$reply = mysqli_fetch_assoc($refund);
		$tmp_arr[$i]['data_partner'] = $reply;
		$tmp_arr[$i]['data_partner']['status'] = 'buyer';
		mysqli_free_result($refund);
		$i++;
	}
}

if ( count($tmp_arr) ) {
	$answerServer['new_sales'] = $tmp_arr;
	$tmp_arr = [];
}

//проверяю товары для блокирования кнопки "написать сообщение"
$sql = "SELECT * FROM sales WHERE (id_seller = $id_user AND seller_sign = 'show') OR (id_buyer = $id_user AND buyer_sign = 'show')";
$response = mysqli_query($conn, $sql);

$i = 0;
while ( $result = mysqli_fetch_assoc($response) ) {
	['article' => $article, 'id_seller' => $id_seller, 'seller_sign' => $seller_sign, 'id_buyer' => $id_buyer, 'buyer_sign' => $buyer_sign] = $result;

	if ($id_user == $id_seller and $buyer_sign == 'hide') {
		$tmp_arr[$i]['article'] = $article;
		$tmp_arr[$i]['status']= 'видалено покупцем';
	}

	if ($id_user == $id_buyer and $seller_sign == 'hide') {
		$tmp_arr[$i]['article'] = $article;
		$tmp_arr[$i]['status']= 'видалено продавцем';
	}
}

if ( count($tmp_arr) ) {
	$answerServer['new_remove'] = $tmp_arr;
}

$answerServer['action'] = $_POST['action'];
$answerServer['status'] = 'success';
echo json_encode($answerServer);
?>