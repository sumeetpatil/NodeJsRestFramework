# NodeJsRestFramework
Node Js Rest Api Framework

Generate Rest Api's using node js within no time.

Follow the steps for creating rest api :
- Install MySQL
- npm install package.json
- create the restapi table

`CREATE TABLE restapi (restid int(10) NOT NULL, url varchar(100) NOT NULL, rest_method varchar(10) NOT NULL, query_text text NOT NULL, error_text varchar(255) DEFAULT NULL, null_text varchar(255) DEFAULT NULL, PRIMARY KEY (restid) );`

- Create table. Example - po, with fields poid and potext.
- For POST create entry in rest api table and call rest api as follows

restId | rest_method | query_text | error_text | null_text
--- | --- | --- | --- | --- 
1 | testPost | POST | po | error_text | text_for_null_values


Url:/testPost

Method:POST

Content-Type:application/json

Body:{"poid":1, "potext":"po text"}


- For get create entry in rest api table and call rest api  as follows

restId | rest_method | query_text | error_text | null_text
--- | --- | --- | --- | --- 
2 | testGet | GET | select * from po | error_text | text_for_null_values

Url:/testGet

Method:GET


- For delete create entry in rest api table and call rest api as follows
 
restId | rest_method | query_text | error_text | null_text
--- | --- | --- | --- | --- 
3 | testDelete | DELETE | delete from po where poid:poid | error_text | text_for_null_values

Url:/testDelete?poid=1

Method:GET


- For update create entry in rest api table and call rest api as follows

restId | rest_method | query_text | error_text | null_text
--- | --- | --- | --- | --- 
4 | testUpdate | PUT | update po SET potext=;potext where poid=:poid | error_text | text_for_null_values

Url:/testUpdate?poid=1

Method:PUT

Content-Type:application/json

Body:{"potext":"test"}

