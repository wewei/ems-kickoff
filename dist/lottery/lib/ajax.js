window.AJAX=function(e){let t,s;e=Object.assign({},{type:"POST",async:!0,isJson:!0},e||{}),window.XMLHttpRequest?t=new XMLHttpRequest:window.ActiveXObject&&(t=new ActiveXObject("Microsoft.XMLHTTP")),e.isJson&&(s=JSON.stringify(e.data)),t.onreadystatechange=function(){if(4===t.readyState){if(200===t.status){let s=t.responseText;e.isJson&&(s=JSON.parse(s)),e.success&&e.success(s)}else console.log("There was a problem with the request.")}},t.open(e.type,e.url,e.async),t.setRequestHeader("Content-Type","application/json"),t.send(s)};