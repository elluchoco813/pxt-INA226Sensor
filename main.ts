//Registros del sensor
const INA226_CONFIGURATION = 0x00
const INA226_SHUNT_VOLTAGE = 0x01
const INA226_BUS_VOLTAGE = 0x02
const INA226_POWER = 0x03
const INA226_CURRENT = 0x04
const INA226_CALIBRATION = 0x05
const INA226_MASK_ENABLE = 0x06
const INA226_ALERT_LIMIT = 0x07
const INA226_MANUFACTURER = 0xfe
const INA226_DIE_ID = 0xff
const address = 0x40

//Mascaras 

/** 
 * Funciones para operar el modulo
*/
//%weight=10 block="INA226 Sensor"

namespace groveina226 {

    /** 
     * Create Grove - INA226
    */
    //% blockId=grove_ina_create block="Create INA226"
    export function createINA(): INA226 {
        let ina = new INA226();

        ina.init();

        return ina;
    }
    export class INA226 
    {
        // Aquí defines las propiedades y métodos para interactuar con el sensor
        //private address: number;
        private currentLSB: number;
        private shunt: number;
        private maxCurrent: number;

        constructor() {
            //this.address = 0x40;
            this.currentLSB = 0.0;
            this.shunt = 0.001;
            this.maxCurrent = 5;
        }
        /**
         * Init Grove - INA226
         */
        //% blockId=grove_ina_init block="%ina|Init Grove - INA226"
        init(): boolean {
            //Intentamos realizar alguna operación básica como leer el ID del fabricante
            if (!this.calibrate()) {
                return false; // Si la calibración falla
            }
            let manufacterID = this.readRegister(INA226_MANUFACTURER); // Leer el registro del ID del fabricante
            //return true
            if (manufacterID == 16723) { //16679 valor que retorna la identificación del fabricante en la dirección 0xFE
                //Si el ID es correcto se retorna un true y la inicialización es exitosa
                return true;
            } else {
                //Si no es correcto el ID, se retorna false, indicando que no hay respuesta 
                return false;
            }

            return false
        }

        calibrate(): boolean{
            this.currentLSB = this.maxCurrent / 32768;

            let calibrationValue = Math.floor(0.00512 / (this.currentLSB * this.shunt));

            return this.writeRegister(INA226_CALIBRATION, calibrationValue);
        }

        readRegister(reg: number): number {
            pins.i2cWriteNumber(0x40, reg, NumberFormat.UInt8BE);//se comunica a la direccion i2c y se especifica que el registro es en formato unsigned 8-bit con codificación BE
            
            //control.waitMicros(100)

            let buffer = pins.i2cReadBuffer(0x40, 2); //en esta linea lee los datos del dispositivo, el 2 corresponde a los dos bytes que es el tamaño del registro del INA226
            

            return (buffer[0] << 8) | buffer[1]; //retorna el registro, para ello se hace un corrimiento y un OR para leer los 16 bits del registro
        }

        writeRegister(register: number, value: number): boolean {
            //Se crea un buffer de 3 bytes, 1 para indicar el registro a escribir y 2 para ingresar el valor que se escribirá en este
            let buffer = pins.createBuffer(3);

            //Buffer para definir el registro en el que se escribirá
            buffer.setNumber(NumberFormat.UInt8LE, 0, register);

            //Buffer para definir el valor que se escribirá
            buffer.setNumber(NumberFormat.UInt16BE, 1, value);

            //Se escribe a traves de i2c y la dirección del INA
            let result = pins.i2cWriteBuffer(0x40, buffer, false);
            //Si el resultado es 0 se indica que se escribió correctamente, por ende se retorna un true
            return result == 0;
        }

        setModeShuntBusContinuous(): boolean {
            let config = this.readRegister(INA226_CONFIGURATION); // Leer el registro de configuración
            config &= ~(0x07); // Limpiar los bits del modo
            config |= 0x07; // Establecer el modo "Shunt and Bus continuous"
            return this.writeRegister(INA226_CONFIGURATION, config); // Escribir el nuevo valor en el registro
        }

        setAverage(average: number): boolean {
            let config = this.readRegister(INA226_CONFIGURATION); // Leer el registro de configuración
            config &= ~(0x0E00); // Limpiar los bits del promedio
            config |= (average << 9); // Establecer el valor del promedio (ajustar el shift según la tabla de bits del INA226)
            return this.writeRegister(INA226_CONFIGURATION, config); // Escribir el nuevo valor en el registro
        }

        setBusVoltageConversionTime(time: number): boolean {
            let config = this.readRegister(INA226_CONFIGURATION); // Leer el registro de configuración
            config &= ~(0x01C0); // Limpiar los bits del tiempo de conversión del bus
            config |= (time << 6); // Establecer el tiempo de conversión (según la tabla de tiempos)
            return this.writeRegister(INA226_CONFIGURATION, config); // Escribir el nuevo valor en el registro
        }

        setShuntVoltageConversionTime(time: number): boolean {
            let config = this.readRegister(INA226_CONFIGURATION); // Leer el registro de configuración
            config &= ~(0x0038); // Limpiar los bits del tiempo de conversión del shunt
            config |= (time << 3); // Establecer el tiempo de conversión (según la tabla de tiempos)
            return this.writeRegister(INA226_CONFIGURATION, config); // Escribir el nuevo valor en el registro
        }

        //% blockID=grove_ina_readvoltage block="%ina|Medir Voltaje"
        //% blockSetVariable=voltage
        //% blockGap=8
        readvoltage():number {
            let rawVoltage = this.readRegister(INA226_BUS_VOLTAGE); // Leer el registro de voltaje
            // Convertir el valor crudo a voltios
            let voltage = rawVoltage * this.shunt; // Ajusta esto según la fórmula correcta para el INA226
            return Math.round(voltage * 10000) / 10000;
        }

        //% blockID=grove_ina_readcurrent block="%ina|Medir Corriente"
        //% blockSetVariable=current
        //% blockGap=8
        readCurrent():number {
            let rawCurrent = this.readRegister(INA226_CURRENT); // Leer el registro de corriente
            // Convertir el valor crudo a amperios
            let current = rawCurrent * this.currentLSB; // Ajusta esto según la relación que tienes para currentLSB
            return Math.round(current*10000) / 10000;
        }

    }

}
