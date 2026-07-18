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
		<!--Здесь разположенны карточки проданных товаров-->
		<?php
			if (isset($_SESSION['id'])) {
				$uid = (int)$_SESSION['id'];
				// Объединяем user_favorites + product + photo_product (не фильтруем по p.display)
				$stmt = $conn->prepare("SELECT uf.article, p.title, p.price, ph.src, uf.created_at 
					FROM user_favorites uf 
					LEFT JOIN product p ON p.article = uf.article
					LEFT JOIN photo_product ph ON ph.article = p.article AND ph.photo_sign = 1
					WHERE uf.id_user = ? ORDER BY uf.created_at DESC");
				$stmt->bind_param('i', $uid);
				$stmt->execute();
				$res = $stmt->get_result();
				while ($row = $res->fetch_assoc()) {
					$article = htmlspecialchars($row['article'], ENT_QUOTES);
					$title = htmlspecialchars($row['title'] ?? 'Товар удален', ENT_QUOTES);
					$price = htmlspecialchars($row['price'] ?? '', ENT_QUOTES);
					$src = $row['src'] ? htmlspecialchars($row['src'], ENT_QUOTES) : '/pictures/user avatars/empty avatar.jpg';
					echo "<li class='item-favorites card_ad' data-article='".$article."'>
								<input type='checkbox'>
								<div class='card-favorite'>
									<img src='..".$src."' alt='фото' width='90' height='90'>
									<ul class='card-data'>
										<li><b>".$title."</b></li>
										<li class='article'>Арт: ".$article."</li>
										<li>Цена: ".$price." гр</li>
									</ul>
								</div>
							</li>";
					/*echo '<li class="favorite-item" data-article="'.$art.'">';
					echo '<div class="card">';
					echo '<img src="'.$src.'" width="90" height="90" alt="">';
					echo '<ul class="card-data">';
					echo '<li><b>'.$title.'</b></li>';
					echo '<li class="article">Арт: '.$art.'</li>';
					echo '<li>Цена: '.$price.' грн</li>';
					echo '</ul>';
					echo '<div class="card-actions">';
					echo '<button class="btn-favorite active" data-article="'.$art.'" title="Убрать из избранного">♥</button>';
					echo '<button class="but_delete_trading remove-favorite" data-article="'.$art.'" title="Удалить"><img src="../pictures/bin.png" width="20" height="20" alt="Удалить"></button>';
					echo '</div>';
					echo '</div>';
					echo '</li>';*/
				}
				$stmt->close();
			} /*else {
				echo '<li>Пожалуйста, авторизуйтесь чтобы просматривать избранное.</li>';
			}*/
		?>
	</ul>
</section>