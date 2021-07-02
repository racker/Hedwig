module.exports = async (page, scenario) => {
    const clickSelector = scenario.clickSelectors || scenario.clickSelector;
    const handle = (await page.waitForFunction(() => document.querySelector("#maas_cpu-system-usage > div > hedwig-graph > line-graph").shadowRoot.querySelector("#hedwig-TI1Nj > g > g.legend > text.textoutside7"))).asElement();

   // const buttonHandle = await page.evaluateHandle(`document.querySelector("#maas_cpu-system-usage > div > hedwig-graph > line-graph").shadowRoot.querySelector("#hedwig-TI1Nj > g > g.legend > text.textoutside7")`);
// Click element
   await handle.click();
    // if(clickSelector){
    //   await page.evaluate(() =>{
    //     const elements= [...document.querySelectorAll("body > hedwig-graph > line-graph")];
       

    //     elements.map(rootElement => {
    //       const shadowRoot = rootElement.shadowRoot;
    //       if (shadowRoot) {
    //         /**
    //          * WAY 1: Find the element and apply css to it directly
    //          */
    //         // this holds the top share button and pagination slides
    //         const eleme = shadowRoot.querySelector("#hedwig-TI1Nj > g > g.legend > text.textoutside7");
    //         eleme.click();
    //       }
    //     })
      
    //   })
      
    //   //await page.click(clickSelector);
    // }
    
   
};