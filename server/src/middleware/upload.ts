import multer from "multer";
import fs from "fs";

//Ensure uploads directory exists before multer tries to write to it
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Unique name prevents filename collisions
    // Original filename is NOT used here — avoids path traversal in storage
    const uniqueName =
      Date.now() + "-" + Math.random().toString(36).slice(2) + ".pdf";
    cb(null, uniqueName);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  // First layer: MIME type check
  // This alone can be spoofed — magic bytes are validated in the controller
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  // File size limit prevents DoS via huge uploads
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
    files: 1,
  },
});