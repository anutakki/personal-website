$(function(){function e(){switch(k){case 12:case 1:case 2:w=0;break;case 3:case 4:case 5:w=1;break;case 6:case 7:case 8:w=2;break;case 9:case 10:case 11:w=3}}function t(){switch(!0){case d.wind<=F.calm:u="calm";break;case F.calm<d.wind&&d.wind<=F.strong:u="strong";break;case F.danger<d.wind:u="danger"}}function i(){O=Y[w].msg1,T=Y[w].low,A=Y[w].msg2,D=Y[w].high,G=Y[w].msg3}function o(){"calm"===u?(f=d.tempC,p=d.tempF):(f=d.windChill,p=d.windChill)}function n(){switch(!0){case d.tempC<=T:C=O;break;case T<d.tempC&&d.tempC<=D:C=A;break;case D<d.tempC:C=G}}function c(e,t){M.eq(e).children().text(t)}function a(e,t){B.eq(e).children().text(t)}function l(){W=W!==!0,W?q.slideDown(500):q.slideUp(500)}function s(){j=j!==!0;var e=500;N.fadeTo(0,0),j?(c(1,d.tempC+" °C"),c(2,Math.floor(1.61*d.wind)+" km/h"),a(0,"range "+d.lowC+" ~ "+d.highC+" °C"),a(3,d.tmrlowC+" ~ "+d.tmrhighC+" °C")):(c(1,d.tempF+" °F"),c(2,d.wind+" mph"),a(0,"range "+d.lowF+" ~ "+d.highF+" °F"),a(3,d.tmrlowF+" ~ "+d.tmrhighF+" °F")),N.fadeTo(e,1)}function r(){c(3,d.currently),c(4,d.city+" "+d.region),a(1,"sunset "+d.sunset),a(4,d.tmrtext),s()}function h(){r(),$("div#summaryBox").on("click",s),$("#detailBox").on("click",l)}function g(){e(),t(),o(),i(),n(),c(0,C)}function m(e){E=e,$.simpleWeather({location:e,unit:"f",success:function(e){d={tempF:e.temp,lowF:e.low,highF:e.high,tempC:e.alt.temp,lowC:e.alt.low,highC:e.alt.high,wind:e.wind.speed,windChill:e.wind.chill,currently:e.currently,city:e.city,region:e.region,sunset:e.sunset,tmrtext:e.forecast[1].text,tmrlowF:e.forecast[1].low,tmrhighF:e.forecast[1].high,tmrlowC:e.forecast[1].alt.low,tmrhighC:e.forecast[1].alt.high},h(),g()},error:function(e){$("#weather").html("<p>"+e+"</p>")}})}var d,w,u,f,p,C,y=new Date,k=y.getMonth()+1,F={calm:5,strong:20,danger:30},b,v,x,S;b={msg1:"STAY. IN.",low:-8,msg2:"Okay...",high:0,msg3:"YASSS! WARMTH!"},v={msg1:"Nope. So cold.",low:5,msg2:"Okay, a bit chilly.",high:15,msg3:"Oh Yesss!"},x={msg1:"Yeah, lil chilly.",low:18,msg2:"Yes! Go Go Go!",high:26,msg3:"Nope. Scorching-hot."},S={msg1:"Erm, kinda cold",low:11,msg2:"Okay, lil chilly",high:16,msg3:"Yes, go enjoy."};var Y;Y=[b,v,x,S];var O,T,A,D,G,M=$("ul#weatherSummary").children(),N=M.slice(1,3),q=$("ul#hiddenDetail");q.hide();var B=q.children(),W=!1,j=!1,E;navigator.geolocation?navigator.geolocation.getCurrentPosition(function(e){m(e.coords.latitude+","+e.coords.longitude)}):c(0,":( Your browser doesn't support geolocation")});