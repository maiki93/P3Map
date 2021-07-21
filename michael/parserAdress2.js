
// object to transfer in HTML to fill the document inputText
// may add parameter
function fullDataAdress(lat, lgn) {
	this.latitude = lat;
	this.longitude = lgn;
}

function parserAddress2(lat, lgn) {
	
	this.latitude = lat;
	this.longitude = lgn;
	this.fullData = new fullDataAdress(lat, lgn);
	
	// not accepted ?
	/*
    this.uri = 'https://wxs.ign.fr/choisirgeoportail/geoportail/ols?xls=';
	this.templParcelle = `
		<?xml version="1.0" encoding="UTF-8"?>
		<XLS version="1.2">
		<gml:Point>
        	<gml:pos>${this.latitude} ${this.longitude}</gml:pos>
        </gml:Point>
        </XLS>`;
	*/
	this.getLat = function() {
		return this.latitude;
	};
	
	this.getLng = function() {
		return this.longitude;
	};
	
	//createRequest(lat, lng) {
	this.createRequestParcel = function() {
		// ACHTUNG blank caracter at the end seems necessary
		let test = `<?xml version="1.0" encoding="UTF-8"?>
		<XLS version="1.2" 
			xmlns="http://www.opengis.net/xls" 
	        xmlns:gml="http://www.opengis.net/gml" 
			xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
			xsi:schemaLocation="http://www.opengis.net/xls http://schemas.opengis.net/ols/1.2/olsAll.xsd"> 
		<RequestHeader/> 
		<Request methodName="ReverseGeocodeRequest" maximumResponses="1" requestID="parcelle" version="1.2"> 
			<ReverseGeocodeRequest> 
				<ReverseGeocodePreference>CadastralParcel</ReverseGeocodePreference> 
				<Position> 
					<gml:Point> 
						<gml:pos>${this.latitude} ${this.longitude}</gml:pos> 
					</gml:Point> 
				</Position> 
	        </ReverseGeocodeRequest>  
		</Request> 
		</XLS>`;
		//console.log("XML Parcelle req:\n" + test);
		return test;
	};
	
	this.requestParcelle = function() {
		let urlReq = this.createRequestParcel(); // lat, lng
		let uri = 'https://wxs.ign.fr/choisirgeoportail/geoportail/ols?xls='+encodeURI(urlReq);
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", uri, false); // false synchroneous
		xmlHttp.send( null );
		console.log("XML Parcel response :\n" + xmlHttp.responseText);
		
		const parser = new DOMParser();
		xmlDoc = parser.parseFromString(xmlHttp.responseText, "application/xml");
		this.extractDataParcel( xmlDoc );
		//return this.fullData;
	};
	
	this.extractDataParcel = function( xlmDoc ) {
		this.fullData.parcelId = xmlDoc.getElementsByTagName('Street')[0].textContent;
	};
	
	this.createRequestAddress = function() {
		// ACHTUNG blank caracter at the end seems necessary
		let test = `<?xml version="1.0" encoding="UTF-8"?>
		<XLS version="1.2" 
			xmlns="http://www.opengis.net/xls" 
	        xmlns:gml="http://www.opengis.net/gml" 
			xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
			xsi:schemaLocation="http://www.opengis.net/xls http://schemas.opengis.net/ols/1.2/olsAll.xsd"> 
		<RequestHeader/> 
		<Request methodName="ReverseGeocodeRequest" maximumResponses="1" requestID="adresse" version="1.2"> 
			<ReverseGeocodeRequest> 
				<ReverseGeocodePreference>StreetAddress</ReverseGeocodePreference> 
				<Position> 
					<gml:Point> 
						<gml:pos>${this.latitude} ${this.longitude}</gml:pos> 
					</gml:Point> 
				</Position> 
	        </ReverseGeocodeRequest> 
		</Request> 
		</XLS> 
		`;
		//console.log("XML Adress req:\n" + test);
		return test;
	};
	
	this.extractDataAddress = function( xlmDoc ) {
		//this.fullData.Municipality = xmlDoc.getElementsByTagName('Municipality')[0].textContent;
		this.fullData.streetName = xmlDoc.getElementsByTagName('Street')[0].textContent;
		this.fullData.streetNb = xmlDoc.getElementsByTagName('Building')[0].getAttribute('number');
		this.fullData.zipCode = xmlDoc.getElementsByTagName('PostalCode')[0].textContent;
		
		console.log(this.fullData.streetNb);
		
		placeElements = xmlDoc.getElementsByTagName('Place');
		for(i = 0; i < placeElements.length; i++) {
			//console.log(placeElements[i].getAttribute('type'));
			//console.log(placeElements[i].textContent);
			switch( placeElements[i].getAttribute('type') ) {
				case 'Municipality' : this.fullData.municipality = placeElements[i].textContent;
									  break;
				case 'INSEE'  : this.fullData.inseeId = placeElements[i].textContent;
									  break;
				case 'Departement'  : this.fullData.departement = placeElements[i].textContent;
									  break;
			}
		}
		//console.log('Municipality : ' + this.fullData.Municipality);
	};
	
	this.requestAddress = function() {
		let urlReq = this.createRequestAddress(); // lat, lng
		let uri = 'https://wxs.ign.fr/choisirgeoportail/geoportail/ols?xls='+encodeURI(urlReq);
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", uri, false); // false synchroneous
		xmlHttp.send( null );
		console.log("response :\n" + xmlHttp.responseText);
		
		const parser = new DOMParser();
		xmlDoc = parser.parseFromString(xmlHttp.responseText, "application/xml");
		this.extractDataAddress( xmlDoc );
		
		return this.fullData;
	};
}