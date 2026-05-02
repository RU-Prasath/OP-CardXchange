const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const ExcelJS = require('exceljs');

// Get today's orders (for PrintHub screen)
router.get('/today', async (req, res) => {
  try {
    const start = new Date(); start.setHours(0,0,0,0);
    const end = new Date(); end.setHours(23,59,59,999);
    const orders = await Order.find({ createdAt: { $gte: start, $lte: end } }).sort('-createdAt');
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get all orders (admin)
router.get('/', auth, async (req, res) => {
  try {
    const { date, startDate, endDate } = req.query;
    let query = {};
    if (date) {
      const d = new Date(date);
      const start = new Date(d); start.setHours(0,0,0,0);
      const end = new Date(d); end.setHours(23,59,59,999);
      query.createdAt = { $gte: start, $lte: end };
    } else if (startDate && endDate) {
      const start = new Date(startDate); start.setHours(0,0,0,0);
      const end = new Date(endDate); end.setHours(23,59,59,999);
      query.createdAt = { $gte: start, $lte: end };
    }
    const orders = await Order.find(query).sort('-createdAt');
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get daily summary for calendar
router.get('/calendar', auth, async (req, res) => {
  try {
    const { year, month } = req.query;
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);
    const orders = await Order.find({ createdAt: { $gte: start, $lte: end }, status: 'completed' });

    const dailyData = {};
    orders.forEach(o => {
      const day = new Date(o.createdAt).getDate();
      if (!dailyData[day]) dailyData[day] = { earnings: 0, count: 0 };
      dailyData[day].earnings += o.total;
      dailyData[day].count += 1;
    });
    res.json(dailyData);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Create order
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = req.body.status;
    if (req.body.status === 'completed') order.completedAt = new Date();
    await order.save();
    res.json(order);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// Delete order
router.delete('/:id', auth, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Delete orders by date range
router.delete('/range/delete', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const start = new Date(startDate); start.setHours(0,0,0,0);
    const end = new Date(endDate); end.setHours(23,59,59,999);
    const result = await Order.deleteMany({ createdAt: { $gte: start, $lte: end } });
    res.json({ deleted: result.deletedCount });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Export orders to Excel
router.get('/export', auth, async (req, res) => {
  try {
    const { date, startDate, endDate } = req.query;
    let query = {};
    if (date) {
      const d = new Date(date);
      const start = new Date(d); start.setHours(0,0,0,0);
      const end = new Date(d); end.setHours(23,59,59,999);
      query.createdAt = { $gte: start, $lte: end };
    } else if (startDate && endDate) {
      const start = new Date(startDate); start.setHours(0,0,0,0);
      const end = new Date(endDate); end.setHours(23,59,59,999);
      query.createdAt = { $gte: start, $lte: end };
    }

    const orders = await Order.find(query).sort('createdAt');

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Orders');

    sheet.columns = [
      { header: 'S.No', key: 'sno', width: 6 },
      { header: 'Date', key: 'date', width: 12 },
      { header: 'Time', key: 'time', width: 10 },
      { header: 'Service', key: 'service', width: 20 },
      { header: 'Details', key: 'details', width: 25 },
      { header: 'Total (₹)', key: 'total', width: 12 },
      { header: 'Status', key: 'status', width: 12 }
    ];

    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1B8B5E' } };
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    orders.forEach((o, i) => {
      const d = new Date(o.createdAt);
      let details = '';
      if (o.pages) details += `${o.pages}pg`;
      if (o.copies) details += ` x ${o.copies}`;
      if (o.printType) details += ` ${o.printType}`;
      if (o.quantity) details += `Qty: ${o.quantity}`;
      if (o.size) details += ` ${o.size}`;
      if (o.binding) details += ' +Binding';
      if (o.lamination) details += ' +Lamination';

      sheet.addRow({
        sno: i + 1,
        date: d.toLocaleDateString('en-IN'),
        time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        service: o.service,
        details: details.trim(),
        total: o.total,
        status: o.status.charAt(0).toUpperCase() + o.status.slice(1)
      });
    });

    // Total row
    const totalRow = sheet.addRow({ sno: '', date: '', time: '', service: 'TOTAL', details: '', total: orders.reduce((s, o) => s + o.total, 0), status: '' });
    totalRow.font = { bold: true };

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=orders_${date || startDate + '_to_' + endDate}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
