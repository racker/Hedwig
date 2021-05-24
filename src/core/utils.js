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
}
