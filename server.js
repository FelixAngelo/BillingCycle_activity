import express from 'express';
import fs from "fs";
import multer from "multer";
import path from "path";
import connectDB from './config/database.js';
import { isValidBillingCycle, isValidDate, parseDateTxt} from './utils/helper.js';


const PORT = process.env.PORT || 8080;
const URI = process.env.DB_CONNECTION_STRING;

const app = express();

const uploadsDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["text/csv", "text/plain"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("File is not supported for processing"));

  }
};


const upload = multer({ storage, fileFilter }).single('file');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



  app.post('/api/uploads', (req, res) => {
    upload(req, res, async function (err) {

    //Catch error for unsupported file
      if(err) {
        return res.status(500).send({ message: err.message });
      }

      const filePath = req.file.path;
      const billingsData = [];
      const invalidRows = [];
  
      const fileExtension = req.file.originalname.split(".").pop();
      const isTxtFile = fileExtension === "txt";
      const isCsvFile = fileExtension === "csv";

      try{
        const fileContent = await fs.promises.readFile(filePath, "utf-8");
        const lines = fileContent
        .split("\n")
        .filter((line) => line.trim().length > 0);
     
        
        if(lines.length < 1) {
          res.send('No request(s) to read from the input file')
        }

        const txtFileQuery = lines.map((line, index) => {
         const row = line.split(",");
          const billingCycle = fileExtension === 'txt' ? isValidBillingCycle(parseInt(line.slice(0, 2), 10)) : isValidBillingCycle(parseInt(row[0], 10)) ;
          const startDate = fileExtension === 'txt' ? parseDateTxt(line.slice(2, 10)) : isValidDate(row[1]);
          const endDate = fileExtension === 'txt' ? parseDateTxt(line.slice(10, 18)): isValidDate(row[2]);
        
          console.log({
            billing_cycle: billingCycle,
            start_date: startDate,
            end_date: endDate,
            index: index
          });

          if(!startDate){
            res.status = 422;
            res.send(`Invalid Start Date format at row ${index+1}`)
          }

          if(!endDate){
            res.status = 422;
            res.send(`Invalid End Date format at row ${index+1}`)
          }
          
          if(!billingCycle){
            res.status = 422;
            res.send(`Billing Cycle not on range at row ${index+1}`)
          }
      
        });

        res.send("Good");
      }catch (error) {
        console.error("An error occurred while processing the file:", error.message);
      }
    
})
    

  
  })



connectDB(URI).then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });