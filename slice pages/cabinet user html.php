<?php
	if ($id_currentUser) {
		echo "<section id='cabinet' style='transform: rotateY(360deg);'>
					<div class='cabinet-header'>
						<p id='user-name' class='cabinet-header__title'>".$_SESSION['user']."</p>
					</div>";
	} else {
		echo "<section id='cabinet'>
					<div class='cabinet-header'>
						<p id='user-name' class='cabinet-header__title'></p>
					</div>";
	}
?>
	<div class="number-messages hide"></div>
	<ul id="cabinet-menu">
		<li data-token='new_advert'>Нове оголошення</li>
		<li data-token='user_advert'>Мої оголошення</li>
		<li data-token='user-trading'>Моя торгівля</li>
		<li data-token='chat'>Повідомлення</li>
		<li data-token='favorites'>Избранное</li>
		<li>Баланс</li>
		<li>Настройки</li>
	</ul>
	<button id="but-out-cabinet">Выход</button>
</section>
<script type="module" src="../js/cabinet user.js"></script>