// Require module
import SolrNode from 'solr-node';

// Create client
export default new SolrNode({
    host: '127.0.0.1',
    port: '8983',
    core: 'better_food_onto',
    protocol: 'http'
});

// Set logger level (can be set to DEBUG, INFO, WARN, ERROR, FATAL or OFF)
//require('log4js').getLogger('solr-node').level = 'DEBUG';