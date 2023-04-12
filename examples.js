/*
Before running this script,
first install the graphy supermodule in the current directory:

npm i graphy
*/

const fs = require('fs');
const graphy = require('graphy');
const factory = require('@graphy/core.data.factory');

//Load the patched version of the @graphy/content.ttl.write module,
//instead of the original version:
const ttlWrite = require('./main.js');

//The original version of the @graphy/content.ttl.write module (commented):
//const ttlWrite = require('@graphy/content.ttl.read');

let objPrefixes =
  {
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  owl: 'http://www.w3.org/2002/07/owl#',
  skos: 'http://www.w3.org/2004/02/skos/core#',
  lime: 'http://www.w3.org/ns/lemon/lime#',
  dc: "http://purl.org/dc/elements/1.1/",
  }
  
let objTurtleCons =
  {
  ">http://example.com/my-concept-scheme":
    {
      //this first predicate of the <http://example.com/my-concept-scheme> subject (i.e. "rdf:type")
      //will start on a new line
      //when style.toStartFirstPredicateOnNewLine = true
      //and it is not in style.firstPredicatesNotStartingOnNewLine,
      //or when it is in style.firstPredicatesStartingOnNewLine
      "rdf:type":
        [
        "skos:Concept",
        "lime:Lexicon"
        ],
      "rdfs:label":
        //these objects will start from a new line
        //when style.toStartObjectsOnNewLineInObjectLists = true
        //and their rdfs:label predicate is not in style.predicatesWhoseObjectsDontStartOnNewLineInObjectLists,
        //or when this predicate is in style.predicatesWhoseObjectsStartOnNewLineInObjectLists
        [
        '@en"My concept scheme',
        '@es"Mi esquema de conceptos',
        '@ru"Моя концептуальная схема',
        ],
      "dc:language":
        //this object will never start on a new line because it is not in an object list (i.e. in an array)
        '"en',
      "dc:creator":
        //put this object in an objects list represented by a one-element array
        //for it will start on a new line when the aforementioned properties of style are set
        [">http://example.com/john-smith"],
      "skos:hasTopConcept":
        [
        ">http://example.com/my-concept-scheme/concept1",
        ">http://example.com/my-concept-scheme/concept2",
        ">http://example.com/my-concept-scheme/concept3",
        ">http://example.com/my-concept-scheme/concept4",
        ">http://example.com/my-concept-scheme/concept5"
        ]
    },
  ">http://example.com/john-smith":
    {
    "rdfs:label":
      [
      '@en"John Smith',
      '@ru"Джон Смит',
      ]
    }
  }

let objConfig =
  {
  indent: "  ",
  toStartFirstPredicateOnNewLine: false,
  firstPredicatesStartingOnNewLine: [],
  firstPredicatesNotStartingOnNewLine: [],
  toStartObjectsOnNewLineInObjectLists: true,
  predicatesWhoseObjectsStartOnNewLineInObjectLists: [], //["foaf:list"],
  predicatesWhoseObjectsDontStartOnNewLineInObjectLists: [], //["a", "rdf:type"],  
  }


//Example 1. Default style:

let streemWriter1 = ttlWrite
  ({
  prefixes: objPrefixes,
  style: {}
  });

streemWriter1.pipe (process.stdout);

streemWriter1.write
  ({
  type: "c3",
  value:
    {
    [factory.comment()]: 'Default style:',
    [factory.newlines()]: true,
    ...objTurtleCons,
    [factory.newlines()]: true
    }
  })

streemWriter1.end ();

/*
Output:

<http://example.com/my-concept-scheme> rdf:type skos:Concept, lime:Lexicon ;
	rdfs:label "My concept scheme"@en, "Mi esquema de conceptos"@es, "Моя концептуальная схема"@ru ;
	dc:language "en" ;
	dc:creator <http://example.com/john-smith> ;
	skos:hasTopConcept <http://example.com/my-concept-scheme/concept1>, <http://example.com/my-concept-scheme/concept2>, <http://example.com/my-concept-scheme/concept3>, <http://example.com/my-concept-scheme/concept4>, <http://example.com/my-concept-scheme/concept5> .

<http://example.com/john-smith> rdfs:label "John Smith"@en, "Джон Смит"@ru .

*/


//Example 2. All the first predicates of their subjects start on a new line:

let streemWriter2 = ttlWrite
  ({
  prefixes: objPrefixes,
  style:
    {
    toStartFirstPredicateOnNewLine: true
    }
  });

streemWriter2.write
  ({
  type: "c3",
  value:
    {
    [factory.comment()]: 'All the first predicates of their subjects start on a new line:',
    [factory.newlines()]: true,
    ...objTurtleCons,
    [factory.newlines()]: true
    }
  })

streemWriter2.pipe (process.stdout);
streemWriter2.end ();

/*
Output:

<http://example.com/my-concept-scheme> 
	rdf:type skos:Concept, lime:Lexicon ;
	rdfs:label "My concept scheme"@en, "Mi esquema de conceptos"@es, "Моя концептуальная схема"@ru ;
	dc:language "en" ;
	dc:creator <http://example.com/john-smith> ;
	skos:hasTopConcept <http://example.com/my-concept-scheme/concept1>, <http://example.com/my-concept-scheme/concept2>, <http://example.com/my-concept-scheme/concept3>, <http://example.com/my-concept-scheme/concept4>, <http://example.com/my-concept-scheme/concept5> .

<http://example.com/john-smith> 
	rdfs:label "John Smith"@en, "Джон Смит"@ru .

*/


//Example 3. All objects in object lists (i.e. separated by commas) start on a new line:

let streemWriter3 = ttlWrite
  ({
  prefixes: objPrefixes,
  style:
    {
    toStartObjectsOnNewLineInObjectLists: true
    }
  });

streemWriter3.pipe (process.stdout);

streemWriter3.write
  ({
  type: "c3",
  value:
    {
    [factory.comment()]: 'All objects in object lists (i.e. separated by commas) start on a new line:',
    [factory.newlines()]: true,
    ...objTurtleCons,
    [factory.newlines()]: true
    }
  })

streemWriter3.end ();

/*
Output:

<http://example.com/my-concept-scheme> rdf:type 
		skos:Concept, 
		lime:Lexicon ;
	rdfs:label 
		"My concept scheme"@en, 
		"Mi esquema de conceptos"@es, 
		"Моя концептуальная схема"@ru ;
	dc:language "en" ;
	dc:creator 
		<http://example.com/john-smith> ;
	skos:hasTopConcept 
		<http://example.com/my-concept-scheme/concept1>, 
		<http://example.com/my-concept-scheme/concept2>, 
		<http://example.com/my-concept-scheme/concept3>, 
		<http://example.com/my-concept-scheme/concept4>, 
		<http://example.com/my-concept-scheme/concept5> .

<http://example.com/john-smith> rdfs:label 
		"John Smith"@en, 
		"Джон Смит"@ru .

*/


//Example 4. All the first predicates of their subjects start on a new line
//and and all objects in object lists start on a new line:

let streemWriter4 = ttlWrite
  ({
  prefixes: objPrefixes,
  style:
    {
    toStartFirstPredicateOnNewLine: true,
    toStartObjectsOnNewLineInObjectLists: true
    }
  });

streemWriter4.write
  ({
  type: "c3",
  value:
    {
    [factory.comment()]: 'All the first predicates of their subjects and all objects in object lists start on a new line:',
    [factory.newlines()]: true,
    ...objTurtleCons,
    [factory.newlines()]: true
    }
  })

streemWriter4.pipe (process.stdout);
streemWriter4.end ();

/*
Output:

<http://example.com/my-concept-scheme> 
	rdf:type 
		skos:Concept, 
		lime:Lexicon ;
	rdfs:label 
		"My concept scheme"@en, 
		"Mi esquema de conceptos"@es, 
		"Моя концептуальная схема"@ru ;
	dc:language "en" ;
	dc:creator 
		<http://example.com/john-smith> ;
	skos:hasTopConcept 
		<http://example.com/my-concept-scheme/concept1>, 
		<http://example.com/my-concept-scheme/concept2>, 
		<http://example.com/my-concept-scheme/concept3>, 
		<http://example.com/my-concept-scheme/concept4>, 
		<http://example.com/my-concept-scheme/concept5> .

<http://example.com/john-smith> 
	rdfs:label 
		"John Smith"@en, 
		"Джон Смит"@ru .

*/


//Example 5.
//All the first predicates of their subjects with the exception of the rdf:type predicate,
//and all objects in object lists start on a new line with the exception of the objects of the rdf:type predicate

let streemWriter5 = ttlWrite
  ({
  prefixes: objPrefixes,
  style:
    {
    toStartFirstPredicateOnNewLine: true,
    firstPredicatesNotStartingOnNewLine: ["a", "rdf:type"],
    toStartObjectsOnNewLineInObjectLists: true,
    predicatesWhoseObjectsDontStartOnNewLineInObjectLists: ["a", "rdf:type"]
    }
  });

streemWriter5.write
  ({
  type: "c3",
  value:
    {
    [factory.comment()]: 'All the first predicates of their subjects start on a new line with the exception of the rdf:type predicate',
    [factory.comment()]: 'and all objects in object lists start on a new line with the exception of the objects of the rdf:type predicate:',
    [factory.newlines()]: true,
    ...objTurtleCons,
    [factory.newlines()]: true
    }
  })

streemWriter5.pipe (process.stdout);
streemWriter5.end ();

/*
Output:

<http://example.com/my-concept-scheme> rdf:type skos:Concept, lime:Lexicon ;
	rdfs:label 
		"My concept scheme"@en, 
		"Mi esquema de conceptos"@es, 
		"Моя концептуальная схема"@ru ;
	dc:language "en" ;
	dc:creator 
		<http://example.com/john-smith> ;
	skos:hasTopConcept 
		<http://example.com/my-concept-scheme/concept1>, 
		<http://example.com/my-concept-scheme/concept2>, 
		<http://example.com/my-concept-scheme/concept3>, 
		<http://example.com/my-concept-scheme/concept4>, 
		<http://example.com/my-concept-scheme/concept5> .

<http://example.com/john-smith> 
	rdfs:label 
		"John Smith"@en, 
		"Джон Смит"@ru .

*/


//Example 6.
//The rdfs:label predicate, when being the first predicate of its subject, starts on a new line, and
//the objects in object lists of the skos:hasTopConcept predicate start on a new line:

let streemWriter6 = ttlWrite
  ({
  prefixes: objPrefixes,
  style:
    {
    firstPredicatesStartingOnNewLine: ["rdfs:label"],
    predicatesWhoseObjectsStartOnNewLineInObjectLists: ["skos:hasTopConcept"]
    }
  });

streemWriter6.write
  ({
  type: "c3",
  value:
    {
    [factory.comment()]: 'The rdfs:label predicate, when being the first predicate of its subject, starts on a new line, and',
    [factory.comment()]: 'the objects in object lists of the skos:hasTopConcept predicate start on a new line:',
    [factory.newlines()]: true,
    ...objTurtleCons,
    [factory.newlines()]: true
    }
  })

streemWriter6.pipe (process.stdout);
streemWriter6.end ();

/*
Output:

<http://example.com/my-concept-scheme> rdf:type skos:Concept, lime:Lexicon ;
	rdfs:label "My concept scheme"@en, "Mi esquema de conceptos"@es, "Моя концептуальная схема"@ru ;
	dc:language "en" ;
	dc:creator <http://example.com/john-smith> ;
	skos:hasTopConcept 
		<http://example.com/my-concept-scheme/concept1>, 
		<http://example.com/my-concept-scheme/concept2>, 
		<http://example.com/my-concept-scheme/concept3>, 
		<http://example.com/my-concept-scheme/concept4>, 
		<http://example.com/my-concept-scheme/concept5> .

<http://example.com/john-smith> 
	rdfs:label "John Smith"@en, "Джон Смит"@ru .

*/


//Example 7 with nested nodes:

let streemWriter7 = ttlWrite
  ({
  prefixes:
    {
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    owl: 'http://www.w3.org/2002/07/owl#',
    dbr: 'http://dbpedia.org/resource/',
    dbo: 'http://dbpedia.org/ontology/',
    demo: 'http://ex.org/demo#',
    eg: 'http://ex.org/owl#'
    },
  style:
    {
    toStartFirstPredicateOnNewLine: true,
    toStartObjectsOnNewLineInObjectLists: true,
    indent: "  "
    }
  });

streemWriter7.write
  ({
  type: "c3",
  value:
    {
    [factory.comment()]: 'Example with nested nodes:',
    [factory.newlines()]: true,
     
    // triples about dbr:Banana
    [factory.comment()]: 'hey look, a comment!',
    'dbr:Banana':
      {
      // `a` is shortcut for rdf:type
      a: 'dbo:Plant',

      // primitive ES types map to XSD datatypes
      'eg:boolean': true,
      'eg:integer': 42,
      'eg:decimal': 0.1,
      'eg:infinity': Infinity,

      // list of objects
      'rdfs:label': ['@en"Banana', '@fr"Banane', '@es"Plátano'],

      // nested array becomes an RDF collection
      'demo:steps':
        [
          ['demo:Peel', 'demo:Slice', 'demo:distribute'],
        ],
      },

    // example from OWL 2 primer: https://www.w3.org/TR/owl2-primer/#Property_Restrictions
    [factory.comment()]: 'hey look, another comment!',
    'eg:HappyPerson':
      {
      a: 'owl:Class',

      // nesting an anonymous blank node
      'owl:equivalentClass':
        {
        a: 'owl:Class',

        // a list of objects
        'owl:intersectionOf':
           [
             // nested anonymous blank node
             {
             a: 'owl:Restriction',
             'owl:onProperty': 'eg:hasChild',
             'owl:allValuesFrom': 'eg:Happy',
             },
             // another nested anonymous blank node
             {
             a: 'owl:Restriction',
             'owl:onProperty': 'eg:hasChild',
             'owl:someValuesFrom': 'eg:Happy',
             },
           ],
        },
      },
    }
  })

streemWriter7.pipe (process.stdout);
streemWriter7.end ();

/*
Output:

# hey look, a comment!
dbr:Banana 
  a dbo:Plant ;
  eg:boolean true ;
  eg:integer 42 ;
  eg:decimal 0.1 ;
  eg:infinity "INF"^^<http://www.w3.org/2001/XMLSchema#double> ;
  rdfs:label 
    "Banana"@en, 
    "Banane"@fr, 
    "Plátano"@es ;
  demo:steps 
    (
      demo:Peel
      demo:Slice
      demo:distribute
    ) .

# hey look, another comment!
eg:HappyPerson 
  a owl:Class ;
  owl:equivalentClass [
    rdf:type owl:Class ;
    owl:intersectionOf 
      [
        rdf:type owl:Restriction ;
        owl:onProperty eg:hasChild ;
        owl:allValuesFrom eg:Happy ;
      ], 
      [
        rdf:type owl:Restriction ;
        owl:onProperty eg:hasChild ;
        owl:someValuesFrom eg:Happy ;
      ] ;
  ] .

*/
