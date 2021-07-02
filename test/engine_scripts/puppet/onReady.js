module.exports = async (page, scenario, vp) => {
    console.log('aooon    SCENARIO > ' + scenario.label);
     
    return await require('./clickAlert')(page, scenario);
  
    // add more ready handlers here...
  };