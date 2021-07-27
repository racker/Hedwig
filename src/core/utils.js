export class Utils {

    /**
     * Convert bytes to largest unit
     * @param {*} bytes number
     * @param {*} decimals number
     * @returns string
     */
    static formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        let k, dm, sizes, i;
        k = 1024;
        dm = decimals < 0 ? 0 : decimals;
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        if(Number.isInteger(bytes))
            bytes = Math.round((bytes + Number.EPSILON) * 100) / 100;
        else
            i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    /**
    * @description
    * Recursive function for returning value based on property path
    * @param o object
    * @param p string
    */
    static findByProp(o, prop) {
        if (!prop) return o;
        const properties = prop.split('.');
        return this.findByProp(o[properties.shift()], properties.join('.'));
    }

    /**
     * Create set of distinct values
     * @param {data} data
     */
    static maxValue(data) {
        let arr = new Set()
        data.forEach(element => {
            element.datapoints.forEach(el => {
                arr.add(el.value);
            });
        });
        let min = Math.min(...[...arr]);
        if (min === 0 && arr.size === 1) {
            arr.add(-1);
            arr.add(1);
        } else if (arr.size === 1) {
            let tenPer = (([...arr][0] * 10) / 100);
            arr.add([...arr][0] - tenPer);
            arr.add([...arr][0] + tenPer);
        }
        return [...arr];
    }

    /**
    * Create set of time values
    * @param {data} data
    */
    static maxTime(data) {
        let arr = [];
        data.forEach(element => {
            element.datapoints.forEach(el => {
                arr.push(el.time);
            });
        });
        return arr;
    }
        /**
         * Check byte unit of measurment
         * @param {number} dataPointValue // the value which is needed to show on graph for each line as data points
         * @param {number} decimalPlaces // value which needs to be rounded to two decimal places
         * @returns number
         */
         static roundOffValue(dataPointValue, decimalPlaces=2) {
            let x, power, roundedValue;    
            if(Number.isInteger(dataPointValue)) {
                x=(''+dataPointValue).length,power=Math.pow,decimalPlaces=p(10,decimalPlaces)
                x-=x%3
                return Math.round(dataPointValue*decimalPlaces/p(10,x))/decimalPlaces+" kMGTPE"[x/3];
            } else {
                roundedValue = Math.round((dataPointValue + Number.EPSILON) * 100) / 100;
                return roundedValue;
            }
        }
        static roundUnitsValue(measurmentUnit, value) {
            switch(measurmentUnit) {
                case measurmentUnit === 'bytes':
                case measurmentUnit === 'kilobytes':
                case measurmentUnit ===  'megabytes':
                    return this.formatBytes(value, 2);
                case measurmentUnit === 'load':
                case measurmentUnit === 'count':
                    return this.roundOffValue(value);
                case measurmentUnit === 'frames':
                case measurmentUnit === 'overruns':
                case measurmentUnit === 'errors':
                case measurmentUnit === 'packets':
                case measurmentUnit === 'collisions':
                    return this.roundOffValue(value) + ' ' + measurmentUnit + '/s';
                case measurmentUnit === 'other':
                    return this.roundOffValue(value) + ' days';
                case measurmentUnit === 'milliseconds':
                    return this.roundOffValue(value) + ' ms';
                case measurmentUnit === 'centiseconds':
                    return this.roundOffValue(value) + ' cs';
                case measurmentUnit === 'kilobytes/second':
                case measurmentUnit === 'pages/second':
                case measurmentUnit === 'octets':
                    return this.roundOffValue(value) + ' ' + measurmentUnit;
                case measurmentUnit == '%':
                    return this.roundOffValue(value) + ' %';             
                default:
                    return this.roundOffValue(value);
            }
        }

}
