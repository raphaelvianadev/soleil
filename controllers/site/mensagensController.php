<?php


namespace controllers\site;


use app\site\messages\Messages;
use config\Controller;

class mensagensController extends Controller
{

    public $messages;

    public function __construct()
    {
        parent::__construct();

        $this->messages = new Messages();

        $this->setLayout("core");
    }

    public function index()
    {
        $this->view();
    }

}