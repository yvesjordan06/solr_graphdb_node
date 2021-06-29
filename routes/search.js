import Router from 'koa-router'
import GraphDB from '../database/graphdb.js'
import Solr from '../database/solr.js'
const _ = new Router()
const _wiki= new Router()
import loadash from "lodash";

_.prefix("/search")
_wiki.prefix("/wiki")


_wiki.get('/:id', async (ctx) => {
    var main
    var id = ctx.params.id;
    let response = await GraphDB.query(`SELECT * WHERE {<${GraphDB.iri+id}> ?link ?subject}`)
    //var query = Solr.query().q("object:fruit or subject:fruit")
    //response = await Solr.search(query)
    //const filter = response.response.docs.filter(x=>x.link[0].endsWith("type")&&x.subject[0].endsWith("Class"))
   /*  if(filter.length){
       
        main = await GraphDB.query(`SELECT * WHERE {<${filter[0].object[0]}> ?link ?object}`)
        main = main.results.bindings
    } */
    ctx.body= {main, id, response:response.results.bindings}
    return ctx.render('wiki',{main, id, response:response.results.bindings})
})



function normalizeSparqlResults(results) {
    var rest = loadash.groupBy(results, (x) => x.link.value)

    return rest;
    
}


_.get('/', async(ctx) => {
    if(!ctx.query.query){
        return ctx.render("index")
    }
  
    const term = ctx.query.query.trim()
    var query = Solr.query().q(`subject:${term} || subject:"${term}"`)
    
    var time = Date.now();
    let response = await Solr.search(query)


    //Recuperer la boite de connaissance

    var boite

    var documents = response.response.docs ;
    //ctx.body = documents.filter(x => x.link === "http://www.w3.org/2000/01/rdf-schema#label").map(x => x.subject)
    //return

    // On recherche un triplet où le label est exactemenent le terme recherché
    boite = documents.find(x => x.link === "http://www.w3.org/2000/01/rdf-schema#label" && x.subject.trim().toLowerCase()===term.trim().toLowerCase())

    // Si la boite existe, on explore l'objet de la boite
    if(boite){
        var req = await GraphDB.query(`
        SELECT * 
        WHERE {
            <${boite.object}> ?link ?subject.
            optional {
                ?subject <http://www.w3.org/2000/01/rdf-schema#label> ?label.
                
                        
                }.
                optional {
                    ?link <http://www.w3.org/2000/01/rdf-schema#label> ?linkLabel
                }

                filter ( !bound(?label) || lang(?label) = 'fr' )
                filter ( !bound(?linkLabel) || lang(?linkLabel) = 'fr' )
                filter (isLiteral(?subject) || isLiteral(?label))

                
        }
        `)


        var req2 = await GraphDB.query(`
        SELECT * 
        WHERE {
            ?subject ?link <${boite.object}>.
            filter ( ?link in ( <http://www.w3.org/1999/02/22-rdf-syntax-ns#type>, <http://www.w3.org/2000/01/rdf-schema#subClassOf> ) ).
            optional {
                ?subject <http://www.w3.org/2000/01/rdf-schema#label> ?label.
                
                        
                }.
                optional {
                    ?link <http://www.w3.org/2000/01/rdf-schema#label> ?linkLabel
                }

                filter ( !bound(?label) || lang(?label) = 'fr' )
                filter ( !bound(?linkLabel) || lang(?linkLabel) = 'fr' )
                filter (isLiteral(?subject) || isLiteral(?label))

                
        }
        `)
        
        var r1 = normalizeSparqlResults(req.results.bindings)
        var r2 = normalizeSparqlResults(req2.results.bindings)
        boite.detail = r1;
        boite.relations = r2
    }
    time = Date.now() - time
    //Tout ce qui est link.endwith=>Label est un objet ou une instance
    //On prend son label (subject) on met comme resultat puis on recherche sa description
    //On utilise l'objet (object) et on fait une SPARQL pour avoir les infos sur l'objets

   



    

    const object = { documents: response.response.docs, boite, query:term, time}
   //return ctx.body = (object);
   //return ctx.render('wiki',{main, filter, response})
   return ctx.render('results',object)

})


export function SearchRoutes() {
    return _.routes();
}

export function WikiRoutes() {
    return _wiki.routes();
}
