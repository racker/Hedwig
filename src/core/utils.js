export class Utils {

    /**
     * Convert bytes to largest unit
     * @param {*} bytes number
     * @param {*} decimals number
     * @returns string
     */
    static formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
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
         * @param {number} n
         * @param {number} d
         * @returns number
         */
         static roundOffValue(n, d=2) {
            if(Number.isInteger(n)) {
                var x=(''+n).length,p=Math.pow,d=p(10,d)
                x-=x%3
                return Math.round(n*d/p(10,x))/d+" kMGTPE"[x/3];
            } else {
                var dd = Math.round((n + Number.EPSILON) * 100) / 100;
                return dd;
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
                    return this.roundOffValue(value) + ' frames/s';
                case measurmentUnit === 'overruns':
                    return this.roundOffValue(value) + ' overruns/s';
                case measurmentUnit === 'errors':
                    return this.roundOffValue(value) + ' errors/s';
                case measurmentUnit === 'packets':
                    return this.roundOffValue(value) + ' packets/s';
                case measurmentUnit === 'collisions':
                    return this.roundOffValue(value) + ' collisions/s';
                case measurmentUnit === 'other':
                    return this.roundOffValue(value) + ' days';
                case measurmentUnit === 'milliseconds':
                    return this.roundOffValue(value) + ' ms';
                case measurmentUnit === 'octets':
                    return this.roundOffValue(value) + ' octets';
                case measurmentUnit === 'centiseconds':
                    return this.roundOffValue(value) + ' cs';
                case measurmentUnit === 'kilobytes/second':
                    return this.roundOffValue(value) + ' kilobytes/second';
                case measurmentUnit === 'pages/second':
                    return this.roundOffValue(value) + ' pages/second';
                case measurmentUnit == 'percent':
                    return this.roundOffValue(value) + ' %';             
                default:
                    return this.roundOffValue(value);
            }
        }

}
