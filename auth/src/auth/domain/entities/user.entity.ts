export class User {
  constructor(
    public full_name: string,
    public email: string,
    public pass: string,
    public id?: number,
  ) {}
}
