const months={
    '0':'Jan',
    '1':'Feb',
    '2':'Mar',
    '3':'Apr',
    '4':'May',
    '5':'Jun',
    '6':'Jul',
    '7':'Aug',
    '8':'Sep',
    '9':'Oct',
    '10':'Nov',
    '11':'Dec' 
};
const weeks = {
    '0':'Mon',
    '1':'Tue',
    '2':'Wed',
    '3':'Thu',
    '4':'Fri',
    '5':'Sat',
    '6':'Sun'
};

function formatDate(date){
    if(!date)
      return new Date();
     date = new Date(date);
    if(date=='Invalid Date')
       return false;
     let [day,week,month,year] = [date.getDate(),date.getDay(),date.getMonth(),date.getFullYear()];
     
     if(day<10){
        day = '0'+day;
     }
    week = weeks[week];
    month = months[month];
  return week+' '+month+' '+day+' '+year;
     
}

module.exports = {formatDate};