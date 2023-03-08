/* eslint-disable import/prefer-default-export */
import multer from "multer";

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "./profilePictures/");
  },
  filename(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, callback) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
    callback(null, true); // accept file
  } else {
    callback(
      new Error("Filetype not supported. Please upload .png or .jpg"),
      false,
    ); // deny file
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 8,
  },
  fileFilter,
});
