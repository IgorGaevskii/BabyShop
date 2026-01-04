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
			<div id="left">
				<?php
					include('../slice pages/menu.php');
				?>
			</div>

			<section class="content main-content">
				<!-- Card goods -->
				<?php
					$codeNumber = $_GET['codeNumber'];

					if ( !empty($codeNumber) ) {
						include 'php/connection bd.php';

						$query = "SELECT * FROM product WHERE article = '$codeNumber'";

						if ( $response = mysqli_query($conn, $query) ) {
							$data_goods = mysqli_fetch_assoc($response);
							$id_seller = $data_goods['id_user'];//id seller
						}
						
						echo "<script>let data_goods = ".json_encode($data_goods).";</script>";
						
						$arr_photo = [];
						$sql = "SELECT * FROM photo_product WHERE article = '$codeNumber'";
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
								<!-- <button class="dut-swipe swipe-left">left</button> -->
								<?php
									$src_photo = array_find($arr_photo, function ($photo) {
    									return $photo['photo_sign'] == 1;
									});
									echo '<img class="main-photo" src="..'.$src_photo['src'].'" alt="photo goods" width="270" height="270">';
								?>
								<div class="but-swipe swipe-right">
									<div class="tick__body"></div>
								</div>
								<!-- <button class="dut-swipe swipe-right">right</button> -->
							</div>
							<div class="photo-album">
								<?php
									foreach ($arr_photo as $photo) {
										echo '<img src="..'.$photo['src'].'" alt="photo goods" width=45"" height="45">';
									}
								?>
							</div>
						</div>
						<div class="product-description box">
							<div class="box-header">
								<h3>Описание товара</h3>
							</div>
						</div>
					</div>
					<div class="grid-column">
						<section class="column__section box card-goods-data">
							<div class="card-goods-data-wrap">
								<?php
									echo '<span class="code_goods">Код: '.$data_goods['article'].'</span>
											<span class="state_goods">Стан: '.$data_goods['state'].'</span>
											<span class="availability-goods">'.$data_goods['stock'].'</span>';
								?>
							</div>
							<?php
								echo '<p class="titel-goods">'.$data_goods['title'].'</p>
									   <p class="price-goods">Цена: <strong>'.$data_goods['price'].' грн</strong></p>
									   <button class="card-goods-data-btn" data-id-seller="'.$id_seller.'">Купить</button>
										<button class="write-message" data-id-seller="'.$id_seller.'">Запитати</button>';
							?>
						</section>
						<section class="column__section box seller-data">
							<div class="box-header">
								<div class="box-header__title rating">
									<div class="rating__title">
										<?php
										$request = "SELECT id, user, src_avatar, rating_payment, rating_analogy, rating_sending, rating_dialog, rating_user FROM users WHERE id = '$id_seller'";
										$response = mysqli_query($conn, $request);
										$answer = mysqli_fetch_assoc($response);
										$user_name = $answer['user'];
										$src_avatar = $answer['src_avatar'];
										$data_partner = json_encode($answer);
										echo "<h4>Продавец: <strong>$user_name</strong></h4>
												<script>let data_partner = $data_partner;</script>";
										?>
									</div>
									<div class="rating__stars"></div>
									<div class="rating__value">(
										<?php
											echo $answer['rating_user'];
										?>
									)</div>
								</div>
								<div class="box-header__tick tick">
									<div class="tick__body"></div>
								</div>
							</div>
							<div class="detailed_information">
								<?php
								echo '<img src="..'.$src_avatar.'" alt="photo user" class="seller_avatar" data-id-seller="'.$id_seller.'" width="110" height="110">';
								?>
								<div class="detailed_information_body">
									<p class="seller_city">Місто: <strong>Дніпро</strong></p>
									<p>На сайте: <strong> 1 рік і 10 мясяців</strong></p>
									<p class="seller_phone">Телефон продовца: <strong>Показать</strong></p>
									<p>Графік роботи:</p>
									<p>Вопрос продавцу: <strong>Задать</strong></p>
								</div>
							</div>
						</section>
						<section class="column__section box seller-rating">
							<div class="box-header">
								<h4>Рейтинг продавца:</h4>
								<div class="box-header__tick tick">
									<div class="tick__body"></div>
								</div>
							</div>
							<ul class="seller-rating-list">
								<li class="seller-rating-list__item rating">
									<div class="rating__title">
										Загальний рейтинг продавця
									</div>
									<div class="rating__stars">
										<?php
											echo "<div class='rating__active' style='width:".$answer['rating_user'] / 0.05."%'></div>"
										?>
									</div>
									<div class="rating__value">
										<?php
											echo $answer['rating_user'];
										?>
									</div>
								</li>
								<li class="seller-rating-list__item rating">
									<div class="rating__title">
										Відповідність товару опису
									</div>
									<div class="rating__stars">
										<?php
											echo "<div class='rating__active' style='width:".$answer['rating_analogy'] / 0.05."%'></div>"
										?>
									</div>
									<div class="rating__value">
										<?php
											echo $answer['rating_analogy'];
										?>
									</div>
								</li>
								<li class="seller-rating-list__item rating">
									<div class="rating__title">
										Швидкість відправлення товару
									</div>
									<div class="rating__stars">
										<?php
											echo "<div class='rating__active' style='width:".$answer['rating_sending'] / 0.05."%'></div>"
										?>
									</div>
									<div class="rating__value">
										<?php
											echo $answer['rating_sending'];
										?>
									</div>
								</li>
								<li class="seller-rating-list__item rating">
									<div class="rating__title">
										Спілкування продавця з покупцем
									</div>
									<div class="rating__stars">
										<?php
											echo "<div class='rating__active' style='width:".$answer['rating_dialog'] / 0.05."%'></div>"
										?>
									</div>
									<div class="rating__value">
										<?php
											echo $answer['rating_dialog'];
										?>
									</div>
								</li>
							</ul>
						</section>
						<section class="column__section box payment-delivery">
							<div class="box-header">
								<h4>Оплата та доставка:</h4>
								<div class="box-header__tick tick">
									<div class="but-wrapper">
										<div class="tick__body"></div>
									</div>
								</div>
							</div>
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
				<div class="header-box">
					<p class="header-name">Нове оголошення</p>
					<div class="header-cross" data-status-window="newAdvert">
						<div class="cross"></div>
					</div>
				</div>
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
							<button class="but_add_photo" data-action="appendPhoto" data-numberButton="1">1</batton>
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
				<div class="header-box">
					<p class="header-name">Мої оголошення</p>
					<div class="header-cross">
						<div class="cross"></div>
					</div>
				</div>
				<ul class="tabs">
					<li class="tabs-item active" data-item="0">Активні</li>
					<li class="tabs-item" data-item="1">Неактивні</li>
				</ul>
				<div class="content_tab">
					<div class="hat_ads active_ads">
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
					<div class="hat_ads inactive_ads">
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
				<div class="header-box">
					<p class="header-name">Моя торгівля</p>
					<div class="header-cross">
						<div class="cross"></div>
					</div>
				</div>
				<ul class="tabs">
			      <li class="tabs-item active" data-item="0">Продажи</li>
			      <li class="tabs-item" data-item="1">Покупки</li>
			   </ul>
				<div class="content_tab">
					<div class="hat_ads my-sales">
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
					<div class="hat_ads my-purchases">
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
	         <div class="header-box">
	            <p class="header-name">Листування</p>
	            <div class="header-cross">
	               <div class="cross"></div>
	            </div>
	         </div>
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