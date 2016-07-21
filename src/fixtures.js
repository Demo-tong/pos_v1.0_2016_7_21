'use strict';

function loadAllItems() {
  return [
    {
      barcode: 'I00',
      name: '可口可乐',
      unit: '瓶',
      price: 3.00
    },
    {
      barcode: 'I01',
      name: '雪碧',
      unit: '瓶',
      price: 3.00
    },
    {
      barcode: 'I02',
      name: '苹果',
      unit: '斤',
      price: 5.50
    },
    {
      barcode: 'I03',
      name: '荔枝',
      unit: '斤',
      price: 15.00
    },
    {
      barcode: 'I04',
      name: '电池',
      unit: '个',
      price: 2.00
    },
    {
      barcode: 'I05',
      name: '方便面',
      unit: '袋',
      price: 4.50
    }
  ];
}

function loadPromotions() {
  return [
    {
      type: 'BUY_TWO_GET_ONE_FREE',
      barcodes: [
        'I00',
        'I01',
        'I05'
      ]
    }
  ];
}