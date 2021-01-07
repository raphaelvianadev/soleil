<?php

namespace app\admin;

use config\Forms;
use config\Json;
use config\Model;
use config\Security;

class Accounts
{

    private $model;
    const TABLE = "website_accounts";

    public function __construct()
    {
        $this->model = new Model();
    }

    public function auth($inputs)
    {
        $forms = new Forms();
        if (!Security::ajax()) {
            return Json::encode(['response' => 'error', 'message' => 'Conexão recusada!']);
        }
        if (empty($_POST)) {
            return Json::encode(['response' => 'error', 'message' => 'Global POST não está definida']);
        }
        if (empty($_POST[$inputs['username']]) || empty($_POST[$inputs['password']])) {
            return Json::encode(['response' => 'error', 'message' => 'Informe todos os dados']);
        }
        if (!$forms->checkValid($_POST)) {
            return Json::encode(['response' => 'error', 'message' => 'CSFR detectado!']);
        }

        if (!$this->login($_POST[$inputs['username']], $_POST[$inputs['password']])) {
            return Json::encode(['response' => 'error', 'message' => 'Usuário e/ou senha inválidos (COD: 75)']);
        }

        $mode = isset($_POST[$inputs['mode']]);
        $this->setSession('BangBang', $_POST[$inputs['username']], $mode);

        return Json::encode(['response' => 'ok', 'message' => 'Autenticado com sucesso!']);
    }

    public function has($username)
    {
        $stmt = $this->model->getConnection()->prepare("SELECT * FROM `" . self::TABLE . "` WHERE `account_username`=?");
        $stmt->execute([$username]);
        $has = $stmt->rowCount() > 0;
        $stmt = null;
        return $has;
    }

    public function login($username, $pass)
    {
        $stmt = $this->model->getConnection()->prepare("SELECT `account_password` FROM `" . self::TABLE . "` WHERE `account_username`=?");
        $stmt->execute([$username]);
        $password = $stmt->fetchObject()->account_password;

        $stmt = null;

        return password_verify($pass, $password);
    }


    public function logged()
    {
        return (isset($_SESSION['BangBang'])) ? true : isset($_COOKIE['BangBang']);
    }

    public function logout()
    {
        $user = $_SESSION['BangBang'];
        if (isset($user)) {
            unset($user);
            return;
        }
        unset($_COOKIE['BangBang']);
        setcookie('BangBang', '', time() - 3600, '/');
    }

    public function username()
    {
        if (isset($_SESSION['BangBang'])) {
            return $_SESSION['BangBang'];
        }
        return $_COOKIE['BangBang'];
    }

    private function setSession($name, $value, $mode = false)
    {
        if ($mode) {
            return setcookie($name, $value, time() + 3600 * 24 * 30, "/");
        }
        return $_SESSION[$name] = $value;
    }

    public function hash()
    {
        $lmin = 'abcdefghijklmnopqrstuvwxyz';
        $lmai = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $num = '1234567890';
        $retorno = '';
        $caracteres = '';
        $caracteres .= $lmin;
        if (true) $caracteres .= $lmai;
        if (true) $caracteres .= $num;
        $len = strlen($caracteres);
        for ($n = 1; $n <= 12; $n++) {
            $rand = mt_rand(1, $len);
            $retorno .= $caracteres[$rand - 1];
        }
        return $retorno;
    }

    private function userByID($id)
    {
        $stmt = $this->model->getConnection()->prepare("SELECT * FROM `" . self::TABLE . "` WHERE `account_id`=?");
        $stmt->execute([$id]);
        $user = $stmt->fetchObject()->account_username;
        $stmt = null;
        return $user;
    }

    public function id($username)
    {
        $stmt = $this->model->getConnection()->prepare("SELECT * FROM `" . self::TABLE . "` WHERE `account_username`=?");
        $stmt->execute([$username]);
        $id = $stmt->fetchObject()->account_id;
        $stmt = null;
        return $id;
    }

    private function row()
    {
        $stmt = $this->model->getConnection()->prepare("SELECT * FROM `" . self::TABLE . "`");
        $stmt->execute();
        $row = $stmt->rowCount();
        $stmt = null;
        return $row;
    }

    private function hasId($id)
    {
        $stmt = $this->model->getConnection()->prepare("SELECT * FROM `" . self::TABLE . "` WHERE `account_id`=?");
        $stmt->execute([$id]);
        $has = $stmt->rowCount() > 0;
        $stmt = null;
        return $has;
    }

}