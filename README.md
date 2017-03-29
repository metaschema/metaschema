# Metaschema

This app is just gui, all functionalities are 100% based on our library **Oxyzen** (https://github.com/metaschema/oxyzen).

- supports document linking in different collections
- textual searches as in LIKE "%foo%", [until new native query tools are developed]
- DEMO : https://cdn.rawgit.com/metaschema/oxyzen/master/index.html
- A WEBSITE USING OXYZEN : eoitecne.it (Try the search function) - yes pure static - firebaseonly - no elastic.

# Why?

I have been searching and successfully tried MANY nosql db accessible via rest api (one excellent example https://www.clusterpoint.com).
The difficulties I have found using rest nosql dbs basically end up being two :
- P1-Users login not integrated / data access rules missing / near impossible security model (without a third party (see P2)).
- P2-The need of different tools and server - adding drastically to the overall complexity of managing a small project.

# Firebase is a solution

With Firebase all this is solved, plus it's awesome (realtime listeners and stuff), but we end up with just a couple of things to implement.
- Relations
- Texual searches

I was very intrigued by this year's Firebase roll in the [Google io 2016].
I have been looking for a serverless platform with database and integrated security.

Firebase seems like a comfortable starting point for some things, the features that attract me the most are:
- Obviously and foremost : the realtime database + logins providers + data access rules
- Integrated Analytics
- Cloud console integrated with google services.

I know great things can be implemented without those concepts - but some can't.
However those concepts can be built on top of existing api calls and with a simple data model.
Note infact that if one's data is "indexed" then she shouldn't really need "LIKE%foo%" queries anymore.  
The index is infact build to avoid it.  
So once the data is indexed the queries that firebase provides should be more than enough.

So I made a small library to help me do this couple this just easily, and this demo to test it.

