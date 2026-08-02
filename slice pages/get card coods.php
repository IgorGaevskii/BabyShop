<!-- Card goods -->
<?php
	include 'php/connection bd.php';
	// получаем данные товара
	$article = isset($_GET['article']) ? (int)$_GET['article'] : null;

	if ( !empty($article) ) {
		$query = "SELECT title, price, id_user, state, stock FROM product WHERE article = '$article'";

						if ( $response = mysqli_query($conn, $query) ) {
							$data_goods = mysqli_fetch_row($response);
							// print_r($data_goods);
							[$title, $price, $id_seller, $state, $stock] = $data_goods;
						}
						// Создаём объект с данными о товаре и продавце
						// Из этого объекта в js будем выбирать данные для работы скрипта.
						echo "<script>let obj_data = ".json_encode($data_goods).";</script>";
						
						$arr_photo = [];
						$sql = "SELECT * FROM photo_product WHERE article = '$article'";
						$excerpt = mysqli_query($conn, $sql);

						while ($result = mysqli_fetch_assoc($excerpt)) {
							$arr_photo[] = $result;
						}
					}
				?>
					
				<div class="center-content__grid">
					<div class="grid-column">
						<div class="slider">
							<div class="slider-switch">
								<div class="but-swipe swipe-left">
									<div class="tick__body"></div>
								</div>
								<?php
									$src_photo = array_find($arr_photo, function ($photo) {
    									return $photo['photo_sign'] == 1;
									});
									echo '<img class="main-photo" src="..'.$src_photo['src'].'" alt="photo goods" width="270" height="270">';
									//Добавляем в объект путь к главной картинке товара
									echo "<script>obj_data.src_goods = ".json_encode($src_photo['src']).";</script>";
								?>
								<div class="but-swipe swipe-right">
									<div class="tick__body"></div>
								</div>
							</div>
							<div class="photo-album">
								<?php
									foreach ($arr_photo as $photo) {
										echo '<img src="..'.$photo['src'].'" alt="photo goods" width=45"" height="45">';
									}
								?>
							</div>
						</div>
						<div class="product-description container">
							<div class="container-header">
								<h3>Описание товара</h3>
							</div>
						</div>
					</div>
					<div class="grid-column">
						<section class="column__section container card-goods-data">
							<div class="card-goods-data-wrap">
								<?php
									echo '<span class="code_goods">Код: '.$article.'</span>
											<span class="state_goods">Стан: '.$state.'</span>
											<span class="availability-goods">'.$stock.'</span>';
								?>
							</div>
							<p class="titel-goods"><?php echo $title; ?></p>
							<p class="price-goods">Цена: <strong><?php echo $price; ?> грн</strong></p>
							<?php
								// проверяем, в избранном ли товар у текущего пользователя
								$isFavorite = false;
								if (isset($_SESSION['id'])) {
									$id_currentUser = (int)$_SESSION['id'];
									$articleEsc = mysqli_real_escape_string($conn, $data_goods['article']);
									$q = "SELECT 1 FROM user_favorites WHERE id_user = $id_currentUser AND article = '$articleEsc' LIMIT 1";
									$r = mysqli_query($conn, $q);
									if ($r && mysqli_num_rows($r) > 0) $isFavorite = true;
								}
							?>
							<div class="block-btn">
								<button class="btn-buy">Купить</button>
								<button class="btn-favorite <?php echo $isFavorite ? 'active' : ''; ?>"
										  title="<?php echo $isFavorite ? 'Видалити з обраного' : 'Додати до обраного'; ?>">
									<svg width="16" height="16"
										  viewBox="0 0 24 24"
										  fill="<?php echo $isFavorite ? 'red' : 'none'; ?>"
										  stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
										<path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1 .9-1-.9a5.5 5.5 0 10-7.8 7.8L12 22l8.8-9.6a5.5 5.5 0 000-7.8z"></path>
									</svg>
									<span class="btn-favorite-text">Обране</span>
								</button>
							</div>
						</section>

						<section class="column__section container seller-data">
							<?php
								// Объединенный запрос: выбираем данные пользователя и его город
								$request = "SELECT u.id, u.created, u.user, u.phone, u.src_avatar, u.rating_payment, u.rating_analogy, u.rating_sending, u.rating_dialog, u.rating_user, p.name_city FROM users u LEFT JOIN place_residence p ON u.id = p.id_user WHERE u.id = '$id_seller'";
								
								$response = mysqli_query($conn, $request);
								$answer = mysqli_fetch_row($response);

								[$id_seller, $created, $name_seller, $phone_seller, $src_avatar, $rating_payment, $rating_analogy, $rating_sending, $rating_dialog, $rating_user, $name_city] = $answer;
						                
								// Продолжительность регистрации
								$date_created = new DateTime($created);
								$now = new DateTime();
								$interval = $date_created->diff($now);
								$years = $interval->y;
								$months = $interval->m;

								if ($years == 0) {
									// Только месяцы
									if ($months == 0) {
										$duration = 'менше місяця';
									} else if ($months == 1) {
										$duration = "1 місяць";
									} else if ($months >= 2 || $months <= 4) {
										$duration = "$months місяці";
									} else {
										$duration = "$months місяців";
									}

								} else {
									// Годы и месяцы
									$yearWord = ($years == 1) ? "рік" : (($years >= 2 && $years <= 4) ? "роки" : "років");
									if ($months == 0) {
										$duration = "$years $yearWord";
									} else {
										$monthWord = ($months == 1) ? "місяць" : (($months >= 2 && $months <= 4) ? "місяці" : "місяців");
										$duration = "$years $yearWord і $months $monthWord";
									}
								}

								//Добавляем в объект путь к аватару продавца
								echo "<script>obj_data.src_seller = ".json_encode($src_avatar).";</script>";
							?>
							<h4 class="container-header">Продавец: <strong><?php echo $name_seller; ?></strong></h4>
							<div class="container-content">
								<img src="..<?php echo $src_avatar; ?>" alt="seller avatar" width="110" height="110">
								<div class="information">
									<div class="brief-inform">
										<div class="rating">
											<div class="rating__title">Загальний рейтинг:</div>
											<div class="rating__stars"></div>
											<div class="rating__value">(<?php echo $rating_user; ?>)</div>
										</div>
										<p>На сайті: <strong><?php echo $duration; ?></strong></p>
										<p>Графік роботи: <strong>не вказано</strong></p>
									</div>
									<div class="know-more">
										<button class="btn-details">Докладніше</button>
										<button class="btn-ask">Запитати</button>
										<button class="btn-goods-seller" data-token="goods-seller">Інші товари</button>
									</div>
								</div>
							</div>
						</section>
						
						<section class="column__section container payment-delivery">
							<h4 class="container-header">Оплата та доставка:</h4>
							<ul class="list-payment">Оплата
								<li class="item-payment">Карта ПриватБанка</li>
								<li class="item-payment">Карта МоноБанка</li>
							</ul>
							<ul class="list-delivery">Доставка
								<li class="item-delivery">Новая почта</li>
								<li class="item-delivery">УкрПочта</li>
							</ul>
						</section>
					</div>
				</div>