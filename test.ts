let ina: groveina226.INA226;

ina.init()

basic.forever(() => {
    if (ina.init()){
        basic.showNumber(10);
        basic.pause(250);
    }
    else{
        basic.showNumber(11);
        basic.pause(250);
    }
    
    
})