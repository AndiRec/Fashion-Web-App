<?php
// app/Enums/Category.php

namespace App\Enums;

enum Category: string
{
    case DRESS = 'dress';
    case SKIRT = 'skirt';
    case BLOUSE = 'blouse';
    case TSHIRT = 'tshirt';
    case TOP = 'top';
    case PANTS = 'pants';
    case COAT = 'coat';
    case BODYCON = 'bodycon';
    case ACCESSORY = 'accessory';
}
