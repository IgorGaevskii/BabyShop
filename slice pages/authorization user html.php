<?php
session_start();
	if ( empty($_SESSION) ) {
		echo "<section id='authorization'>";
	} else {
		echo "<section id='authorization' style='transform: rotateY(180deg);'>";
	}
?>
	<p class="header">Авторизация</p>
	<form name="authorizationUser">
		<label>Email</label>
		<input 
			class="field-email" 
			type="text" 
			name="email" 
			autocomplete="off"
		>
		<label>Пароль</label>
		<div class="wrap-field-password">
			<input
				class="field-password"
				type="password" 
				name="password" 
				autocomplete="off"
			>
			<div class="eye-switch">
				<img src="../pictures/show password.png" alt="show password" width="18" height="18">
			</div>
		</div>
		
		<button id="but-authorization">Войти</button>
	</form>
	<a href="/pages/forgot_password.html"
		class="forgot-password">
		Забыли пароль?
	</a>
	<a href="/pages/move_one.html"
		class="registration-user">
		Регистрация
	</a>
</section>
<script type="module" src="../js/authorization user.js"></script>