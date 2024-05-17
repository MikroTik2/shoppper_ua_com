const fs = require('fs');
const axios = require('axios');
const log = require('../models/log.js');

class NewPostService {
     constructor(apiKey) {
          this.apiKey = process.env.API_KEY_NOVA_POSHTA;
          this.baseUrl = 'https://api.novaposhta.ua/v2.0/json/';
     };

     async getCity(query) {
          log.info(`NewPostService :::::::::::::::::::::: getTracking QUERY: ${query}`);

          const request = {
               "apiKey": this.apiKey,
               "modelName": "Address",
               "calledMethod": "searchSettlements",
               "methodProperties": {
                    "CityName": query,
                    "Limit": "50",
                    "Page": "1"
               }
          };

          try {

               const response = await axios.post(this.baseUrl, request);
               const result = response.data;
               return result.success ?
                    { ok: true, data: result.data } :
                    { ok: false, msg: `${result.errors[0]} ${result.warnings[0]}` };

          } catch (error) {
               return { ok: false };
          };
     };

     async getDepartament(query) {

          log.info(`NewPostService :::::::::::::::::::::: getTracking QUERY: ${query}`);

          const request = {
               "apiKey": this.apiKey,
               "modelName": "Address",
               "calledMethod": "getWarehouses",
               "methodProperties": {
                    "CityRef" : query,
                    "Page" : "1",
                    "Limit" : "50",
               },
          };

          try {

               const response = await axios.post(this.baseUrl, request);
               const result = response.data;
               return result.success ?
                    { ok: true, data: result.data } :
                    { ok: false, msg: `${result.errors[0]} ${result.warnings[0]}` };

          } catch (error) {
               return { ok: false };
          };
     };
};

module.exports = { NewPostService };