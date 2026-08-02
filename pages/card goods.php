<?php
	require_once '../php/init.php';
?>
<!DOCUMENT>
<html>
	<head>
		<meta charset="utf-8">
		<title>Мой интернет магазин</title>
		<link rel="stylesheet" href="../css/card goods.css">
		<link rel="stylesheet" href="../css/content.css">
		<link rel="stylesheet" href="../css/tick.css">
		<link rel="stylesheet" href="../css/menu.css">
		<link rel="stylesheet" href="../css/authorization user.css">
		<script type="module" src="../js/card goods.js" defer></script>
		<script type="module" src="../js/new advert.js" defer></script>
		<script type="module" src="../js/user advert.js" defer></script>
		<script type="module" src="../js/user trading.js" defer></script>
		<script type="module" src="../js/user chat.js" defer></script>

	</head>
  	<body>
		<?php
			include('../slice pages/header.php');
		?>
		<main>
			<?php
				include('../slice pages/menu.php');
			?>

			<section class="content main-content">
				<!-- Card goods -->
				<?php
					include 'php/connection bd.php';

					$id_currentUser = isset($_SESSION['id']) ? (int)$_SESSION['id'] : null;
					echo "<script>let id_currentUser = ".json_encode($id_currentUser).";</script>";

					// default initializations to avoid undefined variable notices when article is missing
					$article = isset($_GET['article']) ? (int)$_GET['article'] : null;

					if ( !empty($article) ) {
						$query = "SELECT title, price, id_user, state, stock FROM product WHERE article = '$article'";

						if ( $response = mysqli_query($conn, $query) ) {
							$data_goods = mysqli_fetch_assoc($response);
							// print_r($data_goods);
							['title'=>$title, 'price'=>$price, 'id_user'=>$id_seller, 'state'=>$state, 'stock'=>$stock] = $data_goods;
						}
						// Создаём объект с данными о товаре и продавце
						// Из этого объекта в js будем выбирать данные для работы скрипта.
						$data_goods['article'] = $article;
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
									$articleEsc = mysqli_real_escape_string($conn, $article);
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
			</section>

			<!--start modal window new advert-->
			<section class="content new_advert hide">
				<div class="content-cross" data-status-window="newAdvert">
					<div class="cross"></div>
				</div>
				<h2 class="content-header">Нове оголошення</h2>
				<div class="wrapper_form">
					<form name="new_advert">
						<p class="addAdvert_name_field">Категорія товару</p>
						<select class="addAdvert_category category" name="id_category">
							<option value="allCategory">Выберите категорию</option>
						</select>
						<p class="addAdvert_name_field">Подкатегория товара</p>
						<select class="addAdvert_subcategory  category" name="id_subcategory">
							<option value="allSubcategory">Выберите подкатегорию</option>
						</select>
						<p class="addAdvert_name_field">Название товара</p>
						<input type="text" name="name_goods">
						<p class="addAdvert_name_field">Стоимость товара</p>
						<input type="text" name="price_goods">
						<fieldset class="block_append_photo">
							<legend class="addAdvert_name_field">
								Вставте изображения
							</legend>
							<button class="but_add_photo" data-action="appendPhoto" data-numberButton="1">1</button>
							<button class="but_add_photo" data-action="appendPhoto" data-numberButton="2">2</button>
							<button class="but_add_photo" data-action="appendPhoto" data-numberButton="3">3</button>
							<button class="but_add_photo" data-action="appendPhoto" data-numberButton="4">4</button>
							<button class="but_add_photo" data-action="appendPhoto" data-numberButton="5">5</button>
							<button class="but_add_photo" data-action="appendPhoto" data-numberButton="6">6</button>
							<button class="but_add_photo" data-action="appendPhoto" data-numberButton="7">7</button>
							<button class="but_add_photo" data-action="appendPhoto" data-numberButton="8">8</button>
							<input type="file" name="photo_goods" class="hide">
						</fieldset>
						<p class="addAdvert_name_field">Описание товара</p>
						<textarea name="description_goods"></textarea>
						<fieldset>
							<legend class="addAdvert_name_field">
								Стан товару
							</legend>
							<label>
								<input type="radio" name="state_goods" value="Новий" checked>Новий
							</label>
							<label>
								<input type="radio" name="state_goods" value="Б/у">Б/у
							</label>
						</fieldset>
						<fieldset>
							<legend class="addAdvert_name_field">
								Наявність товару
							</legend>
							<label>
								<input type="radio" name="stock_goods" value="В наявності" checked>В наявності
							</label>
							<label>
								<input type="radio" name="stock_goods" value="Під замовлення">Під замовлення
							</label>
						</fieldset>
						<fieldset>
							<legend class="addAdvert_name_field">
								Продолжительность публикации товара
							</legend>
							<label>
								<input type="radio" name="time_display" value="10" checked>10 дней
							</label>
							<label>
								<input type="radio" name="time_display" value="20">20 дней
							</label>
							<label>
								<input type="radio" name="time_display" value="30">30 дней
							</label>
						</fieldset>
						<fieldset>
							<legend class="addAdvert_name_field">
								Добавить в "Топ товаров"?
							</legend>
							<label>
								<input type="radio" name="radio_goods" value= 0 checked>Нет
							</label>
							<label>
								<input type="radio" name="radio_goods" value= 1>Да
							</label>
						</fieldset>
					</form>
					<div class="new_advert_description">
						<p></p>
					</div>
				</div>
				<button id="but_send_advert">Відправити</button>
			</section>
			<!--end modal window new advert-->
					
			<!--start modal window advert user-->
			<section class="content user_advert hide">
				<div class="content-cross">
					<div class="cross"></div>
				</div>
				<h2 class="content-header">Мої оголошення</h2>
				<ul class="tabs">
					<li class="tabs-item active" data-item="0">Активні</li>
					<li class="tabs-item" data-item="1">Неактивні</li>
				</ul>
				<div class="content_tab">
					<div class="control-panel active_ads">
						<input type="checkbox">
						<button class="but_display_advert" data-action='deactivate' title="Деактивувати">
							<img src="../pictures/cross screen computer.png" alt="photo" width="30" height="30">
						</button>
					</div>
					<div class="container_active_ads box">
						<!--Здесь разположенны карточки активных товаров--> 
					</div>
				</div>
				<div class="content_tab hide">
					<div class="control-panel inactive_ads">
						<input type="checkbox">
						<button class="but_display_advert" data-action='activate' title="Активувати">
							<img src="../pictures/tick screen computer.png" alt="photo" width="30" height="30">
						</button>
						<button class="but_edit_advert" data-action='edit' title="Редагувати">
							<img src="../pictures/pen screen computer.png" alt="photo" width="30" height="30">
						</button>
						<button class="but_delete_advert" data-action='delete' title="Видалити">
							<img src="../pictures/bin.png" alt="photo" width="25" height="25">
						</button>
					</div>
					<div class="container_inactive_ads box">
						<!--Здесь разположенны карточки не активных товаров--> 
					</div>
				</div>
			</section>
			<!--end modal window advert user-->

			<!--start modal window user trading-->
			<section class="content user-trading hide">
				<div class="content-cross">
					<div class="cross"></div>
				</div>
				<h2 class="content-header">Моя торгівля</h2>
				<ul class="tabs">
			      <li class="tabs-item active" data-item="0">Продажи</li>
			      <li class="tabs-item" data-item="1">Покупки</li>
			   </ul>
				<div class="content_tab">
					<div class="control-panel my-sales">
						<input type="checkbox">
						<button class="but_delete_trading" data-action='removeSale' title="Видалити">
							<img src="../pictures/bin.png" alt="photo" width="25" height="25">
						</button>
					</div>
					<ul class="sold-goods-list box">
						<!--Здесь разположенны карточки проданных товаров--> 
					</ul>
				</div>
				<div class="content_tab hide">
					<div class="control-panel my-purchases">
						<input type="checkbox">
						<button class="but_delete_trading" data-action='removePurchase' title="Видалити">
							<img src="../pictures/bin.png" alt="photo" width="25" height="25">
						</button>
					</div>
					<ul class="purchased-goods-list box">
						<!--Здесь разположенны карточки активных товаров--> 
					</ul>
				</div>
			</section>
			<!--end modal window user trading-->

			<!--start modal window chat-->
			<section class="content chat hide">
				<div class="content-cross">
					<div class="cross"></div>
				</div>
				<h2 class="content-header">Листування</h2>
	         <div class="core">
	            <div class="core-left">
	               <ul class="list-goods">
							<!--Здесь разположенны карточки товаров-->
	               </ul>
	               <ul class="list-partners">
	               	<!--Здесь разположенны карточки собеседников-->
	               </ul>
	            </div>
	            <div class="core-right">
	               <div class="heading">
	                  <div class="heading-info-goods"></div>
	                  <div class="heading-info-user"></div>
	               </div>
	               <div class="messages-screen">
							<ul class="list-messages">
								<!--here messages-->
							</ul>
						</div>
	               <form name="send_message">
							<textarea class="typing-area" name="typing_area" placeholder="Напишіть повідомлення" disabled></textarea>
					      <button class="but-send-message">
					      	<img src="/pictures/icon-send-question.png" alt="icon send message" width="24" height="24">
					      </button>
					   </form>
	            </div>
	         </div>
			</section>
			<!--end modal window chat-->

			<!--start modal window favorites-->
			<?php
				include('../slice pages/favorites html.php');
			?>
			<!--end modal window favorites-->

			<!--start window other goods seller-->
			<section class="content goods-seller hide">
				<div class="content-cross">
					<div class="cross"></div>
				</div>
				<h2 class="content-header">Інші товари продавця</h2>
				<div class="list-goods-seller">
					<?php
						$query = "SELECT p.article, p.title, p.price, ph.src FROM product as p
									JOIN photo_product as ph ON ph.article = p.article
									WHERE p.id_user = $id_seller AND p.display = 'show'";
						$response = mysqli_query($conn, $query);
						/* извлечение ассоциативного массива */
						while ($result = mysqli_fetch_array($response)) {
							[$gs_article, $gs_title, $gs_price, $gs_src_icon] = $result;

							echo <<<HTML
								<div class="card">
									<img src="$gs_src_icon" width="230" height="230">
									<p class="card__name">$gs_title</p>
									<p class="card__code">Код товара: <span class="code-number">$gs_article</span></p>
									<p class="card__price">Цена: $gs_price гр</p>
								</div>
							HTML;
						}
					?>
				</div>
			</section>
			<!--end window other goods seller-->

			<div id="right">
				<div class="right-wrap">
					<?php
						include("../slice pages/authorization user html.php");
						include("../slice pages/cabinet user html.php");
					?>
				</div>
				<!--start window ask user-->
					<div class="ask">
						<div class="ask-header">
							<div class="header-box-cross">
								<div class="cross"></div>
							</div>
							<!--here data header-->
						</div>
					   <ul class="messages">
					   	<!--here messages-->
					   </ul>
					   <form name="ask_question">
					      <textarea class="typing-area" name="typing_area" placeholder="Напишіть запитання"></textarea>
					      <button class="but-send-question">
					      	<img src="../pictures/icon-send-question.png" alt="icon send message" width="20" height="20">
					      </button>
					   </form>
					</div>
					<!--end modal window ask user-->
			</div>
		</main>

<?php
	include('../slice pages/footer and modal window.php');
?>