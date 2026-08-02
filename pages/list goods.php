<?php
	require_once '../php/init.php';

	// If this page was reached via POST (from index.php navigation),
	// use Post/Redirect/Get to convert it into a GET request with query params.
	// This prevents the browser "Confirm form resubmission" dialog when the
	// user navigates back/forward.
	if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id_category']) && isset($_POST['id_subcategory'])) {
		// Cast to int to avoid injection in URL and keep behavior predictable
		$id_category = (int) $_POST['id_category'];
		$id_subcategory = (int) $_POST['id_subcategory'];

		$redirectUrl = '/pages/list goods.php?id_category=' . $id_category . '&id_subcategory=' . $id_subcategory;
		header('Location: ' . $redirectUrl);
		exit;
	}
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Document</title>
		<link rel="stylesheet" href="/css/list goods.css">
		<link rel="stylesheet" href="../css/content.css">
		<link rel="stylesheet" href="/css/tick.css">
		<link rel="stylesheet" href="/css/menu.css">
		<link rel="stylesheet" href="/css/authorization user.css">
		<script type="module" src="../js/list goods.js" defer></script>
		<script type="module" src="../js/new advert.js" defer></script>
		<script type="module" src="../js/user advert.js" defer></script>
	</head>
	<body>
		<?php
			include('../slice pages/header.php');
		?>
		<main>
			<?php
				include('../slice pages/menu.php');
			?>

			<!--start modal window list card-->
			<section class="content list-card main-content">
				<!--Здесь расположены карточки товаров-->
				<?php
					// Accept id_subcategory and id_category via POST (from index.php redirect) or GET (from URL or history)
					$id_category = null;
					$id_subcategory = null;

					if (!empty($_POST['id_category']) && !empty($_POST['id_subcategory'])) {
						$id_category = (int) $_POST['id_category'];
						$id_subcategory = (int) $_POST['id_subcategory'];
					} elseif (!empty($_GET['id_category']) && !empty($_GET['id_subcategory'])) {
						$id_category = (int) $_GET['id_category'];
						$id_subcategory = (int) $_GET['id_subcategory'];
					}

					if ($id_category && $id_subcategory) {
						$query = "SELECT product.article, product.title, product.price, photo_product.src 
						FROM product JOIN photo_product ON photo_product.article = product.article
						WHERE product.id_category = $id_category AND product.id_subcategory = $id_subcategory AND product.display = 'show' AND photo_product.photo_sign = 1";
					} else {
						// No category/subcategory specified — show top visible products as a safe default
						$query = "SELECT product.article, product.title, product.price, photo_product.src 
						FROM product JOIN photo_product ON photo_product.article = product.article
						WHERE product.display = 'show' AND photo_product.photo_sign = 1 LIMIT 40";
					}

					$response = mysqli_query($conn, $query);
					/* извлечение ассоциативного массива */
					while ($result = mysqli_fetch_array($response)) {
						[$article, $title, $price, $src] = $result;

						echo <<<HTML
							<div class="card">
								<img src="$src" width="230" height="230">
								<p class="card__name">$title</p>
								<p class="card__code">Код товара: <span class="code-number">$article</span></p>
								<p class="card__price">Цена: $price гр</p>
							</div>
						HTML;
					}
					/* удаление выборки */
					mysqli_free_result($response);
				?>
			</section>
			<!--end modal window list card-->

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
							<img src="/pictures/cross screen computer.png" alt="photo" width="30" height="30">
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
							<img src="/pictures/tick screen computer.png" alt="photo" width="30" height="30">
						</button>
						<button class="but_edit_advert" data-action='edit' title="Редагувати">
							<img src="/pictures/pen screen computer.png" alt="photo" width="30" height="30">
						</button>
						<button class="but_delete_advert" data-action='delete' title="Видалити">
							<img src="/pictures/bin.png" alt="photo" width="25" height="25">
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
							<img src="/pictures/bin.png" alt="photo" width="25" height="25">
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
							<img src="/pictures/bin.png" alt="photo" width="25" height="25">
						</button>
					</div>
					<ul class="purchased-goods-list box">
						<!--Здесь разположенны карточки купленных товаров--> 
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
						<!--here data goods-->
					</div>
				   <ul class="messages">
				   	<!--here messages-->
				   </ul>
				   <form name="ask_question">
				      <textarea class="typing-area" name="typing_area" placeholder="Напишіть запитання"></textarea>
				      <button class="but-send-question">
				      	<img src="/pictures/icon-send-question.png" alt="icon send message" width="20" height="20">
				      </button>
				   </form>
				</div>
				<!--end modal window ask user-->
			</div>
		</main>
		<?php
			include('../slice pages/footer and modal window.php');
		?>