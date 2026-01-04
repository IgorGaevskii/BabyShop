<?php
	session_start();
   include 'connection bd.php';

	$article = $_POST['article'];
	$id_partner = $_POST['id_partner'];

   $answerServer = [];

	 // Определяем кто делает удаление продавец или покупатель
   $query = "SELECT id_user FROM product WHERE article = $article";
   $response = mysqli_query($conn, $query);
   [$id_user] = mysqli_fetch_row($response);

   if ($id_partner == $id_user) {
   	$sql = "UPDATE chat SET buyer_ratio = true WHERE article = $article AND id_seller = $id_partner AND id_buyer = ".$_SESSION['id'];
      $answerServer['buyer_ratio'] = true;
   } else {

      if ($_POST['action'] == 'block user') {
         $sql = "UPDATE chat SET seller_ratio = true WHERE article = $article AND id_seller = ".$_SESSION['id']." AND id_buyer = $id_partner";
         $answerServer['seller_ratio'] = true;
      } else {
         $sql = "UPDATE chat SET seller_ratio = false WHERE article = $article AND id_seller = ".$_SESSION['id']." AND id_buyer = $id_partner";
         $answerServer['seller_ratio'] = false;
      }
   	
   }



   if ( mysqli_query($conn, $sql) ) {
      $answerServer['action'] = $_POST['action'];
      $answerServer['status'] = 'success';
      $answerServer['article'] = $_POST['article'];
      $answerServer['id_partner'] = $_POST['id_partner'];
      echo json_encode($answerServer);
   } else {
      echo 'fiasco';
   }
?>