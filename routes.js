const index = require('./controllers/index');
const user = require('./controllers/user');
const campaign = require('./controllers/campaign');
const brands = require('./controllers/brands')
const post = require('./controllers/posts')
const  multipart  =  require('connect-multiparty');
const  multipartMiddleware  =  multipart({ uploadDir:  './uploads' });

module.exports = function (app) {
    app.get('/server-status', index.status);

    //user apis
    app.post('/verify-email', user.verifyEmail)
    app.post('/register', user.register)
    app.post('/complete-signup', user.completeSignup)
    app.post('/login', user.login)
    app.get('/users', user.getUsers)
    app.get('/users/:userid', user.getUserById)
    app.get('/profiles/:username', user.getUserByUsername)
    app.get('/deals', user.getDeals)
    app.post('/create-user', user.createUser)
    app.post('/update-user', user.updateUser)
    app.post('/set-password', user.setPassword)
    // /app.post('/set-password', user.setPassword)


    app.post('/campaign/create', campaign.create)
    app.post('/post/create', post.create)
    app.get('/post/getAll', post.get)
    app.post('/post/approve', post.approvePost)
    app.post('/post/availCoins', post.availCoins)
    app.get('/post/types', post.getPostTypes);
    app.get('/post/approvals/:userid', post.getPostForApproval);
    
    //brands
    app.post('/brand/create', brands.create)
    app.get('/brand/:brandid', brands.getBrandById)
    app.get('/user/brand/:userid', brands.getBrandByUserId)
    app.post('/brand/offer/create', brands.createOffer)
    app.get('/brand/offers/all', brands.getOffers)
    app.post('/offer/avail', brands.availOffer)

}