const schedule = require('node-schedule');


const AdvertisingPoint = require('../models/advertisingPoint')
const Street = require('../models/street')
const Size = require('../models/size')
const Order = require('../models/order')

const createUAdvertisingPoint = async (req, res) => {
  console.log('create AdvertisingPoint', req.body)

  let address = await Street.findOne({"streetName":req.body.address})
  if(!address) {address = new Street({ streetName: req.body.address })
  await address.save()}
  let size = await Size.findOne({"sizeName":req.body.size})
  if(!size) {size = new Size({ sizeName: req.body.size })
  await size.save()}
  const AdvertisingPointObj = new AdvertisingPoint({
    address: address.id,
    size: size._id,
    price: req.body.price,
    status: false
  })
  
  try {
     await AdvertisingPointObj.save()
    const newAdvertisingPointafterPopulate =await AdvertisingPoint.findOne({"_id":AdvertisingPointObj._id}).populate('address')
      res.status(200).json({
      message: 'new AdvertisingPoint created succesfully',
      newAdvertisingPoint: newAdvertisingPointafterPopulate
    })
  } catch (err) {
    res.status(500).send(err.message)
  }
}

const getAdvertisingPoint = async (req, res) => {
  console.log('get AdvertisingPoint')
  try {
    const AdvertisingPointObj = AdvertisingPoint.findById(req.params.id)
    console.log('AdvertisingPointObj', AdvertisingPointObj)
    if (AdvertisingPointObj)
      res.status(200).json({ AdvertisingPoint: AdvertisingPointObj })
    else res.status(404).send('AdvertisingPoint not exist')
  } catch (err) {
    res.status(500).send(err.message)
  }
}
const updateAdvertisingPoint = async (req, res) => {
  console.log('update AdvertisingPoint', req.body)
  //   let streetUpdate=''
  //   await Street.findOne({'streetName': req.body.address }, function (s, err) {
  //     console.log('APPERROR', err)
  //     streetUpdate = err
  //     console.log('APP', s)
  //   })
  // console.log("AP",street);

  //   const size = Size.findOne({ sizeName: req.body.size })

  AdvertisingPoint.findOneAndUpdate(
    { _id: req.body._id },
    {
      $set: {
        // address: streetUpdate.streetName,
        status: req.body.status,
        price: req.body.price
      }
    },
    { new: true },
    (err, doc) => {
      if (err) {
        res.status(500).send(err)
      }
      console.log('getalladvaterpoint')
      AdvertisingPoint.find()
        .populate('size')
        .populate('address')
        .then(ad => {
          res.status(200).send(ad)
        })
        .catch(err => res.send(err))
    }
  )
  // .then((b) =>
  //     console.log("😎",b)

  // )

  // .then(AdvertisingPoint => {
  //     console.log("up",advertisingPoint)
  //     res.status(200).json({ AdvertisingPoint: AdvertisingPoint })
  // }).catch(err =>{
  //      console.log("uperr",err)

  //     res.status(500).send(err.message)})
}

const deleteAdvertisingPoint = (req, res) => {
  console.log('delete AdvertisingPoint')
  AdvertisingPoint.findByIdAndDelete(req.params.id)
    .then(async () => {
      await AdvertisingPoint.find()
        .populate('size')
        .populate('address')
        .then(ad => {
          res.status(200).send(ad)
        })
    })
    .catch(err => res.send(err))
}

const getAllAdvertisingPoint = (req, res) => {
  console.log('getalladvaterpoint')
  AdvertisingPoint.find()
    .populate('size')
    .populate('address')
    .then(ad => {
      res.send(ad)
    })
    .catch(err => res.send(err))
}
const setAPstatus= async (req, res) => {


// const job = schedule.scheduleJob('22 9 * * *',async function (){
  let date_today= new Date();
  let month_today =date_today.getDate();
  let day_today= date_today.getDate();
  let year_today = date_today.getFullYear()
  console.log('function work every 12 on night');
  const order = await Order.find().populate('AdvertisingPointId')
    order.forEach(x => {
  
  if(x.startDate&&(x.startDate).getDate()==month_today&&(x.startDate).getMonth()==month_today&&(x.startDate).getFullYear()==year_today)
  x.AdvertisingPointId.staus=true
  if(x.endDate&&(x.endDate).getDate()==month_today&&(x.endDate).getMonth()==month_today&&(x.endDate).getFullYear()==year_today)
  x.AdvertisingPointId.status=false
  })
  
  // await order.save()
 

//});

}
module.exports = {
  createUAdvertisingPoint,
  getAdvertisingPoint,
  updateAdvertisingPoint,
  deleteAdvertisingPoint,
  getAllAdvertisingPoint,setAPstatus
}
