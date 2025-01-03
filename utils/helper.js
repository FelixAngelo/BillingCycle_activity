import moment from "moment"

const isValidBillingCycle = (billingCycle) => {
    if(billingCycle > 12 || billingCycle < 1){
        return false;
    }
     return true;
  };
  

  const isValidDate = (date) => {
    return !isNaN(new Date(`${date}`));
  };


  const parseDateTxt = (dateString) => {
    const month = dateString.slice(0, 2);
    const day = dateString.slice(2, 4);
    const year = dateString.slice(4);
    return !isNaN(new Date(`${year}-${month}-${day}T00:00:00.000+00:00`));
  };


  export { isValidBillingCycle, isValidDate, parseDateTxt};