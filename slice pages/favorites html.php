<section class="content favorites hide">
	<div class="content-cross">
		<div class="cross"></div>
	</div>
	<h2 class="content-header">Oбране</h2>
	<div class="control-panel">
		<input type="checkbox">
		<button class="but_delete" data-action='remove favorite' title="Видалити">
			<img src="/pictures/bin.png" alt="photo" width="25" height="25">
		</button>
	</div>
	<ul class="list-favorites box">
		<!--Здесь разположенны карточки избранных товаров-->
		<?php
			if (isset($_SESSION['id'])) {
				$id_currentUser = (int)$_SESSION['id'];
				// Объединяем user_favorites + product + photo_product (не фильтруем по p.display)
				$stmt = $conn->prepare("SELECT uf.article, p.title, p.price, ph.src 
					FROM user_favorites uf 
					LEFT JOIN product p ON p.article = uf.article
					LEFT JOIN photo_product ph ON ph.article = p.article AND ph.photo_sign = 1
					WHERE uf.id_user = ? ORDER BY uf.created_at DESC");
				$stmt->bind_param('i', $id_currentUser);
				$stmt->execute();
				$res = $stmt->get_result();
				while ( $row = $res->fetch_row() ) {
					[$article, $title, $price, $src_icon] = $row;
					echo <<<HTML
						<li class='item-favorites card_ad' data-article='$article'>
							<input type='checkbox'>
							<div class='card-favorite'>
								<img src='..$src_icon' alt='фото' width='90' height='90'>
								<ul class='card-data'>
									<li><b>$title</b></li>
									<li class='article'>Арт: $article</li>
									<li>Цена: $price гр</li>
								</ul>
							</div>
						</li>
					HTML;
				}
				$stmt->close();
			}
		?>
	</ul>
</section>