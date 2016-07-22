'use strict';

function printReceipt(tags) {
  let allItems = loadAllItems();
  let promotions = loadPromotions();

  let barcodes = generateBarcodes(tags);
  let amountedBarcode = getAmount(barcodes);
  let typedBarcodes = getPromotionType(promotions, amountedBarcode);
  let cartItems = getCartItems(allItems, typedBarcodes);
  let subtotalItems = getSubtotal(cartItems);
  let promotedItems = getPromotion(subtotalItems);
  let savedItems = getSavedSubtotal(promotedItems);
  let total = getAfterSavedTotal(savedItems);
  let savedTotal = getSavedMoney(savedItems);
  let receiptString = Print(total, savedTotal, savedItems);

  return receiptString;
}

function generateBarcodes(tags) {
  return tags.map(function (item) {
    let info = item.split('-');

    return {
      barcode: info[0],
      amount: parseFloat(info[1]) || 1
    }
  });
}


function getAmount(barcodes) {
  return barcodes.reduce(function (cur, newVal) {
    let exist = cur.find(function (item) {
      return item.barcode === newVal.barcode;
    });

    if (exist) {
      exist.amount += newVal.amount;
    } else {
      cur.push(Object.assign({}, newVal));
    }

    return cur;
  }, []);
}

function getPromotionType(promotions, amountedBarcodes) {
  let typedBarcodes = [];

  for (let i = 0; i < amountedBarcodes.length; ++i) {
    let flag = 0;
    for (let j = 0; j < promotions.length; ++j) {
      let exist = promotions[j].barcodes.find(function (item) {
        if (item === amountedBarcodes[i].barcode) {
          typedBarcodes.push(Object.assign({}, amountedBarcodes[i], {type: promotions[j].type}));
          flag = 1;
        }
      });
    }

    (flag === 0) ?
            typedBarcodes.push(Object.assign({}, amountedBarcodes[i], {type: "NO_PROMOTION"})) :
            flag = 0;
  }

  return typedBarcodes;
}

function getCartItems(allItems, typedBarcodes) {
  let cartItems = [];

  typedBarcodes.map(function (item) {
    for (let i = 0; i < allItems.length; ++i) {
      if (item.barcode === allItems[i].barcode) {
        cartItems.push(Object.assign({}, allItems[i], {amount: item.amount, type: item.type}));
        break;
      }
    }
  })

  return cartItems;
}

function getSubtotal(cartItems) {
  let subtotalItems = [];

  cartItems.map(function (item) {
    subtotalItems.push(Object.assign({}, item, {subtotal: item.price * item.amount}));
  })

  return subtotalItems;
}

function getPromotion(subtotalItems) {
  let promotedItems = [];

  subtotalItems.map(function (item) {
    if (item.type === "BUY_TWO_GET_ONE_FREE") {
      let save = item.price * (parseInt(item.amount / 3));
      promotedItems.push(Object.assign({}, item, {promotion: save}));
    } else {
      promotedItems.push(Object.assign({}, item, {promotion: 0}));
    }
  });

  return promotedItems;
}

function getSavedSubtotal(promotedItems) {
  let savedItems = [];

  promotedItems.map(function (item) {
    savedItems.push(Object.assign({}, item, {afterSavedSubtotal: item.subtotal - item.promotion}));
  });

  return savedItems;
}

function getAfterSavedTotal(savedItems) {
  return savedItems.reduce(function (first, second) {
    return first.afterSavedSubtotal + second.afterSavedSubtotal;
  });
}

function getSavedMoney(savedItems) {
  return savedItems.reduce(function (fir, sec) {
    return fir.promotion + sec.promotion;
  });
}

function Print(total, savedTotal, savedItems) {
  let receiptString = [];
  receiptString.push("***<没钱赚商店>收据***");
  for (let i = 0; i < savedItems.length; ++i) {
    receiptString.push("名称：" + savedItems[i].name + "，数量：" + savedItems[i].amount + savedItems[i].unit +
            "，单价：" + savedItems[i].price + "(元)，小计：" + savedItems[i].afterSavedSubtotal + "(元)")
  }

  receiptString.push("－－－－－－－－－－－－－－－－－－－－－");
  receiptString.push("总计：" + total + "(元)");
  receiptString.push("节省：" + savedTotal + "(元)");
  receiptString.push("*************************************");

  for (let item of receiptString) {
    console.log(item);
  }

  return (receiptString);
}
