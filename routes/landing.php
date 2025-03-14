<?php

use Inertia\Inertia;
Route::get('/', function () {
    return Inertia::render('landing/index');
})->name('home');

Route::get('/about', function () {
    return Inertia::render('landing/about');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('landing/contact');
})->name('contact');

Route::get('/pricing', function () {
    return Inertia::render('landing/pricing');
})->name('pricing');
