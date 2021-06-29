import {
    EnapsoGraphDBClient
} from "@innotrade/enapso-graphdb-client";

class GraphDBClient {
    
    constructor(url, repository, username, password, iri) {
        this.iri = iri
        this.url = url;
        this.repository = repository;
        this.username = username;
        this.password = password;
        this.graphDBEndpoint = new EnapsoGraphDBClient.Endpoint({
            baseURL: this.url,
            repository: this.repository,
            prefixes: this.DEFAULT_PREFIXES
        });
    }

    login() {
        console.log("Trying to connect to GraphDB...");
        // connect and authenticate
        this.graphDBEndpoint.login(this.username, this.password)
            .then((result) => {
                console.log(result);
            }).catch((err) => {
                console.log(err);
                console.log("Retrying in 10 seconds");
                setTimeout(() => {
                    this.login() 
                }, 10000);
               
            });
    }

    async query(query) {

        return await this.graphDBEndpoint
            .query(query);
    }




    static DEFAULT_PREFIXES = [
        EnapsoGraphDBClient.PREFIX_OWL,
        EnapsoGraphDBClient.PREFIX_RDF,
        EnapsoGraphDBClient.PREFIX_RDFS,
        EnapsoGraphDBClient.PREFIX_XSD,
        EnapsoGraphDBClient.PREFIX_PROTONS,
        {
            prefix: "web",
            iri: this.iri,
        }
    ];



}

export default new GraphDBClient("http://127.0.0.1:7200", "BetterFoodOnto", "hiro", "12345678", 'http://www.semanticweb.org/hiro/ontologies/2021/4/untitled-ontology-17#')