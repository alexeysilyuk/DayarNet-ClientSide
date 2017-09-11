export class Dira {
  public street: string;
  public rooms: number;
  public area: number;
  public arnona: number;
  public price: number;
  public baal: string;
  public phoneNumber: string;
  public contactEmail: string;

  constructor (street: string,
               rooms: number,
               area: number,
               arnona: number,
               price: number,
               baal: string,
               phoneNumber: string,
               contactEmail: string) {
    this.street = street;
    this.rooms = rooms;
    this.area = area;
    this.arnona = arnona;
    this.price = price;
    this.baal = baal;
    this.phoneNumber = phoneNumber;
    this.contactEmail = contactEmail;

  }
}
