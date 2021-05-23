const Koa = require('koa');
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose')
const moment = require('moment-jalaali')
const cors = require('koa-cors')
const _ = require('lodash')
const serve = require('koa-static');

const Records = require('./Records')
mongoose.connect(`mongodb+srv://Admin:Hamed@@123@eventbookingnosqldb.wjhm3.mongodb.net/minesweeper?retryWrites=true&w=majority`
  , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => {
    console.log('DB IS CONNECTED')
  })
  .catch(err => {
    console.log('error in connecting database ====>>>', err)
  })


const app = new Koa();
const router = new Router()
// response
app.use(cors({
  origin: 'http://localhost:63342'
}))
app.use(router.allowedMethods())
app.use(serve(`${__dirname}/public`))
app.use(bodyParser())
router.get('/scoreboard/:type'
  , async (ctx) => {
    let records = await Records.find({level: ctx.params.type})
    records.map(rec => {
      rec._doc.record = parseInt(rec._doc.record)
      return rec._doc
    })
    records = _.sortBy(records, 'record')
    ctx.body = records
  })
router.post('/scoreboard'
  , async (ctx) => {
    const params = ctx.request.body
    params.date = moment().format('YYYY/MM/DD HH:mm:ss')
    const record = new Records(params)
    const test = record.save()
    ctx.body = test
  })
app.use(router.routes())

app.listen(process.env.PORT || 3000, () => {
  console.log('server running on 3000')
});
