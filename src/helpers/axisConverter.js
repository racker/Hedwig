
/**
 * @name AxisLeft
 * @description
 * Class to handle conversion of Left Axis labels
 */
export class AxisLeft {

    constructor() {
    }

    /**
     * @name convert
     * @description
     * Function to return correct y axis tick label
     * @param {string} unit
     */
    convert(unit, d) {
        switch(true) {
            case unit === 'count':
                return d;
            case unit === 'b':
                return d + ' b';
            case unit === 'kb':
                return d + ' kb';
            case unit === 'mb':
                return d + ' mb';
            case unit === 'frames':
                return d + ' frames/s';
            case unit === 'overruns':
                return d + ' overruns/s';
            case unit === 'errors':
                return d + ' errors/s';
            case unit === 'packets':
                return d + ' packets/s';
            case unit === 'collisions':
                return d + ' collisions/s';
            case unit === 'other':
                return d + ' days';
            case unit === 'milliseconds':
                return d + ' ms';
            case unit === 'seconds':
                return d + ' s';
            default:
                return d + '%';
       }
    }
}

export class AxisRight {

    constructor() {

    }
}
