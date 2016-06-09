# firebase-oxygen
light, standalone, pure firebase db model wrapper
- supports document linking in different collections
- textual searches as in LIKE "%foo%", [until forther tools are developed]

I was very intrigued by this year FireBase roll in the [Google io 2016].
I have been looking for a serverless platform with database and integrated security (...yes if you have no server you shall manage no user, so it has to be integrated).

Firebase seems like a comfortable starting point for somethings, the features that attract me the most are:
1-Obviously and foremost : the realtime database + logins providers + data access rules
2-Integrated Analytics
3-Cloud console integrated with google services.

Previously I have been successfully using other nosql db accessible via rest api (for example https://www.clusterpoint.com).
The difficulties I have found using others rest nosql dbs basically end up being two :
P1-Users login not integrated / data access rules missing / near impossible security model.
P2-The need of different tools and server - possibly also taking part in security and users login. Because the other db services are just db services one could never bring home any real life project with "just it".

--

With Firebase all this is solved, plus it's awesome (realtime listeners and stuff...), but we end up with just a couple of "small" things to implement.
-Relations
-Texual searches

I have found many negative answers, I have found many "in the future it will be possible" answers and I have found a post on the old firebase blog, that suggested deploying an instance of elastic search with some third party.
That seemed to work well, but I'd have again the problem P2.
Anyway this suggestion was inspiring, so I thought

What would the elastic search code do? Yhy would it need an instance on it's own? This solution wraps inserts and updates so that it can "index" your data, after that a mongodb server is used to store the index data, and to query it.

Note very well that one data is "indexed" then you should not REALLY need "LIKE" queries anymore... the index is infact build to avoid it. So once the data is indexed the queries that firebase provides should be more than enough.

So I made a small library to help me do this just easily.


