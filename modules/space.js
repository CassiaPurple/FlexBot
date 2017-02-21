var flexbot = global.flexbot
var request = require("request");

flexbot.addCommand("apod","get the astronaumical picture of the day.",function(msg){
	request.get("https://api.nasa.gov/planetary/apod?api_key=bZm8t6j7Tr6nw9bJJxbpXDVkH2v2GRsOsOnvzOOk",function(e,res,body){
    		if(!e && res.statusCode == 200){
       			let data = JSON.parse(body);

			msg.channel.createMessage({embed:{
    				color:0x0B3D91,
    				title:data.title,
    				description:data.date+"\n\n[Full Image]("+data.hdurl+")",
    				image:{
    				    url:data.url
    				},
    				footer:{
    				    text:"Powered by NASA API",
    				    icon_url:"https://api.nasa.gov/images/logo.png"
    				}
			}});
		}
	})
},["aspod","asspod","aspotd","apd"])
