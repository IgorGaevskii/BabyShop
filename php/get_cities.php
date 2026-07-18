<?php
include 'connection bd.php';

$apiKey = '2d424437e0d372495ef768e13fae1634';

// 1. Создание таблицы (используем mysqli)
$query = "CREATE TABLE IF NOT EXISTS list_cities (
    id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, -- ref VARCHAR(36) PRIMARY KEY,
    name_city VARCHAR(255),
    name_district VARCHAR(255),
    name_region VARCHAR(36),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";
mysqli_query($conn, $query);

//2. Очищаем таблицу перед вставкой обновлённых данных
mysqli_query($conn, "TRUNCATE TABLE list_cities");

for ($i = 1; ; $i++) {
   // 3. Запрос к API
    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL => "https://api.novaposhta.ua/v2.0/json/", // Добавлен корректный эндпоинт v2.0
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode([
            "apiKey" => $apiKey,
            "modelName" => "AddressGeneral",
            "calledMethod" => "getSettlements",
            "methodProperties" => ["Page" => $i],
        ]),
    ]);

    $raw_response = curl_exec($curl);
    curl_close($curl);

    echo $raw_response;

    $data = json_decode($raw_response, true);

   // 4. Проверяем полученные данные
   if ( isset($data['success']) && $data['success'] == true && !empty($data['data']) ) {
        
        // 5. Подготовка запроса через mysqli (исправлено с $db на $conn)
        $stmt = $conn->prepare("INSERT INTO list_cities (name_city, name_district, name_region) 
                                VALUES (?, ?, ?) 
                                ON DUPLICATE KEY UPDATE name_city=?, name_district=?, name_region=?");

        foreach ($data['data'] as $item) {
            $name_city = $item['Description'];
            $name_district = $item['RegionsDescription'];
            $name_region = $item['AreaDescription'];

            // Привязываем параметры (s = string)
            $stmt->bind_param("ssssss", $name_city, $name_district, $name_region, $name_city, $name_district, $name_region);
            $stmt->execute();
        }
      echo "Добавлено: " . count($data['data']) . " городов.";
   } else {
      // file_put_contents(__DIR__ . '/log.txt', date('Y-m-d H:i:s') . " - Выполнение завершено\n", FILE_APPEND);
      echo "Синхронизация завершена.";
      break;
   }
}