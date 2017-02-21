var flexbot = global.flexbot;
var emoji = require("node-emoji");
var fs = require("fs");
var itemdata = JSON.parse(fs.readFileSync(__dirname+"/../data/items.json"));

let doPage = function(msg,name,data,index,func,max=20){
	let o = [];

	for(let i=(index-1)*max;i<(data.length > index*max ? index*max : data.length);i++){
		let item = data[i];
		o.push("["+(i+1)+"] "+item.name);
	}

	return flexbot.awaitForMessage(msg,name+"\n```ini\n"+o.join("\n")+"\n"+(index > 1 ? "\n[<] Previous Page" : "")+(data.length > index*max ? "\n[>] Next page" : "")+"\n[c] Close\n```",func)
};

flexbot.addCommand("inventory","See and manage your inventory",function(msg,args){
	flexbot.awaitForMessage(msg,"Inventory Menu\n```ini\n[1] View Inventory\n[2] View shop\n\n[c] Cancel\n```",(m)=>{
		if(m.content == "c"){
			return msg.channel.createMessage("Canceled.");
		}else if(m.content == 1){
			let sampledata = [
				{id:"sample",name:"Sample Item 1"},
				{id:"sample",name:"Sample Item 2"},
				{id:"sample",name:"Sample Item 3"},
				{id:"sample",name:"Sample Item 4"},
				{id:"sample",name:"Sample Item 5"},
				{id:"sample",name:"Sample Item 6"},
				{id:"sample",name:"Sample Item 7"},
				{id:"sample",name:"Sample Item 8"},
				{id:"sample",name:"Sample Item 9"},
				{id:"sample",name:"Sample Item 10"}
			];

			return doPage(m,"Inventory for **"+msg.author.username+"#"+msg.author.discriminator+"**:",sampledata,1,function(m2){
				return msg.channel.createMessage("[DEBUG/WIP] User inputed: `"+m2.content+"`");
			});
		}else if(m.content == 2){
			return msg.channel.createMessage("[DEBUG/WIP] User selected option 2");
		}
	});
},["inv"]);

flexbot.addCommand("items","Manage items.",function(msg,args){
	if(flexbot.isOwner(msg)){
		let a = args.split(" ");
		let cmd = a[0];
		let cargs = a.splice(1,a.length).join(" ").split(",");
		if(!args || !cmd){
			msg.channel.createMessage("Possible arguments: list, add, delete, edit");
		}else if(cmd == "add"){
			let id = cargs[0];
			let name = cargs[1];
			let desc = cargs[2];
			let em = cargs[3];

			if(!id || !name || !desc || !em){
				msg.channel.createMessage("One or more arguments missing. Format: `f!items add id,name,desc,emoji`");
			}else{
				if(itemdata[id]){ msg.channel.createMessage("Item already exists. Use `edit` to change it."); return }

				itemdata[id.toLowerCase()] = {
					id:id.toLowerCase(),
					name:name,
					desc:desc,
					emoji:em
				}

				msg.channel.createMessage("Added item "+em+" **"+name+"** (ID: `"+id+"`) with description `"+desc+"`.");
				fs.writeFileSync(__dirname+"/../data/items.json",JSON.stringify(itemdata));
			}
		}else if(cmd == "edit"){
			let id = cargs[0];
			let c = cargs[1].split(":");
			let prop = c[0];
			let str = c[1];

			if(!id){
				msg.channel.createMessage("Item ID not given. Format: `f!items update id,property:new value`");
			}else if(!prop){
				msg.channel.createMessage("Property missing. Format: `f!items update id,property:new value`");
			}else if(!str){
				msg.channel.createMessage("No value passed to change.");
			}else if(prop !== "name" && prop !== "desc" && prop !== "emoji"){
				msg.channel.createMessage("`"+prop+"` is an invalid property. Properties: name, desc, emoji");
			}else{
				itemdata[id][prop] = str;

				msg.channel.createMessage("Property `"+prop+"` of item `"+id+"` updated to `"+str+"`.");
				fs.writeFileSync(__dirname+"/../data/items.json",JSON.stringify(itemdata));
			}
		}else if(cmd == "delete"){
			let id = cargs[0];
			if(!id){
				msg.channel.createMessage("Item ID not given.");
			}else{
				delete itemdata[id];

				msg.channel.createMessage("Item `"+id+"` deleted.");
				fs.writeFileSync(__dirname+"/../data/items.json",JSON.stringify(itemdata));
			}
		}else if(cmd == "list"){
			let items = [];

			for(item in itemdata){
				let i = itemdata[item];
				items.push("ID: "+i.id+" | Name: "+i.name+" | Description: "+i.desc+" | Emoji: "+i.emoji);
			}
			msg.channel.createMessage("```xl\n"+items.join("\n")+"```");
		}
	}
});