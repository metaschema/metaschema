# firebase-oxygen
light, standalone, pure firebase db model wrapper
- supports document linking in different collections
- textual searches as in LIKE "%foo%", [until new native query tools are developed]
- DEMO : http://rawgit.com/hidekiyamamoto/firebase-oxygen/master/index.html

I was very intrigued by this year FireBase roll in the [Google io 2016].
I have been looking for a serverless platform with database and integrated security (...yes if you have no server you shall manage no user, so it has to be integrated).

Firebase seems like a comfortable starting point for somethings, the features that attract me the most are:
- Obviously and foremost : the realtime database + logins providers + data access rules
- Integrated Analytics
- Cloud console integrated with google services.

Previously I have been successfully using many other nosql db accessible via rest api (one excellent example https://www.clusterpoint.com).
The difficulties I have found using others rest nosql dbs basically end up being two :
- P1-Users login not integrated / data access rules missing / near impossible security model.
- P2-The need of different tools and server - possibly also taking part in security and users login. Because the other db services are just db services one could never bring home any real life project with "just it".

--

With Firebase all this is solved, plus it's awesome (realtime listeners and stuff...), but we end up with just a couple of "small" things to implement.
- Relations
- Texual searches

I know great things can be implemented without those concepts - but some can't.
However those concepts can be built on top of existing api calls and with a simple data model.
Note infact that of one's data is "indexed" then she should not really need "LIKE" queries anymore... the index is infact build to avoid it. So once the data is indexed the queries that firebase provides should be more than enough.

So I made a small library to help me do this couple this just easily, and this demo to test it.
