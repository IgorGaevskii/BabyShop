<?php
// Returns JSON list of goods. If id_subcategory provided, returns goods for that subcategory.
header('Content-Type: application/json; charset=utf-8');

include 'connection bd.php';

$id_subcategory = isset($_GET['id_subcategory']) ? intval($_GET['id_subcategory']) : null;
$id_category = isset($_GET['id_category']) ? intval($_GET['id_category']) : null;

$arr = [];

if ($id_subcategory) {
	$query = "SELECT product.article, product.title, product.price, photo_product.src 
	FROM product JOIN photo_product ON photo_product.article = product.article
	WHERE product.id_category = $id_category AND product.id_subcategory = $id_subcategory AND product.display = 'show' AND photo_product.photo_sign = 1";
} else {
	$query = "SELECT product.article, product.title, product.price, photo_product.src 
	FROM product JOIN photo_product ON photo_product.article = product.article
	WHERE product.top = 1 AND product.display = 'show' AND photo_product.photo_sign = 1";
}

if ($response = mysqli_query($conn, $query)) {
	$arr['error'] = 'success';
	$arr['goods'] = [];
	while ($row = mysqli_fetch_assoc($response)) {
		$arr['goods'][] = $row;
	}
	mysqli_free_result($response);
} else {
	$arr['error'] = 'fiasco';
}

// close connection
mysqli_close($conn);

echo json_encode($arr, JSON_UNESCAPED_UNICODE);

?>