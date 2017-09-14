export class Dira {
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
  public floot: number;
  public entranceDate: string;
  public type: string;

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
               type: string) {
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
    this.floot = floor;
    this.entranceDate = entranceDate;
    this.type = type;

  }
}
