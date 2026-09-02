<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'invoice_number',
        'total_amount',
        'invoice_date',
    ];

    /**
     * Relationship: An invoice belongs to an order.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
