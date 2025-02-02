import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'
import { deliveryOptions } from '../../data/deliveryOptions.js'


export function calculateDate(deliveryId){
    const today = dayjs();
    const deliveryDays = deliveryOptions
                                    .find(option => option.id === deliveryId).deliveryDays;
    const deliveryDate = today.add(deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    return dateString;
}
    