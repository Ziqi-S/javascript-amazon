export function formatCurrency(priceCents){
    return (priceCents/100).toFixed(2);//.toFixed(2): 保留两位小数
};