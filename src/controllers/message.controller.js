const Report = require('../models/report.model')
exports.reportMessage = async (req, res) => {
    const data = req.body
    try {

        let newReport = new Report(data)

        await newReport.save()

        return res.status(200).json({message: 'successfully reported'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message })
    }
}