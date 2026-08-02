		<?php
		// Ensure variables used in this fragment are defined to avoid undefined variable notices
		if (!isset($src_avatar) || !$src_avatar) $src_avatar = '/pictures/user avatars/empty avatar.jpg';
		if (!isset($name_seller)) $name_seller = '';
		if (!isset($duration)) $duration = '';
		if (!isset($name_city)) $name_city = '';
		if (!isset($phone_seller)) $phone_seller = '';
		$rating_user = isset($rating_user) ? (float)$rating_user : 0.0;
		$rating_payment = isset($rating_payment) ? (float)$rating_payment : 0.0;
		$rating_sending = isset($rating_sending) ? (float)$rating_sending : 0.0;
		$rating_analogy = isset($rating_analogy) ? (float)$rating_analogy : 0.0;
		$rating_dialog = isset($rating_dialog) ? (float)$rating_dialog : 0.0;
		if (!isset($id_seller)) $id_seller = null;
		?>
		<footer></footer>

		<section class="popup hide">
			<div class="popup-window">
				<p class="message"></p>
				<button class="but-window">ok</button>
			</div>
		</section>

		<!--start modal window review about seller user-->
		<section class="modal review-about-seller hide">
			<div class="modal-window">
				<div class="modal-window-cross">
					<div class="cross"></div>
				</div>
				<h2 class="modal-window-header">Відгук</h2>
				<form class="modal-window__content form" name="review user">
					<ul class="form-rating-list">
						<li class="form-rating-list__item simple-rating">
							<div class="simple-rating-title">
								Відповідність товару опису
							</div>
							<div class="simple-rating-stars">
								<div class="list-points">
									<input id="cpd-point-5" type="radio" class="point cpd" name="analogy" value="5">
									<label for="cpd-point-5" class="point-label"></label>
									<input id="cpd-point-4" type="radio" class="point cpd" name="analogy" value="4">
									<label for="cpd-point-4" class="point-label"></label>
									<input id="cpd-point-3" type="radio" class="point cpd" name="analogy" value="3">
									<label for="cpd-point-3" class="point-label"></label>
									<input id="cpd-point-2" type="radio" class="point cpd" name="analogy" value="2">
									<label for="cpd-point-2" class="point-label"></label>
									<input id="cpd-point-1" type="radio" class="point cpd" name="analogy" value="1">
									<label for="cpd-point-1" class="point-label"></label>
								</div>
							</div>
							<div class="rating__value">0</div>
						</li>
						<li class="form-rating-list__item simple-rating">
							<div class="simple-rating-title">
								Швидкість відправлення товару
							</div>
							<div class="simple-rating-stars">
								<div class="list-points">
									<input id="ssp-point-5" type="radio" class="point" name="sending" value="5">
									<label for="ssp-point-5" class="point-label"></label>
									<input id="ssp-point-4" type="radio" class="point" name="sending" value="4">
									<label for="ssp-point-4" class="point-label"></label>
									<input id="ssp-point-3" type="radio" class="point" name="sending" value="3">
									<label for="ssp-point-3" class="point-label"></label>
									<input id="ssp-point-2" type="radio" class="point" name="sending" value="2">
									<label for="ssp-point-2" class="point-label"></label>
									<input id="ssp-point-1" type="radio" class="point" name="sending" value="1">
									<label for="ssp-point-1" class="point-label"></label>
								</div>
							</div>
							<div class="rating__value">0</div>
						</li>
						<li class="form-rating-list__item simple-rating">
							<div class="simple-rating-title">
								Спілкування продавця з покупцем
							</div>
							<div class="simple-rating-stars">
								<div class="list-points">
									<input id="csb-point-5" type="radio" class="point" name="dialog" value="5">
									<label for="csb-point-5" class="point-label"></label>
									<input id="csb-point-4" type="radio" class="point" name="dialog" value="4">
									<label for="csb-point-4" class="point-label"></label>
									<input id="csb-point-3" type="radio" class="point" name="dialog" value="3">
									<label for="csb-point-3" class="point-label"></label>
									<input id="csb-point-2" type="radio" class="point" name="dialog" value="2">
									<label for="csb-point-2" class="point-label"></label>
									<input id="csb-point-1" type="radio" class="point" name="dialog" value="1">
									<label for="csb-point-1" class="point-label"></label>
								</div>
							</div>
							<div class="rating__value">0</div>
						</li>
					</ul>
					<div class="form-rating-comment">Комментарий
						<textarea name="review-comment"></textarea>
					</div>
					<button class="btn-user-review">Відправити</button>
				</form>
			</div>
		</section>
		<!--end modal window review user-->

		<!--start modal window review about buyer user-->
		<section class="modal review-about-buyer hide">
			<div class="modal-window">
				<div class="modal-window-cross">
					<div class="cross"></div>
				</div>
				<h2 class="modal-window-header">Відгук</h2>
				<form class="modal-window__content form" name="review user">
					<ul class="form-rating-list">
						<li class="form-rating-list__item simple-rating">
							<div class="simple-rating-title">
								Швидкість оплати
							</div>
							<div class="simple-rating-stars">
								<div class="list-points">
									<input id="sp-point-5" type="radio" class="point" name="payment" value="5">
									<label for="sp-point-5" class="point-label"></label>
									<input id="sp-point-4" type="radio" class="point" name="payment" value="4">
									<label for="sp-point-4" class="point-label"></label>
									<input id="sp-point-3" type="radio" class="point" name="payment" value="3">
									<label for="sp-point-3" class="point-label"></label>
									<input id="sp-point-2" type="radio" class="point" name="payment" value="2">
									<label for="sp-point-2" class="point-label"></label>
									<input id="sp-point-1" type="radio" class="point" name="payment" value="1">
									<label for="sp-point-1" class="point-label"></label>
								</div>
							</div>
							<div class="rating__value">0</div>
						</li>
						<li class="form-rating-list__item simple-rating">
							<div class="simple-rating-title">
								Спілкування покупця з продавцем
							</div>
							<div class="simple-rating-stars">
								<div class="list-points">
									<input id="cbs-point-5" type="radio" class="point" name="dialog" value="5">
									<label for="cbs-point-5" class="point-label"></label>
									<input id="cbs-point-4" type="radio" class="point" name="dialog" value="4">
									<label for="cbs-point-4" class="point-label"></label>
									<input id="cbs-point-3" type="radio" class="point" name="dialog" value="3">
									<label for="cbs-point-3" class="point-label"></label>
									<input id="cbs-point-2" type="radio" class="point" name="dialog" value="2">
									<label for="cbs-point-2" class="point-label"></label>
									<input id="cbs-point-1" type="radio" class="point" name="dialog" value="1">
									<label for="cbs-point-1" class="point-label"></label>
								</div>
							</div>
							<div class="rating__value">0</div>
						</li>
					</ul>
					<div class="form-rating-comment">Комментарий
						<textarea name="review-comment"></textarea>
					</div>
					<button class="btn-user-review">Відправити</button>
				</form>
			</div>
		</section>
		<!--end modal window review user-->

		<!--start modal window full info user-->
	   <section class="modal full-info-seller hide">
	   	<div class="modal-window">
	   		<div class="modal-window-cross">
	   			<div class="cross"></div>
	   		</div>
				<h2 class="modal-window-header">Інформація про продавця</h2>
			   <div class="modal-window-data">
			   	<img src="..<?php echo $src_avatar; ?>" alt="seller avatar" width="125" height="125" class="modal-window-data-avatar">
				   <ul class="modal-window-data-list">
					   <li class="full-info-seller-name">Продавець: <strong><?php echo $name_seller; ?></strong></li>
					   <li class="full-info-seller-duration">На сайті: <strong><?php echo $duration; ?></strong></li>
					   <li class="full-info-seller-city">Місто: <strong> <?php echo $name_city; ?></strong></li>
					   <li class="full-info-seller-phone">Телефон: <strong><?php echo $phone_seller; ?></strong></li>
					   <li class="work schedule">Графік роботи:</li>
				   </ul>
				</div>
				<ul class="modal-window-rating">Pейтинг продавця
					<li class="seller-rating-list__item rating">
						<div class="rating__title">
							Загальний рейтинг
						</div>
						<div class="rating__stars">
							<?php
								echo "<div class='rating__active' style='width:".$rating_user / 0.05."%'></div>"
							?>
						</div>
						<div class="rating__value">
							<?php
								echo $rating_user;
							?>
						</div>
					</li>
					<li class="seller-rating-list__item rating">
						<div class="rating__title">
							Швидкість оплати
						</div>
						<div class="rating__stars">
							<?php
								echo "<div class='rating__active' style='width:".$rating_payment / 0.05."%'></div>"
							?>
						</div>
						<div class="rating__value">
							<?php
								echo $rating_payment;
							?>
						</div>
					</li>
					<li class="seller-rating-list__item rating">
						<div class="rating__title">
							Швидкість відправлення
						</div>
						<div class="rating__stars">
							<?php
								echo "<div class='rating__active' style='width:".$rating_sending / 0.05."%'></div>"
							?>
						</div>
						<div class="rating__value">
							<?php
								echo $rating_sending;
							?>
						</div>
					</li>
					<li class="seller-rating-list__item rating">
						<div class="rating__title">
							Відповідність опису
						</div>
						<div class="rating__stars">
							<?php
								echo "<div class='rating__active' style='width:".$rating_analogy / 0.05."%'></div>"
							?>
						</div>
						<div class="rating__value">
							<?php
								echo $rating_analogy;
							?>
						</div>
					</li>
					<li class="seller-rating-list__item rating">
						<div class="rating__title">
							Спілкування
						</div>
						<div class="rating__stars">
							<?php
								echo "<div class='rating__active' style='width:".$rating_dialog / 0.05."%'></div>"
							?>
						</div>
						<div class="rating__value">
							<?php
								echo $rating_dialog;
							?>
						</div>
					</li>
				</ul>
				<ul class="modal-window-reviews">Відгуки про продавця
					<?php
						// Only try to load reviews if we have a DB connection and a seller id
						if (isset($conn) && !empty($id_seller)) {
							$sql = "SELECT r.text_review, COALESCE(u.user, 'Гість') as user_name FROM reviews r 
									  LEFT JOIN users u ON CAST(r.from_whom AS UNSIGNED) = u.id 
									  WHERE about_whom = ?";
							if ($stmt = $conn->prepare($sql)) {
								$stmt->bind_param('i', $id_seller);
								$stmt->execute();
								$res = $stmt->get_result();
								if ($res->num_rows > 0) {
									while ($row = $res->fetch_assoc()) {
										$text_review = htmlspecialchars($row['text_review'] ?? '', ENT_QUOTES);
										$author_review = htmlspecialchars($row['user_name'] ?? 'Гість', ENT_QUOTES);
										echo '<li>';
										echo '<div class="review-author">'.$author_review.'</div>';
										echo '<div class="review-text">'.$text_review.'</div>';
										echo '</li>';
									}
								} else {
									echo '<li>Відгуків немає</li>';
								}
								$stmt->close();
							} else {
								echo '<li>Не вдалося отримати відгуки</li>';
							}
						} else {
							echo '<li>Відгуків немає</li>';
						}
					?>
				</ul>
			</div>
	   </section>


		<!-- site-wide favorites handlers -->
		<script type="module" src="..js/favorites.js"></script>

	</body>
</html>