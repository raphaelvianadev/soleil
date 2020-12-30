<?php

namespace config;

class Router
{

    protected array $routers = [
        'site' => 'site',
        'admin' => 'admin'
    ];
    protected string $routerOnRaiz = 'site';
    protected bool $onRaiz = true;

}