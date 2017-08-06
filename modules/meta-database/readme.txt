The database module is made to be multiprovider.
A database provider connector is requested to implements a series of methods, much like an interface.
Through the use of such methods the following functionalities are available in a cross provider fashion:
-Document Collections : your data is arranged in documents and documents are arranged in document collections.
-Relations : Any document can be related to any other document in any collection, plus, any metadata can be attached to such relation.
-Subcollections : This is optimized for use instead of relations, if your documents in one or more of your collection have subdocuments.
-Find : A unified search function to search in any arbitrary collection, with a simple and intuitive expression syntax.

All the above functionalities work in a cross provider fashion, meaning you can for example create
relations between documents in different database providers, or simultaneously search and handle results
from different database providers.


