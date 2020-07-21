export class Helper{
    constructor(){}


  /**
   * Create set of distinct values
   * @param {data} data 
   */
  maxValue(data) {
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
  maxTime(data) {
    let arr = [];
    data.forEach(element => {
      element.datapoints.forEach(el => {
        arr.push(el.time);
      });
    });
    return arr;
  }
}