const binance = require('node-binance-api')
const express = require('express')
const app = express()
const cors = require('cors');
const port = 3000
app.use(cors());
app.get('/prices', (req, res) => {
    console.log("-----------------------")
    console.log("-----------------------")
    console.log("New Requst...")
    console.log("/prices")
    var query = require('url').parse(req.url,true).query;
    var symb = query.symbol;
    var time = query.time;
    var count = query.count;
    console.log("symb = ",symb);
    console.log("time = ",time);
    console.log("count = ", count);
    //let symb = "ETHBTC"
    const bin = new binance().options({
        'APIKEY': 'HYoErXAxuWRHbQnmesjz7LQDzYkIl2z5vsedJ1oVxyTdIownJaco0dZs3quvT6Ax',
        'APISECRET': 'PVI2a13RvyBeoJVtRFWFOCOn9vaFdYHS6CugoXeIJK3TKdSLaXTwR5VrkHkogfnK3',
        'family': 4
    })


    const getPrice = new Promise(function(resolve,reject){
        const res = bin.prices(symb)
        resolve(res)
    })

    const getHistory = new Promise(function(resolve,reject){
        const res = bin.candlesticks(symb, time)
        resolve(res)
    })

    function time1(date){
        return date.getHours()*60 + date.getMinutes()
    }
    function time2(minutes){
        let h = Math.floor(minutes/60)
        let m = minutes % 60
        if(h < 10){
            h = '0' + h.toString()
        }
        else{
            h = h.toString()
        }
        if(m < 10){
            m = '0' + m.toString()
        }
        else{
            m = m.toString()
        }
        return h + ":" + m
    }
    var timeLabel = time.slice(0,time.length - 1)
   let prices = []
    getHistory.then(data => {
        var date = new Date()
        var fullMinutes = time1(date)

       for(let i = data.length - 1;i >=data.length - count ;i--){
        var pr = {"close":parseFloat(data[i][4]),"open":parseFloat(data[i][1]),"high":parseFloat(data[i][2]),"low":parseFloat(data[i][3]),
        "time":time2(fullMinutes)}

        fullMinutes=fullMinutes- Number(timeLabel)
        prices.push(pr)
       }
       prices.reverse()
       console.log("-----------------------")
       console.log("-----------------------")
       res.send((prices))
    })

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

