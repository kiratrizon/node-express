const PORT = process.env.PORT || 3000;
const app = require('./app');

const sendApiResponse = (res, message, error = false) => {
    const response = { message, error };
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response, null, 4));
};


app.use((req, res) => {
    let [,r] = req.path.split('/');
    if (r === 'api'){
        sendApiResponse(res, 'This is an API response');
    } else {
        res.render('error', { message: 'Page Not Found' });
    }
});

module.exports = app;