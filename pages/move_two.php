<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
	<link rel="stylesheet" href="../css/registration.css">
</head>
<body>
	<main class="content">
		<h2 class="header-name">Регистрация - Шаг 2 из 2</h2>
		<div class="wrapper-form">
			<form name="registrationMoveTwo">
				<label class="name-field">Имя</label>
				<input type="text" name="first_name" autocomplete="off" class="field-registration">
				<label class="name-field">Фамилия</label>
				<input type="text" name="surname" autocomplete="off" class="field-registration">
				<label class="name-field">Номер телефона</label>
				<input type="tel" name="phone" autocomplete="off" maxlength="17" class="field-registration">
				<fieldset class="area-сhoose-avatar">
					<legend class="name-field">Зображення для профілю</legend>
					<input type="button"
							class="btn-choose-avatar"
							value="Виберіть файл"
					>
					<input type="file" 
							class="input-file hide"
							name="user-avatar"
					>
					<span>Файл не вибрано</span>
					<div class="extensions">
						<p>Дозволені розширення: jpg, jpeg, png, gif.</p>
					</div>
				</fieldset>
				<?php
					if ( isset($_GET['token']) ) {
						$token = $_GET['token'];
						echo "<input type='text' name='token' value='".$token."' hidden>";
					}
				?>
			</form>
			<div class="vertical_stripe"></div>
			<div class="description"></div>
		</div>
		<button id="but-registration-move-two">Отправить</button>
	</main>

	<section class="modal popup hide">
		<div class="window popup-window">
			<p class="message"></p>
			<button class="but-window">ok</button>
		</div>
	</section>
		
	<script type="module" src="../js/move_two.js"></script>
</body>
</html>