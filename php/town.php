<?php
	$arr = [];

	include 'connection bd.php';

	$query = "SELECT * FROM list_cities";
	$response = mysqli_query($conn, $query);
	while ($result = mysqli_fetch_assoc($response)) {
		$arr[] = $result;
	}

	echo json_encode($arr);
?>