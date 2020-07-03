
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
    convert(unit) {
        switch(true) {
            case unit === 'count':
                return '';
            case unit === 'b':
                return ' b';
            case unit === 'kb':
                return ' kb';
            case unit === 'mb':
                return ' mb';
            case unit === 'frames':
                return ' frames/s';
            case unit === 'overruns':
                return ' overruns/s';
            case unit === 'errors':
                return ' errors/s';
            case unit === 'packets':
                return ' packets/s';
            case unit === 'collisions':
                return ' collisions/s';
            case unit === 'other':
                return ' days';
            case unit === 'milliseconds':
                return ' ms';
            case unit === 'seconds':
                return ' s';
            default:
                return '%';
       }
    }
}

export class AxisRight {

    constructor() {

    }
}
