//?id=53&userName=sanyi99
const parseQueryString = (queryString)=> {
    queryString = queryString.replace("?", "");
    const keyValuePairs = queryString.split("&"); // ez egy tömb lesz
    const queryObj = {};

    for(const pair of keyValuePairs) {
        const keyValue = pair.split("=");
        queryObj[keyValue[0]] = decodeURI(keyValue[1]);
    }

    return queryObj;
};

const urlObj = {
    host: location.host,
    port: location.port,
    path: location.path,
    protocol: location.protocol,
    query: parseQueryString(location.search),
    getBaseUrl() {
        return `${this.protocol} ${this.this}`; //nagyon fontos, hogyha itt akarunk valamire hivatkozni(mezőre) akkor azt a this-vel tudjuk 
    }
}

export default urlObj;