
const bcrypt = require('bcrypt');
const main = async () => console.log(await bcrypt.hash('root', 10));
main();