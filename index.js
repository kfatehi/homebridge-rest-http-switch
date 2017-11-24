var Service, Characteristic;
var axios = require('axios');

var url;

module.exports = function (homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-http-simple-switch", "SimpleHttpSwitch", SimpleHttpSwitch);
}


function SimpleHttpSwitch(log, config) {
  this.log = log;
  this.name = config["name"];
  this.resource = config["resource"];
}

SimpleHttpSwitch.prototype = {
  getPowerState: function (callback) {
    axios.get(this.resource).then((res)=>{
      this.log(res.data);
      callback(null, res.data.value === 0 ? true : false);
    }).catch(err=>{
      this.log(err.stack);
      callback(err);
    });
  },

  setPowerState: function(powerOn, callback) {
    this.log("setpowerstate", powerOn);
    axios.post(this.resource, { value: powerOn ? 0 : 1 }).then((res)=>{
      callback(null);
    }).catch(err=>{
      this.log(err.stack);
      callback(err);
    });
  },

  identify: function (callback) {
    this.log("Identify requested!");
    callback(); // success
  },

  getServices: function () {
    var informationService = new Service.AccessoryInformation();

    informationService
      .setCharacteristic(Characteristic.Manufacturer, "Luca Manufacturer")
      .setCharacteristic(Characteristic.Model, "Luca Model")
      .setCharacteristic(Characteristic.SerialNumber, "Luca Serial Number");

    switchService = new Service.Switch(this.name);
    switchService
      .getCharacteristic(Characteristic.On)
      .on('get', this.getPowerState.bind(this))
      .on('set', this.setPowerState.bind(this));


    return [switchService];
  }
};
