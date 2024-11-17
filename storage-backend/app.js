const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();

const uploadsDir = path.join(__dirname, "./uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use("/uploads", express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  if (req.file) {
    res.status(200).json({
      message: "文件上传成功",
      filename: req.file.filename,
    });
  } else {
    res.status(500);
  }
});

module.exports = app;
