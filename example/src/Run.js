function Run(data){

  s = data.s;
  w = data.w;
  
  //split by comma, period, single space
  a = s.split(/[ ,.]+/);

  var count = 0;
  for (var i = 0; i < a.length; i++) {
    if (a[i].toLowerCase() === w.toLowerCase()) count++;
    if (a[i].toLowerCase() === w.toLowerCase()+'s') count++;//acount plurals
  };

  return count;

}

