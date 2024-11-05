import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();

const uploadsDir = path.join(__dirname, "../uploads");
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
    res.json({
      message: "文件上传成功",
      filename: req.file.filename,
    });
  } else {
    res.status(400);
  }
});

module.exports = app;
