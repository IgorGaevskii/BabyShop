<?php
    session_start();
    include 'connection bd.php';
    $answerServer = [];
    // echo 'delete_chat';

// --- Блок удаления чата ---
   $article = intval($_POST['article']);

    // Определяем кто делает удаление продавец или покупатель
   $query = "SELECT display, id_user FROM product WHERE article = $article";
   $response = mysqli_query($conn, $query);
   [$display, $id_user] = mysqli_fetch_row($response);

   if ($id_user == $_SESSION['id']) {
      $update = "UPDATE chat SET seller_token = 'delete' WHERE article = $article AND id_seller = ".$_SESSION['id'];
   } else {
      $update = "UPDATE chat SET buyer_token = 'delete' WHERE article = $article AND id_buyer = ".$_SESSION['id'];
   }

   if (mysqli_query($conn, $update)) $answerServer['message'] = 'Чат удалён';

   $sql = "SELECT id_seller, id_buyer FROM chat WHERE article = $article AND (seller_token = 'remove' OR seller_token = 'delete' OR seller_token = 'sold') AND (buyer_token = 'remove' OR buyer_token = 'delete')";
   $res = mysqli_query($conn, $sql);

   while ( [$id_seller, $id_buyer] = mysqli_fetch_row($res) ) {
      // Удаляем все сообщения, связанные с этим чатом
      $delete_messages = "DELETE FROM message WHERE article = $article AND ( (to_whom = $id_seller AND from_whom = $id_buyer) OR (to_whom = $id_buyer AND from_whom = $id_seller) )";
      mysqli_query($conn, $delete_messages);

      // Удаляем сам чат
      $delete_chat = "DELETE FROM chat WHERE article = $article AND id_seller = $id_seller AND id_buyer = $id_buyer";
      mysqli_query($conn, $delete_chat);

      $ask = "SELECT * FROM chat WHERE article = $article AND ( (seller_token = 'show' AND seller_token = 'sold') OR buyer_token = 'show' )";
      $report = mysqli_query($conn, $ask);
      $rows = mysqli_num_rows($report);

      if ($display == "remove" OR $display == 'purchase' AND $rows == 0) {
         $request = "UPDATE product SET article=null, title=null, price=null, description=null, state=null, stock=null, display=null, time_display=null, top=null, id_user=null, id_subcategory=null WHERE article = '$article'";
         mysqli_query($conn, $request);

         $question = "SELECT src FROM photo_product WHERE article = '$article'";

         if ( $answer = mysqli_query($conn, $question) ) {
            //Delete photo file
            while ( $result = mysqli_fetch_assoc($answer) ) {
               unlink("..".$result['src']);
            }
         }

         mysqli_query($conn, "DELETE FROM photo_product WHERE article = '$article'");
      }

      $answerServer['message'] = 'Чат и сообщения удалены';
   }

   $answerServer['status'] = 'success';
   $answerServer['article'][] = $article;
   $answerServer['action'] = $_POST['action'];
   echo json_encode($answerServer);
// --- конец блока удаления чата ---
?>