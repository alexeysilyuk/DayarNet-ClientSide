import {Location} from './location.model';

export class Dira {
  public id: string;
  public street: string;
  public rooms: number;
  public area: number;
  public arnona: number;
  public pricePerMonth: number;
  public baal: string;
  public phoneNumber: string;
  public contactEmail: string;
  public city_code: number;
  public houseNumber: number;
  public floor: number;
  public entranceDate: string;
  public type: string;
  public tenantLocation: Location;
  public neighborhood_code: number;

  constructor (street: string,
               rooms: number,
               area: number,
               arnona: number,
               pricePerMonth: number,
               baal: string,
               phoneNumber: string,
               contactEmail: string,
               city_code: number,
               houseNumber: number,
               floor: number,
               entranceDate: string, 
               type: string,
               location: Location,
               neighborhood_code: number,
               id: string) {
    this.street = street;
    this.rooms = rooms;
    this.area = area;
    this.arnona = arnona;
    this.pricePerMonth = pricePerMonth;
    this.baal = baal;
    this.phoneNumber = phoneNumber;
    this.contactEmail = contactEmail;
    this.city_code = city_code;
    this.houseNumber = houseNumber;
    this.floor = floor;
    this.entranceDate = entranceDate;
    this.type = type;
    this.tenantLocation = location;
    this.neighborhood_code = neighborhood_code;
    this.id = id;

  }
}
