export class Neighborhood {
    public neighborhood_code:	number;
    public city_code:	number;
    public lng:	number;
    public lat:	number;
    public name:	string;

    constructor (neighborhood_code:	number, lng:	number, lat:	number, name:	string, city_code:number) {
        this.neighborhood_code = neighborhood_code;
        this.city_code = city_code;
        this.lng = lng;
        this.lat = lat;
        this.name = name;
    }
}