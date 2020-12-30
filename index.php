<?php

session_start();
header_remove('X-Powered-By');
header("X-XSS-Protection: 1; mode=block");
header("X-WebKit-CSP: policy");
header('Content-Type: text/html; charset=utf-8');
ini_set('display_errors', 1);
ini_set('display_startup_erros', 0);
error_reporting(E_ALL);
setlocale(LC_TIME, 'pt_BR', 'pt_BR.utf-8', 'pt_BR.utf-8', 'portuguese');
date_default_timezone_set('America/Campo_Grande');

define('DOMAIN', "localhost");

if (!empty($_SERVER['HTTPS'])) {
    $config['base_url'] = 'https://' . DOMAIN . '/';
} else {
    $config['base_url'] = 'http://' . DOMAIN . '/';
}

define('APP_ROOT', $config['base_url']);

define('APP_NAME', "Soleil");

require_once 'helper/Autoload.php';
require_once 'vendor/autoload.php';
