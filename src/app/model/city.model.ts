export class City {
    public code:	number;
    public lng:	number;
    public lat:	number;
    public name:	string;

    constructor (code:	number, lng:	number, lat:	number, name:	string) {
        this.code = code;
        this.lng = lng;
        this.lat = lat;
        this.name = name;
    }
}