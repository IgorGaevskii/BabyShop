<?php
session_start();
include 'connection bd.php';

$answerServer = [];
$answerServer['action'] = $_POST['action'];
$token = mysqli_real_escape_string($conn, $_POST['token']);


// 1. Получаем текстовые данные
$name = mysqli_real_escape_string($conn, trim($_POST['first_name']));
$surname = mysqli_real_escape_string($conn, trim($_POST['surname']));
$phone = mysqli_real_escape_string($conn, trim($_POST['phone']));
$full_name = $name . " " . $surname;

// 2. Обработка файла (если передан)
$path_file = "/pictures/user avatars/empty avatar.jpg"; // Путь по умолчанию

if (isset($_FILES['user_avatar']) && $_FILES['user_avatar']['size'] > 0) {
    $file = $_FILES['user_avatar'];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowed = ['jpg', 'jpeg', 'png', 'gif'];

    if (in_array($ext, $allowed)) {
        $new_name = $token . ".jpg";
        $upload_path = $_SERVER['DOCUMENT_ROOT'] . "/pictures/user avatars/" . $new_name;
        
        if (move_uploaded_file($file['tmp_name'], $upload_path)) {
            $path_file = "/pictures/user avatars/" . $new_name;
        }
    }
}

// 3. Один SQL запрос на обновление всего профиля
if (!empty($name) && !empty($surname) && !empty($phone)) {
    $query = "UPDATE users SET 
                confirmed = true, 
                user = '$full_name', 
                phone = '$phone', 
                src_avatar = '$path_file', 
                active = false, 
                rating_payment = 0, 
                rating_analogy = 0, 
                rating_sending = 0, 
                rating_dialog = 0, 
                rating_user = 0 
              WHERE keyEmail = '$token'";
      
      if ( mysqli_query($conn, $query) ) {
         // Получаем id этого пользователя для связи
         $res = mysqli_query($conn, "SELECT id FROM users WHERE keyEmail = '$token'");
         $user_data = mysqli_fetch_assoc($res);
         $user_id = $user_data['id'];

         if ($user_id) {
            // Создаём таблицу место проживания
            $sql = "CREATE TABLE IF NOT EXISTS place_residence (
               id_user INT PRIMARY KEY,
               name_region VARCHAR(100),
               name_district VARCHAR(255),
               name_city VARCHAR(255)
            )";
            
            if ( mysqli_query($conn, $sql) ) {
               // Получаем данные адреса из POST (добавьте свои названия полей)
               $region = mysqli_real_escape_string($conn, trim($_POST['region']));
               $district = mysqli_real_escape_string($conn, trim($_POST['district']));
               $city = mysqli_real_escape_string($conn, trim($_POST['city']));
               
               // Сохраняем адрес
               $sql_address = "INSERT INTO place_residence (id_user, name_region, name_district, name_city) 
                              VALUES ('$user_id', '$region', '$district', '$city')
                              ON DUPLICATE KEY UPDATE 
                              name_region='$region', name_district='$district', name_city='$city'";
                  
               if ( mysqli_query($conn, $sql_address) ) {
                  $answerServer['status'] = 'success';
                  $answerServer['bodyAnswer'] = 'Реєстрація успішно<br>завершена!';
               }
            }   
         }
    } else {
        $answerServer['error'] = 'Ошибка базы данных';
    }
} else {
    $answerServer['error'] = 'Заполните все поля формы';
}

echo json_encode($answerServer);
mysqli_close($conn);
?>
