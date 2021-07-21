
// Strange class ?? do not work ?
class parserAdress {
	// A variable defined in a factory or constructor function scope
	// is private to that function
	instanceField = 'instance';
	// not accepted ?
    uri = 'https://wxs.ign.fr/choisirgeoportail/geoportail/ols?xls=';
	templParcelle = `
		<?xml version="1.0" encoding="UTF-8"?>
		<XLS version="1.2">
		<gml:Point>
        	<gml:pos>${this.latitude} ${this.longitude}</gml:pos>
        </gml:Point>
        </XLS>`;
	
	constructor( lat, lgn ) {
		this.latitude = lat;
		this.longitude = lgn;
	}
	
	getLat() {
		return this.latitude;
	}
	
	getLgn() {
		return this.longitude;
	}
	
	//createRequest(lat, lng) {
	createRequest()  {
		/*
		return `
		<?xml version="1.0" encoding="UTF-8"?>
		<XLS version="1.2">
		<gml:Point>
			<gml:pos>${lat} ${lng}</gml:pos>
		</gml:Point>
		</XLS>
		`;
		*/
		return new String("temp");
	}
	
	requestParcelle() {
		//return this.templParcelle;
		//url = createRequest(this.latitude, this.longitude);
		var url = createRequest();
		return url;
	}
	
	
	//return ({
	// accsess to 'private'
	//})
}