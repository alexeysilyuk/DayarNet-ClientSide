import {Location} from './location.model';

export class Dira {
  public street: string;
  public rooms: number;
  public area: number;
  public arnona: number;
  public pricePerMonth: number;
  public tennantName: string;
  public tennantPhone: string;
  public tennantEmail: string;
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
               neighborhood_code: number) {
    this.street = street;
    this.rooms = rooms;
    this.area = area;
    this.arnona = arnona;
    this.pricePerMonth = pricePerMonth;
    this.tennantName = baal;
    this.tennantPhone = phoneNumber;
    this.tennantEmail = contactEmail;
    this.city_code = city_code;
    this.houseNumber = houseNumber;
    this.floor = floor;
    this.entranceDate = entranceDate;
    this.type = type;
    this.tenantLocation = location;
    this.neighborhood_code = neighborhood_code;

  }
}
