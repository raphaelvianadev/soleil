<?php


namespace controllers\site;


use config\Controller;

class homeController extends Controller
{

    public function __construct()
    {
        parent::__construct();

        $this->setLayout("core");
    }

    public function index()
    {
        $this->view();
    }

}