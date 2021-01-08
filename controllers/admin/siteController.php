<?php

namespace controllers\admin;


use app\admin\Accounts;
use app\admin\messages\Messages;
use app\admin\Permissions;
use config\Controller;

class siteController extends Controller
{

    public $accounts, $permissions, $messages;

    public function __construct()
    {
        parent::__construct();

        $this->accounts = new Accounts();
        $this->permissions = new Permissions();
        $this->messages = new Messages();

        $this->setLayout("core");
    }

    public function index()
    {
        if(!$this->accounts->logged())
        {
            header('Location: /admin/home/login');
            die();
        }
        header("Location: /admin");
    }

    public function mensagens()
    {
        if(!$this->accounts->logged())
        {
            header('Location: /admin/home/login');
            die();
        }
        if(!$this->permissions->parent('site', 'mensagens'))
        {
            header('Location: /admin');
            die();
        }
        if($this->getParams(0) == "add")
        {
            echo $this->messages->add();
            return;
        }
        if($this->getParams(0) == "delete")
        {
            echo $this->messages->delete();
            return;
        }
        if($this->getParams(0) == "edit")
        {
            echo $this->messages->edit();
            return;
        }
        $this->view();
    }

}