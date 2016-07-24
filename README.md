# 

This app is based on our library oxyzen(https://github.com/metaschema/oxyzen).
- supports document linking in different collections
- textual searches as in LIKE "%foo%", [until new native query tools are developed]
- DEMO : https://cdn.rawgit.com/metaschema/oxyzen/master/index.html

I was very intrigued by this year's firebase roll in the [Google io 2016].
I have been looking for a serverless platform with database and integrated security...

Firebase seems like a comfortable starting point for some things, the features that attract me the most are:
- Obviously and foremost : the realtime database + logins providers + data access rules
- Integrated Analytics
- Cloud console integrated with google services.

Previously I have been searching and successfully tried MANY other nosql db accessible via rest api (one excellent example https://www.clusterpoint.com).
The difficulties I have found using others rest nosql dbs basically end up being two :
- P1-Users login not integrated / data access rules missing / near impossible security model (without a third party (see P2)).
- P2-The need of different tools and server - adding drastically to the overall complexity of managing a small project.

--/

With Firebase all this is solved, plus it's awesome (realtime listeners and stuff...), but we end up with just a couple of things to implement.
- Relations
- Texual searches

I know great things can be implemented without those concepts - but some can't.
However those concepts can be built on top of existing api calls and with a simple data model.
Note infact that if one's data is "indexed" then she shouldn't really need "LIKE%foo%" queries anymore... the index is infact build to avoid it. So once the data is indexed the queries that firebase provides should be more than enough.

So I made a small library to help me do this couple this just easily, and this demo to test it.

--/

Things that work : 
- Loading on the fly of code snippet in the form the one firebase gives now (3.0).
- Login in our or other firebase project - given the access the js origin (rawgit.com as the time of wrinting this document - or localhost if you can)
- Works in localhost - and it' suggested to use localhost if you want to test the demo with your firebase project, as it's default in firebase access rules, so it doesn't require inserting rawgit.com in the javascript allowed origins.
- Saving a new or updating an existing json document in an existing or new collection.
- Textually search in the documents that have been inserted using oxygen.
- Logout

Things that half work
- LINKING and UNLINKING - working the API not tested in the UI.
- Delete is not deleting all, the text index(es) have yet to be cleaned on delete
- Document versions and logs actually get automatically saved in the db - but the UI of the demo does not allow seeing them (the buttons are not working)

Things that don't work : 
- reindexing of existing tables is not implemented
- various other text index implementations are missing (#hashed words - titles, -$rels.*.title)
- no trash is implemented
