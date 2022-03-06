const mongoose = require('mongoose')
const Order = require('../models/order')
const User = require('../models/user')

var nodemailer = require('nodemailer');

const createOrder = async (req, res) => {
  console.log('create order', req.body)
  const avilable = await check_AP_avilable(req.body)
  if (!avilable)
    return res.status(401).json({ message: 'שלט תפוס', status: 401 })

  const order = new Order(req.body)
  if (
    !order.userId ||
    !order.startDate ||
    !order.endDate ||
    !order.AdvertisingPointId
  )
    return res.status(403).json({ message: 'חסר מידע', status: 403 })

  const newOrder = await order.save()
  if (newOrder)
  {
     sendEmail(newOrder)

    return res.status(200).json({
      message: 'new order created succesfully',
      newOrder: newOrder,
      status: 200
    })
  }
  return res.status(403).send('problam')
}
async function check_AP_avilable (order) {
  const startDate = new Date(order.startDate)
  const endDate = new Date(order.endDate)

  const ordersByAP = await Order.find({
    AdvertisingPointId: order.AdvertisingPointId
  })
  let available = true
  ordersByAP.forEach((item, index) => {
    if (
      (item.startDate <= startDate && item.endDate >= startDate) ||
      (item.startDate <= endDate && item.endDate >= endDate)
    ) {
      available = false
      return
    }
  })
  return available
}
const getAllOrders = async (req, res) => {
  console.log('😋🤩🙂😚')
  // Order.find({userId: req.params.userId})
  //   .populate('userId')
  //   .populate('AdvertisingPointId','address')
  //   .then(ad => {
  //     console.log(ad);
  //     res.send(ad)
  //   })
  //   .catch(err =>
  //   res.send(err))

  Order.find({ userId: req.params.userId })
    .populate({
      path: 'AdvertisingPointId',
      model: 'AdvertisingPoint',
      populate: {path:'address',path:'size'}
       // model: 'Street', 
      // },
      //  populate: 'size'
             //   path: 'size',
      // //  model: 'Size', 
      // }
    })
    .populate('userId')
    .exec(function (err, user) {
      if (err) {
        console.log('eerrorr', err)
        return res.status(403).send(err)
      }
      console.log(
        'good',
        user.AdvertisingPointId ? user.AdvertisingPointId.address : 'no'
      )
      return res.status(200).send(user)
    })
}
const deleteOrder = (req, res) => {
  console.log('delete Order',req.params.userId,req.params.orderId)
  Order.findByIdAndDelete(req.params.orderId).then(
    Order.find({ userId: req.params.userId })
      .populate({
        path: 'AdvertisingPointId',
        model: 'AdvertisingPoint',
        populate: {
          path: 'address',
          model: 'Street'
        }
      })
      .populate('userId')
      .exec(function (err, user) {
        if (err) {
          console.log('eerrorr', err)
          return res.status(403).send(err)
        }
        console.log(
          'good',
          user.AdvertisingPointId ? user.AdvertisingPointId.address : 'no'
        )
        return res.status(200).send(user)
      })
  )
}
async function sendEmail(order) {
  let user =await User.findOne({_id: order.userId})
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'chedva357@gmail.com',
    pass: 'tpr, buhchry'
  }
});

var mailOptions = {
  from: 'no-repla@advertstigpoint.com',
  to: user.email,
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}
module.exports = { createOrder, getAllOrders,deleteOrder }
