<?php
// Запуск сессии
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Установка кодировки
ini_set('default_charset', 'UTF-8');
mb_internal_encoding('UTF-8');

// Настройка вывода ошибок (в продакшене установить error_reporting(0))
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Установка временной зоны
date_default_timezone_set('Europe/Kiev');

// Подключение к базе данных
require_once __DIR__ . '/connection bd.php';

// Функции для обработки ошибок
function handleError($errno, $errstr, $errfile, $errline) {
    // Логирование ошибок
    error_log("Error [$errno]: $errstr in $errfile on line $errline");
    return true;
}

// Установка обработчика ошибок
set_error_handler('handleError');

// Константы приложения
define('ROOT_PATH', dirname(__DIR__));
define('UPLOAD_PATH', ROOT_PATH . '/pictures');