const { app,userModel } = require('../index');
const supertest = require('supertest');


test('Test GET users API', async () => {
    await supertest(app)
        .get('/api/datas')
        .expect(200)
        .then(response => {
            expect(response && typeof response.body === 'object').toBeTruthy();
        });
}, 30000);

test('should return "Server is running"', async () => {
    await supertest(app)
        .get("/")
        .expect(200)
        .then((response) => {
            expect(response.text).toBe('Server is running');
        });
});


