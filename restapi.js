var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'host_name',
  user     : 'user_name',
  password : 'password',
  database : 'database name'
});

connection.connect(function(err) {
  if(err!=null){
                console.log("Error in connection - " + err);
        }
});

connection.on('error', function(err) {
  console.log(err.stack); 
});

var bodyParser = require('body-parser');
var express = require('express');
var app = express();
app.use(bodyParser.json());

var generateApis = {
	restApiMain:"select * from restapi",
	generateRestApis:function(){
		  connection.query(this.restApiMain, function(err, rows, fields) {
		  if (err) throw err;
		  rows.forEach(function(obj){
			  generateApis.restApi(obj.restid, obj.url, obj.rest_method, obj.query_text, obj.error_text, obj.null_text); 
		  });
		});
	},
	restApi:function(restId, url, restMethod, query, errorText, nullText){
		if(url.substring(0,1)!="/"){
			url = "/" + url;
		}
		
		if(restMethod.toLowerCase()=="get" || restMethod.toLowerCase()=="delete"){
			generateApis.createGet(url, query, errorText, nullText);
		}else if(restMethod.toLowerCase()=="post"){
			generateApis.createPost(url, query, errorText, nullText);
		}else if(restMethod.toLowerCase()=="put"){
			generateApis.createPut(url, query, errorText, nullText);
		}
		
	},
	createGet:function(url, q, errorText, nullText){
		app.get(url, function(req, res){
		  var query = q;	
		  var errTxt = errorText;
		  var nullTxt = nullText;
		  if(query.search(":")!=-1){
		    	query = generateApis.generateQuery(req.query, query);
		  }
		  
		  console.log(query);

		  connection.query(query, function(err, rows, fields) {
		  if (err){
				console.log(err.stack);

		  		if(!(errTxt=="" || errTxt==null)){
		  			res.send(generateApis.generateMessage(errTxt, "ERROR", null));
		  		}else{
		  			res.send(generateApis.generateMessage(err.code, "ERROR", null));
		  		}

		    }else{

		    	if(rows.length==0){
		    		if(!(nullTxt==null || nullTxt=="")){
			  			res.send(generateApis.generateMessage(nullTxt, "WARN", null));
			  			return;
			  		}
		    	}

				res.send(generateApis.generateMessage("success", "INFO", rows));		  
		    }
		  });		  
		});
	},
	createPost:function(url, q, errorText, nullText){
		app.post(url, function(req, res){
			  var errTxt = errorText;
			  var nullTxt = nullText;
			  var query = "INSERT INTO "+q+" SET ?";
			  connection.query(query, req.body, function(err, result) {
			  	if (err){ 
						console.log(err.stack);

				  		if(!(errTxt=="" || errTxt==null)){
				  			res.send(generateApis.generateMessage(errTxt, "ERROR", null));
				  		}else{
				  			res.send(generateApis.generateMessage(err.code, "ERROR", null));
				  		}
				
				}else{
			  		
					res.send(generateApis.generateMessage("success", "INFO", []));		 

				}
			  });							
		});
	},
	createPut:function(url, q, errorText, nullText){
		console.log(q);
		app.put(url, function(req, res){
		  var query = q;	
		  var errTxt = errorText;
		  var nullTxt = nullText;
		  
		  console.log(query);

		  if(query.search(":")!=-1){
		    	query = generateApis.generateQuery(req.query, query, ":");
		  }

		  if(query.search(";")!=-1){
		    	query = generateApis.generateQuery(req.body, query , ";");
		  }		  
		  
		  console.log(query);

		  connection.query(query, function(err, result) {
		  if (err){
				console.log(err.stack);

		  		if(!(errTxt=="" || errTxt==null)){
		  			res.send(generateApis.generateMessage(errTxt, "ERROR", null));
		  		}else{
		  			res.send(generateApis.generateMessage(err.code, "ERROR", null));
		  		}

		    }else{

				res.send(generateApis.generateMessage("success", "INFO", ""));		  

		    }
		  });		  
		});
	},
	generateQuery:function(params, query, symbol){
		var qSymbol = symbol;
		var q_colon = query.indexOf(qSymbol);
		if(q_colon!=-1){
			var q_space = query.indexOf(" ",q_colon);
			if(q_space==-1){
				q_space = query.length;
			}

			var param = query.substring(++q_colon, q_space);
			var paramsReplaceText = "";
			if(symbol==";"){
				if(typeof params[param] == "string"){
	                paramsReplaceText = "'"+params[param]+"'";
				}else{
					paramsReplaceText = params[param];
				}
			}else{
				paramsReplaceText = params[param];
			}

			query = query.replace(qSymbol+param, paramsReplaceText);
			query = generateApis.generateQuery(params, query);			
		}
		
		return query;
	},
	generateMessage:function(msgTxt, type, data){
			var obj = {};
			if(data!=null){
				obj.data = data;	
			}else{
				obj.data = "[]";
			}

			obj.msg = msgTxt;
			obj.type = type;
			var res = JSON.stringify(obj);
			console.log(res);
			return res;
	}
};

app.get('/reloadMetadata', function(req, res){
  generateApis.generateRestApis();
  res.send("Success");
});

generateApis.generateRestApis();

app.listen(3000)
