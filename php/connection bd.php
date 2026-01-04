<?php
//Create connection basedata
// $conn = mysqli_connect("dg601947.mysql.tools", "dg601947_babystore", "7sG#A2j@e9", "dg601947_babystore");
$conn = mysqli_connect("MySQL-8.4", "root", "", "BabyShop");
//Check connection
if (mysqli_connect_errno()) {
    echo "Не удалось подключиться к MySQL: " . mysqli_connect_error();
}
?>