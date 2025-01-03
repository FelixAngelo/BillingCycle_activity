import mongoose from "mongoose";

const billingDatabaseSchema = new mongoose.Schema(
    {
        billing_cycle: Number,
        billing_month: String,
        amount: Number,
        start_date: Date,
        end_date: Date,
        last_edited: String,
        account: {
            account_name: String,
            date_created: Date,
            is_active: String,
            last_edited: String,
            customer: {
                first_name: String,
                last_name: String,
                address: String,
                status: String,
                date_created: Date,
                last_edited: String
            }
        }  
    }    
);

 mongoose.model("billings", billingDatabaseSchema);