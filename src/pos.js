'use strict';

function printReceipt(tags){
  let allItems = loadAllItems();
  let promotions = loadPromotions();

  let barcodes = generateBarcodes(tags);
  let amountedBarcodes = getAmount(barcodes);
  let typedBarcodes = getPromotionType(promotions, amountedBarcodes);
  let cartItems = getCartItems(allItems, typedBarcodes);
  let subtotalItems = getSubtotal(cartItems);
  let promotedItems = getPromotion(subtotalItems);
  let savedItems = getSavedSubtotal(promotedItems);

  let total = getAfterSavedTotal(savedItems);
  let savedTotal = getSavedMoney(savedItems);

  let receiptString = Print(total, savedTotal, savedItems);

  return receiptString;
}

function generateBarcodes(tags){
  return tags.map(function(item){
    let info = item.split('-');

    return {
      barcode: info[0],
      amount: parseFloat(info[1]) || 1
    }
  });
}

function getAmount(barcodes){
  return barcodes.reduce(function(cur, newVal){
    let exist = cur.find(function(item){
      return item.barcode === newVal.barcode;
    });

    if(exist){
      exist.amount += newVal.amount;
    }else{
      cur.push(Object.assign({}, newVal));
    }
    return cur;
  }, []);
}

function getPromotionType(promotions, amountedBarcodes){
  let typedBarcodes = [];

  for(let i = 0; i < amountedBarcodes.length; ++i){
    let flag = 0;
    for(let j = 0; j < promotions.length; ++j){
      promotions[j].barcodes.find(function(item){
        if(item === amountedBarcodes[i].barcode){
          typedBarcodes.push(Object.assign({}, amountedBarcodes[i], {type: promotions[j].type}));
          flag = 1;
        }
      });
    }
    if(flag === 0){
      typedBarcodes.push(Object.assign({}, amountedBarcodes[i], {type: "NO_PROMOTION"}));
    }else{
      flag = 0;
    }
  }

  return typedBarcodes;
}

function getCartItems(allItems, typedBarcodes){
  return typedBarcodes.map(function (item){
    let exist = allItems.find(function(info){
      return item.barcode === info.barcode;
    });
    if(exist){
      return Object.assign({}, exist, {amount: item.amount, type: item.type});
    }
  });
}

function getSubtotal(cartItems){
  return cartItems.map(function(item){
    let temp = item.price * item.amount;
    return Object.assign({}, item, {subtotal: temp});
  });
}

function getPromotion(subtotalItems){
  return subtotalItems.map(function(item){
    if(item.type === "BUY_TWO_GET_ONE_FREE"){
      let temp = item.price * parseInt(item.amount/3);
      return Object.assign({}, item, {promotion: temp});
    }else{
      return Object.assign({}, item, {promotion: 0});
    }
  });
}

function getSavedSubtotal(promotedItems){
  return promotedItems.map(function(item){
    return Object.assign({}, item, {afterSavedSubtotal: item.subtotal - item.promotion});
  });
}

function getAfterSavedTotal(savedItems){
  let total = 0;

  for(let item of savedItems){
    total += item.afterSavedSubtotal;
  }

  return total;
}

function getSavedMoney(savedItems){
  let savedTotal = 0;

  for(let item of savedItems){
    savedTotal += item.promotion;
  }

  return savedTotal;
}

function Print(total, savedTotal, savedItems){
  let receiptString = [];

  receiptString.push("***<没钱赚商店>收据***");
  for(let item of savedItems){
    receiptString.push("名称："+ item.name + "，数量：" + item.amount + item.unit +
            "，单价："+ item.price + "(元)，小计：" + item.afterSavedSubtotal + "(元)");
  }

  receiptString.push("－－－－－－－－－－－－－－－－－－－－－");
  receiptString.push("总计：" + total + "(元)");
  receiptString.push("节省：" + savedTotal + "(元)");
  receiptString.push("*************************************");

  return receiptString;
}