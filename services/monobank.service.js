const axios = require('axios');

class MonoBankService {
     constructor(apiKey) {
          this.apiKey = process.env.TEST_MONOBANK_TOKEN;
          this.baseUrl = 'https://api.monobank.ua/api';
     };

     async paymentPost(cart, total_price) {

          const request = {
               "amount": parseInt(total_price * 100),
               "ccy": 980,
               "merchantPaymInfo": {
                    "destination": "Ваш товар",
                    "comment": "Ваш товар",
                    "basketOrder": cart.map(item => ({
                         "name": item.title,
                         "qty": parseInt(item.quantity),
                         "sum": parseInt(item.priceTotal * 100),
                         "unit": "шт.",
                         "icon": item.image.url,
                         "code": "d21da1c47f3c45fca10a10c32518bdeb",
                    })),
               },
               "redirectUrl": `http://localhost:${process.env.PORT}`,
               "webHookUrl": `http://localhost:${process.env.PORT}`,
               "paymentType": "debit",
          };

          try {

               const response = await axios.post(`${this.baseUrl}/merchant/invoice/create`, request, {
                    headers: {
                         "Content-Type": "application/json",
                         "X-Token": this.apiKey,
                    },
               });

               const result = response.data;
               return { result };

          } catch (error) {
               return { ok: false };
          };
     };
};

module.exports = { MonoBankService };