<?php
	date_default_timezone_set('UTC'); // Установите нужный часовой пояс
	include 'connection bd.php';

	// это время 24 часа назад в формате MySQL DATETIME
	$cutoff_time = date('Y-m-d H:i:s', strtotime('-24 hours'));

	// Подготовленное выражение для безопасного выполнения
	$stmt = $conn->prepare("DELETE FROM users WHERE confirmed = 0 AND created < ?");
	$stmt->bind_param("s", $cutoff_time); // "s" означает, что параметр - строка (string)

	$stmt->execute();

	$stmt->close();
?>