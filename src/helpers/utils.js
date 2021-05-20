
    /**
     * @description
     * Recursive function for returning value based on property path
     * @param o object
     * @param p string
     */
     function findByProp(o, prop) {
        if (!prop) return o;
        const properties = prop.split('.');
        return findByProp(o[properties.shift()], properties.join('.'));
      }




export {
    findByProp
}