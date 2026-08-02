<?php
session_start();

	function selectFavoriteGoodsUser($conn) {
		$tmp_arr = [];
	// Объединяем user_favorites + product + photo_product (не фильтруем по p.display)
		$stmt = $conn->prepare("SELECT uf.article, p.title, p.price, p.id_user, u.src_avatar, ph.src, uf.created_at 
			FROM user_favorites uf 
			LEFT JOIN product p ON p.article = uf.article
			LEFT JOIN users u ON u.id = p.id_user
			LEFT JOIN photo_product ph ON ph.article = p.article AND ph.photo_sign = 1
			WHERE uf.id_user = ? ORDER BY uf.created_at DESC");
		$stmt->bind_param('i', $_SESSION['id']);
		$stmt->execute();
		$res = $stmt->get_result();

		while ($row = $res->fetch_assoc()) {
		    $tmp_arr[] = $row;
		}

		return $tmp_arr;
	}
?>