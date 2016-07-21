'use strict';

describe("printReceipt", function () {
  it("call all functions", function () {
    let tags = [
      'I01',
      'I02-3.5',
      'I01-2'
    ]

    expect(printReceipt(tags)).toEqual("Have done!");
  });
});

describe("generateBarcodes", function () {
  it("should output [{barcode:String, amount:Number}]", function () {
    let tags = [
      'I01',
      'I02-3.5',
      'I01-2'
    ]

    let barcodes = [
      {
        barcode: 'I01',
        amount: 1
      },
      {
        barcode: 'I02',
        amount: 3.5
      },
      {
        barcode: 'I01',
        amount: 2
      }
    ]
    expect(generateBarcodes(tags)).toEqual(barcodes);
  })
})

describe("getAmount", function () {
  it("expect output [{barcode:String, amount:Number}]", function () {
    let barcodes = [
      {
        barcode: 'I01',
        amount: 1
      },
      {
        barcode: 'I02',
        amount: 3.5
      },
      {
        barcode: 'I01',
        amount: 2
      }
    ]

    let amountedBarcodes = [
      {
        barcode: 'I01',
        amount: 3
      },
      {
        barcode: 'I02',
        amount: 3.5
      }
    ]

    expect(getAmount(barcodes)).toEqual(amountedBarcodes);
  })
});

describe("getPromotionType", function () {
  it("increase type promote to every kind of good", function () {
    let amountedBarcodes = [
      {
        barcode: 'I01',
        amount: 3
      },
      {
        barcode: 'I02',
        amount: 3.5
      }
    ]

    let typedBarcodes = [
      {
        barcode: 'I01',
        amount: 3,
        type: "BUY_TWO_GET_ONE_FREE"
      },
      {
        barcode: 'I02',
        amount: 3.5,
        type: "NO_PROMOTION"
      }
    ]

    let promotions = loadPromotions();
    expect(getPromotionType(promotions, amountedBarcodes)).toEqual(typedBarcodes);
  })
});

describe("getCartItems", function () {
  it("get cartItems", function () {
    let typedBarcodes = [
      {
        barcode: 'I01',
        amount: 3,
        type: "BUY_TWO_GET_ONE_FREE"
      },
      {
        barcode: 'I02',
        amount: 3.5,
        type: "NO_PROMOTION"
      }
    ]

    let cartItems = [
      {
        barcode: 'I01',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        amount: 3,
        type: "BUY_TWO_GET_ONE_FREE"
      },
      {
        barcode: 'I02',
        name: '苹果',
        unit: '斤',
        price: 5.50,
        amount: 3.5,
        type: "NO_PROMOTION"
      }
    ]
    let allItems = loadAllItems();

    expect(getCartItems(allItems, typedBarcodes)).toEqual(cartItems);
  });
});

describe("getSubtotal", function () {
  it("calculate the subtotal and put it into subtotalItems", function () {
    let cartItems = [
      {
        barcode: 'I01',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        amount: 3,
        type: "BUY_TWO_GET_ONE_FREE"
      },
      {
        barcode: 'I02',
        name: '苹果',
        unit: '斤',
        price: 5.50,
        amount: 3.5,
        type: "NO_PROMOTION"
      }
    ]

    let subtotalItems = [
      {
        barcode: 'I01',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        amount: 3,
        type: "BUY_TWO_GET_ONE_FREE",
        subtotal: 9.00
      },
      {
        barcode: 'I02',
        name: '苹果',
        unit: '斤',
        price: 5.50,
        amount: 3.5,
        type: "NO_PROMOTION",
        subtotal: 19.25
      }
    ]

    expect(getSubtotal(cartItems)).toEqual(subtotalItems);
  });
});

describe("getPromotion", function () {
  it("calculate every kind goods' promotion", function () {
    let subtotalItems = [
      {
        barcode: 'I01',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        amount: 3,
        type: "BUY_TWO_GET_ONE_FREE",
        subtotal: 9.00
      },
      {
        barcode: 'I02',
        name: '苹果',
        unit: '斤',
        price: 5.50,
        amount: 3.5,
        type: "NO_PROMOTION",
        subtotal: 19.25
      }
    ]

    let promotedItems = [
      {
        barcode: 'I01',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        amount: 3,
        type: "BUY_TWO_GET_ONE_FREE",
        subtotal: 9.00,
        promotion: 3
      },
      {
        barcode: 'I02',
        name: '苹果',
        unit: '斤',
        price: 5.50,
        amount: 3.5,
        type: "NO_PROMOTION",
        subtotal: 19.25,
        promotion: 0
      }
    ]

    expect(getPromotion(subtotalItems)).toEqual(promotedItems);
  });
});

describe("getSavedSubtotal", function () {
  it("calculate every kind goods'subtotal after promote ", function () {
    let promotedItems = [
      {
        barcode: 'I01',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        amount: 3,
        type: "BUY_TWO_GET_ONE_FREE",
        subtotal: 9.00,
        promotion: 3
      },
      {
        barcode: 'I02',
        name: '苹果',
        unit: '斤',
        price: 5.50,
        amount: 3.5,
        type: "NO_PROMOTION",
        subtotal: 19.25,
        promotion: 0
      }
    ]

    let savedItems = [
      {
        barcode: 'I01',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        amount: 3,
        type: "BUY_TWO_GET_ONE_FREE",
        subtotal: 9.00,
        promotion: 3,
        afterSavedSubtotal: 6
      },
      {
        barcode: 'I02',
        name: '苹果',
        unit: '斤',
        price: 5.50,
        amount: 3.5,
        type: "NO_PROMOTION",
        subtotal: 19.25,
        promotion: 0,
        afterSavedSubtotal: 19.25
      }
    ]

    expect(getSavedSubtotal(promotedItems)).toEqual(savedItems);
  });
});

describe("getAfterSavedTotal", function () {
  it("get total money", function () {
    let savedItems = [
      {
        barcode: 'I01',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        amount: 3,
        type: "BUY_TWO_GET_ONE_FREE",
        subtotal: 9.00,
        promotion: 3,
        afterSavedSubtotal: 6
      },
      {
        barcode: 'I02',
        name: '苹果',
        unit: '斤',
        price: 5.50,
        amount: 3.5,
        type: "NO_PROMOTION",
        subtotal: 19.25,
        promotion: 0,
        afterSavedSubtotal: 19.25
      }
    ]

    let total = 25.25;

    expect(getAfterSavedTotal(savedItems)).toEqual(total);
  });
});

describe("getSavedMoney", function () {
  it("get saved money", function () {
    let savedItems = [
      {
        barcode: 'I01',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        amount: 3,
        type: "BUY_TWO_GET_ONE_FREE",
        subtotal: 9.00,
        promotion: 3,
        afterSavedSubtotal: 6
      },
      {
        barcode: 'I02',
        name: '苹果',
        unit: '斤',
        price: 5.50,
        amount: 3.5,
        type: "NO_PROMOTION",
        subtotal: 19.25,
        promotion: 0,
        afterSavedSubtotal: 19.25
      }
    ]

    let saved = 3;

    expect(getSavedMoney(savedItems)).toEqual(saved);
  });
});

describe("Print", function () {
  it("print the list", function () {
    let savedItems = [
      {
        barcode: 'I01',
        name: '雪碧',
        unit: '瓶',
        price: 3.00,
        amount: 3,
        type: "BUY_TWO_GET_ONE_FREE",
        subtotal: 9.00,
        promotion: 3,
        afterSavedSubtotal: 6
      },
      {
        barcode: 'I02',
        name: '苹果',
        unit: '斤',
        price: 5.50,
        amount: 3.5,
        type: "NO_PROMOTION",
        subtotal: 19.25,
        promotion: 0,
        afterSavedSubtotal: 19.25
      }
    ]

    let total = 25.25;
    let savedTotal = 3;

    expect(Print(total, savedTotal, savedItems)).toEqual("Print successfully!");
  });
});