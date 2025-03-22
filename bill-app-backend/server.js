const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const PDFDocument = require("pdfkit");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});

app.post("/generate-pdf", (req, res) => {
    const { shopName, address, contact, items, nitems } = req.body;

    const doc = new PDFDocument();
    const filePath = "bill.pdf";
    doc.pipe(fs.createWriteStream(filePath));

    // Shop Details
    doc.fontSize(18).text(shopName, { align: "center" }).moveDown(0.5);
    doc.fontSize(12).text(`Address: ${address}`);
    doc.text(`Contact: ${contact}`).moveDown(1);

    // Table Header
    doc.fontSize(14).text("Items", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    
    let total = 0;
    items.forEach((item, index) => {
        const { name, quantity, price } = item;
        const itemTotal = quantity * price;
        total += itemTotal;
        doc.text(`${index + 1}. ${name} - ${quantity} x ₹${price} = ₹${itemTotal}`);
    });
    doc.fontSize(12).text(`Total: ₹${total}`, { align: "right" });

    doc.fontSize(14).text("neg Items", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    let total1 = 0;
    
    nitems.forEach((nitem, index) => {  // ✅ Correct `nitems`
        const { name1, quantity1, price1 } = nitem;
        const itemTotal1 = quantity1 * price1;
        total1 += itemTotal1;
        doc.text(`${index + 1}. ${name1} - ${quantity1} x ₹${price1} = ₹${itemTotal1}`);
    });
    doc.fontSize(12).text(`Total Neg : -₹${total1}`, { align: "right" });

    doc.moveDown(1);
    doc.fontSize(16).text(`Final Total: ₹${total-total1}`, { align: "right" });

    doc.end();
    
    doc.on("finish", () => {
        res.download(filePath, "bill.pdf");
    });
});

app.listen(5000, () => console.log("Server running on port 5000"));
