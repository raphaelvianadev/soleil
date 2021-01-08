<?php

namespace config;

use PDO;

class Model extends Config
{

    private $con;

    public function __construct()
    {
        try {
            if (self::DEV_MODE) {
                $this->con = new PDO("mysql:host=" . self::LOCAL_DBHOST . ";dbname=" . self::LOCAL_DBNAME, self::LOCAL_DBUSER, self::LOCAL_DBPASS);
            } else {
                $this->con = new PDO("mysql:host=" . self::DBHOST . ";dbname=" . self::DBNAME, self::DBUSER, self::DBPASS);
            }
            $this->con->exec("set names utf8");
        } catch (\PDOException $e) {
            header('Content-Type: text/html; charset=utf-8');
            define('APP_ERROR_CODE', '500');
            define('APP_ERROR', 'Erro na conexão com o banco de dados: <br><pre>' . $e->getMessage() . "</pre>");
            include("./resources/site/layouts/error.phtml");
            exit();
        }
    }

    public function set($host, $user, $pass, $db)
    {
        try {
            $this->con = new PDO("mysql:host=" . $host . ";dbname=" . $db . ";charset=utf8mb4", $user, $pass);
            $this->con->exec("set names utf8");
        } catch (\PDOException $e) {
            header('Content-Type: text/html; charset=utf-8');
            define('APP_ERROR_CODE', '500');
            define('APP_ERROR', 'Erro na conexão com o banco de dados: <br><pre>' . $e->getMessage() . "</pre>");
            include("./resources/site/layouts/error.phtml");
            exit();
        }
    }

    public static function log($data)
    {
        echo '<script>';
        echo 'console.log(' . json_encode($data) . ')';
        echo '</script>';
    }

    public function getConnection()
    {
        return $this->con;
    }

    public function getNewConnection()
    {
        return $this->con;
    }

    public function closeConnection()
    {
        $this->con = null;
    }

}