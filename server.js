const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const handleError = (err, res) => {
  res.status(500).contentType("text/plain").end("Oops! Something went wrong!");
};

const upload = multer({
  dest: "./public/uploads",
});

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5500;

app.use(cors());
app.use(express.json());

app.use(express.static("./public"));

app.get("/", (req, res) => {
  try {
    res.status(200);
    res.end("connected");
  } catch (err) {
    handleError(err, res);
  }
});

app.post("/upload", upload.single("file"), (req, res) => {
  try {
    // console.log(req.body);
    // console.log(req.file);
    const invoiceNumber = req.body["invoiceNumber"];
    if (invoiceNumber.split(" ").length === 1) {
      const tempPath = req.file.path;
      const extName = path.extname(req.file.originalname).toLowerCase();
      const targetPath = path.join(
        __dirname,
        `./public/uploads/${invoiceNumber}${extName}`
      );

      // console.log(invoiceNumber);
      fs.rename(tempPath, targetPath, (err) => {
        if (err) return handleError(err, res);

        res.status(200).contentType("text/plain").end("File uploaded!");
      });
    } else {
      res.status(500).end("Invoice Number is not correct!");
    }
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
});

app.listen(port, () => console.log(`Server is listening on port: ${port}`));
