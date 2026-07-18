<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
include 'connection bd.php';

// connection bd.php should define $conn
if (!isset($conn) || !$conn) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'db_connection']);
    exit;
}

$answer = ['success' => false];

if (empty($_SESSION['id'])) {
    http_response_code(401);
    $answer['error'] = 'unauthorized';
    echo json_encode($answer);
    exit;
}

$uid = (int)$_SESSION['id'];
$arr_articles = isset($_POST['articles']) ? explode(",", $_POST['articles']) : null;

if (!$arr_articles) {
    http_response_code(400);
    $answer['error'] = 'missing_article';
    echo json_encode($answer);
    exit;
}

foreach ($arr_articles as $article) {

   if (mb_strlen($article) > 100) {
      http_response_code(400);
      $answer['error'] = 'article_too_long';
      echo json_encode($answer);
      exit;
   }

    // check exists
    $stmt = $conn->prepare("SELECT id FROM user_favorites WHERE id_user = ? AND article = ? LIMIT 1");
    $stmt->bind_param("is", $uid, $article);
    $stmt->execute();
    $result = $stmt->get_result();
    $exists = $result && $result->num_rows > 0;
    $stmt->close();

    if ($exists) {
        $stmt = $conn->prepare("DELETE FROM user_favorites WHERE id_user = ? AND article = ?");
        $stmt->bind_param("is", $uid, $article);
        $ok = $stmt->execute();
        $stmt->close();

        if ($ok) {
            $answer['success'] = true;
            $answer['action'] = 'removed';
        } else {
            http_response_code(500);
            $answer['error'] = 'db_error_delete';
        }
    } else {
        $stmt = $conn->prepare("INSERT INTO user_favorites (id_user, article) VALUES (?, ?)");
        $stmt->bind_param("is", $uid, $article);
        $ok = $stmt->execute();
        $stmt->close();

        if ($ok) {
            $answer['success'] = true;
            $answer['action'] = 'added';

            $pstmt = $conn->prepare("SELECT p.title, p.price, ph.src FROM product p LEFT JOIN photo_product ph ON ph.article = p.article AND ph.photo_sign = 1 WHERE p.article = ? LIMIT 1");
            $pstmt->bind_param("s", $article);
            $pstmt->execute();
            $pres = $pstmt->get_result();
            if ($pres && $row = $pres->fetch_assoc()) {
                $answer['product'] = $row;
            }
            $pstmt->close();
        } else {
            http_response_code(500);
            $answer['error'] = 'db_error_insert';
        }
    }
}

echo json_encode($answer);

?>