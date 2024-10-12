let ina2: groveina226.INA226 = groveina226.createINA();


//const address = 0x40

//let x = ina2.init()

//let probe2 = ina.readRegister(0xfe)

/*function readRegister(reg: number): number {
    pins.i2cWriteNumber(address, reg, NumberFormat.UInt8BE);//se comunica a la direccion i2c y se especifica que el registro es en formato unsigned 8-bit con codificación BE

    //control.waitMicros(100)

    let buffer = pins.i2cReadBuffer(address, 2); //en esta linea lee los datos del dispositivo, el 2 corresponde a los dos bytes que es el tamaño del registro del INA226


    return (buffer[0] << 8) | buffer[1]; //retorna el registro, para ello se hace un corrimiento y un OR para leer los 16 bits del registro
}

function writeRegister(register: number, value: number): boolean {
    //Se crea un buffer de 3 bytes, 1 para indicar el registro a escribir y 2 para ingresar el valor que se escribirá en este
    let buffer = pins.createBuffer(3);

    //Buffer para definir el registro en el que se escribirá
    buffer.setNumber(NumberFormat.UInt8LE, 0, register);

    //Buffer para definir el valor que se escribirá
    buffer.setNumber(NumberFormat.UInt16BE, 1, value);

    //Se escribe a traves de i2c y la dirección del INA
    let result = pins.i2cWriteBuffer(address, buffer, false);
    //Si el resultado es 0 se indica que se escribió correctamente, por ende se retorna un true
    return result == 0;
}
*/
let probe = ina2.readRegister(0xfe)

let x = ina2.init()

ina2.calibrate()

if (x){
    let calibracion = ina2.calibrate()
    if (calibracion){
        basic.showNumber(1)
    }
    else{
        basic.showNumber(2)
    }
}

let med = ina2.readvoltage()
let medCurrent = ina2.readCurrent()

basic.forever(function () {
    //for (let address = 1; address < 127; address++) {
    basic.showNumber(med);
    basic.pause(2000);
    basic.showNumber(medCurrent)
    if (probe == 16723){
        basic.pause(2000);
        basic.showString("Si");
    }
    else{
        basic.showNumber(1);
    }
    
    //try {
        // Intentar escribir en cada dirección
        //pins.i2cReadNumber(64, NumberFormat.UInt8BE, true);
        // Si no ocurre una excepción, significa que hay un dispositivo en esa dirección
        //basic.showString("Found: " + address);
        //basic.showNumber(19)
    //} catch (e) {
        //basic.showNumber(20)
        // Si ocurre un error, no hay dispositivo en esa dirección
    //}
    //}
    basic.pause(5000); // Pausar para no hacer el escaneo constantemente
})