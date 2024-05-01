const {app} = require('../index');
const supertest = require('supertest')

test('Test GET users API',async()=>{
    await supertest(app)
    .get('/api/datas')
    .expect(200)
    .then(result=>{
        console.log(typeof result)
        expect(result  && typeof result ==='object')
    })
},10000);

