
// Transpile all code following this line with babel and use 'env' (aka ES6) preset.
require('babel-register')({
    presets: [ 'env' ]
});

let Entity = require('../src/modules/entities').default;

let xauth = 'AABAVQ7g4AQx-vuzY8sOAoz8whIIUcIO2PyaKL961_JX7-OQ4R8boOskjOowTGFF2ucULQp7eQr9d4grXeW252aJw_y_4oJJwj7m9QXpOcWrTO4Y9cltA6OOcSML_KnD_Xe16u4OOLER0Q';
let entities = new Entity(xauth, 867246);

let resources = entities.list().then((response) => {
    let here = response;
}).catch((err) => {
    let error = err;
});
