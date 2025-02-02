import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'

const today = dayjs();
//add 7 days from today
const deliveryDate = today.add(7, 'days');
//console.log(deliveryDate.format('YYYY-MMMM-DD, dddd'));
//D: day of a month 
//dddd: Monday-Sunday
//H: 0-23hour

export const deliveryOptions = [{
    id: '1',
    deliveryDays: 7,
    priceCents: 0
}, {
    id: '2',
    deliveryDays: 3,
    priceCents: 499
}, {
    id: '3',
    deliveryDays: 1,
    priceCents: 999
}];

export function getDeliveryOption(item){
    const deliveryOptionId = item.deliveryOptionId;
    const deliveryOption = deliveryOptions.find(option => option.id === deliveryOptionId);
    
    return deliveryOption || deliveryOptions[0];
}