# @graphy/content.ttl.write patch

The [@graphy/content.ttl.write](https://www.npmjs.com/package/@graphy/content.ttl.write) module of the [graphy.js](https://github.com/blake-regalia/graphy.js) libraries generates Turtle serialization of an RDF graph represented by [a concise JSON object](https://graphy.link/concise).

In the generated Turtle code, the first predicate-objects pair of every subject is on one line with this subject, and any predicate-objects pair is written in one line. When an RDF graph contains long object lists, the generated Turtle code is difficult to read.

For example, in the following Turtle code, the objects of the `skos:hasTopConcept` predicate don't fit to the window:

```turtle
<http://example.com/my-concept-scheme> rdf:type skos:Concept, lime:Lexicon ;
	rdfs:label "My concept scheme"@en, "Mi esquema de conceptos"@es, "Моя концептуальная схема"@ru ;
	dc:language "en" ;
	dc:creator <http://example.com/john-smith> ;
	skos:hasTopConcept <http://example.com/my-concept-scheme/concept1>, <http://example.com/my-concept-scheme/concept2>, <http://example.com/my-concept-scheme/concept3>, <http://example.com/my-concept-scheme/concept4>, <http://example.com/my-concept-scheme/concept5> .
```

This code will be more readable, if it is formatted e.g. as follows:

```turtle
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
```

This patch for the @graphy/content.ttl.write module makes it possible by adding the option to configure indentation style of the produced Turtle code.

## Indentation options

Indentation style is defined by the following new properties of the [style](https://graphy.link/content.textual#config-writeconfig-inlines-writeevents) configuration object: 

* `toStartFirstPredicateOnNewLine` : `boolean = false` – whether the first predicate of a subject must start on a new line by default;
* `firstPredicatesStartingOnNewLine` : `Array <string> = []` – predicates, that when being the first predicates of a subject, must start on a new line;
* `firstPredicatesNotStartingOnNewLine` : `Array <string> = []` – predicates, that when being the first predicates of a subject, must not start on a new line;
* `toStartObjectsOnNewLineInObjectLists` : `boolean = false` – whether objects in object lists (i.e. objects separated by `,`) must start on a new line by default;
* `predicatesWhoseObjectsStartOnNewLineInObjectLists` : `Array <string> = []` – predicates whose objects in object lists must start on a new line;
* `predicatesWhoseObjectsDontStartOnNewLineInObjectLists` : `Array <string> = []` – predicate whose objects in object lists must not start on a new line.

By default (i.e. when the aforementioned properties are not specified), the indentation style is the same as in the original @graphy/content.ttl.write module. 


## Examples

Let `objConcGraph` object be a concise representation of some RDF graph. Turtle serialization of this graph is generated by the following code:

```javascript
const graphy = require('graphy');

//Config object for customizing style of the generated Turtle serialization
let objStyle = {};

//Concise JSON representation of the RDF graph
let objConcGraph =
  {
  ">http://example.com/my-concept-scheme":
    {
      //this first predicate of the <http://example.com/my-concept-scheme> subject (i.e. "rdf:type")
      //will start on a new line
      //when objStyle.toStartFirstPredicateOnNewLine = true
      //and it is not in objStyle.firstPredicatesNotStartingOnNewLine,
      //or when it is in objStyle.firstPredicatesStartingOnNewLine
      "rdf:type":
        [
        "skos:Concept",
        "lime:Lexicon"
        ],
      "rdfs:label":
        //these objects will start from a new line
        //when objStyle.toStartObjectsOnNewLineInObjectLists = true
        //and their rdfs:label predicate is not in objStyle.predicatesWhoseObjectsDontStartOnNewLineInObjectLists,
        //or when this predicate is in objStyle.predicatesWhoseObjectsStartOnNewLineInObjectLists
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
        //for it will start on a new line when the aforementioned properties of objStyle are set
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
  };

let objPrefixes =
  {
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  owl: 'http://www.w3.org/2002/07/owl#',
  skos: 'http://www.w3.org/2004/02/skos/core#',
  lime: 'http://www.w3.org/ns/lemon/lime#',
  dc: "http://purl.org/dc/elements/1.1/",
  };

let streemWriter = graphy.content.ttl.write
  ({
  prefixes: objPrefixes,
  style: objStyle
  });

streemWriter.pipe (process.stdout);

streemWriter.write
  ({
  type: "c3",
  value: objConcGraph
  });
```

The `objStyle` object is used to customize the style of the generated Turtle.

### Example 1

Default style:

```javascript
let objStyle = {};
```

The generated Turtle serialization (hereinafter the prefixes are omitted):

```turtle
#@prefix ...

<http://example.com/my-concept-scheme> rdf:type skos:Concept, lime:Lexicon ;
	rdfs:label "My concept scheme"@en, "Mi esquema de conceptos"@es, "Моя концептуальная схема"@ru ;
	dc:language "en" ;
	dc:creator <http://example.com/john-smith> ;
	skos:hasTopConcept <http://example.com/my-concept-scheme/concept1>, <http://example.com/my-concept-scheme/concept2>, <http://example.com/my-concept-scheme/concept3>, <http://example.com/my-concept-scheme/concept4>, <http://example.com/my-concept-scheme/concept5> .

<http://example.com/john-smith> rdfs:label "John Smith"@en, "Джон Смит"@ru .
```

### Example 2

All the first predicates of their subjects start on a new line:

```javascript
let objStyle =
  {
  toStartFirstPredicateOnNewLine: true
  };
```

The generated Turtle serialization:

```turtle
<http://example.com/my-concept-scheme> 
	rdf:type skos:Concept, lime:Lexicon ;
	rdfs:label "My concept scheme"@en, "Mi esquema de conceptos"@es, "Моя концептуальная схема"@ru ;
	dc:language "en" ;
	dc:creator <http://example.com/john-smith> ;
	skos:hasTopConcept <http://example.com/my-concept-scheme/concept1>, <http://example.com/my-concept-scheme/concept2>, <http://example.com/my-concept-scheme/concept3>, <http://example.com/my-concept-scheme/concept4>, <http://example.com/my-concept-scheme/concept5> .

<http://example.com/john-smith> 
	rdfs:label "John Smith"@en, "Джон Смит"@ru .
```

### Example 3

All objects in object lists (i.e. separated by commas) start on a new line:

```javascript
let objStyle =
  {
  toStartObjectsOnNewLineInObjectLists: true
  };
```

The generated Turtle serialization:

```turtle
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
```

### Example 4

All the first predicates of their subjects and all objects in object lists start on a new line:

```javascript
let objStyle =
  {
  toStartFirstPredicateOnNewLine: true,
  toStartObjectsOnNewLineInObjectLists: true
  };
```

The generated Turtle serialization:

```turtle
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
```

### Example 5

All the first predicates of their subjects start on a new line with the exception of the rdf:type predicate and all objects in object lists start on a new line with the exception of the objects of the `rdf:type` predicate:

```javascript
let objStyle =
  {
  toStartFirstPredicateOnNewLine: true,
  firstPredicatesNotStartingOnNewLine: ["a", "rdf:type"],
  toStartObjectsOnNewLineInObjectLists: true,
  predicatesWhoseObjectsDontStartOnNewLineInObjectLists: ["a", "rdf:type"]
  };
```

The generated Turtle serialization:

```turtle
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
```

### Example 6

The `rdfs:label` predicate, when being the first predicate of its subject, starts on a new line, and the objects in object lists of the `skos:hasTopConcept` predicate start on a new line:

```javascript
let objStyle =
  {
  firstPredicatesStartingOnNewLine: ["rdfs:label"],
  predicatesWhoseObjectsStartOnNewLineInObjectLists: ["skos:hasTopConcept"]
  };
```

The generated Turtle serialization:

```turtle
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
```


### Example 7. Nested nodes


```javascript
const graphy = require('graphy');
const factory = require('@graphy/core.data.factory');

let objStyle = {};

let objConcGraph =
  {
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
  };

let objPrefixes =
  {
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  owl: 'http://www.w3.org/2002/07/owl#',
  dbr: 'http://dbpedia.org/resource/',
  dbo: 'http://dbpedia.org/ontology/',
  demo: 'http://ex.org/demo#',
  eg: 'http://ex.org/owl#'
  };

let streemWriter = graphy.content.ttl.write
  ({
  prefixes: objPrefixes,
  style: objStyle
  });

streemWriter.pipe (process.stdout);

streemWriter.write
  ({
  type: "c3",
  value: objConcGraph
  });
```

The generated Turtle serialization:

```turtle
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
```

See all these examples in the [examples.js](examples.js) file.


## Installation:

1. Install the graphy module in the current directory: `npm i graphy`.
2. Replace `[current_dir]/node_modules/@graphy/content.ttl.write/main.js` by the [main.js](main.js) patch from this repository.
