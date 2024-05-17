const axios = require('axios');
const LiqPay = require('../my_modules/liqpay');

const liqpay = new LiqPay(process.env.TEST_LIQPAY_PUBLIC_KEY, process.env.TEST_LIQPAY_PRIVATE_KEY);

class LiqPayService {
     
     async paymentPost(cart, total_price, order) {


          const params = {
               action: "invoice_send",
               version: "3",
               description: 'Оформлення заказа',
               email: order.email,
               currency: "UAH",
               amount: total_price,
               order_id: order._id,
               goods: cart.map(item => ({
                    amount: item.priceTotal,
                    count: item.quantity,
                    unit: "шт.",
                    name: item.title
               }))
          };

          try {

               const result = await liqpay.api('request', params);
               console.log(result);
               return { result };

          } catch (error) {
               return { ok: false };
          };
     };
};

module.exports = { LiqPayService };