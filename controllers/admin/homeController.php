<?php

namespace controllers\admin;

use app\admin\Accounts;
use app\admin\Permissions;
use config\Controller;
use config\Forms;
use config\Json;

class homeController extends Controller
{

    public $accounts, $permissions, $forms, $tokenId, $tokenValue, $inputs;

    public function __construct()
    {
        parent::__construct();

        $this->accounts = new Accounts();
        $this->forms = new Forms();
        $this->permissions = new Permissions();

        $this->setLayout("core");
    }

    public function index()
    {
        if (!$this->accounts->logged()) {
            header('Location: /admin/home/login');
            die();
        }
        $this->view();
    }

    public function login()
    {
        if ($this->getParams(0) == 'logout') {
            $this->accounts->logout();
            header('Location: /admin');
            die();
        }

        if ($this->accounts->logged()) {
            header('Location: /admin');
            return;
        }

        $this->tokenId = $this->forms->getTokenID();
        $this->tokenValue = $this->forms->getToken();
        $this->inputs = $this->forms->formNames(['username', 'password', 'ip', 'mode'], false);
        if ($this->getParams(0) == "auth") {
            $try = $this->accounts->auth($this->inputs);
            echo $try;
            $json = Json::decode($try);
            if ($json->response == "ok") {
                $this->inputs = $this->forms->formNames(['username', 'password', 'ip', 'mode'], true);
            }
            return;

        }

        $this->setLayout("login");
        $this->view();
    }

}