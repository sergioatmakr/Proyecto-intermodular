<?php

namespace App\Http\Controllers;

use App\Models\Actividad;

class HomeController extends Controller
{
    public function index()
    {
        $actividades = Actividad::accesibles()->get();
        return view('home', compact('actividades'));
    }
}
